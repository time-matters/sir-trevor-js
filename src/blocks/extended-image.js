/*
  Extended Image Block
*/

SirTrevor.Blocks.ExtendedImage = SirTrevor.Blocks.Image.extend({

  type: "extended_image",
  title: function() { return i18n.t('blocks:extended_image:title'); },

  droppable: true,
  uploadable: true,

  icon_name: 'image',

  loadData: function(data) {
    var editor = this.$editor;

    // Create our image tag
    var figure = $("<figure class='captioned'></figure>");
    var picture = $("<picture class='captioned__media'></picture>");
    var image = $('<img>', { src: data.file.url });

    figure.append(picture.append(image));

    var figcaption = $("<figcaption class='captioned__text'></figcaption>");

    var copyright = $([
      "<label class='st-input-label'>" + i18n.t('blocks:extended_image:copyright_field') +
      "</label>",
      "<input type='text' maxlength='140' name='copyright' class='st-input-string st-required js-copyright-input'",
      "placeholder='" + i18n.t("blocks:extended_image:copyright_placeholder") + "'></input>"
    ].join("\n"));
    figure.append(copyright);

    var caption = $([
      "<label class='st-input-label'>" + i18n.t('blocks:extended_image:caption_field') +
      "</label>",
      "<input type='text' name='caption' class='st-input-string st-required js-caption-input'",
      "placeholder='" + i18n.t("blocks:extended_image:caption_placeholder") + "'></input>"
    ].join("\n"));
    figure.append(caption);

    editor.html("").show();
    editor.append(figure);

    this.$('.js-copyright-input').val(data.copyright);
    this.$('.js-caption-input').val(data.caption);
  },

  onBlockRender: function(){
    /* Setup the upload button */
    this.$inputs.find('button').bind('click', function(ev){ ev.preventDefault(); });
    this.$inputs.find('input').on('change', _.bind(function(ev){
      this.onDrop(ev.currentTarget);
    }, this));
  },

  onUploadSuccess : function(data) {
    this.setData(data);
    this.ready();
  },

  // we have to override onUploadError to change the error message.
  onUploadError : function(jqXHR, status, errorThrown){
    this.addMessage(i18n.t('blocks:extended_image:upload_error'));
    this.ready();
  },

  onDrop: function(transferData){
    var file = transferData.files[0],
        urlAPI = (typeof URL !== "undefined") ? URL : (typeof webkitURL !== "undefined") ? webkitURL : null;

    // Handle one upload at a time
    if (/image/.test(file.type)) {
      this.loading();
      // Show this image on here
      this.$inputs.hide();
      this.loadData({file: {url: urlAPI.createObjectURL(file)}});

      this.uploader(file, this.onUploadSuccess, this.onUploadError);
    }

  }
});
