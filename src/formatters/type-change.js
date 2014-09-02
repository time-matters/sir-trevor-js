/* Our base formatters */
(function(){

  //TODO This one will be included even if there is no Heading block
  // enabled in this instance. This is due to my inability to figure an
  // instance out at the point in the initialization where the FormatBar
  // creates the Formatters.

  var Heading = SirTrevor.Formatter.extend({
    title: "heading",
    cmd: "bold",
    iconName: "heading",
    text : "H1",

    getCurrentBlock: function() {

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

      var instance = SirTrevor.getInstance(node.attr('data-instance'));
      var block = instance.getBlocksByIDs( [node.attr('id')] ) [0];

      return block;

    },

    onClick: function() {

      var block = this.getCurrentBlock();
      console.log("transform to heading");
    },

    isActive: function() {
      var block = this.getCurrentBlock();
      return block.type === "Heading";
    }

  });

  SirTrevor.Formatters.Heading = new Heading();

})();
