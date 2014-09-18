SirTrevor.BlockReorder = (function(){

  var BlockReorder = function(block_element, instance_id) {
    this.$block = block_element;
    this.blockID = this.$block.attr('id');
    this.instanceID = instance_id;

    this._ensureElement();
    this._bindFunctions();

    this.initialize();
  };

  _.extend(BlockReorder.prototype, FunctionBind, Renderable, {

    bound: ['onMouseDown', 'onClick', 'onDragStart', 'onDragEnd', 'onDrag', 'onDrop'],

    className: 'btn--editor-panel btn--with-rocker',
    tagName: 'div',

    attributes: function() {
      return {
        'html': '<span class="btn--rocker"><button class="btn--rocker__up"><span class="icon--dropup"></span></button><button class="btn--rocker__down"><span class="icon--dropdown"></span></button></span><span class="btn__label">'+i18n.t('general:position')+'</span>',
        'draggable': 'true'
      };
    },

    initialize: function() {
      this.$el.bind('mousedown touchstart', this.onMouseDown)
              .bind('click', this.onClick)
              .bind('dragstart', this.onDragStart)
              .bind('dragend touchend', this.onDragEnd)
              .bind('drag touchmove', this.onDrag);

      this.$block.dropArea()
                 .bind('drop', this.onDrop);
    },

    onMouseDown: function() {
      SirTrevor.EventBus.trigger("block:reorder:down", this.blockID);
    },

    onDrop: function(ev) {
      ev.preventDefault();

      var dropped_on = this.$block,
          item_id = ev.originalEvent.dataTransfer.getData("text/plain"),
          block = $('#' + item_id);

      if (!_.isUndefined(item_id) &&
        !_.isEmpty(block) &&
        dropped_on.attr('id') != item_id &&
        dropped_on.attr('data-instance') == block.attr('data-instance')
      ) {
        dropped_on.after(block);
      }
      SirTrevor.EventBus.trigger("block:reorder:dropped", item_id);
    },

    onDragStart: function(ev) {
      var btn = $(ev.currentTarget).parent();

      ev.originalEvent.dataTransfer.setDragImage(this.$block[0], btn.position().left, btn.position().top);
      ev.originalEvent.dataTransfer.setData('Text', this.blockID);

      SirTrevor.EventBus.trigger("block:reorder:dragstart", this.blockID);
      this.$block.addClass('st-block--dragging');
    },

    onDragEnd: function(ev) {
      SirTrevor.EventBus.trigger("block:reorder:dragend", this.blockID);
      this.$block.removeClass('st-block--dragging');
    },

    onDrag: function(ev){},

    onClick: function(event) {
      var $target, idx;
      event.preventDefault();

      $target = $(event.target).closest('button');
      idx  = this.$block.index('.st-block');

      if ($target.hasClass('btn--rocker__up')) {
        SirTrevor.EventBus.trigger(this.instanceID + ":blocks:change_position", this.$block, idx, ('before'));
      }
      else if ($target.hasClass('btn--rocker__down')) {
        SirTrevor.EventBus.trigger(this.instanceID + ":blocks:change_position", this.$block, idx + 2, ('before'));
      }
    },

    render: function() {
      return this;
    }

  });

    return BlockReorder;

  })();
