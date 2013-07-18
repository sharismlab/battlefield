###
  queue.coffee
###
define [
  'exports'
  'redis'
  'crypto'
], (m, r, c) ->

    redis  = null

    key_news     = 'q:news'
    key_urls     = 'q:urls'
    key_unique   = 'k:news'

    m.init = (ctx) ->
        config = ctx.redis
        redis = r.createClient(config.port, config.host, config.options)

    unique = (s, callback) ->
        md5sum = c.createHash('md5')
        md5sum.update(s)
        hash = key_unique + md5sum.digest('hex').substring(0, 16)
        redis.exists hash, (err, flag) ->
            if !flag
                redis.set hash, '1'
                redis.expire hash, 3600 * 24 * 3
            callback err, !flag

    m.push = (url) ->
        if url
            unique url, (err, flag) ->
                redis.rpush key_urls, url if flag

    m.pop = (callback) ->
        redis.lpop key_urls, (err, val) ->
            if err
                callback err, null
            else
                callback null, val

    m.enqueue = (o) ->
        if o
            val = JSON.stringify o
            unique val, (err, flag) ->
                redis.rpush key_news, val if flag

    m.dequeue = (callback) ->
        redis.lpop key_news, (err, val) ->
            if err
                callback err, null
            else
                if val
                    callback null, JSON.parse val
                else
                    callback null, null

    m.fetchText = (callback) ->
        redis.lpop key_news, (err, value) ->
            if not err and value
                callback err, JSON.parse(value).text
            else
                callback null, null

    m.size = (callback) ->
        redis.llen key_news, callback

    m

