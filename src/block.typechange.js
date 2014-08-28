SirTrevor.BlockTypeChange = (function(){

  var BlockTypeChange = function(block_element, instance_id) {
    this.$block = block_element;
    this.instanceID = instance_id;

    this._ensureElement();
    this._bindFunctions();

    this.initialize();
  };

  _.extend(BlockTypeChange.prototype, FunctionBind, Renderable, {

    bound: [],

    tagName: 'a',
    className: 'st-block-ui-btn st-block-ui-btn--type-typechange st-icon',

    attributes: {
      html: 'typechange',
      'data-icon': 'text'
    },

    // className: 'st-block-typechange',
    visibleClass: 'st-block-typechange--is-visible',

    trigger: function() {
      console.log('BlockTypeChange trigger');
    },

    initialize: function() {
      console.log('BlockTypeChange initialize');
    },

  });

  return BlockTypeChange;

})();
