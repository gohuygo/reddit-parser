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

    let numberOfDaysBack    = 30
    let promiseDailyThreads = new Array(0)
    for (var i = 0; i < numberOfDaysBack; i++) {
      let date = moment().subtract(i+(2*numberOfDaysBack), 'days').format('MMMM D, YYYY')
      let threadName = 'Daily General Discussion - ' + date
      console.log('Querying: ' + threadName)
      let dailyThread = ethtrader.search({query: threadName})
      // promiseDailyThreads.push(dailyThread)
      Promise.resolve(dailyThread).then(result => {
        let threadId = result[0].id
        console.log(threadId)
        reddit.getSubmission(threadId).expandReplies({limit: Infinity, depth: Infinity}).then(thread => {
          let threadDate = moment.unix(thread.created_utc).format('MMMM D, YYYY')
          let threadName = 'Daily General Discussion - ' + threadDate
          let subreddit = 'ethtrader'

          let header = "threadDate, score, body, sourceId, subreddit, threadName \r\n"

          let filePath = `csv/reddit_${moment.unix(thread.created_utc).format('MMDDYY')}.csv`

          try {
            if(fs.openSync(filePath,'r')) return
          } catch (err) {
            fs.appendFile(filePath, header, (err) => {
              if (err) throw err
              console.log('Write Header:' + threadId)
            })

            let mapping;
            mapping = thread.comments.map(c =>{
              let body = c.body.replace(/(?:\r\n|\r|\n)/g, '');
              let score = c.score
              let sourceId = c.id

              let row = threadDate + ", " + score + ", " + body + ", " + sourceId +  ", " + subreddit +  ", " + threadName + "\r\n"

              fs.appendFile(`csv/reddit_${moment.unix(thread.created_utc).format('MMDDYY')}.csv`, row, (err) => {
                if (err) throw err
                console.log('Write Row:' + sourceId)
              })
            })
          }
        })
      })
    }
  })




program.parse(process.argv)
if (!program.args.filter(arg => typeof arg === 'object').length) {
  program.help()
}
