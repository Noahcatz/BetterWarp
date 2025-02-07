(async function(Scratch) {
  'use strict';
  
  const vm = Scratch.vm;
  
  if(!Scratch.extensions.unsandboxed) {
    throw new Error('The Screenshot Extension requires to be unsandboxed to use! Sorry!')
  }
  
  const body = document.body;
  
  const html2canvasElement = document.createElement('script');
  
  html2canvasElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  
  body.appendChild(html2canvasElement);
  
  if(!html2canvasElement) {
    throw new Error('You need to Internet to use this extension. Sorry!');
  }
  
  class ScreenshotExt {
    getInfo() {
      return {
        id: 'lemonScreenshot',
        name: Scratch.translate('Screenshot (Slow)'),
        color1: '#715DF2',
        blocks: [
          {
            opcode: 'screenshot',
            blockType: Scratch.BlockType.REPORTER,
            text: 'screenshot entire page',
            disableMonitor: true
          }
        ]
      };
    }
  
    screenshot() {
      try {
        return html2canvas(body)
          .then(canvas => {
            return canvas.toDataURL();
          })
      } catch (error) {
        return error;
      }
    }
  }

Scratch.extensions.register(new ScreenshotExt());})(Scratch);