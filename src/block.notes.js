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
      className: 'st-block-notes-wrapper',
      visibleClass: 'st-block-notes--is-visible',

      OFF_STATE: "no",
      ON_STATE: "yes",

      toggle: function() {
        var state = this.uiInput[0].checked ?
          this.ON_STATE :
          this.OFF_STATE;
        this.$block.toggleClass(this.notesClassName);
        return this.hiddenInput.val(state);
      },

      initialize: function() {
        var data = this.block.getData();

        // default state is off.
        this.hiddenInput = $("<input class='st-input-string js-note-input' name='note' type='hidden' value='" + this.OFF_STATE + "'></input>");
        this.block.$el.append(this.hiddenInput);

        this.uiInput = $("<input name='note-ui' type='checkbox' value='note'>");
        var a = $('<a class="st-block-ui-btn st-icon">');

        this.uiInput.on('click', this, this.toggle);

        // if current state is on, toggle.
        if (data.note === this.ON_STATE) {
          this.uiInput.attr({'checked': 'checked'});
          this.toggle();
        }

        this.$el.append(a.append(this.uiInput));
      },

    });

    return BlockNotes;

  })();
