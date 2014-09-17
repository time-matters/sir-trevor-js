SirTrevor.BlockStyles = (function(){

  var BlockStyles = function(block_element, instance_id, block) {
    this.$block = block_element;
    this.instanceID = instance_id;
    this.block = block;

    this._ensureElement();
    this._bindFunctions();

    this.initialize();
  };

  _.extend(BlockStyles.prototype, FunctionBind, Renderable, SirTrevor.Events, {

    tagName: 'a',
    className: 'btn--editor-panel',
    attributes: {
      html: ' <span class="btn__label">Style</span>'
    },

    bound: ['updateValue', 'onSelectChange'],

    create: function(e)  {
      SirTrevor.EventBus.trigger('showBlockControls', this.$block);
    },

    instrumentBlock: function() {
      var data = this.block.getData();

      // default state is off.
      this.hiddenInput = $("<input class='st-input-string js-style-input' name='style' type='hidden' value='" + "'></input>");
      this.block.$el.append(this.hiddenInput);

      console.log(data);

      this.$el.find('select').val(data.style)
      this.updateValue(data.style);
    },

    availableStyles: function() {
      return [
        { name: 'Default', value: 'default', className: 'default' },
        { name: 'Full-width', value: 'fullwidth', className: 'full-width' }
      ];
    },

    updateValue: function(val) {
      this.hiddenInput.val(val);
    },

    onSelectChange: function(event) {
      var value = event.target.value;
      this.updateValue(value);
    },

    initialize: function() {
      var styles = this.availableStyles();

      var select = '<select>';
      for(var i=0; i<styles.length; i++) {
        select += '<option value="'+styles[i].value+'">'+styles[i].name+'</option>';
      }
      select += '</select>';
      select = $(select);

      select.on('change', this.onSelectChange);

      this.$el.prepend(select);
      this.instrumentBlock();
    }

  });

  return BlockStyles;

})();
