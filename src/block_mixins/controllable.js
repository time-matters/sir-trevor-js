SirTrevor.BlockMixins.Controllable = {

  mixinName: "Controllable",

  initializeControllable: function() {
    SirTrevor.log("Adding controllable to block " + this.blockID);
    this.$control_ui = $('<div>', {'class': 'ui show--on-active-block st-block__control-ui'});
    _.each(
      this.controls,
      function(handler, cmd) {
        // Bind configured handler to current block context
        this.addUiControl(cmd, _.bind(handler, this));
      },
      this
    );
    this.$inner.append(this.$control_ui);
  },

  getControlTemplate: function(cmd) {
    return $("<a>",
      { 'data-icon': cmd,
        'class': 'st-btn st-block-control-ui-btn--' + cmd
      });
  },

  addUiControl: function(cmd, handler) {
    this.$control_ui.append(this.getControlTemplate(cmd));
    this.$control_ui.on('click', '.st-block-control-ui-btn--' + cmd, handler);
  }
};
