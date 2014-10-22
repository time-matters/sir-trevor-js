/*
 * Sir Trevor Editor Store
 * By default we store the complete data on the instances $el
 * We can easily extend this and store it on some server or something
 */

SirTrevor.editorStore = function(editor, method, options) {
  var resp;

  options = options || {};

  Version = function(version) {
    var results;
    try {
      results = /(\d+)\.(\d+)/.exec(version);
      this.version = results[0];
      this.major = results[1];
      this.minor = results[2];
    } catch(e) {
      results = /(\d+)/.exec(version);
      this.version = results[0];
      this.major = results[1];
      this.minor = "0";
      this.recreateVersion();
    }
    return this;
  };

  Version.prototype = {

    minorVersion: function() {
      return parseInt(this.minor, 10);
    },

    incrementMinorVersion: function() {
      this.minor = (this.minorVersion() + 1).toString();
      return this.recreateVersion();
    },

    majorVersion: function() {
      return parseInt(this.major, 10);
    },

    incrementMajorVersion: function() {
      this.major = (this.majorVersion() + 1).toString();
      this.minor = "0";
      return this.recreateVersion();
    },

    recreateVersion: function() {
      this.version = this.major + "." + this.minor;
      return this;
    },

    gt: function(version) {
      if (this.majorVersion() > version.majorVersion()) {
        return true;
      } else if (this.majorVersion() === version.majorVersion()) {

        if (this.minorVersion() > version.minorVersion()) {
          return true;
        } else {
          return false;
        }

      } else {
        return false;
      }
    },

    toString: function() {
      return this.version;
    }
  };


  var reset = function() {
    var oldDataStore = editor.dataStore;
    editor.dataStore = {
      data: []
    };

    if (oldDataStore !== undefined) {
      editor.dataStore.version = oldDataStore.version;
      editor.dataStore.uuid = oldDataStore.uuid;
      editor.dataStore.server_version = oldDataStore.server_version;
      editor.dataStore.server_uuid = oldDataStore.server_uuid;
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
      editor.dataStore.version = '0.0';
    }
  };

  var isNewArticle = function() {
    var content = _.trim(editor.$el.val());
    return content === '' || JSON.parse(content).server_uuid === undefined;
  };

  var getLatestUnsavedFromUUIDs = function(uuids) {
    var name = editor.options.modelName;
    var urlPrefix = editor.options.baseURL;
    return _.find(uuids, function(uuid) {
      var result = $.ajax({
        type: 'GET',
        url: urlPrefix + uuid + '/version',
        async: false
      });
      return !(result.responseJSON &&
               result.responseJSON[name] &&
               result.responseJSON[name].server_version);
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

    if (editor.options.localStorage !== true) {
      return {};
    }

    var i, key, keys = [];
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
    var versions = keys.map(function(e) {
      return new Version(/version-(\d+(?:\.\d+)?)/.exec(e)[1]);
    });
    var result = versions[0];
    for (i=0; i<versions.length; i++) {
      if (versions[i].gt(result)) {
        result = versions[i];
      }
    }

    if (result === undefined) {
      return null;
    }

    return {
      version: result.toString(),
      dataStore: localStorage[prefix + '-version-' + result.toString()]
    };
  };

  var getUUIDFromKey = function(key) {
    return /st-(.*)-version-(\d+(?:\.\d+)?)/.exec(key)[1];
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

  var removeAllForUUID = function(uuid) {
    var key, document, stop = false;
    while (!stop) {
      document = newestDocumentForUUID(uuid);
      if (document === null) { break; }
      key = 'st-' + uuid + '-version-' + document.version;
      stop = !localStorage.hasOwnProperty(key);
      localStorage.removeItem(key);
    }
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

  var promptRestoration = function() {
    var warn = $('<div class="st-autoload-info">Dieser Artikel wurde aus dem Zwischenspeicher dieses Browsers geladen. Er wurde zuvor geändert und nicht auf dem Server gesichert. Du kannst die Änderungen beibehalten indem du speicherst oder die Änderungen verwerfen.<br></div>');
    var discard = $('<a href="#" class="st-autoload-discard-button">Verwerfen</a>');
    var close = $('<a href="#" class="st-icon st-autoload-close-button" data-icon="close"></a>');

    warn.append(discard);
    warn.append(close);

    close.on('click', function(e) {
      e.preventDefault();
      warn.remove();
      return false;
    });

    discard.on('click', function(e) {
      e.preventDefault();
      editor.store('restore');
      warn.remove();
      return false;
    });

    editor.$outer.prepend(warn);
  };

  var newVersion;

  switch(method) {

    case "autosave":
      newVersion = (new Version(editor.dataStore.version)).incrementMinorVersion().toString();
      editor.dataStore.version = newVersion;
      var store = editor.dataStore,
          value = (store.data.length > 0) ? JSON.stringify(editor.dataStore) : '',
          key = "st-" + store.uuid + "-version-" + store.version;
      window.localStorage.setItem(key, value);
      removeOldAutosaves();
    break;

    case "restore":
      removeAllForUUID(editor.dataStore.uuid);
      editor.reinitialize();
    break;

    case "create":
      var document, str, uuids, unsaved;
      var parsedStore, documentVersion, dataStoreVersion;

      // Grab our JSON from the textarea and clean any whitespace in case there is a line wrap between the opening and closing textarea tags
      var content = _.trim(editor.$el.val());

      reset();

      // Ensure the JSON string has a data element that's an array
      try {
        str = JSON.parse(content);
        if (!_.isUndefined(str.data)) {
          // Set it
          editor.dataStore = str;
          ensureMetadata();
        }
      } catch (e) {
        // nop.
      }

      if (isNewArticle()) {

        uuids = getKeysWithoutServerUUID();
        unsaved = getLatestUnsavedFromUUIDs(uuids);

        if (unsaved !== undefined) {

          document = newestDocumentForUUID(unsaved);
          if (document !== null) {
            parsedStore = JSON.parse(document.dataStore);
            documentVersion = new Version(parsedStore.version);
            dataStoreVersion = new Version(editor.dataStore.version);
            if (documentVersion.gt(dataStoreVersion) && askUserForConfirmation()) {
              editor.dataStore = JSON.parse(document.dataStore);
              promptRestoration();
            }
          }
        }

      } else {

        try {

          // check local storage for article cache. if one is found, ask user.
          document = newestDocumentForUUID(editor.dataStore.uuid);
          if (document !== null) {
            parsedStore = JSON.parse(document.dataStore);
            documentVersion = new Version(parsedStore.version);
            dataStoreVersion = new Version(editor.dataStore.version);
            if (documentVersion.gt(dataStoreVersion) &&
                askUserForConfirmation() &&
                document.dataStore.indexOf(JSON.stringify(editor.dataStore.data)) === -1) {
              editor.dataStore = JSON.parse(document.dataStore);
              promptRestoration();
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
      editor.dataStore.version = (new Version(editor.dataStore.version)).incrementMajorVersion().toString();
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
