#!/usr/bin/env node

/** helps countercheck which env variables have not been added to helm and
 * possibly what envs exist in helm that might have been removed from the code.
 */
import ts from 'typescript';
import yaml from 'js-yaml';

// const ts = require("typescript");
// const yaml = require('js-yaml');

const reactAppEnvTsFile =
  'https://raw.githubusercontent.com/onaio/fhir-web/refs/heads/main/app/src/configs/env.ts';
const expressAppEnvTsFile =
  'https://raw.githubusercontent.com/onaio/express-server/refs/heads/update-imports/src/configs/envs.ts';

const helmChartValuesYaml =
  'https://raw.githubusercontent.com/opensrp/helm-charts/refs/heads/main/charts/opensrp-web/values.yaml';

async function fetchFileContents(fileUri) {
  try {
    const response = await fetch(fileUri);
    if (!response.ok) {
      throw new Error(`Problem making request: ${fileUri}`);
    }
    return await response.text();
  } catch (err) {
    throw new Error('Application Error: Exception');
  }
}

function createSourceFile(sourceText) {
  return ts.createSourceFile(
    'temp.ts', // A temporary file name
    sourceText,
    ts.ScriptTarget.ESNext, // Target ECMAScript version
    true // SetParentNodes
  );
}

/**
 * Parses a TypeScript file and extracts all exported const variables.
 * @param {string} fileContent - The content of the TypeScript file.
 * @returns {string[]} An array of names of exported const variables.
 */
function getWebEnvVarDeclarations(sourceFile) {
  const setEnvArguments = [];

  /**
   * Recursively visit nodes in the AST.
   * @param {ts.Node} node - The current AST node.
   */
  function visit(node) {
    // Check if the node is a CallExpression and the function name is `setEnv`
    if (
      ts.isCallExpression(node) && // Check if it's a call expression
      ts.isIdentifier(node.expression) && // Check if the callee is an identifier
      node.expression.text === 'setEnv' // Check if the identifier's name is "setEnv"
    ) {
      // Get the first argument if it exists
      const firstArgument = node.arguments[0];
      if (firstArgument) {
        setEnvArguments.push(firstArgument.text); // Extract the argument's text
      }
    }

    // Recursively visit all child nodes
    ts.forEachChild(node, visit);
  }

  // Start visiting nodes from the root
  visit(sourceFile);

  return setEnvArguments;
}

/**
 * Parses a TypeScript file and extracts all environment variable keys from `process.env`.
 * @param {string} fileContent - The content of the TypeScript file.
 * @returns {string[]} An array of environment variable keys accessed from `process.env`.
 */
function getExpressEnvVarDeclarations(sourceFile) {
  const envKeys = [];

  /**
   * Recursively visit nodes in the AST.
   * @param {ts.Node} node - The current AST node.
   */
  function visit(node) {
    // Check if the node is a PropertyAccessExpression
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      ts.isIdentifier(node.expression.expression) &&
      node.expression.expression.text === 'process' && // Object must be `process`
      node.expression.name.text === 'env' // Property must be `env`
    ) {
      // The accessed key is the name of the property
      envKeys.push(node.name.text);
    }

    // Recursively visit all child nodes
    ts.forEachChild(node, visit);
  }

  // Start visiting nodes from the root
  visit(sourceFile);

  return envKeys;
}

async function getAndParseEnvs(fileUri, envsExtractor) {
  const fileContents = await fetchFileContents(fileUri);
  const sourceFile = createSourceFile(fileContents);
  const envs = envsExtractor(sourceFile);
  return envs;
}

async function getHelmEnvs() {
  const yamlContents = await fetchFileContents(helmChartValuesYaml);
  const doc = yaml.load(yamlContents);
  const {
    containerEnvironmentVariables: expressAppHelmEnvs,
    reactEnvironmentVariables: reactAppHelmEnvs,
  } = doc;
  return { expressAppHelmEnvs, reactAppHelmEnvs };
}

async function main() {
  const { expressAppHelmEnvs, reactAppHelmEnvs } = await getHelmEnvs();
  const reactEnvs = await getAndParseEnvs(reactAppEnvTsFile, getWebEnvVarDeclarations);
  const expressEnvs = await getAndParseEnvs(expressAppEnvTsFile, getExpressEnvVarDeclarations);

  // check envs in react app that are not in the helm chart envs.
  const reactEnvsMissingInHelm = [];
  for (const key of reactEnvs) {
    if (!Object.prototype.hasOwnProperty.call(reactAppHelmEnvs, key)) {
      reactEnvsMissingInHelm.push(key);
    }
  }
  if (reactEnvsMissingInHelm.length) {
    console.log(`React app envs missing in helm: \n${reactEnvsMissingInHelm.join(',  \n')}\n`);
  }

  // check envs in express app that are not in the helm chart envs.
  const expressEnvsMissingInHelm = [];
  for (const key of expressEnvs) {
    if (!Object.prototype.hasOwnProperty.call(expressAppHelmEnvs, key)) {
      expressEnvsMissingInHelm.push(key);
    }
  }
  if (expressEnvsMissingInHelm.length) {
    console.log(`Express envs missing in helm: \n${expressEnvsMissingInHelm.join(',  \n')}\n`);
  }

  // check for envs that exist in helm that are no longer in react
  const reactEnvsByEnv = reactEnvs.reduce((acc, value) => {
    acc[value] = value;
    return acc;
  }, {});
  const helmReactMissingInReactEnvs = [];
  for (const key in reactAppHelmEnvs) {
    if (!Object.prototype.hasOwnProperty.call(reactEnvsByEnv, key)) {
      helmReactMissingInReactEnvs.push(key);
    }
  }
  if (helmReactMissingInReactEnvs.length) {
    console.log(
      `Helm react envs that no longer exist on the react app: \n${helmReactMissingInReactEnvs.join(
        ',  \n'
      )}\n`
    );
  }

  // check for envs that exist in helm that are no longer in react
  const expressEnvsByEnv = expressEnvs.reduce((acc, value) => {
    acc[value] = value;
    return acc;
  }, {});
  const helmReactMissingInExpressEnvs = [];
  for (const key in expressAppHelmEnvs) {
    if (!Object.prototype.hasOwnProperty.call(expressEnvsByEnv, key)) {
      helmReactMissingInExpressEnvs.push(key);
    }
  }
  if (helmReactMissingInExpressEnvs.length) {
    console.log(
      `Helm express envs that no longer exist on the express app: \n${helmReactMissingInExpressEnvs.join(
        ',  \n'
      )}\n`
    );
  }
}

main();
