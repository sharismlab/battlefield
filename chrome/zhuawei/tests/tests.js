describe("Zhuawei", function() {

    describe("fire", function(){

        beforeEach(function(){
            tab = {id: 12345};
            page = "";
            chrome = {
                pageAction: {
                    show: function(){},
                    onClicked: {
                        addListener: function(){}
                    }
                }
            }
        }); 

        it("should show button", function(){
          // expect(chrome.pageAction.show).toHaveBeenCalledWith(tab.id);
        });

        it("send data to server", function(){
          // expect(chrome.pageAction.show).toHaveBeenCalledWith(tab.id);
          index_setuped = true;
          
        });

    });

});


describe("background", function(){
  
  beforeEach(function(){
    chrome = {
      extension: {
        onMessage: {
          addListener: function(){}
        }
      }
    } 
    spyOn(chrome.extension.onMessage, 'addListener');
    // spyOn(GistIO, 'setUp').andCallFake(function(){});
  });

  it("should add a listener ", function(){
    runs(function(){
      require(['background']);
    });
    waits(100);

    runs(function(){
      listener = chrome.extension.onMessage.addListener;
      listener("fetch", {tab: "tab"}, function(){});
      console.log(listener)
      // expect(zhuawei.setUp).toHaveBeenCalledWith("fetch", "tab");
    });
  });

})
