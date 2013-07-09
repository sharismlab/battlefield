###
  crawler.coffee
###
define [
  'exports'
  'underscore'
  'weibo'
  'cs!./queue'
], (m, _, w, q) ->

    m.run = (ctx, callback) ->
        q.init(ctx)

        config = ctx.weibo
        console.log(config)
        w.init 'weibo', config.appkey, config.secret, config.oauth_callback_url

        gap = 30000 # 30 seconds
        check = ->
            q.size (err, len) ->
                if not err and len >= 0
                    gap = 30000 * len
            setTimeout(check, 10000)

        fetch = ->
            user = { blogtype: 'weibo', access_token: config.access_token, uid: config.uid };
            cursor = {count: 100, source: config.appkey };
            w.public_timeline user, cursor, (error, statuses) ->
              if error
                callback error
              else if statuses and statuses.length > 0
                _.each statuses, (status) ->
                    q.enqueue {
                      created_at: status.created_at
                      id: status.id
                      text: status.text
                      user_id: status.user.id
                      user_name: status.user.screen_name
                    }
                    callback error, item

            setTimeout(fetch, gap)

        check()
        fetch()

    m

