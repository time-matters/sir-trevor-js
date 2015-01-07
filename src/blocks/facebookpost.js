SirTrevor.Blocks.FacebookPost = (function(){

  var initDone = false;
  function initFacebookOnce() {
    if (typeof FB !== "undefined" || initDone) {
      return;
    }

    var facebookInitScript = [
      '<div id="fb-root"></div>',
      '<script>(function(d, s, id) {',
      '  var js, fjs = d.getElementsByTagName(s)[0];',
      '  if (d.getElementById(id)) return;',
      '  js = d.createElement(s); js.id = id;',
      '  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";',
      '  fjs.parentNode.insertBefore(js, fjs);',
      '}(document, "script", "facebook-jssdk"));</script>'
    ].join("\n");

    jQuery(document.body).append(facebookInitScript);

    initDone = true;
  }

  var facebook_post_template = _.template([
    '<div class="fb-post" data-href="<%= url %>" data-width="<%= width %>"></div>'
  ].join("\n"));

  var facebookPostRegex = /((?:http[s]?:\/\/)?(?:www.)?(:?facebook.com\/.*\/posts\/(.*?)))(:?\?.*)?$/;

  return SirTrevor.Block.extend({

    type: 'facebook_post',
    title: function() { return i18n.t('blocks:facebookpost:title'); },

    droppable: true,
    pastable: true,

    icon_name: 'facebook-outline',

    extractSourceInformation: function(url) {
      this.$editor.parents('.st-block').append(
        '<aside>' + i18n.t('general:source') + ': ' + url + '</aside>');
    },

    loadData: function(data){
      initFacebookOnce();
      this.$inner.prepend(facebook_post_template({ url: data.url, width: this.$editor.width() || "700" }));
      this.extractSourceInformation(data.url);

      if (typeof FB !== "undefined") {
        FB.XFBML.parse();
      }
    },

    onContentPasted: function(event){
      this.handleDropPaste($(event.target).val());
    },

    handleDropPaste: function(url){
      if(!_.isURI(url)) {
        return;
      }

      if (!this.validPostUrl(url)) {
        SirTrevor.log("Invalid Facebook Post URL");
        return;
      }

      this.setAndLoadData({ url: url });
      this.ready();
    },

    validPostUrl: function (url) {
      return url.match(facebookPostRegex);
    },

    onDrop: function(transferData){
      var url = transferData.getData('text/plain');
      this.handleDropPaste(url);
    }
  });

})();
