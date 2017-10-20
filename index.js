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
    const ethtrader = reddit.getSubreddit('linktrader')

    let numberOfDaysBack    = 1;
    let promiseDailyThreads = new Array(0);
    let date;
    for (var i = 0; i < numberOfDaysBack; i++) {
      date = moment().subtract(i+1, 'days').format('MMMM D, YYYY')
      let dailyThread = ethtrader.search({query: 'WEEKLY LINK DISCUSSION - 16th OCTOBER'})
      // let dailyThread = ethtrader.search({query: 'Daily General Discussion - ' + date})

      promiseDailyThreads.push(dailyThread)
    }

    Promise.all(promiseDailyThreads).then(results => {
      let threadIds = results.map(result=>result[0].id)
      threadIds.forEach((threadId) => {
        // map over first level comments only
        reddit.getSubmission(threadId).expandReplies({limit: 0, depth: 0}).then(data => {
          data.comments.map(c =>{
            let comment = c.body
            let score = c.score
            let sourceId = c.id
            let sourceName = 'reddit'

            console.log(score, sourceId, sourceName, date)
          })
        })
      })
    })
  })



program.parse(process.argv);
if (!program.args.filter(arg => typeof arg === 'object').length) {
  program.help();
}
