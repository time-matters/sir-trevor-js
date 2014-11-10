SirTrevor.Blocks.Infographic = (function(){

  return SirTrevor.Block.extend({

    // more providers at https://gist.github.com/jeffling/a9629ae28e076785a14f
    providers: {
      infoactive: {
        regex: /(?:http[s]?:\/\/)?(?:www.)?infoactive.co\/plays\/(.+)/,
        html: [
          "<div data-url='https://infoactive.co/plays/{{remote_id}}' id='infoactive-iframe-container-{{remote_id}}'></div>",
          "<script type='text/javascript'>",
            "jQuery.getScript('https://dqzzm1bt1bnva.cloudfront.net/assets/pym-7afa305c2065e6ace0f4cb837fc78658.js', function() {",
              "var iFrameLoader = new pym.Parent('infoactive-iframe-container-{{remote_id}}','https://infoactive.co/plays/{{remote_id}}', {});",
            "});",
          "</script>"
        ].join("\n")
      },
    },

    type: 'infographic',
    title: function() { return i18n.t('blocks:infographic:title'); },

    droppable: true,
    pastable: true,

    icon_name: 'infographic',

    extractSourceInformation: function() {
      var url = this.$editor.find('div[data-url]').attr('data-url');
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
          .replace(/{{protocol}}/g, window.location.protocol)
          .replace(/{{remote_id}}/g, data.remote_id)
          .replace(/{{width}}/g, this.$editor.width()); // for videos that can't resize automatically like vine

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
