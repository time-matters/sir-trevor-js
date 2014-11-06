/*
  Divider
*/

SirTrevor.Blocks.Divider = (function() {

  var template = '<div class="st-divider st-block--divider"><hr></div>';

  return SirTrevor.Block.extend({

    type: 'divider',

    title: function() { return i18n.t('blocks:divider:title'); },

    icon_name: 'divider',

    editorHTML: function() {
      return _.template(template, this);
    },

    toMarkdown: function(markdown) {
      return "---------------------------------------";
    },

    toHTML: function(html) {
      return template;
    },

    isEmpty: function() {
      return false;
    }

  });

})();
