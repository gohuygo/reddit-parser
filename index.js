'use strict';

require('dotenv').config();

const program = require('commander');
const pkg = require('./package.json');
const moment = require('moment');
const snoowrap = require('snoowrap');
const reddit = new snoowrap({
  userAgent: process.env.REDDITUSERAGENT,
  clientId: process.env.REDDITCLIENTID,
  clientSecret: process.env.REDDITCLIENTSECRET,
  username: process.env.REDDITUSERNAME,
  password: process.env.REDDITPASSWORD
});

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')

program
  .command('scrape [thread]')
  .description('scrape all comments from thread')
  .action((thread ='/') => {
    const ethtrader = reddit.getSubreddit('ethtrader')
    // ethtrader.search({query: 'Daily General Discussion - September 30, 2017'}).then(console.log)
    // reddit.getSubmission('4j8p6d').expandReplies({limit: Infinity, depth: Infinity}).then(console.log)
    console.log(moment().subtract(1, 'days').format('MMMM D, YYYY'))
    // console.log(ethtrader)
  })

program.parse(process.argv);
if (!program.args.filter(arg => typeof arg === 'object').length) {
  program.help();
}
