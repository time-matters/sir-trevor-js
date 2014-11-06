SirTrevor.Blocks.Audio = (function(){
  return SirTrevor.Block.extend({
    providers: {
      soundcloud: {
        regex: /((?:http[s]?:\/\/)?(?:www.)?(:?soundcloud.com\/(.*)))/,
        html: function(callback, options) {
          $.getJSON('https://soundcloud.com/oembed?callback=?', {
            format: 'js',
            url: options.remote_id,
            iframe: true
          }, function(data) {
            callback(data.html);
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
      };

      if (!this.providers.hasOwnProperty(data.source)) {

        embed_string = '<h1><i class="icon--exclamation-triangle"></i></h1>';
        self.$editor.html(embed_string);

      } else {

        if (this.providers[data.source].square) {
          this.$editor.addClass('st-block__editor--with-square-media');
        } else {
          this.$editor.addClass('st-block__editor--with-sixteen-by-nine-media');
        }

        var html = this.providers[data.source].html;

        if (html instanceof Function) {

          html(update_editor, {
            protocol: window.location.protocol,
            remote_id: data.remote_id,
            width: this.$editor.width() // for videos that can't resize automatically like vine
          });

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
