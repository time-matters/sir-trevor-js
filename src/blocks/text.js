/*
  Text Block
*/
SirTrevor.Blocks.Text = SirTrevor.Block.extend({

  type: "text",

  title: function() { return i18n.t('blocks:text:title'); },

  editorHTML: '<div class="st-required st-text-block" contenteditable="true"></div>',

  icon_name: 'text',
  changeable: ['Heading', 'quote'],

  loadData: function(data){
    this.getTextBlock().html(SirTrevor.toHTML(data.text, this.type));
  },
  onBlockRender: function() {
    var is_note = this.getData().note;
    this.$el.append("<input class='st-input-string js-note-input' name='note' type='hidden' value='" + is_note + "'></input>")
    if (is_note === "yes")  {
      this.$el.addClass('st-block-is-note')
    }
  }
});
