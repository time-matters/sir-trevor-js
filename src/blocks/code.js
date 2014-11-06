/*
  Code Block
*/

SirTrevor.Blocks.Code = (function(){

  var template = _.template([
    '<code class="st-code st-required st-text-block st-block--code" contenteditable="true"></code>',
    '<label class="st-input-label"> <%= i18n.t("blocks:code:language_field") %></label>',
    '<input name="lang" placeholder="<%= i18n.t("blocks:code:language_field") %>"',
    ' class="st-input-string js-lang-input" type="text" />'
  ].join("\n"));

  return SirTrevor.Block.extend({

    type: "code",

    title: function() { return i18n.t('blocks:code:title'); },

    icon_name: 'text',
    // changeable: ['Heading', 'text'],

    editorHTML: function() {
      return template(this);
    },

    loadData: function(data){
      this.getTextBlock().html(SirTrevor.toHTML(data.text, this.type));
      this.$('.js-lang-input').val(data.lang);
    },

    toMarkdown: function(markdown) {
      return markdown.replace(/^(.+)$/mg,"    $1");
    }

  });

})();
