/*
  RewardList
*/

SirTrevor.Blocks.RewardList = (function() {

  var template = [
    '<div class="st-reward-list st-block--reward-list">',
    '<h1><i class="icon--money"></i>%s</h1>',
    '</div>'
  ].join("\n");

  debugger;

  return SirTrevor.Block.extend({

    type: 'reward_list',

    title: function() { return i18n.t('blocks:reward_list:title'); },

    icon_name: 'money',

    editorHTML: function() {
      return _.template(template.replace('%s', this.title()), this);
    },

    // toMarkdown: function(markdown) {
    //   return "---------------------------------------";
    // },

    // toHTML: function(html) {
    //   return template;
    // },

    isEmpty: function() {
      return false;
    }

  });

})();
