SirTrevor.BlockTypeChange = (function(){

  var BlockTypeChange = function(block_element, instance_id, block_type, changeable) {
    this.$block = block_element;
    this.instanceID = instance_id;
    this.block_type = block_type;
    this.changeable = changeable;

    this._ensureElement();
    this._bindFunctions();

    this.initialize();
  };

  _.extend(BlockTypeChange.prototype, FunctionBind, Renderable, {

    bound: [],

    className: 'st-block-typechange-wrapper',
    visibleClass: 'st-block-typechange--is-visible',

    trigger: function() {
      // nop
    },

    initialize: function() {

      var i, a, change;

      if (this.changeable === undefined) {
        return; // nop.
      }

      for (i=0; i<this.changeable.length; i++) {

        change = this.changeable[i];

        a = $([
          '<a class="st-block-ui-btn st-icon">',
          change.toLowerCase(),
          '</a>'
        ].join("\n"));

        this.$el.append(a);
      }
    },

  });

  return BlockTypeChange;

})();
