
var observeObj = {

  observe: function (subject, topic, data) {
    if (topic == "http-on-modify-request") {
      subject.QueryInterface(Components.interfaces.nsIHttpChannel);
      var url = subject.URI.spec; /* url being requested. you might want this for something else */
      var start = url.substr(0, 5)
      if (start !== 'https') {
        Firebug.Console.log('not https but ' + start + ': ' + url);
      }
    }
  }
};

var observerService = Cc["@mozilla.org/observer-service;1"]
    .getService(Ci.nsIObserverService);

observerService.addObserver(observeObj,
    "http-on-modify-request", false);



var HelloWorld = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    alert('hello theree');
  },

  onMenuItemCommand: function() {
    window.open("chrome://helloworld/content/hello.xul", "", "chrome");
  },

};

window.addEventListener("load", function(e) { HelloWorld.onLoad(e); }, false); 


var examplePageLoad = function() {
  //alert('in examplePageLoad');
}
window.addEventListener("load", function () {
  // Add a callback to be run every time a document loads.
  // note that this includes frames/iframes within the document
  gBrowser.addEventListener("load", examplePageLoad, true);
}, false);
