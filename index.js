'use strict'

require('dotenv').config()

const program = require('commander')
const pkg = require('./package.json')
const moment = require('moment')
const snoowrap = require('snoowrap')
const fs = require('fs')

const reddit = new snoowrap({
  userAgent: process.env.REDDITUSERAGENT,
  clientId: process.env.REDDITCLIENTID,
  clientSecret: process.env.REDDITCLIENTSECRET,
  username: process.env.REDDITUSERNAME,
  password: process.env.REDDITPASSWORD
})

reddit.config({
  requestDelay: 1000,
  continueAfterRatelimitError: true
})

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')

program
  .command('scrape [thread]')
  .description('scrape all comments from thread')
  .action(() => {
    const ethtrader = reddit.getSubreddit('ethtrader')

    let numberOfDaysBack    = 1
    let promiseDailyThreads = new Array(0)
    for (var i = 0; i < numberOfDaysBack; i++) {
      let date = moment().subtract(i+1, 'days').format('MMMM D, YYYY')
      let dailyThread = ethtrader.search({query: 'Daily General Discussion - ' + date})
      promiseDailyThreads.push(dailyThread)
    }

    Promise.all(promiseDailyThreads).then(results => {
      let threadIds = results.map(result=>result[0].id)
      threadIds.forEach((threadId) => {
        reddit.getSubmission(threadId).expandReplies({limit: Infinity, depth: Infinity}).then(thread => {
          // console.log(threadId)
          let threadDate = moment.unix(thread.created_utc).format('MMMM D, YYYY')
          thread.comments.map(c =>{
            let body = c.body
            let score = c.score
            let sourceId = c.id
            let sourceName = 'reddit'
            let date = moment.unix(c.created_utc).format('MMMM D, YYYY')
            console.log(threadDate)

            // console.log(score, body, sourceId, sourceName)

            // fs.writeFile('target.txt', 'hello world', (err) => {
            //   if (err) throw err
            //   console.log('File saved!')
            // })
          })
        })
      })
    })
  })



program.parse(process.argv)
if (!program.args.filter(arg => typeof arg === 'object').length) {
  program.help()
}
