SirTrevor.Blocks.ExtendedTweet = (function(){

  var tweet_template = _.template([
    "<blockquote class='twitter-tweet' align='center'>",
    "<p><%= text %></p>",
    "&mdash; <%= user.name %> (@<%= user.screen_name %>)",
    "<a href='<%= status_url %>' data-datetime='<%= created_at %>'><%= created_at %></a>",
    "</blockquote>",
    '<script src="//platform.twitter.com/widgets.js" charset="utf-8"></script>'
  ].join("\n"));

  return SirTrevor.Block.extend({
    providers: {
      soundcloud: {
        regex: /((?:http[s]?:\/\/)?(?:www.)?(:?twitter.com\/.*\/status\/(.*)))/,
        html: function(callback, options) {
          $.getJSON('https://api.twitter.com/1/statuses/oembed.json?callback=?', {
            format: 'js',
            url: options.remote_id,
            align: 'center',
            maxwidth: 550,
            hide_thread: 1,
            iframe: true
          }, function(data) {
            callback(data.html, options);
          });
        }
      }
    },

    type: 'extended_tweet',
    title: function() { return i18n.t('blocks:tweet:title'); },

    droppable: true,
    pastable: true,

    icon_name: 'twitter',

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

      if (!this.providers.hasOwnProperty(data.source)) {

        embed_string = '<h1><i class="fa fa-exclamation-triangle"></i></h1>';
        self.$editor.html(embed_string);

      } else {

        var html = this.providers[data.source].html;


        if (html instanceof Function) {

          html(update_editor, {
            protocol: window.location.protocol,
            remote_id: data.remote_id,
            width: this.$editor.width()
          });

        } else {

          embed_string = html
            .replace('{{protocol}}', window.location.protocol)
            .replace('{{remote_id}}', data.remote_id)
            .replace('{{width}}', this.$editor.width());
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
