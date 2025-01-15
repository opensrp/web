# Helm envs checker

This script uses typescript parser to extract expected envs for the codebases i.e. the react app and the express app. It then counterchecks these with the envs that are already listed on our official helm envs.

It generates a report for envs that are:

- in the code's repositories but not added as part of helm
- Already added to helm but no longer part of the code's repositories

## Usage

```shell
cd scripts/helm-envs-checker

# enable corepack for better node js package manager UX
corepack enable

# install this script dependency
yarn install

# run the script
./cli.js
```
