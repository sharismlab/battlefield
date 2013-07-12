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
  tweet['tags'] = [m.group(1) for m in re.finditer(patTag, message)]
  tweet['pings'] = [m.group(1) for m in re.finditer(patPing, message)]
  tweet['message'] = re.sub(r'\'', '\\u0027', message)

  print "curl -XPOST http://localhost:9200/oz214/tweets/%s -d '%s'" % (tid, json.dumps(tweet))
