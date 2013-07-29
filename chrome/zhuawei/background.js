(function(){
    var root = this;
    var
        zhuawei = {bg:{}, store: localStorage},
        bg = zhuawei.bg ;

    root.zhuawei = zhuawei;

    var parserUtils = {
        'getTimeSinaA': function(jq){
            // for userPage, searchPage
            var d = new Date();
            d.setSeconds(parseInt(jq.find('a[node-type="feed_list_item_date"]').attr('date'))/1000);
            return d.toISOString();
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
        'getAccountSina': function(jq){
            //TODO
            return;
        },
        'getPermalinkSinaA': function(jq){
            // for userPage
            return jq.find('div.WB_from a').get(0).href;
        },
        'getPermalinkSinaB': function(jq){
            // for topicPage
            return jq.find('span.time a').attr('href');
        },
        'getPermalinkSinaC': function(jq){
            // for searchPage
            return jq.find('a.date').attr('href');
        },
        'getMessageSinaA': function(jq){
            // for userPage
            return jq.find('div.WB_text').text();
        },
        'getMessageSinaB': function(jq){
            // for topicPage
            return jq.find('p.con_txt em').text();
        },
        'getMessageSinaC': function(jq){
            // for searchPage
            return jq.find('dd.content em').text();
        },
        'getLinksSinaA': function(jq){
            // for userPage
            return _.map(jq.find('div.WB_text a[action-type="feed_list_url"]'), function(o){return o.href;});
        },
        'getLinksSinaB': function(jq){
            // for topicPage
            return _.filter(_.map(jq.find('p.con_txt em a').slice(0), function(o){ return o.href; }), function(url){ return url.indexOf('http://t.cn/')==0; });
        },
        'getLinksSinaC': function(jq){
            // for searchPage
            return _.map(jq.find('dd.content em a[action-type="feed_list_url"]'), function(o){return o.href;});
        },
        'getImagesSinaA': function(jq){
            // for userPage, searchPage
            return _.map(jq.find('dd.content > ul.piclist img.bigcursor'), function(o){return o.src;});
        },
        'getImagesSinaB': function(jq){
            // for topicPage
            return _.map(jq.find('div.con_media img.bigcursor'), function(o){return o.src;});
        },
        'getVideoSinaA': function(jq){
            // for userPage
            return _.map(jq.find('div.WB_feed_detail > div.WB_detail > ul.WB_media_list li[action-type="feed_list_media_video"]'), function(o){ return _.filter(decodeURIComponent(o.getAttribute("action-data")).split('&'), function(pair){ return pair.indexOf('full_url='==0;)})[0].slice(9);});
        },
        'getVideoSinaB': function(jq){
            // for topicPage
            return _.map(jq.find('div.con_media ul.media_list > li[action-type="list_preview"]'), function(o){ return _.filter(decodeURIComponent(o.getAttribute("action-data")).split('&'), function(pair){ return pair.indexOf('full_url='==0;)})[0].slice(9);});
        },
        'getVideoSinaC': function(jq){
            // for searchPage
            return _.map(jq.find('dd.content > ul.piclist img[action-type="feed_list_media_video"]'), function(o){ return _.filter(decodeURIComponent(o.getAttribute("action-data")).split('&'), function(pair){ return pair.indexOf('full_url='==0;)})[0].slice(9);});
        },
        'getTagsSinaA': function(jq){
            // for userPage
            return _.map(jq.find('div.WB_text a.a_topic'), function(o){ return o.innerText;});
        },
        'getTagsSinaB': function(jq){
            // for topicPage
            return _.filter(_.map(jq.find('div.content em a'), function(o){ return o.innerText;}), function(txt){ return txt.slice(0,1)=='#' && txt.slice(-1)=='#';});
        },
        'getTagsSinaC': function(jq){
            // for searchPage
            return _.map(jq.find('dd.content a'), function(o){ return o.innerText;});
        },
        'getAtsSinaA': function(jq){
            // for userPage
            return _.map(jq.find('div.WB_text a[usercard]'), function(o){return o.innerText.slice(1);});
        },
        'getAtsSinaB': function(jq){
            // for topicPage
            return _.map(jq.find('div.content em a[action-type="usercard"]'), function(o){return o.innerText.slice(1);});
        },
        'getAtsSinaC': function(jq){
            // for searchPage
            return _.map(jq.find('dd.content em a[usercard]'), function(o){return o.innerText.slice(1);});
        },


    };

    // url patterns sina only currently
    var serviceUrlPatterns = {
        "sina_userPage": [/https?:\/\/weibo\.com\/(u\/)?[a-zA-Z0-9]+\/profile.*/i, /https?:\/\/weibo\.com\/(u\/)?[a-zA-Z0-9]+(\?.+)?$/i],
        "sina_topicPage": [/https?:\/\/huati\.weibo\.com\/.*/i],
        "sina_searchPage": [/https?\/\/s\.weibo\.com\/weibo\/.*/i],
    };

    var serviceSelectors = {
        "sina_userPage": ['div.WB_feed div.WB_feed_type'],
        "sina_topicPage": '',
        "sina_searchPage": '',
    };

    var serviceParsers = {
        "sina_userPage": function(msg){
            var o = $(msg);

        },
        "sina_topicPage": function(msg){
        },
        "sina_searchPage": function(msg){
        },
    };

    /** **
    // apis for pageAction and content scripts
    bg.api = {
        "checkPageaction": function(request, sender, response){
            var tab = sender.tab;
            if(tab && tab.url && zhuawei.url2service(tab.url)){
                    chrome.pageAction.show(tab.id);
                    response("pageAction has shown");
            }else{
                    console.log("[API]"+request.method+", Fail, url="+tab.url);
                    response("fail!!");
            }
        }
    };
    /** **/

    // utils
    zhuawei.url2service = function(url){
        var matches = _.filter(_.pairs(serviceUrlPatterns), function(pair){ return _.any(pair[1], function(patt){ return url.match(patt);})});
        if(!_.isEmpty(matches)){
            return matches[0][0];
        }
    }

    /** **
    // dispatching api request
    chrome.extension.onMessage.addListener(function(request, sender, response){
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
            chrome.tabs.sendRequest(tabId, {method: 'grabTweets', selectors: serviceSelectors['sina_userPage']}, function(msg){
                if(!msg || _.isEmpty(msg)){
                    console.log("[onResponse] nothing return!!!");
                    return;
                };
                chrome.pageAction.show(tabId);
                console.log(msg);
                //console.log(_.map(msg, function(o){ return $(o).find("div.WB_text").innerHTML;}));
            });
        };
        /** **/
    });
    /** **/

}).call(this);
