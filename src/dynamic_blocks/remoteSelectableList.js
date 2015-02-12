SirTrevor.DynamicBlocks.RemoteSelectableList = (function(){
  return function (parameters) {
    //parameters.callback
    //parameters.model_name
    //parameters.api_url

    return {
      type: parameters.model_name,
      fetchable: true,

      selectedElements: [],

      title: function() { return i18n.t("blocks:remote_list:" + parameters.model_name + ":title"); },

      icon_name: parameters.icon,

      editorHTML: function() {
        return "";
      },

      onBlockRender: function () {
        if (!this.getData().selected) {
          this.loading();

          this.setData({
            selected: [],
            model_name: parameters.model_name
          });

          parameters.callback(this.onListSuccess.bind(this), this.onGetFail.bind(this));
        }
      },

      loadData: function(data) {
        if (!_.isArray(data.selected) || data.selected.length === 0) {
          this.destroy();
          return;
        }

        this.renderSelected(data.selected);
      },

      renderSelected: function (selected) {
        var data = JSON.stringify({ model_name: parameters.model_name, selected: selected });

        $.get(parameters.render_endpoint, { content: data }, this.onGetRenderSuccess.bind(this)).fail(this.onGetFail.bind(this));
      },

      onGetRenderSuccess: function (data) {
        this.ready();
        this.$el.append(data);
      },

      onListSuccess: function (data) {
        var that = this;

        this.setAndLoadData({
          selected: data,
          model_name: parameters.model_name
        });

        this.ready();
      },

      onGetFail: function () {
        this.addMessage(i18n.t("blocks:remote_list:fetch_error"));
        this.ready();
      }
    };
  };
})();
