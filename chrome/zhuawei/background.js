(function(){
    var root = this;
    var
        zhuawei = {bg:{}, store: localStorage},
        bg = zhuawei.bg ;

    root.zhuawei = zhuawei;

    var parserUtils = {
        'int2isodate': function(i){
            var d = new Date();
            d.setTime(i);
            return d.toISOString();
        },
        'getTimeSinaA': function(jq){
            // for userPage
            return parserUtils.int2isodate(parseInt($(jq.find('div.WB_from').filter(':last')).find('a.WB_time').attr('date')));
        },
        'getTimeSinaB': function(jq){
            // for topicPage
            return parserUtils.int2isodate(parseInt(jq.find('div.content span.time a').attr('date')));
        },
        'getTimeSinaC': function(jq){
            // for searchPage
            return parserUtils.int2isodate(parseInt(jq.find('.info.W_linkb').filter(':last').find('a.date').attr('date'))/1000);
        },
        'getMidSinaA': function(jq){
            // for userPage, searchPage
            return jq.attr('mid');
        },
        'getMidSinaB': function(jq){
            // for topicPage
            // currently there's only one data(mid=xxx), we need to track the data changing
            return jq.attr('list-data').split('=')[1];
        },
        'getAccountSinaA': function(jq){
            // for userPage
            var a = jq.find('div.WB_from').filter(':last').find('a.WB_time');
            if(a.length==0){console.log('deleted weibo');console.log(jq[0]);return null;};
            //console.log(a.length);
            return "http://weibo.com/u/"+a.attr('href').split('/')[1];
            //return "http://weibo.com/u/"+jq.find('div.WB_from').filter(':last').find('a.WB_time').attr('href').split('/')[1];
        },
        'getAccountSinaB': function(jq){
            // for topicPage
            return "http://weibo.com/u/"+jq.find('div.content span.time a').attr('href').split('/')[1];
        },
        'getAccountSinaC': function(jq){
            // for searchPage
            var a = jq.find('.info.W_linkb').filter(':last').find('a.date');
            if(a.length==0){console.log('deleted weibo');console.log(jq[0]);return null;};
            return "http://weibo.com/u/"+a.attr('href').split('/')[3];
        },
        'getPermalinkSinaA': function(jq){
            // for userPage
            return 'http://weibo.com'+jq.find('div.WB_from').filter(':last').find('a.WB_time').attr('href');
        },
        'getPermalinkSinaB': function(jq){
            // for topicPage
            return 'http://weibo.com'+jq.find('div.content span.time a').attr('href');
        },
        'getPermalinkSinaC': function(jq){
            // for searchPage
            return 'http://weibo.com'+jq.find('.info.W_linkb').filter(':last').find('a.date').attr('href');
        },
        'getMessageSinaA': function(jq){
            // for userPage
            return jq.find('div.WB_text').filter(':first').text();
        },
        'getMessageSinaB': function(jq){
            // for topicPage
            return jq.find('p.con_txt em').text();
        },
        'getMessageSinaC': function(jq){
            // for searchPage
            return jq.find('em:not([class])').filter(':first').text();
        },
        'getLinksSinaA': function(jq){
            // for userPage
            return _.map(jq.find('div.WB_text').filter(':first').find('a[action-type="feed_list_url"]'), function(o){return o.href;});
        },
        'getLinksSinaB': function(jq){
            // for topicPage
            return _.filter(_.map(jq.find('p.con_txt em a').slice(0), function(o){ return o.href; }), function(url){ return url.indexOf('http://t.cn/')==0; });
        },
        'getLinksSinaC': function(jq){
            // for searchPage
            return _.map(jq.find('em:not([class])').filter(':first').find('a[action-type="feed_list_url"]'), function(o){return o.href;});
        },
        'getImagesSinaA': function(jq){
            // for userPage
            return _.map(jq.find('ul.WB_media_list img.bigcursor'), function(o){return o.src;});
        },
        'getImagesSinaB': function(jq){
            // for topicPage
            return _.map(jq.find('div.con_media img.bigcursor'), function(o){return o.src;});
        },
        'getImagesSinaC': function(jq){
            // for searchPage
            return _.map(jq.find('ul.piclist img.bigcursor'), function(o){return o.src;});
        },
        'getVideoSinaA': function(jq){
            // for userPage
            return _.map(jq.find('ul.WB_media_list li[action-type="feed_list_media_video"]'), function(o){ var res=_.filter(decodeURIComponent(o.getAttribute("action-data")).split('&'), function(pair){ return pair.indexOf('full_url=')==0;}); if(!_.isEmpty(res)){return res[0].slice(9);}});
        },
        'getVideoSinaB': function(jq){
            // for topicPage
            return _.map(jq.find('div.con_media ul.media_list > li[action-type="list_preview"]'), function(o){ var res=_.filter(decodeURIComponent(o.getAttribute("action-data")).split('&'), function(pair){ return pair.indexOf('full_url=')==0;}); if(!_.isEmpty(res)){return res[0].slice(9);}});
        },
        'getVideoSinaC': function(jq){
            // for searchPage
            return _.map(jq.find('ul.piclist img[action-type="feed_list_media_video"]'), function(o){ var res=_.filter(decodeURIComponent(o.getAttribute("action-data")).split('&'), function(pair){ return pair.indexOf('full_url=')==0;}); if(!_.isEmpty(res)){return res[0].slice(9);}});
        },
        'getTagsSinaA': function(jq){
            // for userPage
            return _.map(jq.find('div.WB_text').filter(':first').find('a.a_topic'), function(o){ return o.innerText;});
        },
        'getTagsSinaB': function(jq){
            // for topicPage
            return _.filter(_.map(jq.find('div.content em a'), function(o){ return o.innerText;}), function(txt){ return txt.slice(0,1)=='#' && txt.slice(-1)=='#';});
        },
        'getTagsSinaC': function(jq){
            // for searchPage
            return _.map(jq.find('em:not([class]').filter(':first').find('a.a_topic'), function(o){ return o.innerText;});
        },
        'getAtsSinaA': function(jq){
            // for userPage
            return _.map(jq.find('div.WB_text').filter(':first').find('a[usercard]'), function(o){return o.innerText.slice(1);});
        },
        'getAtsSinaB': function(jq){
            // for topicPage
            return _.map(jq.find('div.content em a[action-type="usercard"]'), function(o){return o.innerText.slice(1);});
        },
        'getAtsSinaC': function(jq){
            // for searchPage
            return _.map(jq.find('em:not([class]').filter(':first').find('a[usercard]'), function(o){return o.innerText.slice(1);});
        }
        /** **
        'getRetweetSinaA': function(jq){
            // for userPage
            var expand = jq.find('div.WB_media_expand').filter(':first');
            var link = expand.find('div.WB_from a.WB_time');
            if(link.length==0){return;};
            return {
                '@timestamp': parserUtils.getTimeSinaA(expand),
                'service': 'sina',
                'mid': expand.find('div.WB_handle').attr('mid'),
                'person': zhuawei.store['user'],
                'account': parserUtils.getAccountSinaA(expand),
                'permalink': parserUtils.getPermalinkSinaA(expand),
                'message': parserUtils.getMessageSinaA(expand),
                'links': parserUtils.getLinksSinaA(expand),
                'images': parserUtils.getImagesSinaA(expand),
                'video': parserUtils.getVideoSinaA(expand),
                'tags': parserUtils.getTagsSinaA(expand),
                'ats': parserUtils.getAtsSinaA(expand)
            };
        },
        'getRetweetSinaC': function(jq){
            // for searchPage
            var expand = jq.find('dl.comment');
            var link = expand.find('.info.W_linkb');
            if(link.length==0){return;};
            return {
                '@timestamp': parserUtils.getTimeSinaC(expand),
                'service': 'sina',
                'mid': null,
                'person': zhuawei.store['user'],
                'account': parserUtils.getAccountSinaC(expand),
                'permalink': parserUtils.getPermalinkSinaC(expand),
                'message': parserUtils.getMessageSinaC(expand),
                'links': parserUtils.getLinksSinaC(expand),
                'images': parserUtils.getImagesSinaC(expand),
                'video': parserUtils.getVideoSinaC(expand),
                'tags': parserUtils.getTagsSinaC(expand),
                'ats': parserUtils.getAtsSinaC(expand)
            };
        }
        /** **/
    };

    // url patterns sina only currently
    var serviceUrlPatterns = {
        "sina_userPage": [  /https?:\/\/weibo\.com\/(u\/)?[a-zA-Z0-9]+\/profile.*/i,
                            /https?:\/\/weibo\.com\/(u\/)?[a-zA-Z0-9]+(\?.+)?$/i,
                            /https?:\/\/weibo\.com\/p\/[0-9]+\/(home|weibo)(\?.+)?$/i,
                            ],
        "sina_topicPage": [/https?:\/\/huati\.weibo\.com\/.*/i],
        "sina_searchPage": [/https?\/\/s\.weibo\.com\/weibo\/.*/i],
    };

    var serviceSelectors = {
        "sina_userPage": ['div[action-type="feed_list_item"]'],
        "sina_topicPage": ['li[node-type="list-item"]'],
        "sina_searchPage": ['dl[action-type="feed_list_item"]'],
    };

    var serviceParsers = {
        "sina_userPage": function(msg){
            var jq=$(msg),
                expand=jq.find('div.WB_media_expand:not([node-type="feed_list_repeat"])'),
                hasForward=expand.find('a').length==0?false:true;

            return {
                '@timestamp': parserUtils.getTimeSinaA(jq),
                'service': 'sina',
                'mid': parserUtils.getMidSinaA(jq),
                'person': zhuawei.store['user'],
                'account': parserUtils.getAccountSinaA(jq),
                'permalink': parserUtils.getPermalinkSinaA(jq),
                'message': parserUtils.getMessageSinaA(jq),
                'links': parserUtils.getLinksSinaA(jq),
                'images': parserUtils.getImagesSinaA(jq),
                'video': parserUtils.getVideoSinaA(jq),
                'tags': parserUtils.getTagsSinaA(jq),
                'pings': parserUtils.getAtsSinaA(jq),
                'retweet_author': hasForward?parserUtils.getAccountSinaA(expand):null,
                'retweet_permalink': hasForward?parserUtils.getPermalinkSinaA(expand):null
            };
        },
        "sina_topicPage": function(msg){
            var jq=$(msg);
            return {
                '@timestamp': parserUtils.getTimeSinaB(jq),
                'service': 'sina',
                'mid': parserUtils.getMidSinaB(jq),
                'person': zhuawei.store['user'],
                'account': parserUtils.getAccountSinaB(jq),
                'permalink': parserUtils.getPermalinkSinaB(jq),
                'message': parserUtils.getMessageSinaB(jq),
                'links': parserUtils.getLinksSinaB(jq),
                'images': parserUtils.getImagesSinaB(jq),
                'video': parserUtils.getVideoSinaB(jq),
                'tags': parserUtils.getTagsSinaB(jq),
                'pings': parserUtils.getAtsSinaB(jq),
                'retweet_author': null,             // we didnt saw any retweets in topicPage
                'retweet_permalink': null
            };
        },
        "sina_searchPage": function(msg){
            var jq=$(msg),
                expand=jq.find('dl.comment'),
                hasForward=expand.find('a').length==0?false:true;
            return {
                '@timestamp': parserUtils.getTimeSinaC(jq),
                'service': 'sina',
                'mid': parserUtils.getMidSinaC(jq),
                'person': zhuawei.store['user'],
                'account': parserUtils.getAccountSinaC(jq),
                'permalink': parserUtils.getPermalinkSinaC(jq),
                'message': parserUtils.getMessageSinaC(jq),
                'links': parserUtils.getLinksSinaC(jq),
                'images': parserUtils.getImagesSinaC(jq),
                'video': parserUtils.getVideoSinaC(jq),
                'tags': parserUtils.getTagsSinaC(jq),
                'pings': parserUtils.getAtsSinaC(jq),
                'retweet_author': hasForward?parserUtils.getAccountSinaC(expand):null,
                'retweet_permalink': hasForward?parserUtils.getPermalinkSinaC(expand):null
            };
        },
    };

    zhuawei.typeconfig = {
      mappings: {
        tweets: {
          properties: {
              timestamp: {
                  type: "string",
                  index: "not_analyzed"
              },
              service: {
                  type: "string",
                  index: "not_analyzed"
              },
              mid: {
                  type: "long",
                  index: "not_analyzed"
              },
              person: {
                  type: "string",
                  index: "not_analyzed"
              },
              account: {
                  type: "string",
                  index: "not_analyzed"
              },
              permalink: {
                  type: "string",
                  index: "not_analyzed"
              },
              message: {
                  type: "string",
                  index: "analyzed"
              },
              links: {
                  type: "string",
                  index: "not_analyzed"
              },
              images: {
                  type: "string",
                  index: "not_analyzed"
              },
              video: {
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
              retweet_author: {
                  type: "string",
                  index: "not_analyzed"
              },
              retweet_permalink: {
                  type: "string",
                  index: "not_analyzed"
              },
          }
        }
      }
    }

    // utils
    zhuawei.url2service = function(url){
        var matches = _.filter(_.pairs(serviceUrlPatterns), function(pair){ return _.any(pair[1], function(patt){ return url.match(patt);})});
        if(!_.isEmpty(matches)){
            return matches[0][0];
        }
    }

    zhuawei.grabAndSend = function(){
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            // TODO: consider task queue 
            var tab = tabs[0];
            //console.log(tabs);
            var tabId = tab.id,
                tabUrl = tab.url;
            //console.log('tabUrl='+tabUrl);
            $.ajax({
                type: "GET",
                cache: false,
                username: localStorage.username,
                password: localStorage.password,
                url: localStorage.searchserver + "/" + localStorage.index + "/_status",

                success: function() {
                    chrome.tabs.sendRequest(tabId, {method: 'grabTweets', selectors: serviceSelectors[zhuawei.url2service(tabUrl)]}, function(msg){
                        if(!msg || _.isEmpty(msg)){
                            console.log("[onResponse] nothing return from grabTweets!!!");
                            return;
                        };
                        var parserFunc = serviceParsers[zhuawei.url2service(tabUrl)];
                        var tweets = _.map(msg, parserFunc);
                        var request = _.map(tweets, JSON.stringify).join('\n');
                        //TODO
                        $.ajax({
                            type: "POST",
                            url: localStorage.searchserver + "/" + localStorage.index + "/_bulk",
                            processData: false,
                            contentType: 'application/json',
                            username: localStorage.username,
                            password: localStorage.password,
                            dataType: 'text',
                            data: request,
                            success: function(){
                                var notification = window.webkitNotifications.createNotification(
                                   'image/icon16.png',
                                   'send successed',
                                   'the tweets has been sent to the server'
                                );
                                notification.show();
                                setTimeout(function(){
                                    notification.hide();
                                }, 1500);
                            }
                        });
                    });
                },

                error: function(){
                    if (!zhuawei.index_setuped){
                        console.log("setup!");
                        $.ajax({
                            type: "POST",
                            url: localStorage.searchserver + "/" + localStorage.index,
                            username: localStorage.username,
                            password: localStorage.password,
                            processData: false,
                            contentType: 'application/json',
                            data: JSON.stringify(zhuawei.typeconfig)
                        });
                        zhuawei.index_setuped = true;
                    }
                }
            });
        });
        return;
    }

    /** **
    // apis for pageAction and content scripts
    bg.api = {
        "grabAndSend": function(request, sender, response){
            chrome.pageAction.hide();
        }
    };
    /** **/

    /** **
    // dispatching api request
    chrome.extension.onMessage.addListener(function(request, sender, response){
        console.log('incoming message');
        console.log(sender);
        if(_.has(bg.api, request.method)){
            bg.api[request.method](request, sender, response);
        }
    });
    /** **/
    var cache = {};

    /** **/
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
        //console.log([tabId, changeInfo, tab]);
        var tabUrl = tab.url;
        // detect pageAction
        if(changeInfo.status == "loading" && zhuawei.url2service(tabUrl)){
            chrome.pageAction.hide(tabId);
        };

        /** **/
        // grab tweets
        if(changeInfo.status == "complete" && zhuawei.url2service(tabUrl)){
            /** **
            chrome.tabs.sendRequest(tabId, {method: 'grabTweets', selectors: serviceSelectors['sina_userPage']}, function(msg){
                if(!msg || _.isEmpty(msg)){
                    console.log("[onResponse] nothing return!!!");
                    return;
                };
                chrome.pageAction.show(tabId);
                var parserFunc = serviceParsers[zhuawei.url2service(tabUrl)];
                var tweets = _.map(msg, parserFunc);
                console.log(tweets);
                //console.log(_.map(msg, function(o){ return $(o).find("div.WB_text").innerHTML;}));
            });
            /** **/
            chrome.pageAction.show(tabId);
        };
        /** **/
    });
    /** **/

}).call(this);
