function fire() {
  console.log("fire!");

  var ids = _.map($('dl.feed_list'), function(dl) { return $(dl).attr('mid'); });
  var authors = _.filter($('dd.content p[node-type="feed_list_content"] > a') , function(a) { return $(a).attr('href').indexOf("http://weibo.com/") === 0; });
  var dates = _.map($('dd.content p.info a.date'), function(a) { var t = $(a).attr('title'); return t.split(' ').join('T') + "+08:00"; });
  var tweets = _.filter($('dd.content p[node-type="feed_list_content"] > em'), function(em) { return em.className === ""; });

  console.log(ids);
  console.log(authors);
  console.log(dates);
  console.log(tweets);

  if (ids.length === authors.length && ids.length === tweets.length) {
    _(_.zip(ids, authors, tweets, dates)).each(function (entry, idx) {
        var id = entry[0], user = $(entry[1]), tweet = $(entry[2]), date = entry[3];
        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:9200/oz214/tweets/" + id,
          processData: false,
          contentType: 'application/json',
          data: JSON.stringify({
            timestamp: date,
            username: user.text(),
            userurl: user.attr('href'),
            message: tweet.text()
          })
        });
    });
  }
}

chrome.extension.sendMessage({}, function(response) {
  if ($(location).attr('href').indexOf('http://s.weibo.com/weibo/') === 0) {
    var readyStateCheckInterval = setInterval(function() {
      if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        console.log("hello!");
        fire();
      }
    }, 10);
  }
});
