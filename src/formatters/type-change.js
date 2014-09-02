/* Our base formatters */
(function(){

  //TODO This one will be included even if there is no Heading block
  // enabled in this instance. This is due to my inability to figure an
  // instance out at the point in the initialization where the FormatBar
  // creates the Formatters.

  var Heading = SirTrevor.Formatter.extend({
    title: "heading",
    iconName: "Heading",
    text : "H1",

    prepare: function() {
      var selection = window.getSelection();

      if (selection.rangeCount === 0) {
        SirTrevor.log("Can't get current selection from formatter!");
        return;
      }

      var node = $(selection.getRangeAt(0)
                   .startContainer
                   .parentNode)
                 .parents(".st-block")
                 .first();

      this._instance = SirTrevor.getInstance(node.attr('data-instance'));
      this._block = this._instance.getBlocksByIDs( [node.attr('id')] ) [0];
    },

    getCurrentBlock: function() {
      return this._block;
    },

    getCurrentInstance: function() {
      return this._instance;
    },

    onClick: function() {
      var instance = this.getCurrentInstance();
      var block = this.getCurrentBlock();
      instance.changeBlockType(block, block.type === "Heading" ? "text" : "Heading");
    },

    isActive: function() {
      this.prepare();
      return this.getCurrentBlock().type === "Heading";
    }

  });

  SirTrevor.Formatters.Heading = new Heading();

})();
