function Zhuawei(){};
var index_setuped = false;

var settings = {
  webserver: "http://localhost:8080",
  searchserver: "http://localhost:9200",
  index: "news"
};

Zhuawei.typeconfig = {
  mappings: {
    tweets: {
      properties: {
          username: {
              type: "string",
              index: "not_analyzed"
          },
          userlink: {
              type: "string",
              index: "not_analyzed"
          },
          tags: {
              type: "string",
              index: "not_analyzed"
          },
          pings: {
              type: "string",
              index: "not_analyzed"
          },
          links: {
              type: "string",
              index: "not_analyzed"
          },
          retweet: {
              type: "string",
              index: "not_analyzed"
          },
          retweetmid: {
              type: "string",
              index: "not_analyzed"
          },
          retweetuname: {
              type: "string",
              index: "not_analyzed"
          },
          retweetulink: {
              type: "string",
              index: "not_analyzed"
          }
      }
    }
  }
}

var retag = /#([^#]+)#/g;
var reping = /@([\u4e00-\u9fa5a-zA-Z0-9_-]{4,30})/g;

function matches(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var results = [];
    var match;
    while (match = regex.exec(string)) {
        results.push(match[index]);
    }
    return results;
}

Zhuawei.fire = function () {
  console.log("fire!");

  if (!index_setuped) {
    console.log("setup!");
    $.ajax({
      type: "PUT",
      url: settings.searchserver + "/" + settings.index,
      processData: false,
      contentType: 'application/json',
      data: JSON.stringify(Zhuawei.typeconfig)
    });
    index_setuped = true;
  }

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
        var msg = tweet.text();
        var links =  _(tweet.children('a')).chain().map(
          function(a) { return $(a).attr('href'); }
        ).filter(
          function(href) { return href.slice(0, 12) == 'http://t.cn/'; }
        ).value();

        var retweet = null;
        var retweetmid = null;
        var retweetuname = null;
        var retweetulink = null;
        var retweetNode = tweet.parent().parent('.content').find('dl.comment > dt[node-type="feed_list_forwardContent"]');
        if (retweetNode) {
          var retweet = $(retweetNode).children('em').text();
          var retweetmid = $(retweetNode).children('em > a[action-type="feed_list_url"]').attr('');
          var retweetulink = $(retweetNode).children('a:first').attr('href');
          var retweetuname = $(retweetNode).children('a:first').attr('nick-name');
        }

        $.ajax({
          type: "POST",
          url: settings.searchserver + "/" + settings.index + "/tweets/" + id,
          processData: false,
          contentType: 'application/json',
          data: JSON.stringify({
            timestamp: date,
            username: user.text(),
            userlink: user.attr('href'),
            message: msg,
            tags: matches(msg, retag),
            pings: matches(msg, reping),
            links: links,
            retweet: retweet,
            retweetmid: retweetmid,
            retweetulink: retweetulink,
            retweetuname: retweetuname
          })
        });
    });
  }
}