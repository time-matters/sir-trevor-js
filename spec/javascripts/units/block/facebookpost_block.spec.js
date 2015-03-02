describe('Facebook post block', function() {

  var element, editor, facebook;
  SirTrevor.DEBUG = false;

  beforeEach(function(){
    element = $("<textarea>");
    editor = new SirTrevor.Editor({ el: element });
    editor.createBlock('facebook_post');
    facebook = editor.blocks[0];
  });

  describe('validPostUrl', function() {

    it('is true for a post', function() {
      expect(facebook.validPostUrl('https://www.facebook.com/mehrbasketball/posts/789246717829360')).toBeTruthy();
    });

    it('is true for a photo', function() {
      expect(facebook.validPostUrl('https://www.facebook.com/BuschmannFrank/photos/a.646326722058247.1073741825.117176518306606/935661633124753/?type=1')).toBeTruthy();
    });

    it('is true for another version of a photo', function() {
      expect(facebook.validPostUrl('https://www.facebook.com/photo.php?fbid=923923527651763&set=a.340340156010106.85330.100001023720602&type=1')).toBeTruthy();
    });

    it('is true for a video', function() {
      expect(facebook.validPostUrl('https://www.facebook.com/video.php?v=932260686798181')).toBeTruthy();
    });

    it('is false for a profile page', function() {
      expect(facebook.validPostUrl('https://www.facebook.com/BuschmannFrank')).toBeFalsy();
    });

    it('is false for the main page', function() {
      expect(facebook.validPostUrl('https://www.facebook.com/')).toBeFalsy();
    });


    it('is false for the friends invitations page', function() {
      expect(facebook.validPostUrl('https://www.facebook.com/friends/requests/')).toBeFalsy();
    });

    it('is false for the messages page', function() {
      expect(facebook.validPostUrl('https://www.facebook.com/messages/')).toBeFalsy();
    });

    it('is false for the message thread page', function() {
      expect(facebook.validPostUrl('https://www.facebook.com/messages/some.one')).toBeFalsy();
    });


    it('is false for the about page', function() {
      expect(facebook.validPostUrl('https://www.facebook.com/some.user/about')).toBeFalsy();
    });

  });


});
