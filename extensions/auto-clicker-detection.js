(function(Scratch) {
  'use strict';
  
  let clicks = 0;
  let limit = 16;
  
  document.addEventListener('click', () => {
    clicks++;
  });
  
  setInterval(() => {
    clicks = 0;
  }, 1000);
  
  class ACDetect {
    getInfo() {
      return {
        id: 'lemonACDetection',
        name: Scratch.translate('Auto Clicker Detection'),
        color1: "#F4502F",
        color2: "#952228",
        blocks: [
          {
            opcode: 'setLimit',
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate('set click limit to [LIMIT]'),
            arguments: {
              LIMIT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 16
              }
            }
          },
          {
            opcode: 'detected',
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate('auto clicker detected?')
          }
        ]
      };
    }
  
    setLimit(args) {
      limit = Scratch.Cast.toNumber(args.LIMIT);
      clicks = 0;
    }
    detected() {
      return clicks > limit;
    }
  }

Scratch.extensions.register(new ACDetect());})(Scratch)