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

    bound: [],

    className: 'st-block-notes-wrapper',
    visibleClass: 'st-block-notes--is-visible',

    trigger: function() {
      console.log('triggered note');
    },

    initialize: function() {
      var data = this.block.getData();

      var input = $(
        "<input class='st-input-string js-note-input' name='note' type='checkbox' value='note'>");
      var a = $('<a class="st-block-ui-btn st-icon">');

      input.on('click', null, this.trigger);

      if (data.note === 'note') {
        input.attr({'checked': 'checked'});
      }

      this.$el.append(a.append(input));
    },

  });

  return BlockNotes;

})();
