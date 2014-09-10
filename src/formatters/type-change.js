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

  var Quote = SirTrevor.Formatter.extend({
    title: "quote",
    iconName: "quote",
    text : "“",

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
      instance.changeBlockType(block, block.type === "quote" ? "text" : "quote");
    },

    isActive: function() {
      this.prepare();
      return this.getCurrentBlock().type === "quote";
    }

  });

  var Annotation = SirTrevor.Formatter.extend({
    title: "Annotate",
    iconName: "annotate",
    text : "*",

    OFF_STATE: "no",
    ON_STATE: "yes",
    notesClassName: 'st-block-is-note',

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

    toggle: function(block) {
      var state, hiddenInput, data;

      hiddenInput = block.$el.find('input.js-note-input[type="hidden"]');
      data = hiddenInput.val();
      state = data == "yes" ? this.OFF_STATE : this.ON_STATE;

      block.$el.toggleClass(this.notesClassName);
      hiddenInput.val(state);
      return state
    },

    onClick: function() {
      this.toggle(this.getCurrentBlock())
    },

    isActive: function() {
      var hiddenInput;
      this.prepare();
      hiddenInput = this._block.$el.find('input.js-note-input[type="hidden"]');
      return hiddenInput.val() == "yes";
    }

  });

  SirTrevor.Formatters.Heading = new Heading();
  SirTrevor.Formatters.Quote = new Quote();
  SirTrevor.Formatters.Annotation = new Annotation();

})();
