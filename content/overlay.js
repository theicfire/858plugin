// const Cc = Components.classes;
// const Ci = Components.interfaces;
// const Cr = Components.results;
// const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

var policy =
{
  classDescription: "Test content policy",
  classID: Components.ID("{12345678-1234-1234-1234-123456789abc}"),
  contractID: "@mozilla.doslash.org/test-policy;1",
  xpcom_categories: ["content-policy"],
  plugin_on: true,

  init: function()
  {
    var registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
    registrar.registerFactory(this.classID, this.classDescription, this.contractID, this);

    var catMan = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);
    for each (var category in this.xpcom_categories)
      catMan.addCategoryEntry(category, this.contractID, this.contractID, false, true);

    /**
     * Installs the toolbar button with the given ID into the given
     * toolbar, if it is not already present in the document.
     *
     * @param {string} toolbarId The ID of the toolbar to install to.
     * @param {string} id The ID of the button to install.
     * @param {string} afterId The ID of the element to insert after. @optional
     */
    var installButton = function(toolbarId, id, afterId) {
        if (!document.getElementById(id)) {
            var toolbar = document.getElementById(toolbarId);
     
            // If no afterId is given, then append the item to the toolbar
            var before = null;
            if (afterId) {
                let elem = document.getElementById(afterId);
                if (elem && elem.parentNode == toolbar)
                    before = elem.nextElementSibling;
            }
     
            toolbar.insertItem(id, before);
            toolbar.setAttribute("currentset", toolbar.currentSet);
            document.persist(toolbar.id, "currentset");
     
            if (toolbarId == "addon-bar")
                toolbar.collapsed = false;
        }
    }
 
    installButton("nav-bar", "my-extension-navbar-button");
    // The "addon-bar" is available since Firefox 4
    installButton("addon-bar", "my-extension-addon-bar-button");
  },

  // nsIContentPolicy interface implementation
  shouldLoad: function(contentType, contentLocation, requestOrigin, node, mimeTypeGuess, extra)
  {
    if (this.plugin_on && (requestOrigin.scheme === 'https' &&
        contentLocation.scheme !== 'https')) {

      if (contentType !== Ci.nsIContentPolicy.TYPE_DOCUMENT &&
          contentType !== Ci.nsIContentPolicy.TYPE_SUBDOCUMENT) {

        return Ci.nsIContentPolicy.REJECT_REQUEST;
      }
    }

    return Ci.nsIContentPolicy.ACCEPT;
  },

  shouldProcess: function(contentType, contentLocation, requestOrigin, node, mimeTypeGuess, extra)
  {
    return Ci.nsIContentPolicy.ACCEPT;
  },

  // nsIFactory interface implementation
  createInstance: function(outer, iid)
  {
    if (outer)
      throw Cr.NS_ERROR_NO_AGGREGATION;
    return this.QueryInterface(iid);
  },

  onMenuItemCommand: function(event) {
    //alert('menu here');
    this.plugin_on = !this.plugin_on;
    if (this.plugin_on) {
      alert('Plugin is on');
    } else {
      alert('Plugin is off');
    }
  },

  // nsISupports interface implementation
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIContentPolicy, Ci.nsIFactory])
};

policy.init();
