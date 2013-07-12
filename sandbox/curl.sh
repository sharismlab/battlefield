curl -XPOST http://localhost:9200/crash/tweets/_search -d '{"query":{"filtered":{"filter":{"numeric_range":{"timestamp":{"lt":"2013-07-07T00:00+08:00","gte":"2013-07-06T00:00+08:00"}}}}},"size":3000,"sort":{"timestamp":"desc"}}'


