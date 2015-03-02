SirTrevor.Blocks.Instagram = (function(){

  return SirTrevor.Block.extend({
    providers: {
      instagram: {
        // http://instagram.com/p/bNd86MSFv6/
        regex: /((?:http[s]?:\/\/)?(?:www.)?(:?instagr.*\/p\/(.*?)))(:?\?.*)?$/,
        html: function(options, success, error) {

          // Cross site requests will not produce errors that jQuery
          // could catch. We need a timeout that is cleared when the
          // request was successful.
          var fail = window.setTimeout(error, 5000);

          // Using YQL and JSONP
          $.ajax({
            url: "//api.instagram.com/oembed",
            data: {
              maxwidth: 550,
              url: options.remote_id
            },
            // The name of the callback parameter, as specified by the YQL service
            jsonp: "callback",
            dataType: "jsonp"
          }).done(function(data) {
            // clear the error timeout.
            clearTimeout(fail);
            success(data.html, options);
          });
        }
      }
    },

    type: 'instagram',
    title: function() { return i18n.t('blocks:instagram:title'); },

    droppable: true,
    pastable: true,

    removeEmpty: true,

    icon_name: 'instagram-outline',

    extractSourceInformation: function(options) {
      var url = options.remote_id;
      this.$editor.parents('.st-block').append(
        '<aside>' + i18n.t('general:source') + ': ' + url + '</aside>');
    },

    loadData: function(data){
      var embed_string, self = this;

      var update_editor = function(embed_string, options) {
        self.$editor.html(embed_string);
        self.extractSourceInformation(options);
      };

      var display_error = function() {
        embed_string = '<h1><i class="icon--exclamation-triangle"></i></h1>';
        self.$editor.html(embed_string);
      };

      var html = this.providers[data.source].html;
      html({
        protocol: window.location.protocol,
        remote_id: data.remote_id,
        width: this.$editor.width()
      }, update_editor, display_error);
    },

    onContentPasted: function(event){
      this.handleDropPaste($(event.target).val());
    },

    handleDropPaste: function(url){
      if(!_.isURI(url)) {
        return;
      }

      var match, data;

      _.each(this.providers, function(provider, index) {
        match = provider.regex.exec(url);

        if(match !== null && !_.isUndefined(match[1])) {
          data = {
            source: index,
            remote_id: match[1]
          };

          this.setAndLoadData(data);
        }
      }, this);
    },

    onDrop: function(transferData){
      var url = transferData.getData('text/plain');
      this.handleDropPaste(url);
    }
  });

})();
