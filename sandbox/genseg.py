import json
import re

patTag = re.compile(r"#([^#]+)#", re.UNICODE)
patPing = re.compile(r"@([^:(\ ]+)[:(\ ]", re.UNICODE)

dates = ['2013-07-07', '2013-07-08', '2013-07-09', '2013-07-10', '2013-07-11']

for date in dates:
  tweets = json.loads(file('%s.json' % date).readline())
  tweets = tweets['hits']['hits']

  for tweet in tweets:
    tid = tweet['_id']
    tweet = tweet['_source']
    message = tweet['message']
    tweet['message'] = re.sub(r'[\'"@#:,.!?]', ' ', message)
    message = tweet['message']

    print ('java -Xms1g -Xmx2g -jar stan-cn-nlp.jar seg "%s" > tweet/segmt/%s/%s.txt' % (message, date, tid)).encode('utf-8')
