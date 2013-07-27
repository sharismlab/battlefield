(function(){
    var root = this;
    var
        zhuawei = {bg:{}, store: localStorage},
        bg = zhuawei.bg ;

    root.zhuawei = zhuawei;

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

    /** **/
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
        console.log([tabId, changeInfo, tab]);
        // detect pageAction
        if(changeInfo.status == "loading" && zhuawei.url2service(tab.url)){
            chrome.pageAction.show(tabId);
        };

        /** **/
        // grab tweets
        if(changeInfo.status == "complete" && zhuawei.url2service(tab.url)){
            chrome.tabs.sendRequest(tabId, {method: 'grabTweets', selectors: serviceSelectors['sina_userPage']}, function(msg){
                if(!msg || _.isEmpty(msg)){
                    console.log("[onResponse] nothing return!!!");
                    return;
                };
                console.log(msg);
                //console.log(_.map(msg, function(o){ return $(o).find("div.WB_text").innerHTML;}));
            });
        };
        /** **/
    });
    /** **/

}).call(this);
