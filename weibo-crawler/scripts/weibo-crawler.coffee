###
  weibo-crawler.coffee
###
define [
  'exports'
  'cs!../lib/crawler/crawler'
  'cs!../config/index'
], (m, c, conf) ->

    m.main = (args...) ->
        c.run conf, (error, msg) ->
            if error
                console.log error
            else
                console.log msg.text

    m
