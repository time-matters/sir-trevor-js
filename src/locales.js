SirTrevor.Locales = {
  en: {
    general: {
      'add':              'Add Content',
      'deleteElement':    'Delete Element',
      'delete':           'Delete?',
      'drop':             'Drag __block__ here',
      'paste':            'Or paste URL here',
      'upload':           '…or choose a file',
      'close':            'close',
      'position':         'Change position',
      'wait':             'Please wait…',
      'link':             'Enter a link',
      'note':             'Note',
      'style':            'Style',
      'source':           'Source'
    },

    errors: {
      'title': "You have the following errors:",
      'validation_fail': "__type__ block is invalid",
      'block_empty': "__name__ must not be empty",
      'type_missing': "You must have a block of type __type__",
      'required_type_empty': "A required block type __type__ is empty",
      'load_fail': "There was a problem loading the contents of the document"
    },
    blocks: {
      text: {
        'title': "Text"
      },
      list: {
        'title': "List"
      },
      quote: {
        'title': "Cite",
        'credit_field': "Credit"
      },
      extended_image: {
        'title': "Image",
        'caption_field': "Caption",
        'caption_placeholder': "Caption",
        'copyright_field': "Copyright",
        'copyright_placeholder': "Copyright",
        'upload_error': "There was a problem with your upload"
      },
      image: {
        'title': "Image",
        'upload_error': "There was a problem with your upload"
      },
      audio: {
        'title': "Audio"
      },
      infographic: {
        'title': "Infographic"
      },
      video: {
        'title': "Video"
      },
      tweet: {
        'title': "Tweet",
        'fetch_error': "There was a problem fetching your tweet"
      },
      embedly: {
        'title': "Embedly",
        'fetch_error': "There was a problem fetching your embed",
        'key_missing': "An Embedly API key must be present"
      },
      heading: {
        'title': "Heading"
      }
    }
  },
  de: {
    general: {
      'add':              'Absatz hinzufügen',
      'deleteElement':    'Absatz löschen',
      'delete':           'Löschen?',
      'drop':             '__block__ hierher bewegen',
      'paste':            'Oder URL hier einfügen',
      'upload':           '…oder Datei auswählen',
      'close':            'Schließen',
      'position':         'Absatz verschieben',
      'wait':             'Bitte warten…',
      'link':             'Link eingeben',
      'note':             'Anmerkung',
      'style':            'Style',
      'source':           'Quelle'
    },
    errors: {
      'title': "Folgende Fehler sind aufgetreten:",
      'validation_fail': "__type__ Block ist nicht gültig",
      'block_empty': "__name__ darf nicht leer sein",
      'type_missing': "Es wird ein Block vom Typ __type__ benötigt",
      'required_type_empty': "Ein benötigter Block vom Typ  __type__ ist leer",
      'load_fail': "Es gab ein Problem beim Laden der Daten für dieses Dokument"
    },
    blocks: {
      text: {
        'title': "Lauftext"
      },
      list: {
        'title': "Liste"
      },
      quote: {
        'title': "Zitat",
        'credit_field': "Quelle"
      },
      extended_image: {
        'title': "Bild",
        'caption_field': "Bildunterzeile",
        'caption_placeholder': "Bildunterzeile",
        'copyright_field': "Fotograf",
        'copyright_placeholder': "Fotograf",
        'upload_error': "es gab ein problem beim hochladen"
      },
      image: {
        'title': "Bild",
        'upload_error': "es gab ein problem beim hochladen"
      },
      audio: {
        'title': "Audio"
      },
      infographic: {
        'title': "Infografik"
      },
      video: {
        'title': "Video"
      },
      tweet: {
        'title': "Tweet",
        'fetch_error': "There was a problem fetching your tweet"
      },
      embedly: {
        'title': "Embedly",
        'fetch_error': "There was a problem fetching your embed",
        'key_missing': "An Embedly API key must be present"
      },
      heading: {
        'title': "Überschrift"
      }
    }
  }
};

if (window.i18n === undefined || window.i18n.init === undefined) {
  // Minimal i18n stub that only reads the English strings
  SirTrevor.log("Using i18n stub");
  window.i18n = {
    t: function(key, options) {
      var parts = key.split(':'), str, obj, part, i;

      obj = SirTrevor.Locales[SirTrevor.LANGUAGE];

      for(i = 0; i < parts.length; i++) {
        part = parts[i];

        if(!_.isUndefined(obj[part])) {
          obj = obj[part];
        }
      }

      str = obj;

      if (!_.isString(str)) { return ""; }

      if (str.indexOf('__') >= 0) {
        _.each(options, function(value, opt) {
          str = str.replace('__' + opt + '__', value);
        });
      }

      return str;
    }
  };
} else {
  SirTrevor.log("Using i18next");
  // Only use i18next when the library has been loaded by the user, keeps
  // dependencies slim
  i18n.init({ resStore: SirTrevor.Locales, fallbackLng: SirTrevor.LANGUAGE,
              ns: { namespaces: ['general', 'blocks'], defaultNs: 'general' }
  });
}
