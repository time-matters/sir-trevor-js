SirTrevor.Block = (function(){

  var Block = function(data, instance_id) {
    SirTrevor.SimpleBlock.apply(this, arguments);
  };

  var delete_template = [
    "<div class='st-block__ui-delete-controls'>",
      "<a class='btn--confirm-delete'><span class='icon--tick' aria-hidden='true'></span><span class='visuallyhidden'>Confirm delete</span></a>",
      "<a class='btn--deny-delete'><span class='icon--cross' aria-hidden='true'></span><span class='visuallyhidden'>Do not delete</span></a>",
      "<label class='st-block__delete-label'>",
      "<%= i18n.t('general:delete') %>",
      "</label>",
    "</div>"
  ].join("\n");

  var drop_options = {
    html: ['<div class="st-block__dropzone">',
           '<span class="st-icon"><%= _.result(block, "icon_name") %></span>',
           '<p><%= i18n.t("general:drop", { block: "<span>" + _.result(block, "title") + "</span>" }) %>',
           '</p></div>'].join('\n'),
    re_render_on_reorder: false
  };

  var paste_options = {
    html: ['<input type="text" placeholder="<%= i18n.t("general:paste") %>"',
           ' class="st-block__paste-input st-paste-block">'].join('')
  };

  var upload_options = {
    html: [
      '<div class="st-block__upload-container">',
      '<input type="file" type="st-file-upload">',
      '<button class="st-upload-btn"><%= i18n.t("general:upload") %></button>',
      '</div>'
    ].join('\n')
  };

  SirTrevor.DEFAULTS.Block = {
    drop_options: drop_options,
    paste_options: paste_options,
    upload_options: upload_options
  };

  _.extend(Block.prototype, SirTrevor.SimpleBlock.fn, SirTrevor.BlockValidations, {

    bound: ["_checkArrowKeysUp", "_checkArrowKeysDown", "_checkReturn",
            "_checkBackspaceAtStartKeyDown", "_checkBackspaceAtStartKeyUp",
            "_handleContentPaste", "_onFocus", "_onBlur", "onDrop",
            "onDeleteClick", "clearInsertedStyles",
            "getSelectionForFormatter", "onBlockRender"],

    className: 'st-block st-icon--add',

    attributes: function() {
      return _.extend(SirTrevor.SimpleBlock.fn.attributes.call(this), {
        'data-icon-after' : "add"
      });
    },

    icon_name: 'default',

    validationFailMsg: function() {
      return i18n.t('errors:validation_fail', { type: this.title() });
    },

    editorHTML: '<div class="st-block__editor"></div>',

    toolbarEnabled: true,

    droppable: false,
    pastable: false,
    uploadable: false,
    fetchable: false,
    ajaxable: false,
    styleable: false,

    drop_options: {},
    paste_options: {},
    upload_options: {},

    formattable: true,

    _previousSelection: '',

    initialize: function() {},

    toMarkdown: function(markdown){ return markdown; },
    toHTML: function(html){ return html; },

    withMixin: function(mixin) {
      if (!_.isObject(mixin)) { return; }

      var initializeMethod = "initialize" + mixin.mixinName;

      if (_.isUndefined(this[initializeMethod])) {
        _.extend(this, mixin);
        this[initializeMethod]();
      }
    },

    render: function() {
      this.beforeBlockRender();
      this._setBlockInner();

      this.$editor = this.$inner.children().first();

      if(this.droppable || this.pastable || this.uploadable) {
        var input_html = $("<div>", { 'class': 'st-block__inputs' });
        this.$inner.append(input_html);
        this.$inputs = input_html;
      }

      if (this.hasTextBlock) { this._initTextBlocks(); }
      if (this.droppable) { this.withMixin(SirTrevor.BlockMixins.Droppable); }
      if (this.pastable) { this.withMixin(SirTrevor.BlockMixins.Pastable); }
      if (this.uploadable) { this.withMixin(SirTrevor.BlockMixins.Uploadable); }
      if (this.fetchable) { this.withMixin(SirTrevor.BlockMixins.Fetchable); }
      if (this.controllable) { this.withMixin(SirTrevor.BlockMixins.Controllable); }

      if (this.formattable) { this._initFormatting(); }

      this._blockPrepare();

      return this;
    },

    remove: function() {
      if (this.ajaxable) {
        this.resolveAllInQueue();
      }

      this.$el.remove();
    },

    loading: function() {
      if(!_.isUndefined(this.spinner)) { this.ready(); }

      this.spinner = new Spinner(SirTrevor.DEFAULTS.spinner);
      this.spinner.spin(this.$el[0]);

      this.$el.addClass('st--is-loading');
    },

    ready: function() {
      this.$el.removeClass('st--is-loading');
      if (!_.isUndefined(this.spinner)) {
        this.spinner.stop();
        delete this.spinner;
      }
    },

    /*
      Generic toData implementation.
      Can be overwritten, although hopefully this will cover most situations
    */
    toData: function() {
      SirTrevor.log("toData for " + this.blockID);

      var bl = this.$el,
          dataObj = {};

      /* Simple to start. Add conditions later */
      if (this.hasTextBlock()) {
        var content = this.getTextBlock().html();
        if (content.length > 0) {
          dataObj.text = SirTrevor.toMarkdown(content, this.type);
        }
      }

      // Add any inputs to the data attr
      if(this.$(':input').not('.st-paste-block').length > 0) {
        this.$(':input').each(function(index,input){
          if (input.getAttribute('name')) {
            dataObj[input.getAttribute('name')] = input.value;
          }
        });
      }

      // Set
      if(!_.isEmpty(dataObj)) {
        this.setData(dataObj);
      }
    },

    /* Generic implementation to tell us when the block is active */
    focus: function() {
      this.getTextBlock().focus();
    },

    blur: function() {
      this.getTextBlock().blur();
    },

    onFocus: function() {
      this.getTextBlock().bind('focus', this._onFocus);
    },

    onBlur: function() {
      this.getTextBlock().bind('blur', this._onBlur);
    },

    /*
    * Event handlers
    */

    _onFocus: function() {
      this.trigger('blockFocus', this.$el);
    },

    _onBlur: function() {},

    onDrop: function(dataTransferObj) {},

    onDeleteClick: function(ev) {
      ev.preventDefault();

      var onDeleteConfirm = function(e) {
        e.preventDefault();
        this.trigger('removeBlock', this.blockID);
      };

      var onDeleteDeny = function(e) {
        e.preventDefault();
        this.$el.removeClass('st-block--delete-active');
        $delete_el.remove();
      };

      if (this.isEmpty()) {
        onDeleteConfirm.call(this, new Event('click'));
        return;
      }

      this.$inner.find('.btn--editor-panel--delete').append(_.template(delete_template));
      this.$el.addClass('st-block--delete-active');

      var $delete_el = this.$inner.find('.st-block__ui-delete-controls');

      this.$inner.on('click', '.btn--confirm-delete',
                      _.bind(onDeleteConfirm, this))
                 .on('click', '.btn--deny-delete',
                      _.bind(onDeleteDeny, this));
    },

    pastedMarkdownToHTML: function(content) {
      return SirTrevor.toHTML(SirTrevor.toMarkdown(content, this.type), this.type);
    },

    onContentPasted: function(event, target){
      target.html(this.pastedMarkdownToHTML(target[0].innerHTML));
      this.getTextBlock().caretToEnd();
      this.splitAtReturns();
    },

    beforeLoadingData: function() {
      this.loading();

      if(this.droppable || this.uploadable || this.pastable) {
        this.$editor.show();
        this.$inputs.hide();
      }

      SirTrevor.SimpleBlock.fn.beforeLoadingData.call(this);

      this.ready();
    },

    _handleContentPaste: function(ev) {
      var target = $(ev.currentTarget);
      _.delay(_.bind(this.onContentPasted, this, ev, target), 0);
    },

    _getBlockClass: function() {
      return 'st-block--' + this.className;
    },

    /*
    * Init functions for adding functionality
    */

    _initUIComponents: function() {

      this._withUIComponent(
        new SirTrevor.BlockReorder(this.$el, this.instanceID)
      );

      var notes = new SirTrevor.BlockNotes(this.$el, this.instanceID, this);

      this._withUIComponent(
        notes, '.st-block-ui-btn--type-notes'
      );

      this._withUIComponent(
        new SirTrevor.BlockDeletion(), '.btn--editor-panel--delete', this.onDeleteClick
      );

      this._withUIComponent(
        new SirTrevor.BlockStyles(this.$el, this.instanceID, this)
      );

      this._withUIComponent(
        new SirTrevor.BlockAdd(this.$el)
      );

      this.onFocus();
      this.onBlur();
    },

    _initFormatting: function() {
      // Enable formatting keyboard input
      var formatter;
      for (var name in SirTrevor.Formatters) {
        if (SirTrevor.Formatters.hasOwnProperty(name)) {
          formatter = SirTrevor.Formatters[name];
          if (!_.isUndefined(formatter.keyCode)) {
            formatter._bindToBlock(this.$el);
          }
        }
      }
    },

    _initTextBlocks: function() {
      this.getTextBlock()
        .bind('paste', this._handleContentPaste)
        .bind('keyup', this._checkReturn)
        .bind('keydown', this._checkArrowKeysDown)
        .bind('keyup', this._checkArrowKeysUp)
        .bind('keydown', this._checkBackspaceAtStartKeyDown)
        .bind('keyup', this._checkBackspaceAtStartKeyUp)
        .bind('keyup', this.getSelectionForFormatter)
        .bind('mouseup', this.getSelectionForFormatter)
        .bind('DOMNodeInserted', this.clearInsertedStyles);
    },

    _previousCaretOffset: undefined,
    _checkArrowKeysDown: function(ev) {
      var target = ev.target;
      // console.log('down');

      // only trigger when an arrow key was hit.
      if (ev !== undefined && [37, 38, 39, 40].indexOf(ev.keyCode) !== -1) {

        if (!window.getSelection().isCollapsed) {
          return; // when selecting, do not alter cursor management.
        }

        try {
          var marker = this.insertSplitMarker();
          this._previousCaretOffset = marker.offset();
        } finally {
          this.removeSplitMarker();
        }
      }
    },
    _checkArrowKeysUp: function(ev) {
      var target = ev.target;

      if ($.inArray(this.type, ["Heading", "text", "Quote", "list"]) === -1) {
        return true;
      }

      // only trigger when an arrow key was hit.
      if (ev !== undefined && $.inArray(ev.keyCode, [37, 38, 39, 40]) !== -1) {

        if (!window.getSelection().isCollapsed) {
          return; // when selecting, do not alter cursor management.
        }

        try {
          var marker = this.insertSplitMarker();
          var offset = marker.offset();

          if (offset.top === this._previousCaretOffset.top) {

            // up / down
            if (ev.keyCode === 38) {
              this.focusPreviousBlock();
              return false;
            } else if (ev.keyCode === 40) {
              this.focusNextBlock();
              return false;

            } else if (offset.left === this._previousCaretOffset.left) {

              // left / right
              if (ev.keyCode == 37) {
                this.focusPreviousBlock();
                return false;
              } else if (ev.keyCode == 39) {
                this.focusNextBlock();
                return false;
              }

            }
          }

        } finally {
          this.removeSplitMarker();
        }
      }

      return true;
    },

    focusPreviousBlock: function() {
      var instance = SirTrevor.getInstance(this.instanceID);
      var currentBlock = this;
      var currentPosition = instance.getBlockPosition(this.$el);

      // guard block being the first.
      if (currentPosition < 1) {
        console.log("Can't focus previous block: no previous block.");
        return;
      }

      var previousBlock = instance.blocks.filter(function(block) {
        return instance.getBlockPosition(block.$el) === (currentPosition - 1);
      })[0];

      // guard previous block not being retrievable via position.
      if (previousBlock === undefined) {
        console.log("Can't merge with previous block: can't find by position");
        return;
      }

      // guard previous block not being text.
      if ($.inArray(previousBlock.type, ["Heading", "text", "Quote", "list"]) === -1) {
        console.log("Can't focus previous block: not a text block. ("+previousBlock.type+")");
        return;
      }

      // cursor management
      previousBlock.focus();
      previousBlock.$editor.caretToEnd();
    },

    focusNextBlock: function() {
      var instance = SirTrevor.getInstance(this.instanceID);
      var currentBlock = this;
      var currentPosition = instance.getBlockPosition(this.$el);

      // guard block being the first.
      if (currentPosition >= instance.blocks.length) {
        console.log("Can't focus next block: no next block.");
        return;
      }

      var nextBlock = instance.blocks.filter(function(block) {
        return instance.getBlockPosition(block.$el) === (currentPosition + 1);
      })[0];

      // guard next block not being retrievable via position.
      if (nextBlock === undefined) {
        console.log("Can't merge with next block: can't find by position");
        return;
      }

      // guard next block not being text.
      if ($.inArray(nextBlock.type, ["Heading", "text", "Quote", "list"]) === -1) {
        console.log("Can't focus next block: not a text block. ("+nextBlock.type+")");
        return;
      }

      // cursor management
      nextBlock.focus();
      nextBlock.$editor.caretToStart();
    },

    _checkReturn: function(ev) {
      var target = ev.target;

      // only trigger when return was hit, but not alt.
      if (ev !== undefined &&
          !ev.altKey &&
          ev.keyCode === 13) {
        _.defer(this.onReturn.bind(this, ev, target), 0);
      }
    },

    _previousContent: null,
    _checkBackspaceAtStartKeyUp: function(ev) {
      var currentContent;
      var target = ev.target;
      if (ev !== undefined && ev.keyCode === 8) {
        currentContent = this.$editor[0].innerHTML;
        if (currentContent === this._previousContent) {
          _.defer(this.onBackspaceAtStart.bind(this, ev, target), 0);
        }
      }
    },
    _checkBackspaceAtStartKeyDown: function(ev) {
      if (ev !== undefined && ev.keyCode === 8) {
        this._previousContent = this.$editor[0].innerHTML;
      }
    },

    onBackspaceAtStart: function(event, target) {

      if ($.inArray(this.type, ["Heading", "text"]) === -1) {
        // disallow split inside blocks other than headings and text.
        return;
      }

      var instance = SirTrevor.getInstance(this.instanceID);
      var currentBlock = this;
      var currentPosition = instance.getBlockPosition(this.$el);

      // guard block being the first.
      if (currentPosition < 1) {
        console.log("Can't merge with previous block: no previous block.");
        return;
      }

      var previousBlock = instance.blocks.filter(function(block) {
        return instance.getBlockPosition(block.$el) === (currentPosition - 1);
      })[0];

      // guard previous block not being retrievable via position.
      if (previousBlock === undefined) {
        console.log("Can't merge with previous block: can't find by position");
        return;
      }

      // guard previous block not being text.
      if ($.inArray(previousBlock.type, ["Heading", "text"]) === -1) {
        console.log("Can't merge with previous block: not a text block.");
        return;
      }

      // cursor management
      previousBlock.focus();
      previousBlock.$editor.caretToEnd();

      // append content and remove block
      previousBlock.$editor.append(this.$editor.contents());
      instance.removeBlock(this.blockID);

      // further cursor management
      // window.getSelection().modify("move", "right", "character");
    },

    insertSplitMarker: function(html) {
      var marker = '<i id="split-marker"></i>';
      var selection, range, element, fragment, node, lastNode;
      if (window.getSelection) {
        selection = window.getSelection();
        if (selection.getRangeAt && selection.rangeCount) {
          range = selection.getRangeAt(0);
          range.deleteContents();
          element = document.createElement("div");
          element.innerHTML = marker;
          fragment = document.createDocumentFragment();
          while ((node = element.firstChild)) {
            lastNode = fragment.appendChild(node);
          }
          range.insertNode(fragment);
        }
      } else if (document.selection && document.selection.type != "Control") {
        document.selection.createRange().pasteHTML(marker);
      }
      return $('#split-marker');
    },

    removeSplitMarker: function() {
      var marker = $('#split-marker');
      var parent = marker.parent();
      marker.remove();

      // removing the split marker might leave the dom with two text
      // nodes that used to be one. that is not good when the font
      // features ligatures and/or negative kerning. normalizing the
      // parent node restores consecutive text nodes into one.

      // however, this should not be done when at the beginning of a
      // node, since normalize also removes empty text nodes, and the
      // caret needs to stay there.

      var range = window.getSelection().getRangeAt(0);
      if (range.startOffset + range.endOffset !== 0) {
        parent[0].normalize();
      }
    },

    removeStartingReturns: function(block) {
      var node, returns, selector = "> div:first-child > br:first-child, > br:first-child";
      if (block === undefined) {
        block = this;
      }
      node = block.$editor;

      returns = node.find(selector);
      while (returns.length > 0) {
        returns.remove();
        returns = node.find(selector);
        node.find('div:empty').remove();
      }
    },

    removeTrailingReturns: function(block) {
      var node, returns, selector = "div:last-child br:last-child, br:last-child";
      if (block === undefined) {
        block = this;
      }
      node = block.$editor;

      node.find('div:empty').remove();
      returns = node.find(selector);

      while (returns.length > 0) {
        returns.remove();
        node.find('div:empty').remove();
        returns = node.find(selector);
      }
    },

    cleanupNestedDivs: function(block) {
      var node, returns, selector = "div div";
      if (block === undefined) {
        block = this;
      }
      node = block.$editor;

      node.find(selector).each(function(i, el) {
        var element = $(el);
        element.replaceWith(element.contents());
      });

      node.find('div:empty').remove();
    },

    splitAtReturns: function() {
      var next, r = this.$el.find('br').first();
      if (r.length === 0) { return; }
      r.replaceWith('<i id="split-marker"></i>');
      try {
        next = this.splitAtSplitMarker();
      } finally {
        this.removeSplitMarker();
      }
      next.splitAtReturns();
    },

    splitAtSplitMarker: function() {
      var instance = SirTrevor.getInstance(this.instanceID);
      var newBlock, currentPosition, nextBlockPosition;

      try {

        newBlock = instance.createBlock("text", undefined, undefined, false); // or this.type, if not always text.
        currentPosition = instance.getBlockPosition(this.$el);
        nextBlockPosition = instance.getBlockPosition(newBlock.$el);

        if ((nextBlockPosition - currentPosition) !== 1) {
          instance.changeBlockPosition(newBlock.$el, currentPosition + 1, "After");
        }

        var range = window.getSelection().getRangeAt(0);
        range.setStartAfter($('#split-marker')[0]);
        range.setEndAfter(this.$el.find('.st-text-block').children().last()[0]);

        var remainder = range.cloneContents();
        range.deleteContents();

        newBlock.$editor.append(remainder);
        newBlock.$editor.find('div:empty').remove();

      } finally {

        this.cleanupNestedDivs(newBlock);

        newBlock.focus();
        newBlock.$editor.caretToStart();
      }

      return newBlock;
    },

    onReturn: function(event, target) {

      if ($.inArray(this.type, ["Heading", "text"]) === -1) {
        // disallow split inside blocks other than headings and text.
        return;
      }

      var instance = SirTrevor.getInstance(this.instanceID);
      var newBlock;

      // break out of formatting.
      window.getSelection().modify("extend", "left", "character");
      document.execCommand("removeFormat", false);

      this.insertSplitMarker();
      try {
        this.splitAtSplitMarker();
      } finally {
        this.removeSplitMarker();
      }
    },

    getSelectionForFormatter: function() {
      _.defer(function(block) {
        var selection = window.getSelection(),
           selectionStr = selection.toString().trim(),
           eventType = (selectionStr === '') ? 'hide' : 'position';

        SirTrevor.EventBus.trigger('formatter:' + eventType, block);
      }, this);
     },

    clearInsertedStyles: function(e) {
      var target = e.target;
      target.removeAttribute('style'); // Hacky fix for Chrome.
    },

    hasTextBlock: function() {
      return this.getTextBlock().length > 0;
    },

    getTextBlock: function() {
      if (_.isUndefined(this.text_block)) {
        this.text_block = this.$('.st-text-block');
      }

      return this.text_block;
    },

    isEmpty: function() {
      var data = jQuery.extend(true, {}, this.saveAndGetData());
      delete data.uuid;
      //TODO this has to come from block.notes.js
      delete data.note;
      // delete data["note-ui"];
      delete data.style;
      //TODO this has to come from block.styles.js
      return _.isEmpty(data);
    }

  });

  Block.extend = extend; // Allow our Block to be extended.

  return Block;

})();
