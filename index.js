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
  .action(() => {
    const ethtrader = reddit.getSubreddit('ethtrader')

    let numberOfDaysBack    = 50;
    let promiseDailyThreads = new Array(0);

    for (var i = 0; i < numberOfDaysBack; i++) {
      let date        = moment().subtract(0+i, 'days').format('MMMM D, YYYY')
      let dailyThread = ethtrader.search({query: 'Daily General Discussion - ' + date})

      promiseDailyThreads.push(dailyThread)
    }

    Promise.all(promiseDailyThreads).then(results => {
      let threadIds = results.map(result=>result[0].id)
      threadIds.forEach((threadId) => {
        // setTimeout(function(){console.log('')}, 100)
        reddit.getSubmission(threadId).expandReplies({limit: Infinity, depth: Infinity}).then(console.log)
      })
    })

     // reddit.getSubmission('4j8p6d').expandReplies({limit: Infinity, depth: Infinity}).then(console.log)

    // console.log(ethtrader)
  })

program.parse(process.argv);
if (!program.args.filter(arg => typeof arg === 'object').length) {
  program.help();
}
