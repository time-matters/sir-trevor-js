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
    //parameters.title
    //parameters.model_name
    //parameters.api_url
    //parameters.maxSelected

    return {
      type: parameters.model_name,
      fetchable: true,

      selectedElements: [],

      title: function() { return parameters.title; },

      icon_name: parameters.icon,

      fetchResults: function () {
        this.loading();

        var ajaxOptions = {
          url: parameters.api_url,
          dataType: "json"
        };

        this.fetch(ajaxOptions, this.onListSuccess, this.onListFail);
      },

      getSelected: function () {
        return this.getData().selected;
      },

      getSelectedIDs: function () {
        return this.getSelected().map(function (e) {
          return e.id;
        });
      },

      markSelectedElements: function () {
        var selectedIDs = this.getSelectedIDs();
        this.$el.find("li").each(function (i, el) {
          el = jQuery(el);
          if (selectedIDs.indexOf(el.data().id) !== -1) {
            el.addClass("st-list-selected");
          } else {
            el.removeClass("st-list-selected");
          }
        });
      },

      toggleElement: function (element) {
        this.resetErrors();

        var selectedElements = this.getSelected().slice();
        var index = this.getSelectedIDs().indexOf(element.id);

        if (index === -1) {
          if (!parameters.maxSelected || parameters.maxSelected > selectedElements.length) {
            selectedElements.push(element);
          } else {
            this.setError(jQuery(), i18n.t("blocks:remoteselectablelist:maximumselected"));
          }
        } else {
          selectedElements.splice(index, 1);
        }

        this.setAndLoadData({
          selected: selectedElements
        });
      },

      editorHTML: function() {
        return list(parameters);
      },

      onBlockRender: function () {
        if (!this.getData().selected) {
          this.setData({ selected: [], model_name: parameters.model_name });
        }

        this.fetchResults();
      },

      loadData: function(data) {
        this.markSelectedElements();
      },

      onListSuccess: function (data) {
        var that = this;
        data = data[parameters.model_name];

        _.each(data, function (e) {
          var li = jQuery(list_item_template(e));
          li.data(e);
          li.click(function () {
            that.toggleElement(jQuery(this).data());
          });
          this.$el.find("ul").append(li);
        }, this);

        this.markSelectedElements();

        this.ready();
      },

      onListFail: function () {
        this.addMessage(i18n.t("blocks:remoteselectablelist:fetch_error"));
        this.ready();
      }
    };
  };
})();
