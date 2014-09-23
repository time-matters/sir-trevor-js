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

  switch(method) {

    case "create":
      // Grab our JSON from the textarea and clean any whitespace incase there is a line wrap between the opening and closing textarea tags
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
