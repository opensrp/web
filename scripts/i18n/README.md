# I!8n Script

Automates i18n tasks across the repository i.e extracting, and updating translation string.

## Features

Read more on how fhir-web structures internationalization in this [guide]()

**Extract Translations**

```shell
# pwd is repo root.
cd scripts/i18n

# enable corepack to better manage node js package managers
corepack enable

# install packages
yarn install

# Extract all translatable strings to i18n package, eusm project to both english and french resource files
./cli.js extract --project eusm -l en,fr
# Extract translatable strings from the fhir-clients package to i18n package > eusm project > fhir-clients namespace> english resource file
./cli.js extract fhir-clients --project eusm -l en
```

Consider a scenario where you have a view say `fhir-location-management.ListView` that is re-used in more than two places with different semantics. Now how would one support translations if the 2 views should show different set of texts within the same language.

We use the concept of namespaces. Pass a namespace config to the ListView i18n configuration that determines which texts to pick even within the same language. Furthermore we regenerate and store a copy of the translation strings under the new namespace. The end results is 2 namespaces that are usable from the same module but that define different string translations for the same lookup text.

To generate a new namespace for a module

```shell
# Extract translatable strings from the fhir-locations package to i18n package > eusm project> fhir-service-points namespace > english resource file
./cli.js extract fhir-locations --project eusm -l en --output-namespace fhir-service-points
```

**Download Translations**

Merges previously extracted translations into a single duplicate-free translation file. This file can then be uploaded to translation services like Transifex for translation.

```shell
# pwd is repo root.
cd scripts/i18n

# enable corepack to better manage node js package managers
corepack enable

# install packages
yarn install

# Downloads all extracted strings in all the generated english resource files in the eusm project.
./cli.js download --project eusm -l en
```

**Upload Translations**

Undoes a download operation. Takes a translated resource file, unravels the translations into the individual resource files in the i18n package.

```shell
# pwd is repo root.
cd scripts/i18n

# enable corepack to better manage node js package managers
corepack enable

# install packages
yarn install

# Downloads all extracted strings in all the generated english resource files in the eusm project.
./cli.js upload --project eusm -l en -tfile <file-path-to-resource-file>
```
