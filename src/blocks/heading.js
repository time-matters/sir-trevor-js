/*
  Heading Block
*/
SirTrevor.Blocks.Heading = SirTrevor.Block.extend({

  type: 'heading',

  title: function(){ return i18n.t('blocks:heading:title'); },

  editorHTML: '<div class="st-required st-text-block st-block--heading" contenteditable="true"></div>',

  icon_name: 'heading',
  changeable: ['text', 'quote'],

  loadData: function(data){
    this.getTextBlock().html(SirTrevor.toHTML(data.text, this.type));
  }
});
