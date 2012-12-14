/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

let policy =
{
  classDescription: "Test content policy",
  classID: Components.ID("{12345678-1234-1234-1234-123456789abc}"),
  contractID: "@adblockplus.org/test-policy;1",
  xpcom_categories: ["content-policy"],

  init: function()
  {
    let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
    registrar.registerFactory(this.classID, this.classDescription, this.contractID, this);

    let catMan = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);
    for each (let category in this.xpcom_categories)
      catMan.addCategoryEntry(category, this.contractID, this.contractID, false, true);

    onShutdown.add((function()
    {
      for each (let category in this.xpcom_categories)
        catMan.deleteCategoryEntry(category, this.contractID, false);

      // This needs to run asynchronously, see bug 753687
      Services.tm.currentThread.dispatch(function()
      {
        registrar.unregisterFactory(this.classID, this);
      }.bind(this), Ci.nsIEventTarget.DISPATCH_NORMAL);
    }).bind(this));
  },

  // nsIContentPolicy interface implementation
  shouldLoad: function(contentType, contentLocation, requestOrigin, node, mimeTypeGuess, extra)
  {

    // var curIsHttps =  window.top.getBrowser().selectedBrowser.contentWindow.location.href.substr(0, 5) === 'https';

    // dump(window.top.getBrowser().selectedBrowser.contentWindow.location.href);
    // dump(curIsHttps);

    // dump(contentLocation.scheme + " " + requestOrigin.scheme + "\n");

    // dump("shouldLoad: " + contentType + " " +
    //                       (contentLocation ? contentLocation.spec : "null") + " " +
    //                       (requestOrigin ? requestOrigin.spec : "null") + " " +
    //                       node + " " +
    //                       mimeTypeGuess + "\n");

    if (requestOrigin.scheme === 'https' &&
        contentLocation.scheme !== 'https') {

      if (contentType === Ci.nsIContentPolicy.TYPE_IMAGE ||
          contentType === Ci.nsIContentPolicy.TYPE_STYLESHEET ||
          contentType === Ci.nsIContentPolicy.TYPE_SCRIPT) {

        return Ci.nsIContentPolicy.REJECT_REQUEST;
      }
    }

    return Ci.nsIContentPolicy.ACCEPT;
  },

  shouldProcess: function(contentType, contentLocation, requestOrigin, node, mimeTypeGuess, extra)
  {
    dump("shouldProcess: " + contentType + " " +
                            (contentLocation ? contentLocation.spec : "null") + " " +
                            (requestOrigin ? requestOrigin.spec : "null") + " " +
                            node + " " +
                            mimeTypeGuess + "\n");
    return Ci.nsIContentPolicy.ACCEPT;
  },

  // nsIFactory interface implementation
  createInstance: function(outer, iid)
  {
    if (outer)
      throw Cr.NS_ERROR_NO_AGGREGATION;
    return this.QueryInterface(iid);
  },

  // nsISupports interface implementation
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIContentPolicy, Ci.nsIFactory])
};

policy.init();
