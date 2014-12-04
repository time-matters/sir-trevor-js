SirTrevor.Blocks.Audio = (function(){
  return SirTrevor.Block.extend({
    providers: {
      soundcloud: {
        regex: /((?:http[s]?:\/\/)?(?:www.)?(:?soundcloud.com\/(.*)))/,
        html: function(options, success, error) {

          // Cross site requests will not produce errors that jQuery
          // could catch. We need a timeout that is cleared when the
          // request was successful.
          var fail = window.setTimeout(error, 5000);

          $.getJSON('https://soundcloud.com/oembed?callback=?', {
            format: 'js',
            url: options.remote_id,
            iframe: true
          }).done(function(data) {
            // clear the error timeout.
            clearTimeout(fail);
            success(data.html, options);
          });
        }
      }
    },

    type: 'audio',
    title: function() { return i18n.t('blocks:audio:title'); },

    droppable: true,
    pastable: true,

    icon_name: 'audio',

    extractSourceInformation: function() {
      var url = this.$editor.find('iframe').attr('src');
      this.$editor.parents('.st-block').append(
        '<aside>' + i18n.t('general:source') + ': ' + url + '</aside>');
    },

    loadData: function(data){
      var embed_string, self = this;

      var update_editor = function(embed_string) {
        self.$editor.html(embed_string);
        self.extractSourceInformation();
        if (self.providers[data.source].square) {
          self.$editor.addClass('st-block__editor--with-square-media');
        } else {
          self.$editor.addClass('st-block__editor--with-sixteen-by-nine-media');
        }
      };

      var display_error = function() {
        embed_string = '<h1><i class="icon--exclamation-triangle"></i></h1>';
        self.$editor.html(embed_string);
      };

      if (!this.providers.hasOwnProperty(data.source)) {
        display_error();

      } else {


        var html = this.providers[data.source].html;

        if (html instanceof Function) {

          html({
            protocol: window.location.protocol,
            remote_id: data.remote_id,
            width: this.$editor.width() // for videos that can't resize automatically like vine
          }, update_editor, display_error);

        } else {

          embed_string = html
            .replace('{{protocol}}', window.location.protocol)
            .replace('{{remote_id}}', data.remote_id)
            .replace('{{width}}', this.$editor.width()); // for videos that can't resize automatically like vine
          update_editor();
        }
      }
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
