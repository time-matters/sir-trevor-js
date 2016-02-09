SirTrevor.Blocks.Video = (function(){

  return SirTrevor.Block.extend({

    // more providers at https://gist.github.com/jeffling/a9629ae28e076785a14f
    providers: {
      vimeo: {
        regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo.com\/(.+)/,
        html: "<iframe src=\"{{protocol}}//player.vimeo.com/video/{{remote_id}}?title=0&byline=0\" width=\"580\" height=\"320\" frameborder=\"0\"></iframe>"
      },
      youtube: {
        regex: /(?:http[s]?:\/\/)?(?:www.)?(?:(?:youtube.com\/watch\?(?:.*)(?:v=))|(?:youtu.be\/))([^&].+)/,
        html: "<iframe src=\"{{protocol}}//www.youtube.com/embed/{{remote_id}}\" width=\"580\" height=\"320\" frameborder=\"0\" allowfullscreen></iframe>"
      }
    },

    type: 'video',
    title: function() { return i18n.t('blocks:video:title'); },

    droppable: true,
    pastable: true,

    icon_name: 'video',

    styleable: true,
    styles: [
      { name: 'Default', value: 'default', className: 'default' },
      { name: 'Full-width', value: 'fullwidth', className: 'default' }
    ],

    removeEmpty: true,

    extractSourceInformation: function() {
      var url = this.$editor.find('iframe').attr('src');
      this.$editor.parents('.st-block').append(
        '<aside>' + i18n.t('general:source') + ': ' + url + '</aside>');
    },

    loadData: function(data){
      var embed_string;

      if (!this.providers.hasOwnProperty(data.source)) {

        embed_string = '<h1><i class="st-icon st-icon--exclamation-triangle"></i></h1>';

      } else {

        if (this.providers[data.source].square) {
          this.$editor.addClass('intrinsic-ratio');
        } else {
          this.$editor.addClass('intrinsic-ratio intrinsic-ratio--16-9');
        }

        embed_string = this.providers[data.source].html
          .replace('{{protocol}}', window.location.protocol)
          .replace('{{remote_id}}', data.remote_id)
          .replace('{{width}}', this.$editor.width()); // for videos that can't resize automatically like vine
      }

      this.$editor.html(embed_string);
      this.extractSourceInformation();
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
