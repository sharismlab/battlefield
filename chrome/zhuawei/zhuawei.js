function Zhuawei(){};
Zhuawei.index_setuped = false;

Zhuawei.settings = {
  webserver: "http://btf.sharismlab.com",
  searchserver: "http://btf.sharismlab.com/search",
  index: "news",
  username: "",
  password: ""
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

Zhuawei.checkAndFire = function () {
  console.log("check!");
  $.ajax({
      type: "GET",
      cache: false,
      username: Zhuawei.settings.username,
      password: Zhuawei.settings.password,
      url: Zhuawei.settings.searchserver + "/" + Zhuawei.settings.index + "/_status",
      success: function() {
          Zhuawei.fire();
      },
      error: function() {
          Zhuawei.setup();
      }
  });
}

Zhuawei.setup = function () {
  if (!Zhuawei.index_setuped) {
    console.log("setup!");
    $.ajax({
      type: "POST",
      url: Zhuawei.settings.searchserver + "/" + Zhuawei.settings.index,
      username: Zhuawei.settings.username,
      password: Zhuawei.settings.password,
      processData: false,
      contentType: 'application/json',
      data: JSON.stringify(Zhuawei.typeconfig)
    });
    Zhuawei.index_setuped = true;
  }
}

Zhuawei.fire = function () {
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
          url: Zhuawei.settings.searchserver + "/" + Zhuawei.settings.index + "/tweets/" + id,
          processData: false,
          contentType: 'application/json',
          username: Zhuawei.settings.username,
          password: Zhuawei.settings.password,
          data: JSON.stringify({
            '@timestamp': date,
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

chrome.extension.sendMessage({method: "settings"}, function(response) {
  Zhuawei.settings = response;
  Zhuawei.index_setuped = false;
});
