/*
  Html Block - careful!
*/
SirTrevor.Blocks.Html = SirTrevor.Block.extend({

  type: "html",

  title: function() { return i18n.t('blocks:html:title'); },

  editorHTML: '<div class="st-required st-html-block" contenteditable="true"></div>',

  icon_name: 'text',
  changeable: [],

  getBlock: function () {
    return this.$(".st-html-block");
  },

  toData: function () {
    SirTrevor.log("toData for " + this.blockID);

    var bl = this.$el,
        dataObj = {};

    var content = this.getBlock().text();
    if (content.length > 0) {
      dataObj.text = content;
    }

    // Set
    if(!_.isEmpty(dataObj)) {
      this.setData(dataObj);
    }
  },

  loadData: function(data){
    this.getBlock().text(data.text);
  }
});
