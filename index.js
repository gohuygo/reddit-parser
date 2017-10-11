'use strict';

const program = require('commander');
const pkg = require('./package.json');
const snoowrap = require('snoowrap');

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')

program
  .command('scrape [thread]')
  .description('scrape all 1st-level posts from thread')
  .action((thread ='/') => console.log('thread', thread))

program.parse(process.argv);
if (!program.args.filter(arg => typeof arg === 'object').length) {
  program.help();
}
