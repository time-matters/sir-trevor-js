/*
  Definition Block
*/

SirTrevor.Blocks.Definition = (function(){

  var template = _.template([
    '<dl class="st-definition"><dt><label class="st-input-label"> <%= i18n.t("blocks:definition:term") %></label>',
    '<input name="term" placeholder="<%= i18n.t("blocks:definition:term") %>"',
    ' class="st-input-string js-term-input" type="text" /></dt>',
    '<dd class="st-required st-text-block" contenteditable="true" data-placeholder="<%= i18n.t("blocks:definition:description") %>"></dd></dl>'
  ].join("\n"));

  return SirTrevor.Block.extend({

    type: "definition",

    title: function() { return i18n.t('blocks:definition:title'); },

    icon_name: 'list',
    changeable: ['Heading', 'text'],

    editorHTML: function() {
      return template(this);
    },

    onBlockRender: function() {
      var placeholders = this.$el.find('[data-placeholder]');
      placeholders.on('change keydown keypress input', function() {
        if (this.textContent) {
          this.setAttribute('data-hide-placeholder', 'true');
        } else {
          this.removeAttribute('data-hide-placeholder');
        }
      });
    },

    loadData: function(data){
      this.getTextBlock().html(SirTrevor.toHTML(data.text, this.type));
      this.$('.js-term-input').val(data.term);
    },

  });

})();
