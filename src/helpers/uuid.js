/*
* UUID generator extracted from simple-block.js
*/

SirTrevor.generateUUID = function() {
  return 'aaaaaaaa-aaaa-4aaa-baaa-aaaaaaaaaaaa'.
    replace(/[ab]/g, function(c) {
      var random = (Math.random()*16)%16 | 0;
      if (c === 'b') random = random & 0x7 | 0x8; // rfc4122 4.1.1. Variant
      return random.toString(16);
    });
};
