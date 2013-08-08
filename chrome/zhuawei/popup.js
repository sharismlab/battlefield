$(document).ready(function(){
    if(localStorage.username){
        $('#username').text(localStorage.username);
        $('#taskbox').css({'display': 'block', 'minheight': '60px'});
        $('#send').click(function(){
            var bg = chrome.extension.getBackgroundPage();
            bg.zhuawei.grabAndSend();
            setTimeout(function(){window.close();}, 500);
        });
    }
});
