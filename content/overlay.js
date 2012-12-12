var certificate_domains = [
  'verisign.com',
  'digicert.com'
];
var observeObj = {
  observe: function (subject, topic, data) {
    if (topic == "http-on-modify-request") {
      var curIsHttps =  window.top.getBrowser().selectedBrowser.contentWindow.location.href.substr(0, 5) === 'https';
      if (!curIsHttps) {
        //Firebug.Console.log('This page is not https');
        dump('This page is not https\n');
        return;
      }
      subject.QueryInterface(Components.interfaces.nsIHttpChannel);
      var url = subject.URI.spec; /* url being requested. you might want this for something else */
      var start = url.substr(0, 5)
      //Firebug.Console.log('checking', url);
      if (is_certificate_domain(url)) {
        //Firebug.Console.log('Letting through certificate: ' + url);
        dump('Letting though cert: ' + url + '\n');
        return;
      }
      if (start !== 'https') {
        //Firebug.Console.log('Blocking non https: ' + url);
        dump('Blocking non https: ' + url + '\n');
        subject.cancel(Components.results.NS_BINDING_ABORTED);
      }
    }
  }
};

var is_certificate_domain = function(url) {
  var domain = String(url.match(/[^./]+\.(com|org|edu)+/g));
  for (var i = 0; i < certificate_domains.length; i++) {
    if (domain === certificate_domains[i]) {
      return true; 
    }
  }
  return false;
}

var observerService = Cc["@mozilla.org/observer-service;1"]
    .getService(Ci.nsIObserverService);

observerService.addObserver(observeObj,
    "http-on-modify-request", false);






/// OTHER STUFF
//
//  OTHER STUFF
// page load stuff
//var myExtension = {
    //init: function() {
        //// The event can be DOMContentLoaded, pageshow, pagehide, load or unload.
        //if(gBrowser) gBrowser.addEventListener("DOMContentLoaded", this.onPageLoad, false);
    //},
    //onPageLoad: function(aEvent) {
        //var doc = aEvent.originalTarget; // doc is document that triggered the event
        //var win = doc.defaultView; // win is the window for the doc
        //// test desired conditions and do something
        //// if (doc.nodeName == "#document") return; // only documents
        //// if (win != win.top) return; //only top window.
        //// if (win.frameElement) return; // skip iframes/frames
        //Firebug.Console.log("page is loaded \n" +doc.location.href);
    //}
//}
//window.addEventListener("load", function load(event){
    //window.removeEventListener("load", load, false); //remove listener, no longer needed
    //myExtension.init();  
//},false);

//var HelloWorld = {
  //onLoad: function() {
    //// initialization code
    //this.initialized = true;
    //alert('hello theree');
  //},

  //onMenuItemCommand: function() {
    //window.open("chrome://helloworld/content/hello.xul", "", "chrome");
  //},

//};

//window.addEventListener("load", function(e) { HelloWorld.onLoad(e); }, false); 







//var examplePageLoad = function() {
  ////alert('in examplePageLoad');
//}
//window.addEventListener("load", function () {
  //// Add a callback to be run every time a document loads.
  //// note that this includes frames/iframes within the document
  //gBrowser.addEventListener("load", examplePageLoad, true);
//}, false);
