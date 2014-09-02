SirTrevor.BlockTypeChange = (function(){

  var BlockTypeChange = function(block_element, instance_id, block) {
    this.$block = block_element;
    this.instanceID = instance_id;
    this.block = block;
    this.changeable = block.changeable;

    this._ensureElement();
    this._bindFunctions();

    this.initialize();
  };

  _.extend(BlockTypeChange.prototype, FunctionBind, Renderable, {

    bound: [],

    className: 'st-block-typechange-wrapper',
    visibleClass: 'st-block-typechange--is-visible',

    changeType: function(toType) {
      var instance = SirTrevor.getInstance(this.instanceID);
      instance.changeBlockType(this.block, toType);
    },

    prepareTypeChange: function(toType) {
      var typeCache = toType;
      var self = this;
      return function() {
        self.changeType(typeCache);
      };
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

        a.on('click', null, this.prepareTypeChange(change));

        this.$el.append(a);
      }
    },

  });

  return BlockTypeChange;

})();
