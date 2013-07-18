###
  crawler.coffee
###
define [
  'exports'
  'underscore'
  'crawler'
  'cs!./queue'
], (m, _, c, q) ->

    m.run = (ctx, callback) ->

      q.init(ctx)

      crawler = new c.Crawler {
        maxConnections: 1
        callback: (error,result,$) ->
          if error
            callback error
          else
            q.enqueue {
              pubdate: $('#pub_date').text()
              source:  $('#media_name').text()
              title:   $('#artibodyTitle').text()
              text:    $('#artibody').text()
            }
            callback null, {text: 'success'}
      }

      check = ->
        q.pop (err, url) ->
          crawler.queue url if !err
        setTimeout(check, 10000)

      check()


    m

