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

    let arr = new Array(50);

    for (var i = 0; i < arr.length; i++) {
      let date = moment().subtract(0-i, 'days').format('MMMM D, YYYY')
      let dailyThreadId = ethtrader.search({query: 'Daily General Discussion - ' + date})
                                   .then(a=>Promise.resolve(a).then(b=>console.log(b[0]['id'])))
      arr[i] = dailyThreadId
    }

    console.log(arr)
    // reddit.getSubmission('4j8p6d').expandReplies({limit: Infinity, depth: Infinity}).then(console.log)

    // console.log(ethtrader)
  })

program.parse(process.argv);
if (!program.args.filter(arg => typeof arg === 'object').length) {
  program.help();
}
