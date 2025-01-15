#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { downloadStrings } from './lib/downloadMerged.js';
import { uploadTranslations } from './lib/uploadMerged.js';
import { runExtractions, supportedProjectCodes, supportedLocaleCodes } from './lib/extract.js';

// Define global options and configure commands
yargs(hideBin(process.argv))
  .options({
    project: {
      alias: 'p',
      describe: 'Code for project that own/consume translations',
      choices: supportedProjectCodes,
      default: 'core',
    },
  })
  .command(
    'extract [packages...]',
    'Gets all translatable strings and writes them to the i18n package',
    (yargs) => {
      yargs
        .positional('packages', {
          describe: 'A list of folders from which to parse for translatable strings',
          type: 'string',
          demandOption: true,
        })
        .options({
          locales: {
            alias: 'l',
            describe: 'Extracted strings will be generated for this locale(s)',
            choices: supportedLocaleCodes,
            type: 'array',
            default: ['en'],
          },
          'key-as-default': {
            default: false,
            describe: 'Duplicate key to also be value',
            type: 'boolean',
            alias: 'k',
          },
          preserve: {
            default: false,
            describe: 'Retain removed translations in separate json files',
            type: 'boolean',
            alias: 'pr',
          },
          'output-namespace': {
            default: false,
            describe:
              'Manually override the namespace/package under which the translations will be written to',
            type: 'string',
            alias: 'on',
          },
        });
    },
    async (argv) => {
      await runExtractions(argv);
    }
  )
  .command(
    'download',
    'Merges all generated translatable strings into a single file',
    (yargs) => {
      yargs.options({
        out: {
          describe: 'Where to write the merged strings into',
          type: 'string',
        },
        locale: {
          choices: supportedLocaleCodes,
          describe: 'Locale for which to download translation files for',
          type: 'string',
          default: ['en'],
        },
      });
    },
    async (argv) => {
      const { project, out, locale } = argv;
      await downloadStrings(project, locale, out);
    }
  )
  .command(
    'upload',
    'Takes a merged translation file and expands the strings into the i18n package',
    (yargs) => {
      yargs.options({
        tfile: {
          describe: 'File with merged translations',
          type: 'string',
          demandOption: true,
        },
        locale: {
          alias: 'l',
          describe: 'Upload strings for this locale',
          choices: supportedLocaleCodes,
          default: ['en'],
        },
      });
    },
    async (argv) => {
      const { project, tfile, locale } = argv;
      await uploadTranslations(tfile, project, locale);
    }
  )
  .demandCommand(1, 'You need to specify at least one command')
  .help()
  .strict()
  .parse();
