(function (Scratch) {
  class regexCollection {
    constructor() {
      this.basic = [
        [
          'Valid password (Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:)',
          '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/',
        ],
        ['Email (Allows executing and testing)', '/^([a-z0-9_\\.-]+)@([\\da-z\\.-]+).([a-z\\.]{2,6})$/'],
      ];

      this.basicRegexConstructed = [];
      this.basic.forEach((e) => {
        this.basicRegexConstructed.push({
          text: e[0],
          value: e[1],
        });
      });
    }
    getInfo() {
      return {
        id: 'minidoggRegexCollection',
        name: 'Regex Collection',
        color1: '#00691c',
        color2: '#00611a',
        color3: '#014012',
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Blocks for using RegExp',
          },
          {
            opcode: 'exec',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Execute regex: [regex] on string: [string]',
            arguments: {
              regex: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '/(abc)/gi',
              },
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '__abc__',
              },
            },
          },
          {
            opcode: 'test',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Test regex: [regex] on string: [string]',
            arguments: {
              regex: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '/abc/gi',
              },
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '__abc__',
              },
            },
          },
          {
            opcode: 'getCaptureGroup',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Get index [index] in [array]',
            arguments: {
              index: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              array: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: `["a","b","c"]`,
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'RegExp Utilities',
          },
          {
            opcode: 'escapeString',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Escape string for regex: [string]',
            arguments: {
              string: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://www.google.com',
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Basic RegExp collection',
          },
          {
            opcode: 'basicRegex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get pre-built RegExp [regex]',
            arguments: {
              regex: {
                type: Scratch.ArgumentType.STRING,
                menu: 'BASIC_REGEX',
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Template RegExp Builders',
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'RegExp Building Blocks',
          },
          {
            opcode: 'join',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Join [a] [b] [c] [e] [f] [g]',
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '/',
              },
              b: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
              },
              c: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
              },
              d: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
              },
              e: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
              },
              f: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '/',
              },
              g: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'gi',
              },
            },
          },
          {
            opcode: 'readBase',
            blockType: Scratch.BlockType.REPORTER,
            text: '[base]',
            arguments: {
              base: {
                type: Scratch.ArgumentType.STRING,
                menu: 'BASE',
              },
            },
          },
        ],
        menus: {
          BASIC_REGEX: {
            acceptReporters: true,
            items: this.basicRegexConstructed,
          },
          BASE: {
            acceptReporters: true,
            items: [
              {
                text: 'Global flag',
                value: 'g',
              },
              {
                text: 'Insensitive flag',
                value: 'i',
              },
            ],
          },
        },
      };
    }

    exec(args) {
      args.regex = Scratch.Cast.toString(args.regex);
      args.string = Scratch.Cast.toString(args.string);
      var parts = /\/(.*)\/(.*)/.exec(args.regex);
      var restoredRegex = new RegExp(parts[1], parts[2]);

      let result = restoredRegex.exec(args.string);
      return typeof result == 'object' ? JSON.stringify(result) : [result];
    }
    test(args) {
      args.regex = Scratch.Cast.toString(args.regex);
      args.string = Scratch.Cast.toString(args.string);
      var parts = /\/(.*)\/(.*)/.exec(args.regex);
      var restoredRegex = new RegExp(parts[1], parts[2]);

      let result = restoredRegex.test(args.string);
      return result;
    }

    getCaptureGroup(args) {
      args.array = Scratch.Cast.toString(args.array);
      args.index = Scratch.Cast.toNumber(args.index);
      return args.array[0] == '[' ? JSON.parse(args.array)?.[args.index] : 'Invalid array!';
    }

    basicRegex(args) {
      args.regex = Scratch.Cast.toString(args.regex);
      return args.regex;
    }
    readBase(args) {
      args.base = Scratch.Cast.toString(args.base);
      return args.base;
    }

    escapeString(args) {
      args.string = Scratch.Cast.toString(args.string);
      let chars = args.string.split('');
      let result = '';
      chars.forEach((e) => {
        result += '.^$*+?()[{|'.includes(e.toLowerCase()) ? '\\' + e : e;
      });

      return result;
    }

    join(args) {
      let result = '';
      Object.keys(args).forEach((e) => {
        result += args[e] != undefined ? args[e] : '';
      });
      return result;
    }
  }

  Scratch.extensions.register(new regexCollection());
})(Scratch);
