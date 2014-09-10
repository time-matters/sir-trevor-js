/*
  Heading Block
*/
SirTrevor.Blocks.Heading = SirTrevor.Block.extend({

  type: 'Heading',

  title: function(){ return i18n.t('blocks:heading:title'); },

  editorHTML: '<div class="st-required st-text-block st-text-block--heading" contenteditable="true"></div>',

  icon_name: 'heading',
  changeable: ['text', 'quote'],

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
