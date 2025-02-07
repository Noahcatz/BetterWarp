const menuIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDEyOCAxMjgiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGZpbGw6ICNlNjNjZDg7CiAgICAgIH0KCiAgICAgIC5jbHMtMSwgLmNscy0yLCAuY2xzLTMsIC5jbHMtNCwgLmNscy01LCAuY2xzLTYsIC5jbHMtNywgLmNscy04LCAuY2xzLTkgewogICAgICAgIHN0cm9rZS13aWR0aDogMHB4OwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNlZDVjZTE7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsbDogI2ZmN2FlMjsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiAjOGE0MmZmOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6ICNkODNiZmY7CiAgICAgIH0KCiAgICAgIC5jbHMtNiB7CiAgICAgICAgZmlsbDogI2IzNDJmZjsKICAgICAgfQoKICAgICAgLmNscy0xMCB7CiAgICAgICAgZmlsbDogIzZkNmU3MTsKICAgICAgICBzdHJva2U6ICM0MTQwNDI7CiAgICAgICAgc3Ryb2tlLW1pdGVybGltaXQ6IDEwOwogICAgICAgIHN0cm9rZS13aWR0aDogNnB4OwogICAgICB9CgogICAgICAuY2xzLTcgewogICAgICAgIGZpbGw6ICNhMTM2ZTM7CiAgICAgIH0KCiAgICAgIC5jbHMtOCB7CiAgICAgICAgZmlsbDogI2U2NDBlNjsKICAgICAgfQoKICAgICAgLmNscy05IHsKICAgICAgICBmaWxsOiAjZDI1NWZmOwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8cGF0aCBjbGFzcz0iY2xzLTEwIiBkPSJNNzguNTIsMTAwLjg5bC0xNi0uNjJjLTExLjQ3LS40NC0yMi44NywxLjU2LTMzLjQ3LDUuODdsLTEyLjc4LDUuMi03LjkyLTEyLjcsMTAuMjktOS4xOWM4LjUzLTcuNjIsMTUuMzQtMTYuOTksMTkuOTktMjcuNDhsNi40OC0xNC42NCwzMy40MSw1My41NloiLz4KICA8cmVjdCBjbGFzcz0iY2xzLTMiIHg9IjY0LjI5IiB5PSI0Ny4xMSIgd2lkdGg9IjEzLjczIiBoZWlnaHQ9IjEzLjczIi8+CiAgPHJlY3QgY2xhc3M9ImNscy00IiB4PSI3OS4wMiIgeT0iMzIuMzgiIHdpZHRoPSIxMy43MyIgaGVpZ2h0PSIxMy43MyIvPgogIDxyZWN0IGNsYXNzPSJjbHMtNSIgeD0iOTMuNzUiIHk9IjMyLjM4IiB3aWR0aD0iMTMuNzMiIGhlaWdodD0iMTMuNzMiLz4KICA8cmVjdCBjbGFzcz0iY2xzLTYiIHg9IjEwOC40NyIgeT0iMzIuMzgiIHdpZHRoPSIxMy43MyIgaGVpZ2h0PSIxMy43MyIvPgogIDxyZWN0IGNsYXNzPSJjbHMtNyIgeD0iNzkuMDIiIHk9IjE3LjY2IiB3aWR0aD0iMTMuNzMiIGhlaWdodD0iMTMuNzMiLz4KICA8cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjkzLjc1IiB5PSIxNy42NiIgd2lkdGg9IjEzLjczIiBoZWlnaHQ9IjEzLjczIi8+CiAgPHJlY3QgY2xhc3M9ImNscy04IiB4PSIxMDguNDciIHk9IjE3LjY2IiB3aWR0aD0iMTMuNzMiIGhlaWdodD0iMTMuNzMiLz4KICA8cmVjdCBjbGFzcz0iY2xzLTkiIHg9IjY0LjI5IiB5PSIzMi4zOCIgd2lkdGg9IjEzLjczIiBoZWlnaHQ9IjEzLjczIi8+CiAgPHJlY3QgY2xhc3M9ImNscy0yIiB4PSI2NC4yOSIgeT0iMTcuNjYiIHdpZHRoPSIxMy43MyIgaGVpZ2h0PSIxMy43MyIvPgo8L3N2Zz4='


let language = `en-US`;
let volume = 1;
let rate = 1;
let pitch = 1;

class speechSynthesisAPI {
    getInfo() {
        return {
            id: 'speechSynthesisAPI',
            name: 'speechSynthesis API',
            menuIconURI: menuIcon,
            color1: '#D226EA',
            color2: '#870ECC',
            color3: '#590F49',
            blocks: [
                {
                    opcode: 'speechToText',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Speak [WORD]',
                    arguments: {
                        WORD: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Hello, world!'
                        }
                    }
                },
                {
                    opcode: 'speechToTextWait',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Speak [WORD] and wait',
                    arguments: {
                        WORD: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Hello, world!'
                        }
                    }
                },
                {
                    opcode: 'setPitch',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Set pitch to [VALUE]',
                    arguments: {
                        VALUE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'setRate',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Set rate to [VALUE]',
                    arguments: {
                        VALUE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'setVolume',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Set volume to [VALUE]',
                    arguments: {
                        VALUE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: '100'
                        }
                    }
                },
                {
                    opcode: 'getPitch',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'pitch'
                },
                {
                    opcode: 'getRate',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'rate'
                },
                {
                    opcode: 'getVolume',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'volume'
                },
            ]
        };
    }

    setPitch(args) {
        pitch = args.VALUE;
    }
    setRate(args) {
        rate = args.VALUE;
    }
    setVolume(args) {
        volume = args.VALUE / 100;
    }

    getPitch() {
        return (pitch);
    }
    getRate() {
        return (rate);
    }
    getVolume() {
        return (volume);
    }

    speechToText(args) {
        if ('speechSynthesis' in window) {
            // IDK how to have multiple speeches at the same time
            // So it just cancels any active ones
            window.speechSynthesis.cancel();

            let utterance = new SpeechSynthesisUtterance(args.WORD);

            utterance.lang = language;
            utterance.volume = volume;
            utterance.rate = rate;
            utterance.pitch = pitch;

            utterance.onend = () => {
                resolve();
            };

            utterance.onerror = (event) => {
                reject(event.error);
            };

            window.speechSynthesis.speak(utterance);
        } else {
            console.log('SpeechSynthesis API is not supported in this browser.');
            reject(new Error('SpeechSynthesis API is not supported in this browser.'));
        }
    }
    speechToTextWait(args) {
        return new Promise((resolve, reject) => {
            if ('speechSynthesis' in window) {
                // IDK how to have multiple speeches at the same time
                // So it just cancels any active ones
                window.speechSynthesis.cancel();

                let utterance = new SpeechSynthesisUtterance(args.WORD);

                utterance.lang = language;
                utterance.volume = volume;
                utterance.rate = rate;
                utterance.pitch = pitch;

                utterance.onend = () => {
                    resolve();
                };

                utterance.onerror = (event) => {
                    reject(event.error);
                };

                window.speechSynthesis.speak(utterance);
            } else {
                console.log('SpeechSynthesis API is not supported in this browser.');
                reject(new Error('SpeechSynthesis API is not supported in this browser.'));
            }
        });
    }
}

Scratch.extensions.register(new speechSynthesisAPI());
