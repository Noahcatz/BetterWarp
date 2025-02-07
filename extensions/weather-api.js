const MenuICON = `data:image/png;base64,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`;

(function(Scratch) {
  
  const vm = Scratch.vm;
  
  let colorPallete = {"color1": ["#39414C", "#56BDEA", "#F2F7FF"], "color2": ["#4C4C4C", "#56BDEA", "#FFFFFF"], "color3": ["#BFD9FF", "#26619E", "#98ADCC"]}
  
  let palleteNumber = 1;
  
  // this does not work as intended :/
  let refreshBlocks = vm.extensionManager.refreshBlocks();
  //Patch made by Miyo
  if (Scratch.gui) Scratch.gui.getBlockly().then(Blockly => {
    // update it to use a new function
    refreshBlocks = () => {
      const ws = Blockly.getMainWorkspace();
      // reflow
      vm.extensionManager.refreshBlocks();
      const cat = ws.toolbox_.categoryMenu_.categories_.find(cat => cat.id_ === 'lemonWeather');
      if (!cat) {
        console.warn('Could not find our category!');
        return;
      }
      cat.colour_ = colorPallete["color1"][palleteNumber - 1];
      cat.contents_.forEach(block => {
        if (block.nodeName.toLowerCase() !== 'block') return;
        block = ws.getBlockById(block.getAttribute('type'));
        if (!block) return;
        block.setColour(colorPallete["color1"][palleteNumber - 1], colorPallete["color2"][palleteNumber - 1], colorPallete["color3"][palleteNumber - 1]);
        block.render(true);
      });
      const flyoutWorkspace = flyout.getWorkspace();
      Blockly.Xml.clearWorkspaceAndLoadFromXml(
        Blockly.Xml.workspaceToDom(flyoutWorkspace),
        flyoutWorkspace
      );
      workspace.getToolbox().refreshSelection();
      workspace.toolboxRefreshEnabled_ = true;
    };
    Blockly.Extensions.register('lemonWeather_colors', function() {
      this.setColour(colorPallete["color1"][palleteNumber - 1], colorPallete["color2"][palleteNumber - 1], colorPallete["color3"][palleteNumber - 1]);
    });
  });

  class WeatherAPI {
  getInfo() {
    const colors = {
      color1: colorPallete["color1"][palleteNumber - 1],
      color2: colorPallete["color2"][palleteNumber - 1],
      color3: colorPallete["color3"][palleteNumber - 1]
    };
    const info = {
      id: 'lemonWeather',
      name: Scratch.translate('Weather'),
      menuIconURI: MenuICON,
      blockIconURI: MenuICON,
      ...colors,
      blocks: [
        {
          func: 'changeColor',
          blockType: Scratch.BlockType.BUTTON,
          text: Scratch.translate('Change color palette')
        },
        {
          opcode: 'condition',
          blockType: Scratch.BlockType.REPORTER,
          text: Scratch.translate('condition of [PLACE]'),
          arguments: {
            PLACE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'London'
            }
          },
          ...colors,
          extensions: ['lemonWeather_colors']
        },
        {
          opcode: 'temperature',
          blockType: Scratch.BlockType.REPORTER,
          text: Scratch.translate('temperature of [PLACE] in [M]'),
          arguments: {
            PLACE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'London'
            },
            M: {
              type: Scratch.ArgumentType.STRING,
              menu: "measurementMenu"
            }
          },
          ...colors,
          extensions: ['lemonWeather_colors']
        },
        {
          opcode: 'humidity',
          blockType: Scratch.BlockType.REPORTER,
          text: Scratch.translate('humidity of [PLACE]'),
          arguments: {
            PLACE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'London'
            }
          },
          ...colors,
          extensions: ['lemonWeather_colors']
        }
      ],
      menus: {
        measurementMenu: {
          items: [
            {
              text: Scratch.translate('celcius'),
              value: 'c'
            },
            {
              text: Scratch.translate('farenheit'),
              value: 'f'
            },
          ]
        }
      }
    };
    return info;
  }

  condition(args) {
    const URL = `https://api.weatherapi.com/v1/current.json?key=a761a091b80341c7a3794546242309&q=${args.PLACE}&aqi=yes`;
    return fetch(URL)
      .then(response => response.json())
      .then((response) => {
        return response["current"]["condition"]["text"]
      })
      .catch((error) => {
        return 'Location not found!';
      })
  }
  temperature(args) {
    const URL = `https://api.weatherapi.com/v1/current.json?key=a761a091b80341c7a3794546242309&q=${args.PLACE}&aqi=yes`;
    const measurement = args.M;
    switch(measurement) {
      case("c"):
        return fetch(URL)
                .then(response => response.json())
                .then(response => {
                  return response["current"]["temp_c"];
                })
                .catch((error) => {
                  return 'Location not found!';
                })
      break
      case("f"):
        return fetch(URL)
                .then(response => response.json())
                .then(response => {
                  return response["current"]["temp_f"];
                })
                .catch((error) => {
                  return 'Location not found!';
                })
      break
      default:
        return 'how';
      break
    }
  }
  humidity(args) {
    const URL = `https://api.weatherapi.com/v1/current.json?key=a761a091b80341c7a3794546242309&q=${args.PLACE}&aqi=yes`;
    return fetch(URL)
      .then(response => response.json())
      .then((response) => {
        return response["current"]["humidity"]
      })
      .catch((error) => {
        return 'Location not found!';
      })
  }
  changeColor() {
    palleteNumber++;
    if(palleteNumber >= 4) palleteNumber = 1;
    refreshBlocks();
    vm.refreshWorkspace();
  }
}

Scratch.extensions.register(new WeatherAPI());})(Scratch)
