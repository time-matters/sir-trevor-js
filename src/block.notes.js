SirTrevor.BlockNotes = (function(){

  var BlockNotes = function(block_element, instance_id, block) {
    this.$block = block_element;
    this.instanceID = instance_id;
    this.block = block;
    this.changeable = block.changeable;

    this._ensureElement();
    this._bindFunctions();

    this.initialize();
  };

  _.extend(BlockNotes.prototype, FunctionBind, Renderable, {

    bound: ["toggle"],

    notesClassName: 'st-block-is-note',
    className: 'btn--editor-panel',
    visibleClass: 'st-block-notes--is-visible',

    attributes: {
      html: '<span class="icon--note" aria-hidden="true"></span><span class="btn__label">Notiz</span>'
    },

    OFF_STATE: "no",
    ON_STATE: "yes",

    toggle: function() {
      var val = this.hiddenInput.val();
      this.$block.toggleClass(this.notesClassName);
      return this.hiddenInput.val(val === this.ON_STATE ?
               this.OFF_STATE : this.ON_STATE );
    },

    instrumentBlock: function() {
      var data = this.block.getData();

      // default state is off.
      this.hiddenInput = $("<input class='st-input-string js-note-input' name='note' type='hidden' value='" + this.OFF_STATE + "'></input>");
      this.block.$el.append(this.hiddenInput);

      // if current state is on, toggle.
      if (data.note === this.ON_STATE) {
        this.toggle();
      }
    },

    initialize: function() {
      this.instrumentBlock();
      this.$el.on('click', this, this.toggle);
    },

  });

  return BlockNotes;

})();
