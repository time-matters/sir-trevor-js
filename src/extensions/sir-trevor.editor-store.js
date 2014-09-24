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
    var content = _.trim(editor.$el.val());
    return content === '' || JSON.parse(content).server_uuid === undefined;
  };

  var getLatestUnsavedFromUUIDs = function(uuids) {
    return _.find(uuids, function(uuid) {
      var result = $.ajax({
        type: 'GET',
        url: '/editor/articles/' + uuid + '/version',
        async: false
      });
      return !(result.responseJSON &&
               result.responseJSON.article &&
               result.responseJSON.article.server_version);
    });
  };

  var getKeysWithoutServerUUID = function() {
    var key, keys = [];
    var prefix = "st-";

    // find eligible keys
    for (key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        if (key.lastIndexOf(prefix) === 0) {
          try {
            if (JSON.parse(localStorage.getItem(key)).server_uuid === undefined) {
              keys.push(key);
            }
          } catch(e) {
            // i hope nobody ever finds this.
          }
        }
      }
    }

    return keys.map(getUUIDFromKey);
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

  var getUUIDFromKey = function(key) {
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
    console.log('replacing the content');
    return true; // always replace;
    // return confirm('Wir haben auf diesem Computer eine zwischengespeicherte Version dieses Artikels gefunden.\nMöchtest du diese Version widerherstellen?');
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
      var document, str, uuids, unsaved;
      // Grab our JSON from the textarea and clean any whitespace incase there is a line wrap between the opening and closing textarea tags
      var content = _.trim(editor.$el.val());
      reset();

      if (isNewArticle()) {

        uuids = getKeysWithoutServerUUID();
        unsaved = getLatestUnsavedFromUUIDs(uuids);

        if (unsaved !== undefined) {

          document = newestDocumentForUUID(unsaved);
          debugger;
          if ((document.version > editor.dataStore.version) && askUserForConfirmation()) {
            editor.dataStore = JSON.parse(document.dataStore);
          }
        }

      } else {

        try {

          // Ensure the JSON string has a data element that's an array
          str = JSON.parse(content);
          if (!_.isUndefined(str.data)) {
            // Set it
            editor.dataStore = str;
            ensureMetadata();
          }

          // check local storage for article cache. if one is found, ask user.
          document = newestDocumentForUUID(editor.dataStore.uuid);
          if ((document.version > editor.dataStore.version) && askUserForConfirmation()) {
            editor.dataStore = JSON.parse(document.dataStore);
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
