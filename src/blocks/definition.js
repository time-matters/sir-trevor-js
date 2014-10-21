/*
  Definition Block
*/

SirTrevor.Blocks.Definition = (function(){

  var template = _.template([
    '<dl><dt><label class="st-input-label"> <%= i18n.t("blocks:definition:term") %></label>',
    '<input name="term" placeholder="<%= i18n.t("blocks:definition:term") %>"',
    ' class="st-input-string js-term-input" type="text" /></dt>',
    '<dd class="st-required st-text-block" contenteditable="true" placeholder="<%= i18n.t("blocks:definition:description") %>"></dd></dl>'
  ].join("\n"));

  return SirTrevor.Block.extend({

    type: "definition",

    title: function() { return i18n.t('blocks:definition:title'); },

    icon_name: 'list',
    changeable: ['Heading', 'text'],

    editorHTML: function() {
      return template(this);
    },

    loadData: function(data){
      this.getTextBlock().html(SirTrevor.toHTML(data.text, this.type));
      this.$('.js-term-input').val(data.term);
    },

  });

})();
