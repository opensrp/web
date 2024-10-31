// window._env_ = {};
// config.js.tpl

window._env_ = {
    // keycloak
    REACT_APP_AUTHZ_STRATEGY: 'keycloak',
    REACT_APP_KEYCLOAK_API_BASE_URL: '<keycloak-base-url>/auth/admin/realms/<keycloak-realm>',
    REACT_APP_KEYCLOAK_LOGOUT_URL:
      '<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/logout',
    REACT_APP_OPENSRP_ACCESS_TOKEN_URL:
      '<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/token',
    REACT_APP_OPENSRP_AUTHORIZATION_URL:
      '<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/auth',
    REACT_APP_OPENSRP_CLIENT_ID: '<keycloak-client-id>',
    REACT_APP_OPENSRP_USER_URL:
      '<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/userinfo',
  
    // fhir-web
    REACT_APP_WEBSITE_NAME: 'OpenSRP-Web',
    REACT_APP_OPENSRP_WEB_VERSION: '<fhir-web-release-tag>',
    REACT_APP_DOMAIN_NAME: 'http://localhost:3000',
    REACT_APP_EXPRESS_OAUTH_GET_STATE_URL: 'http://localhost:3000/oauth/state',
    REACT_APP_EXPRESS_OAUTH_LOGOUT_URL: 'http://localhost:3000/logout',
  
    // fhir-server
    REACT_APP_FHIR_API_BASE_URL: 'http://casi.uwdigi.org:8080//fhir',
  
    // UUID's
    REACT_APP_FHIR_ROOT_LOCATION_ID: '<id-of-the-root-location-on-the-HAPI-server>',
    REACT_APP_COMMODITIES_LIST_RESOURCE_ID: '<id-of-a-list-on-HAPI-fhir-server>',
  
    // toggle fhir-web modules
    REACT_APP_ENABLE_FHIR_CARE_TEAM: 'false',
    REACT_APP_ENABLE_FHIR_GROUP: 'false',
    REACT_APP_ENABLE_FHIR_HEALTHCARE_SERVICES: 'false',
    REACT_APP_ENABLE_FHIR_LOCATIONS: 'false',
    REACT_APP_ENABLE_FHIR_PATIENTS: 'false',
    REACT_APP_ENABLE_FHIR_TEAMS: 'false',
    REACT_APP_ENABLE_FHIR_USER_MANAGEMENT: 'false',
    REACT_APP_ENABLE_FHIR_COMMODITY: 'false',
    REACT_APP_ENABLE_QUEST: 'false',
    REACT_APP_ENABLE_TEAMS_ASSIGNMENT_MODULE: 'false',
  
    // i18n
    REACT_APP_SUPPORTED_LANGUAGES: "en,fr",
    REACT_APP_ENABLE_LANGUAGE_SWITCHER: 'false',
    REACT_APP_PROJECT_CODE: 'core',
    REACT_APP_LANGUAGE_CODE: 'en',
  
    // optional overrides
    SKIP_PREFLIGHT_CHECK: 'true',
    GENERATE_SOURCEMAP: 'false',
    INLINE_RUNTIME_CHUNK: 'false',
    IMAGE_INLINE_SIZE_LIMIT: '0',
    REACT_APP_MAIN_LOGO_SRC:
      'https://github.com/opensrp/web/raw/master/app/src/assets/images/fhir-web-logo.png',
    REACT_APP_OPENSRP_OAUTH_SCOPES: 'openid,profile',
    REACT_APP_ENABLE_OPENSRP_OAUTH: 'true',
    REACT_APP_BACKEND_ACTIVE: 'true',
    REACT_APP_SUPPORTED_LANGUAGES: 'en',
    REACT_APP_PROJECT_CODE: 'demo',
    REACT_APP_DEFAULTS_TABLE_PAGE_SIZE: '10',
    REACT_APP_OPENSRP_LOGOUT_URL: 'null',
    REACT_APP_PRACTITIONER_TO_ORG_ASSIGNMENT_STRATEGY: 'ONE_TO_MANY',
  
    // optional sentry config
    // REACT_APP_SENTRY_CONFIG_JSON: "{\"dsn\":\"<sentry-dsn>\",\"environment\":\"<sentry-environment>\",\"release\":\"<app-release-version>\",\"release-name\":\"<app-release-name>\",\"release-namespace\":\"<app-release-namespace>\",\"tags\":{}}",
  };
