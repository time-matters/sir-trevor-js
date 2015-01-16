/*
  Extended Image Block
*/

SirTrevor.Blocks.ExtendedImage = SirTrevor.Blocks.Image.extend({

  type: "extended_image",
  title: function() { return i18n.t('blocks:extended_image:title'); },

  droppable: true,
  uploadable: true,

  styleable: true,
  styles: [
    { name: i18n.t('blocks:extended_image:default'), value: 'default', className: 'default' },
    { name: i18n.t('blocks:extended_image:bodywidth'), value: 'bodywidth', className: 'bodywidth' },
    { name: i18n.t('blocks:extended_image:fullwidth'), value: 'fullwidth', className: 'fullwidth' }
  ],

  icon_name: 'image',

  // OFF_STATE: "no",
  // ON_STATE: "yes",

  // hiddenLinkInput: undefined,

  removeEmpty: true,

  loadData: function(data) {
    var editor = this.$editor;

    // Create our image tag
    var figure = $("<figure class='media'></figure>");
    var picture = $("<picture class='media__img'></picture>");
    var payload;

    var source = data.file && data.file.url;

    if (source !== undefined) {
      payload= $('<img>', { src: source });
    } else {
      payload = $('<h1><i class="icon--exclamation-triangle"></i></h1>');
    }

    figure.append(picture.append(payload));

    var figcaption = $("<figcaption class='media__body'></figcaption>");

    var copyright = $([
      "<label class='st-input-label'>" + i18n.t('blocks:extended_image:copyright_field') +
      "</label>",
      "<input type='text' maxlength='140' name='copyright' class='st-input-string js-copyright-input'",
      "placeholder='" + i18n.t("blocks:extended_image:copyright_placeholder") + "'></input>"
    ].join("\n"));
    figure.append(copyright);

    var caption = $([
      "<label class='st-input-label'>" + i18n.t('blocks:extended_image:caption_field') +
      "</label>",
      "<textarea name='caption' class='st-input-string js-caption-input'",
      "placeholder='" + i18n.t("blocks:extended_image:caption_placeholder") + "'></textarea>"
    ].join("\n"));
    figure.append(caption);

    // this.hiddenLinkInput = $("<input class='st-input-string js-link_checkbox-input' name='link_checkbox' type='hidden' value='" + "'></input>");
    // this.link_checkbox = $("<input type='checkbox' name='link_checkbox_proxy' class='st-input-checkbox'></input>")
    //   .prop('checked', data.link_checkbox === this.ON_STATE);
    // var link_remainder = $([
    //   "<label class='st-input-label st-checkbox-label'>" + i18n.t('blocks:extended_image:link_checkbox_field') +
    //   "</label>",
    // ].join("\n"));
    // figure.append(this.hiddenLinkInput);
    // figure.append(this.link_checkbox);
    // figure.append(link_remainder);

    // var self = this;
    // this.link_checkbox.on('change', function() {
    //   self.linkCheckboxChange($(this));
    // });

    var target_url = $([
      "<label class='st-input-label'>" + i18n.t('blocks:extended_image:target_url_field') +
      "</label>",
      "<input type='text' maxlength='140' name='target_url' class='st-input-string js-target_url-input'",
      "placeholder='" + i18n.t("blocks:extended_image:target_url_placeholder") + "'></input>"
    ].join("\n"));
    figure.append(target_url);

    editor.html("").show();
    editor.append(figure);

    this.$('.js-target_url-input').val(data.target_url);
    // this.$('.js-link_checkbox-input').val(data.link_checkbox);
    this.$('.js-copyright-input').val(data.copyright);
    this.$('.js-caption-input').val(data.caption);

    if (jQuery.fn.autosize !== undefined) {
      figure.find('.js-caption-input').autosize();
    }
  },

  // linkCheckboxChange: function(element) {
  //   this.hiddenLinkInput.val(
  //     element.is(':checked') ? this.ON_STATE : this.OFF_STATE
  //   );
  // },

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
