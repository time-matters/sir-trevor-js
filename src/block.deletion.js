SirTrevor.BlockDeletion = (function(){

  var BlockDeletion = function() {
    this._ensureElement();
    this._bindFunctions();
  };

  _.extend(BlockDeletion.prototype, FunctionBind, Renderable, {

    tagName: 'a',
    className: 'st-btn st-btn--editor-panel st-btn--editor-panel--delete',

    attributes: {
      html: '<span class="st-icon st-icon--bin" aria-hidden="true"></span><span class="st-btn__label">'+i18n.t('general:deleteElement')+'</span>'
    }

  });

  return BlockDeletion;

})();
