SirTrevor.Blocks.Infographic = (function(){

  return SirTrevor.Block.extend({

    // more providers at https://gist.github.com/jeffling/a9629ae28e076785a14f
    providers: {
      infoactive: {
        regex: /(?:http[s]?:\/\/)?(?:www.)?infoactive.co\/plays\/(.+)/,
        html: "<iframe width='100%' height='700' src='https://infoactive.co/plays/{{remote_id}}' frameborder='0' allowfullscreen onload='javascript:SirTrevor.Blocks.Infographic.adjustHeight(this);'></iframe>"
      },
    },

    type: 'infographic',
    title: function() { return i18n.t('blocks:infographic:title'); },

    droppable: true,
    pastable: true,

    icon_name: 'image',

    extractSourceInformation: function() {
      var url = this.$editor.find('iframe').attr('src');
      this.$editor.parents('.st-block').append(
        '<aside>' + i18n.t('general:source') + ': ' + url + '</aside>');
    },

    loadData: function(data){
      var embed_string;

      if (!this.providers.hasOwnProperty(data.source)) {

        embed_string = '<h1><i class="icon--exclamation-triangle"></i></h1>';
        this.$editor.html(embed_string);

      } else {

        embed_string = this.providers[data.source].html
          .replace('{{protocol}}', window.location.protocol)
          .replace('{{remote_id}}', data.remote_id)
          .replace('{{width}}', this.$editor.width()); // for videos that can't resize automatically like vine

        this.$editor.html(embed_string);
        this.extractSourceInformation();
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

SirTrevor.Blocks.Infographic.adjustHeight = function(frame) {

  // the height has to be set to 0 first for this to work in safari. the
  // height also has to be stored.
  var height = frame.style.height;
  frame.style.height = 0;

  try {
    frame.style.height = frame.contentWindow.document.body.scrollHeight + 'px';

  } catch(e) {
    // there might be a security exception getting the scrollHeight. in
    // that case, do not leave the height at 0.
    frame.style.height = height;
  }
};
