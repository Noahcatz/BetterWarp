(function(Scratch) {
  'use strict';
  
  let tokenRegex = {
    float: /[-+]?\d+\.\d+/g,
    number: /\d+/g,
    boolean: /^(true|false)$/,
    "null": /null/g,
    "undefined": /undefined/g,
    string: /^(['"`]).*\1$/,
    unexpected: /.+/g
  }
  
  let tokenSyntax = {
    type: 't',
    value: 'v'
  };
  
  let typesJSON = {
    string: "String",
    number: "Number",
    float: "Float",
    boolean: "Boolean",
    "null": "Null",
    "undefined": "Undefined",
    unexpected: "Unexpected"
  }
  
  class TurboAST {
    getInfo() {
      return {
        id: 'lemonTURBOAST',
        name: 'TurboAST',
        blocks: [
          {
            opcode: 'setTypeOfValue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set name of type [TYPE] to [NAME]',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "valueTypes"
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'String'
              }
            }
          },
          {
            opcode: 'setTokenSyntax',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set syntax of tokens to [SYNTAX]',
            arguments: {
              SYNTAX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{"value": "v", "type": "t"}'
              }
            }
          },
          {
            opcode: 'createToken',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create token named [NAME] with the value of [VALUE]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my token'
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'my_value'
              }
            }
          },
          {
            opcode: 'tokenize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'tokenize [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '"Hello" "World!" 123 12.3 true null undefined'
              }
            }
          },
        ],
        menus: {
          "valueTypes": {
            items: ["String", "Number", "Boolean", "Float", "Null", "Undefined", "Unexpected"]
          }
        }
      };
    }
    mergeStringLiterals(arr) { //AI helps me with regex
      const result = [];
      const openingRegex = /^['"`]/;
      const closingRegex = /['"`]$/;
      let currentString = null;
      let quoteType = null;
  
      arr.forEach((item) => {
          if (currentString) {
              currentString += " " + item;
              if (new RegExp(`${quoteType}$`).test(item)) {
                  result.push(currentString);
                  currentString = null;
                  quoteType = null;
              }
          } else if (openingRegex.test(item)) {
              const openingQuote = item[0];
              if (item[item.length - 1] === openingQuote) {
                  result.push(item);
              } else {
                  currentString = item;
                  quoteType = openingQuote;
              }
          } else {
              result.push(item);
          }
      });
  
      if (currentString !== null) {
          result.push(currentString);
      }
  
      return result;
      }
    setTypeOfValue(args) {
      const type = Scratch.Cast.toString(args.TYPE);
      const name = Scratch.Cast.toString(args.NAME);
      
      typesJSON[type.toLowerCase()] = name;
    }
    setTokenSyntax(args) {
      tokenSyntax = JSON.parse(args.SYNTAX);
    }
    createToken(args) {
    const NAME = Scratch.Cast.toString(args.NAME);
    const VALUE = Scratch.Cast.toString(args.VALUE);
  
    if(!(NAME in tokenRegex)) {
      tokenRegex = {
        [NAME]: new RegExp(VALUE, 'g'),
        ...tokenRegex
      }
    } else {
      tokenRegex[NAME] = new RegExp(VALUE, 'g');
    }
    if(!(NAME in typesJSON)) {
      typesJSON[NAME] = NAME;
    }
  }
    tokenize(args) {
      let code = this.mergeStringLiterals(Scratch.Cast.toString(args.CODE).split(" "));
      let tokens = [];
      code.forEach((val, index) => {
        for(let type in tokenRegex) {
          const regex = tokenRegex[type];
          if(val.match(regex)) {
            let token = Object.assign({}, tokenSyntax);
            token.type = typesJSON[type] || type;
            switch (type) {
              case 'number':
              case 'float':
                token.value = Scratch.Cast.toNumber(val)
                break;
              
              case 'boolean':
                token.value = Scratch.Cast.toBoolean(val)
                break;
              
              case 'null':
                token.value = null;
                break;
              
              default:
                token.value = val;
            }
            tokens.push(token);
            break;
          }
        }
      })
      return JSON.stringify(tokens)
    }
  }

Scratch.extensions.register(new TurboAST());})(Scratch)