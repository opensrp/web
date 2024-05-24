# OpenSRP Deployment

### Setting up an opensrp web instance

We support 3 deployment environments: stage, preview and production so one should first decide under which environment they want to set up the site in.

You also need to have the necessary SSH keys set up in your machine in order to gain access to the deployment server. Kindly refer to [this](https://github.com/onaio/infrastructure/blob/35172d3e0986d4f55749a780122326340b40e35a/docs/tools/ansible_playbooks.md) doc on how to generate and sign the SSH keys.

### Adding inventories for a new web instance

To add inventories for an existing client, first clone the opensrp inventories repo [here](https://github.com/onaio/opensrp-inventories), then navigate to the host/client folder of choice. Also remember to clone the [playbooks](https://github.com/opensrp/playbooks/) repo in the same location as the opensrp inventories and follow the setup instructions as described [here](https://github.com/opensrp/playbooks#setup).

Each host has a stage, preview and production folder. Change dir into the environment folder of choice then create a `vars.yml` file with a set of variables used by the 4 ansible roles listed below that are used when running the playbook command:

- certbot - Installs certbot that is used to create website SSL certificates
- react - A role used to install react apps
- express - A role that installs and configures an express app
- nginx - Installs and configures Nginx

i.e if the client is `wellness-pass` and we want to deploy a staging site, we create the vars.yml file under `wellness-pass/stage/group_vars/web` directory.

Ansible roles usually offer a level of abstraction useful for organizing playbooks.

Below is a list of vars to be added in the host `vars.yml` file to be used by the above roles:

```
# General
ansible_ssh_user: "ubuntu"
ansible_ssh_host: <insert site url>

# keycloak
keycloak_url: <insert keycloak url>
keycloak_realm: <insert keycloak realm>

# OpenSRP
opensrp_server_url: <insert opensrp server base url>
opensrp_client_id: <insert oauth client id>

# Web application
app_env: <insert environment i.e preview>
app_title: <add app title>

# react
web_react_transpile_packages: true
web_react_remote_js_build: false # true when using admin host
web_react_system_user: "web"
web_react_system_user_home: "/home/{{ web_react_system_user }}"
web_react_codebase_path: "{{ web_react_system_user_home }}/react"
web_react_public_dir: "{{ web_react_codebase_path }}/app/build"
web_react_local_app_path: "{{ react_local_checkout_path }}/app"
web_react_git_url: "https://github.com/opensrp/web.git"
web_react_git_version: "v1.1.0" // update to use latest tag
web_express_system_user: "{{ web_react_system_user }}"
web_express_system_user_home: "/home/{{ web_react_system_user_home }}"
web_react_app_settings:
  SKIP_PREFLIGHT_CHECK: "true"
  REACT_APP_ENV: "{{ app_env }}"
  REACT_APP_DOMAIN_NAME: "https://{{ deployed_site_name }}"
  REACT_APP_WEBSITE_NAME: "{{ app_title }}"
  // other env vars

# express
web_express_git_url: "https://github.com/onaio/express-server.git"
web_express_git_version: "v1.1.0" // use latest tag
web_express_git_key:
web_express_app_name: "{{ web_express_system_user }}"
web_express_codebase_path: "{{ web_express_system_user_home }}/express"
web_express_app_path: "{{ express_checkout_path }}"
web_express_log_path: "/var/log/{{ express_app_name }}"
web_pm2_express_service_name: opensrp_stage_web
web_express_app_settings:
  NODE_ENV: "{{ app_env }}"
  EXPRESS_OPENSRP_ACCESS_TOKEN_URL: "{{ keycloak_url }}/auth/realms/{{ keycloak_realm }}/protocol/openid-connect/token"
  EXPRESS_OPENSRP_AUTHORIZATION_URL: "{{ keycloak_url }}/auth/realms/{{ keycloak_realm }}/protocol/openid-connect/auth"
  EXPRESS_OPENSRP_USER_URL: "{{ opensrp_server_url }}/opensrp/user-details"
  EXPRESS_OPENSRP_OAUTH_STATE: "opensrp"
  EXPRESS_OPENSRP_CALLBACK_URL: "https://{{ deployed_site_name }}/oauth/callback/OpenSRP/"
  EXPRESS_OAUTH_GET_STATE_URL: "https://{{ deployed_site_name }}/oauth/state"
  EXPRESS_PORT: "3000"
  EXPRESS_SESSION_NAME: <insert randon session name>
  EXPRESS_SESSION_SECRET: "{{ vault_express_session_secret }}"
  EXPRESS_SESSION_PATH: "/"
  EXPRESS_REACT_BUILD_PATH: "{{ web_react_public_dir }}"
  EXPRESS_SESSION_FILESTORE_PATH: "/tmp/express-sessions"
  EXPRESS_PRELOADED_STATE_FILE: "/tmp/opensrp-web-state.json"
  EXPRESS_SESSION_LOGIN_URL: "/login"
  EXPRESS_FRONTEND_OPENSRP_CALLBACK_URL: "https://{{ deployed_site_name }}/fe/oauth/callback/opensrp"
  EXPRESS_OPENSRP_CLIENT_ID: "{{ opensrp_client_id }}"
  EXPRESS_OPENSRP_CLIENT_SECRET: "{{ vault_express_opensrp_client_secret }}"
  EXPRESS_FRONTEND_LOGIN_URL: "/fe/login"

# certbot
web_use_certbot: true // set to false if you dont intend to install SSL cert on site
web_certbot_create_certs: true
web_certbot_renew_certs: true
web_certbot_install_cert: false
web_certbot_package: "python3-certbot-nginx"
web_certbot_version: "0.40.*"
web_certbot_site_names:
  - "{{ deployed_site_name }}"
web_certbot_mail_address: "techops+{{ deployed_site_name }}@ona.io"

# nginx
nginx_install_only: true
nginx_version: "1.18.*"
web_nginx_site_names:
  - "{{ deployed_site_name }}"
web_nginx_site_name: "{{ web_nginx_site_names[0] }}"
web_nginx_http_site_name: "{{ deployed_site_name }}-http"
web_nginx_https_site_name: "{{ deployed_site_name }}-https"
web_nginx_log_path: "/var/log/nginx/"
web_nginx_large_client_header_buffers: "4 8k"
web_nginx_access_logs:
  - name: "timed_combined"
    format: '''$http_x_forwarded_for - $remote_user [$time_local]  "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent" $request_time $upstream_response_time $gzip_ratio $request_length'''
    options: null
    filename: "access.log"
web_nginx_enabled_sites:
  - "{{ web_nginx_http_site_name }}"
  - "{{ web_nginx_https_site_name }}"
web_nginx_ssl_dir: /etc/nginx/ssl/{{ deployed_site_name }}
web_nginx_sites:
  - server:
      name: "{{ web_nginx_http_site_name }}"
      listen:
        - "80"
        - "[::]:80"
      server_name: "{{ web_nginx_site_names|join(' ') }}"
      access_log: "{{ web_nginx_log_dir }}/{{ deployed_site_name }}-access.log timed_combined"
      error_log: "{{ web_nginx_log_dir }}/{{ deployed_site_name }}-error.log"
      rewrite: "^(.*) https://{{ web_nginx_site_name }}$1 permanent"
      ssl:
        enabled: false
  - server:
      name: "{{ web_nginx_https_site_name }}"
      listen:
        - "443 ssl"
        - "[::]:443 ssl"
      server_name: "{{ web_nginx_site_names|join(' ') }}"
      access_log: "{{ web_nginx_log_dir }}/{{ deployed_site_name }}-ssl-access.log timed_combined"
      error_log: "{{ web_nginx_log_dir }}/{{ deployed_site_name }}-ssl-error.log"
      ssl:
        add_ssl_directive: false
        access_log_format: "timed_combined"
        enabled: true
        remote_src: true
        create_symlink: true
        cert: "fullchain.pem"
        key: "privkey.pem"
        src_dir: "/etc/letsencrypt/live/{{ deployed_site_name }}"
        conf: "{{ deployed_site_name }}.conf"
      # do not cache the service worker
      location1:
        name: "/service-worker.js"
        add_header: 'Cache-Control "no-cache"'
        proxy_cache_bypass: "$http_pragma"
        proxy_cache_revalidate: "on"
        expires: "off"
        access_log: "off"
web_nginx_monit_protection: false
web_nginx_log_dir: "/var/log/nginx"
web_ginx_large_client_header_buffers: "4 8k"
web_nginx_first_start: true

```

You can also set up a `vault.yml` file where you can set sensitive values such as oauth secrets. To edit this file you should run the following command:
` ansible-vault edit <client folder>/<environment>/group_vars/web/vault.yml --vault-password-file ~/opensrp/.vault_pass.txt` where the vault_pass file is a file with a password used to decrypt the vault.yml file.

After setting up the inventory we then add the client host or tag name under the `web` group var in the `hosts` file located at the root of each environment folder

```
[web:children]
<insert tag or client host name>

```

### Deploying to stage

```

ansible-playbook -i opensrp-inventories/<client folder name>/staging/  web.yml --vault-password-file=~/opensrp/.vault_pass.txt -e react_git_version="v1.1.0"
```

### Deploying to preview

```

ansible-playbook -i opensrp-inventories/<client folder name>/preview/  web.yml --vault-password-file=~/opensrp/.vault_pass.txt -e react_git_version="v1.1.0"
```

### Deploying to production

```

ansible-playbook -i opensrp-inventories/<client folder name>/production/  web.yml --vault-password-file=~/opensrp/.vault_pass.txt -e react_git_version="v1.1.0"
```

If you have passed a default branch name to the `react_git_version` variable in the inventory of a particular host/client, you can deploy without having to provide the branch in the deploy command e.g

```

ansible-playbook -i opensrp-inventories/<client folder name>/production/  web.yml --vault-password-file=~/opensrp/.vault_pass.txt
```
