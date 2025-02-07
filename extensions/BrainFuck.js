(function (Scratch) {
  function bf(code, data, input) {
    let result = '';
    let memory = data.memory;
    let loc = data.memoryPointer;
    let throwErr = (err, i) => {
      return [
        'Error: ' + err + ` (Char:${i}, MemoryLocation:${loc})`,
        {
          memoryPointer: loc,
          memory: memory,
        },
      ];
    };
    for (let i = 0; i < code.length; i++) {
      switch (code[i]) {
        case '+':
          memory[loc]++;
          break;
        case '-':
          memory[loc]--;
          break;
        case '>':
          loc++;
          if (memory[loc] == undefined) memory.push(0);
          break;
        case '<':
          loc--;
          if (memory[loc] == undefined) {
            loc++;
            return throwErr(`Memory location can't go negative!`, i);
          }
          break;
        case '[':
          if (memory[loc] == 0) {
            while (true) {
              if (code.length < i || code[i] == ']') break;
              i++;
            }
          }
          break;
        case ']':
          if (memory[loc] != 0) {
            while (true) {
              if (code.length < i || code[i] == '[') break;
              i--;
            }
          }
          break;
        case '.':
          result += String.fromCharCode(memory[loc]);
          break;
        case ' ':
          break;
        case ',':
          memory[loc] = input.charCodeAt(0);
          break;
        default:
          return throwErr(`Invalid command: ${code[i]}`, i);
      }
    }
    return [
      result,
      {
        memoryPointer: loc,
        memory: memory,
      },
    ];
  }

  //now the extension
  class BrainFuckInterperter {
    constructor() {
      this.contexts = {
        /*
                main:{
                    memoryPointer:0,
                    memory:[0]
                }
            */
      };
      this.allowErrors = false;
    }
    getInfo() {
      return {
        id: 'minidoggBrainfuckinterperter',
        name: 'BrainFuck Intepreter',
        color1: '#c200d4',
        color2: '#a802b8',
        color3: '#56005e',

        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Context Management',
          },
          {
            opcode: 'createContext',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Create/Reset context named: [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main',
              },
            },
          },
          {
            opcode: 'getContext',
            blockType: Scratch.BlockType.REPORTER,
            text: `Get data from context named: [name]`,
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main',
              },
            },
          },
          {
            opcode: 'deleteContext',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Delete context named: [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main',
              },
            },
          },
          {
            opcode: 'deleteAllContext',
            blockType: Scratch.BlockType.COMMAND,
            text: `Delete all contexts`,
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Code Execution',
          },
          {
            opcode: 'runCodeReporter',
            blockType: Scratch.BlockType.REPORTER,
            text: 'In context: [name] run: [code] with input byte: [input]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main',
              },
              code: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '>>+',
              },
              input: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'h',
              },
            },
          },
          {
            opcode: 'runCodeCommand',
            blockType: Scratch.BlockType.COMMAND,
            text: 'In context: [name] run: [code] with input byte: [input]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'main',
              },
              code: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '>>+',
              },
              input: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'h',
              },
            },
          },

          {
            opcode: 'allowErrors',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set allow errors: [value]',
            arguments: {
              value: {
                type: Scratch.ArgumentType.BOOLEAN,
                defaultValue: true,
              },
              // value: {
              //     type: Scratch.ArgumentType.STRING,
              //     menu: 'BOOL_MENU'
              //   },
            },
          },
        ],
        // menus: {
        //     BOOL_MENU: {
        //       acceptReporters: true,
        //       items: [
        //         {
        //           text: 'true',
        //           value: true
        //         },
        //         {
        //           text: 'false',
        //           value: false
        //         }
        //       ]
        //     }
        // }
      };
    }

    allowErrors(args) {
      args.value = Scratch.Cast.toBoolean(args.value);
      this.allowErrors = args.value;
    }

    runCodeReporter(args) {
      args.code = Scratch.Cast.toString(args.code);
      args.name = Scratch.Cast.toString(args.name);
      args.input = Scratch.Cast.toString(args.input);
      let result = bf(args.code, this.contexts[args.name], args.input);
      if (result[0].startsWith('Error:') && this.allowErrors == false) {
        console.warn(result);
      } else {
        this.contexts[args.name] = result[1];
      }
      return result[0];
    }
    runCodeCommand(args) {
      // reduce boiler plate by just calling the preexisting function
      this.runCodeReporter(args);
    }

    createContext(args) {
      args.name = Scratch.Cast.toString(args.name);
      this.contexts[args.name] = {
        memoryPointer: 0,
        memory: [0],
      };
    }
    getContext(args) {
      args.name = Scratch.Cast.toString(args.name);
      return JSON.stringify(this.contexts[args.name]);
    }

    deleteContext(args) {
      args.name = Scratch.Cast.toString(args.name);
      delete this.contexts[args.name];
    }
    deleteAllContext(args) {
      this.contexts = {};
    }
  }

  Scratch.extensions.register(new BrainFuckInterperter());
})(Scratch);
