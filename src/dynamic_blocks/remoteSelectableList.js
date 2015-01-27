SirTrevor.DynamicBlocks.RemoteSelectableList = (function(){
  var list_item_template = _.template([
    "<li>",

    //parent
    "<% if (typeof parent_title!='undefined') { %>",
      "<% if (typeof parent_url!='undefined') { %><a target='_blank' href='<%=parent_url %>'><% } %>",
      "<%= parent_title %><% if (typeof parent_url!='undefined') { %></a><% } %>:",
    "<% } %>",

    //title
    "<% if (typeof url!='undefined') { %> <a target='_blank' href='<%=url %>'> <% } %>",
    "<%- title %>",
    "<% if (typeof url!='undefined') { %> </a> <% } %>",

    //preview image
    "<img src='<%= preview_image %>'>",
    "</li>"
  ].join("\n"));

  var list = _.template([
    "<ul class='st-list st-list--<%= model_name %>'>",
    "</ul>"
  ].join("\n"));

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
        return list(parameters);
      },

      onBlockRender: function () {
        this.loading();

        parameters.callback(this.onListSuccess.bind(this), this.onListFail.bind(this));
      },

      loadData: function(data) {
        this.ready();

        this.renderSelected(data.selected);
      },

      renderSelected: function (selected) {
        _.each(selected, function (e) {
          var li = jQuery(list_item_template(e));
          this.$el.find("ul").append(li);
        }, this);
      },

      onListSuccess: function (data) {
        var that = this;
        data = data[parameters.model_name];

        this.setAndLoadData({
          selected: data,
          model_name: parameters.model_name
        });

        this.ready();
      },

      onListFail: function () {
        this.addMessage(i18n.t("blocks:remote_list:fetch_error"));
        this.ready();
      }
    };
  };
})();
