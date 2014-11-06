/*
  Extended Block Quote
*/

SirTrevor.Blocks.ExtendedQuote = (function(){

  var template = _.template([
    '<blockquote class="st-required st-text-block st-block--extended-quote" contenteditable="true"></blockquote>',
    '<label class="st-input-label"> <%= i18n.t("blocks:extended_quote:credit_field") %></label>',
    '<input name="cite" placeholder="<%= i18n.t("blocks:extended_quote:credit_field") %>"',
    ' class="st-input-string js-cite-input" type="text" />'
  ].join("\n"));

  return SirTrevor.Block.extend({

    type: "extended_quote",

    title: function() { return i18n.t('blocks:extended_quote:title'); },

    icon_name: 'quote-extended',
    changeable: ['Heading', 'text'],

    editorHTML: function() {
      return template(this);
    },

    loadData: function(data){
      this.getTextBlock().html(SirTrevor.toHTML(data.text, this.type));
      this.$('.js-cite-input').val(data.cite);
    },

    toMarkdown: function(markdown) {
      return markdown.replace(/^(.+)$/mg,"> $1");
    }

  });

})();
