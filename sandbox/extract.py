import json
import re

patTag = re.compile(r"#([^#]+)#", re.UNICODE)
patPing = re.compile(r"@([^:(\ ]+)[:(\ ]", re.UNICODE)

tweets = json.loads(file('2013-07-11.json').readline())
tweets = tweets['hits']['hits']

for tweet in tweets:
  tid = tweet['_id']
  tweet = tweet['_source']
  message = tweet['message']

  f = file('2013-07-11/%s.txt' % tid, 'w')
  f.write(unicode(message).encode('utf-8'))
  f.close
