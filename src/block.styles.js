SirTrevor.BlockStyles = (function(){

  var BlockStyles = function(block_element, instance_id, block) {
    if (!block.styleable) { return false; }

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
      return this.block.styles;
    },

    updateValue: function(val) {
      this.hiddenInput.val(val);
      this.updateClass(val);
    },

    updateClass: function(val) {
      var styles = this.availableStyles();
      var $el = this.block.$el;

      // This uses Array.prototype.map and will not work in IE7 and IE8.
      // Polyfill at will                                              .
      var classNames = styles.map(function(e) { return e.className; });
      $el.removeClass(classNames.join(' '));

      try {
        var targetClassName = styles.filter(function(e) {
          return e.value === val;
        }).pop().className;
        $el.addClass(targetClassName);
      } catch (e) {
        console.log('Ignoring a style that seems obsolete in current configuration');
      }
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
