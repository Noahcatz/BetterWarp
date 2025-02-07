(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) throw new Error('Please load the waveforms extension unsandboxed!')

  // Thanks to miyo and elmo bear for the original extension that this patch was extracted from
  // Based on PM blockShape implementation
  if (!Scratch?.BlockShape) {
    const _cbfsb = vm.runtime._convertBlockForScratchBlocks;
    vm.runtime._convertBlockForScratchBlocks = function (...args) {
      const blockInfo = args[0];
      const res = _cbfsb.apply(this, args);
      if (blockInfo?.blockShape) res.json.outputShape = blockInfo.blockShape;
      return res;
    };
  }
  Scratch.BlockShape = Scratch?.BlockShape ?? {
    HEXAGON: 1,
    ROUND: 2,
    SQUARE: 3,
  };

  // Field type example https://github.com/Xeltalliv/extensions/blob/examples/examples/custom-field-types.js
  const _bcfi = vm.runtime._buildCustomFieldInfo;
  const _bcftfsb = vm.runtime._buildCustomFieldTypeForScratchBlocks;
  let fi = null;
  vm.runtime._buildCustomFieldInfo = function (fieldName, fieldInfo, extensionId, categoryInfo) {
    fi = fieldInfo;
    return _bcfi.call(this, fieldName, fieldInfo, extensionId, categoryInfo);
  };
  vm.runtime._buildCustomFieldTypeForScratchBlocks = function (fieldName, output, outputShape, categoryInfo) {
    let res = _bcftfsb.call(this, fieldName, output, outputShape, categoryInfo);
    if (fi) {
      if (fi.color1) res.json.colour = fi.color1;
      if (fi.color2) res.json.colourSecondary = fi.color2;
      if (fi.color3) res.json.colourTertiary = fi.color3;
      fi = null;
    }
    return res;
  };

  const ArgumentType_SQUARE = `SAOIFHAUISHFIAWO@$!@!#%#@!#!@VAWIAHDCAIWHDIASJCKASsquareShape`;

  let implementations = {
    [ArgumentType_SQUARE]: null,
  }, Blockly = null;

  const toRegisterOnBlocklyGot = [],
    customFieldTypes = {
      [ArgumentType_SQUARE]: {
        output: null,
        outputShape: 3,
        implementation: {
          fromJson: (args) => new implementations[ArgumentType_SQUARE](args['squareShape']),
        },
      },
    };

  // Some patching based on https://github.com/AshimeeAlt/survs-gallery/blob/main/extensions/0znzw/MoreFields.js
  function onBlockly(_Blockly) {
    Blockly = _Blockly;
    // This fixes a bug where modifying size_.height in updateWidth causes weird issues when dragged,
    // See MoreFields.js at FieldInlineTextarea for reference of usage.
    // https://github.com/FurryR/ Made this patch.
    const _endBlockDrag = Blockly.BlockDragger.prototype.endBlockDrag;
    Blockly.BlockDragger.prototype.endBlockDrag = function (...a) {
      _endBlockDrag.call(this, ...a);
      for (const childBlock of this.draggingBlock_.childBlocks_) {
        const inputList = childBlock.inputList;
        if (inputList.length === 1 && inputList[0].fieldRow.length === 1 && !!inputList[0].fieldRow[0]?.inlineDblRender) childBlock.render();
      }
    };

    implementations[ArgumentType_SQUARE] = class FieldSquareShape extends Blockly.Field {
      // For future reference on field functions please refer to:
      // https://developers.google.com/blockly/reference/js/blockly.field_class
      // field based on https://github.com/LLK/scratch-blocks/blob/893c7e7ad5bfb416eaed75d9a1c93bdce84e36ab/core/field_angle.js
      constructor(opt_value, opt_validator) {
        super(opt_value, opt_validator);
        this.addArgType(ArgumentType_SQUARE);
      }

      init() {
        Blockly.Field.prototype.init.call(this);
        this.$fixColors();
      }

      $fixColors() {
        try {
          this.sourceBlock_.colour_ = this.sourceBlock_.parentBlock_.colour_;
          this.sourceBlock_.colourSecondary_ = this.sourceBlock_.parentBlock_.colourSecondary_;
          this.sourceBlock_.colourTertiary_ = this.sourceBlock_.parentBlock_.colourTertiary_;
        } catch { }
      }

      render_() {
        this.$fixColors();
        Blockly.Field.prototype.render_.call(this);
      }

      setValue() { }
      showEditor_() { }
    };

    while (toRegisterOnBlocklyGot.length > 0) {
      const [name, impl] = toRegisterOnBlocklyGot.shift();
      Blockly.Field.register(name, impl);
    }
    // https://github.com/TurboWarp/addons/blob/tw/addons/custom-block-shape/update-all-blocks.js
    const eventsOriginallyEnabled = Blockly.Events.isEnabled(),
      workspace = Blockly.getMainWorkspace();

    Blockly.Events.disable();
    if (workspace) {
      if (vm.editingTarget) vm.emitWorkspaceUpdate();

      const flyout = workspace.getFlyout();
      if (flyout) {
        const flyoutWorkspace = flyout.getWorkspace();
        Blockly.Xml.clearWorkspaceAndLoadFromXml(Blockly.Xml.workspaceToDom(flyoutWorkspace), flyoutWorkspace);
        workspace.getToolbox().refreshSelection();
        workspace.toolboxRefreshEnabled_ = true;
      }
    }
    if (eventsOriginallyEnabled) Blockly.Events.enable();
  }
  // https://github.com/LLK/scratch-vm/blob/f405e59d01a8f9c0e3e986fb5276667a8a3c7d40/test/unit/extension_conversion.js#L85-L124
  // https://github.com/LLK/scratch-vm/commit/ceaa3c7857b79459ccd1b14d548528e4511209e7
  vm.addListener('EXTENSION_FIELD_ADDED', (fieldInfo) => {
    if (Blockly) Blockly.Field.register(fieldInfo.name, fieldInfo.implementation);
    else toRegisterOnBlocklyGot.push([fieldInfo.name, fieldInfo.implementation]);
  });
  if (typeof Scratch?.gui === 'object') Scratch.gui.getBlockly().then((Blockly) => onBlockly(Blockly));

  class WaveformsEXT {
    getInfo() {
      return {
        id: 'lemonWaveforms',
        name: 'Waveforms',
        customFieldTypes,
        blocks: [
          {
            opcode: 'sine',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sine wave | [F0]hz',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'cosine',
            blockType: Scratch.BlockType.REPORTER,
            text: 'cosine wave | [F0]hz',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'semisine',
            blockType: Scratch.BlockType.REPORTER,
            text: 'semisine wave | [F0]hz',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },

          '---',

          {
            opcode: 'square',
            blockType: Scratch.BlockType.REPORTER,
            text: 'square wave | [F0]hz | harmonics: [HARMONICS]',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              HARMONICS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              }
            }
          },
          {
            opcode: 'triangle',
            blockType: Scratch.BlockType.REPORTER,
            text: 'triangle wave | [F0]hz | harmonics: [HARMONICS]',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              HARMONICS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'sawtooth',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sawtooth wave | [F0]hz | harmonics: [HARMONICS]',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              HARMONICS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'pulse',
            blockType: Scratch.BlockType.REPORTER,
            text: 'pulse wave | [F0]hz | harmonics: [HARMONICS] | duty cycle: [DUTY_CYCLE]%',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              HARMONICS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              },
              DUTY_CYCLE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 25
              }
            }
          },

          '---',

          {
            opcode: 'semicircle',
            blockType: Scratch.BlockType.REPORTER,
            text: 'semicircle wave | [F0]hz | radius: [RADIUS]',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              RADIUS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Custom Waveforms'
          },
          {
            opcode: 'sinecosine',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sinecosine wave | [F0]hz',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'cosinesine',
            blockType: Scratch.BlockType.REPORTER,
            text: 'cosinesine wave | [F0]hz',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'eulercosine',
            blockType: Scratch.BlockType.REPORTER,
            text: 'eulercosine wave | [F0]hz',
            arguments: {
              F0: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },

          '---',

          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Waveform Creator'
          },
          {
            opcode: 'runWC',
            blockType: Scratch.BlockType.REPORTER,
            text: 'find x at equation [INPUT]',
            arguments: {
              INPUT: {
                type: ArgumentType_SQUARE
              }
            },
          },
          {
            opcode: 'sinWC',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sin ( [INPUT] )',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT: {
                type: ArgumentType_SQUARE
              }
            },
            extensions: ["colours_operators"]
          },
          {
            opcode: 'cosWC',
            blockType: Scratch.BlockType.REPORTER,
            text: 'cos ( [INPUT] )',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT: {
                type: ArgumentType_SQUARE
              }
            },
            extensions: ["colours_operators"]
          },
          {
            opcode: 'tanWC',
            blockType: Scratch.BlockType.REPORTER,
            text: 'tan ( [INPUT] )',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT: {
                type: ArgumentType_SQUARE
              }
            },
            extensions: ["colours_operators"]
          },
          {
            opcode: 'typeWC',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TYPE]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'argType'
              }
            },
            blockShape: Scratch.BlockShape.SQUARE,
            disableMonitor: true,
            extensions: ["colours_operators"]
          },
          {
            opcode: 'multiplyWC',
            blockType: Scratch.BlockType.REPORTER,
            text: '[INPUT1] * [INPUT2]',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT1: {
                type: ArgumentType_SQUARE
              },
              INPUT2: {
                type: ArgumentType_SQUARE
              }
            },
            extensions: ["colours_operators"]
          },
          {
            opcode: 'divideWC',
            blockType: Scratch.BlockType.REPORTER,
            text: '[INPUT1] / [INPUT2]',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT1: {
                type: ArgumentType_SQUARE
              },
              INPUT2: {
                type: ArgumentType_SQUARE
              }
            },
            extensions: ["colours_operators"]
          },
          {
            opcode: 'addWC',
            blockType: Scratch.BlockType.REPORTER,
            text: '[INPUT1] + [INPUT2]',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT1: {
                type: ArgumentType_SQUARE
              },
              INPUT2: {
                type: ArgumentType_SQUARE
              }
            },
            extensions: ["colours_operators"]
          },
          {
            opcode: 'subtractWC',
            blockType: Scratch.BlockType.REPORTER,
            text: '[INPUT1] - [INPUT2]',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT1: {
                type: ArgumentType_SQUARE
              },
              INPUT2: {
                type: ArgumentType_SQUARE
              }
            },
            extensions: ["colours_operators"]
          },
          {
            opcode: 'sqrtWC',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sqrt ( [INPUT] )',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT: {
                type: ArgumentType_SQUARE
              }
            },
            extensions: ["colours_operators"]
          },
          {
            opcode: 'expWC',
            blockType: Scratch.BlockType.REPORTER,
            text: 'exp ( [INPUT] )',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT: {
                type: ArgumentType_SQUARE
              }
            },
            extensions: ["colours_operators"]
          },
          {
            opcode: 'powerWC',
            blockType: Scratch.BlockType.REPORTER,
            text: '[INPUT1] ^ [INPUT2]',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT1: {
                type: ArgumentType_SQUARE
              },
              INPUT2: {
                type: ArgumentType_SQUARE
              }
            },
            extensions: ["colours_operators"]
          },
          {
            opcode: 'inputWC',
            blockType: Scratch.BlockType.REPORTER,
            text: '( [INPUT] )',
            blockShape: Scratch.BlockShape.SQUARE,
            arguments: {
              INPUT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            },
            extensions: ["colours_operators"]
          }
        ],
        menus: {
          'argType': {
            items: ['x', 'pi', 'e']
          }
        }
      };
    }

    timer() {
      return Scratch.vm.runtime.ioDevices.clock.projectTimer();
    }

    sine({ F0 }) {
      return Math.sin(2 * Math.PI * Scratch.Cast.toNumber(F0) * this.timer());
    }

    cosine({ F0 }) {
      return Math.cos(2 * Math.PI * Scratch.Cast.toNumber(F0) * this.timer());
    }

    semisine({ F0 }) {
      return Math.abs(Math.sin(2 * Math.PI * Scratch.Cast.toNumber(F0) * this.timer()))
    }

    square({ F0, HARMONICS }) {
      let value = 0;

      for (let k = 1; k <= Scratch.Cast.toNumber(HARMONICS) * 2; k += 2) {
        value += Math.sin(2 * Math.PI * k * Scratch.Cast.toNumber(F0) * this.timer()) / k;
      }

      return (4 / Math.PI) * value;
    }

    triangle({ F0, HARMONICS }) {
      let value = 0;

      for (let k = 1; k <= Scratch.Cast.toNumber(HARMONICS) * 2; k += 2) {
        value += Math.pow(-1, (k - 1) / 2) * Math.sin(2 * Math.PI * k * Scratch.Cast.toNumber(F0) * this.timer()) / (k * k)
      }
      return (8 / Math.PI ** 2) * value;
    }

    sawtooth({ F0, HARMONICS }) {
      let value = 0;

      for (let k = 1; k <= Scratch.Cast.toNumber(HARMONICS) * 2; k++) {
        value += Math.pow(-1, k + 1) * Math.sin(2 * Math.PI * k * Scratch.Cast.toNumber(F0) * this.timer()) / k;
      }

      return (2 / Math.PI) * value;
    }

    pulse({ F0, HARMONICS, DUTY_CYCLE }) {
      let value = 0;

      for (let k = 1; k <= Scratch.Cast.toNumber(HARMONICS); k++) {
        value += Math.sin(2 * Math.PI * k * Scratch.Cast.toNumber(F0) * this.timer()) * Math.sin(Math.PI * k * (Scratch.Cast.toNumber(DUTY_CYCLE) / 100)) / k
      }

      return (2 / Math.PI) * value;
    }

    semicircle({ F0, RADIUS }) {
      const T = 1 / Scratch.Cast.toNumber(F0);
      const phase = this.timer() % T;

      let x = 2 * Scratch.Cast.toNumber(RADIUS) * ((phase % (T / 2)) / (T / 2)) - Scratch.Cast.toNumber(RADIUS);

      const y = Math.sqrt(Scratch.Cast.toNumber(RADIUS) ** 2 - x ** 2)

      return phase < T / 2 ? y : -y
    }

    sinecosine({ F0 }) {
      return Math.sin(Math.cos(Scratch.Cast.toNumber(F0) * this.timer()) * Math.PI * 2);
    }

    cosinesine({ F0 }) {
      return Math.cos(Math.sin(Scratch.Cast.toNumber(F0) * this.timer()) * Math.PI * 2);
    }

    eulercosine({ F0 }) {
      return Math.cos(Scratch.Cast.toNumber(F0) * this.timer() * Math.sin(Math.E));
    }

    // WAVEFORM CREATOR

    evaluateToken(token) {
      switch (token.type) {
        case 'constant':
          if (token.value === 'x') {
            return this.timer();
          } else if (token.value === 'pi') {
            return Math.PI;
          } else if (token.value === 'e') {
            return Math.E;
          }
        case 'input':
          return Scratch.Cast.toNumber(token.value);
        case 'sin':
          return Math.sin(this.evaluateToken(token.value));
        case 'cos':
          return Math.cos(this.evaluateToken(token.value));
        case 'tan':
          return Math.tan(this.evaluateToken(token.value));
        case 'multiply':
          return this.evaluateToken(token.left) * this.evaluateToken(token.right);
        case 'divide':
          return this.evaluateToken(token.left) / this.evaluateToken(token.right);
        case 'add':
          return this.evaluateToken(token.left) + this.evaluateToken(token.right);
        case 'subtract':
          return this.evaluateToken(token.left) - this.evaluateToken(token.right);
        case 'sqrt':
          return Math.sqrt(this.evaluateToken(token.left));
        case 'exp':
          return Math.exp(this.evaluateToken(token.left));
        case 'power':
          return this.evaluateToken(token.left) ** this.evaluateToken(token.right);
      }
    }

    runWC({ INPUT }) {
      INPUT = JSON.parse(Scratch.Cast.toString(INPUT));
      
      try {
        return this.evaluateToken(INPUT);
      } catch {
        return 0
      }
    }

    sinWC({ INPUT }) {
      try {
        return JSON.stringify({
          type: 'sin',
          value: JSON.parse(INPUT),
        });
      } catch {
        return '{"input":0}'
      }
    }

    cosWC({ INPUT }) {
      try {
        return JSON.stringify({
          type: 'cos',
          value: JSON.parse(INPUT),
        });
      } catch {
        return '{"input":0}'
      }
    }

    tanWC({ INPUT }) {
      try {
        return JSON.stringify({
          type: 'tan',
          value: JSON.parse(INPUT),
        });
      } catch {
        return '{"input":0}'
      }
    }

    typeWC({ TYPE }) {
      try {
        return JSON.stringify({
          type: 'constant',
          value: TYPE,
        });
      } catch {
        return '{"input":0}'
      }
    }

    multiplyWC({ INPUT1, INPUT2 }) {
      try {
        return JSON.stringify({
          type: 'multiply',
          left: JSON.parse(INPUT1),
          right: JSON.parse(INPUT2),
        });
      } catch {
        return '{"input":0}'
      }
    }

    divideWC({ INPUT1, INPUT2 }) {
      try {
        return JSON.stringify({
          type: 'divide',
          left: JSON.parse(INPUT1),
          right: JSON.parse(INPUT2),
        });
      } catch {
        return '{"input":0}'
      }
    }

    addWC({ INPUT1, INPUT2 }) {
      try {
        return JSON.stringify({
          type: 'add',
          left: JSON.parse(INPUT1),
          right: JSON.parse(INPUT2),
        });
      } catch {
        return '{"input":0}'
      }
    }

    subtractWC({ INPUT1, INPUT2 }) {
      try {
        return JSON.stringify({
          type: 'subtract',
          left: JSON.parse(INPUT1),
          right: JSON.parse(INPUT2),
        });
      } catch {
        return '{"input":0}'
      }
    }

    sqrtWC({ INPUT }) {
      try {
        return JSON.stringify({
          type: 'sqrt',
          left: JSON.parse(INPUT)
        });
      } catch {
        return '{"input":0}'
      }
    }
    
    expWC({ INPUT }) {
      try {
        return JSON.stringify({
          type: 'exp',
          left: JSON.parse(INPUT),
        });
      } catch {
        return '{"input":0}'
      }
    }

    powerWC({ INPUT1, INPUT2 }) {
      try {
        return JSON.stringify({
          type: 'power',
          left: JSON.parse(INPUT1),
          right: JSON.parse(INPUT2),
        });
      } catch {
        return '{"input":0}'
      }
    }

    inputWC({ INPUT }) {
      try {
        return JSON.stringify({
          type: 'input',
          value: Scratch.Cast.toNumber(INPUT),
        });
      } catch {
        return '{"input":0}'
      }
    }
  }

  Scratch.extensions.register(new WaveformsEXT());
})(Scratch)