SirTrevor.BlockAdd = (function(){

  var BlockAdd = function(block_element) {
    this.$block = block_element;
    this._ensureElement();
    this._bindFunctions();

    this.initialize();
  };

  _.extend(BlockAdd.prototype, FunctionBind, Renderable, SirTrevor.Events, {

    tagName: 'a',
    className: 'btn--editor-panel',
    attributes: {
      html: '<span class="icon--plus" aria-hidden="true"></span><span class="btn__label">Weitere Inhalt</span>'
    },

    bound: ['create'],

    create: function(e)  {
      SirTrevor.EventBus.trigger('showBlockControls', this.$block);
    },

    initialize: function() {
      this.$el.on('click', this, this.create);
    }

  });

  return BlockAdd;

})();