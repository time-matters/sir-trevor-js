/*
* Sir Trevor Editor Store
* By default we store the complete data on the instances $el
* We can easily extend this and store it on some server or something
*/

SirTrevor.editorStore = function(editor, method, options) {
  var resp;

  options = options || {};

  var reset = function() {
    var oldDataStore = editor.dataStore;
    editor.dataStore = {
      data: []
    };

    if (oldDataStore !== undefined) {
      editor.dataStore.version = oldDataStore.version;
      editor.dataStore.uuid = oldDataStore.uuid;
    }

    ensureMetadata();
  };

  var ensureMetadata = function() {
    ensureUUID();
    ensureVersion();
  };

  var ensureUUID = function() {
    if(editor.dataStore.uuid === undefined) {
      editor.dataStore.uuid = SirTrevor.generateUUID();
    }
  };

  var ensureVersion = function() {
    if(editor.dataStore.version === undefined) {
      editor.dataStore.version = 0;
    }
  };

  var isNewArticle = function() {

    // the proper way
    var content = JSON.parse(_.trim(editor.$el.val()));
    return content.server_uuid === undefined;

    // the easy way
    // var path = window.location.pathname;
    // return $.inArray(path, [
    //   '/editor/articles',
    //   '/editor/articles/new'
    // ]) !== -1;

  };

  var newestDocumentForUUID = function(uuid) {
    var key, keys = [];
    var prefix = "st-" + uuid;

    // find eligible keys
    for (key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        if (key.lastIndexOf(prefix) === 0) {
          keys.push(key);
        }
      }
    }

    // find biggest verison number
    var version = Math.max.apply(null, keys.map(function(e) {
      return parseInt(/version-(\d+)/.exec(e)[1], 10);
    }));

    return {
      version: version,
      dataStore: localStorage[prefix + '-version-' + version]
    };
  };

  var getUUIDFromKey = function(uuid) {
    return /st-(.*)-version-(\d+)/.exec(key)[1];
  };

  var getAllUUIDs = function() {
    var key, keys = [];

    // get all keys
    for (key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        if (key.lastIndexOf('st-') === 0) {
          keys.push(getUUIDFromKey(key));
        }
      }
    }
    return _.uniq(keys);
  };

  var removeOldAutosaves = function() {
    var uuids = getAllUUIDs();
    var keysToKeep = uuids.map(function(uuid) {
      return 'st-' + uuid + '-version-' + newestDocumentForUUID(uuid).version;
    });

    var key, keys = [];

    // get all keys
    for (key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        if (key.lastIndexOf('st-') === 0) {
          if ($.inArray(key, keysToKeep) === -1) {
            localStorage.removeItem(key);
          }
        }
      }
    }
  };

  var askUserForConfirmation = function() {
    return confirm('Wir haben auf diesem Computer eine zwischengespeicherte Version dieses Artikels gefunden.\nMöchtest du diese Version widerherstellen?');
  };

  switch(method) {

    case "autosave":
      editor.dataStore.version = ++editor.dataStore.version;
      var store = editor.dataStore,
          value = (store.data.length > 0) ? JSON.stringify(editor.dataStore) : '',
          key = "st-" + store.uuid + "-version-" + store.version;
      window.localStorage.setItem(key, value);
      removeOldAutosaves();
    break;

    case "create":
      // Grab our JSON from the textarea and clean any whitespace incase there is a line wrap between the opening and closing textarea tags
      // debugger;
      var content = _.trim(editor.$el.val());
      reset();

      if (content.length > 0) {
        try {
          // Ensure the JSON string has a data element that's an array
          var str = JSON.parse(content);
          if (!_.isUndefined(str.data)) {
            // Set it
            editor.dataStore = str;
            ensureMetadata();
          }

          if (isNewArticle()) {

            // check local storage for new caches.
            // if found, ask user
            // otherwise the usual stuff.
            console.log("this article is assumed to be new");

          } else {

            // check local storage for article cache. if one is found, ask user.
            var document = newestDocumentForUUID(editor.dataStore.uuid);
            if ((document.version > editor.dataStore.version) && askUserForConfirmation()) {
              editor.dataStore = JSON.parse(document.dataStore);
            }
          }

        } catch(e) {
          editor.errors.push({ text: i18n.t("errors:load_fail") });
          editor.renderErrors();

          SirTrevor.log('Sorry there has been a problem with parsing the JSON');
          SirTrevor.log(e);
        }
      }
    break;

    case "reset":
      reset();
    break;

    case "add":
      if (options.data) {
        editor.dataStore.data.push(options.data);
        resp = editor.dataStore;
      }
    break;

    case "save":
      // Store to our element
      editor.$el.val((editor.dataStore.data.length > 0) ? JSON.stringify(editor.dataStore) : '');
    break;

    case "read":
      resp = editor.dataStore;
    break;

  }

  if(resp) {
    return resp;
  }

};
