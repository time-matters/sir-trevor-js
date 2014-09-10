SirTrevor.BlockDeletion = (function(){

  var BlockDeletion = function() {
    this._ensureElement();
    this._bindFunctions();
  };

  _.extend(BlockDeletion.prototype, FunctionBind, Renderable, {

    tagName: 'a',
    className: 'btn--editor-panel',

    attributes: {
      html: '<span class="icon--bin" aria-hidden="true"></span><span class="btn__label">Element Löschen</span>'
    }

  });

  return BlockDeletion;

})();