// logic
var API = {};

API.grabTweets = function(request, sender, response){
    if(sender.fromTab){return;}     // dont accept request from other tabs

    var url = window.location.href;
    var selectors = request.selectors;
    var elements = selectors.length==1 ? $(selectors[0]) : _.reduce(_.rest(selectors), function(memo, sel){return memo.find(sel);}, $(_.first(selectors)));

    //console.log("[onGrabTweets]url="+url);
    //console.log(elements.slice(0));
    response(_.map(elements.slice(0), function(o){ return o.outerHTML;}));
}


// initialization jobs

function requestDispatcher(request, sender, response){
    var method = request.method;
    console.log('[onRequest]');
    console.log(request);
    if(method && _.has(API, method)){
        console.log('[onRequest]its an API request');
        sender.fromTab = sender.tab?true:false;
        sender.fromExt = !sender.fromTab;
        _.delay(function(){API[method].call(this, request, sender, response);}, 200);   // need an alternative method
    }else{
        console.log('[onRequest]its nothing');
        response();
    }
}

chrome.extension.onRequest.addListener(requestDispatcher);

console.log("[zhuawei] content script loaded");
