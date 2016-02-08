SirTrevor.BlockAdd = (function(){

  var BlockAdd = function(block_element) {
    this.$block = block_element;
    this._ensureElement();
    this._bindFunctions();

    this.initialize();
  };

  _.extend(BlockAdd.prototype, FunctionBind, Renderable, SirTrevor.Events, {

    tagName: 'a',
    className: 'st-btn st-btn--editor-panel',
    attributes: {
      html: '<span class="st-icon st-icon--plus" aria-hidden="true"></span><span class="st-btn__label">'+i18n.t('general:add')+'</span>'
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
