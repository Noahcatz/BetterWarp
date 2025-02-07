// Name: Live Keyboard Input
// ID: golbolivekeyboardinput
// Description: Get keyboard input from the user, as if they were typing in a textbox!
// By: Golbo

class KeyboardInputExtension {
    constructor() {
        this.isCapturing = false;
        this.textInput = '';
        this.captureCallback = null;

        // Set up keyboard event listeners
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    getInfo() {
        return {
            id: 'keyboardInput',
            name: 'Keyboard Input',
            blocks: [
                {
                    opcode: 'startCapturingInput',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'start capturing input'
                },
                {
                    opcode: 'endCapturingInput',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'end capturing input'
                },
                {
                    opcode: 'captureInputUntilEnter',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'capture input until enter'
                },
                {
                    opcode: 'getTextInput',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'text input'
                },
                {
                    opcode: 'clearTextInput',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clear text input'
                },
                {
                    opcode: 'setTextInput',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set text input to [TEXT]',
                    arguments: {
                        TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'new text'
                        }
                    }
                },
                {
                    opcode: 'isCapturingInput',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Capturing input?',
                    disableMonitor: true
                }
            ]
        };
    }

    // Start capturing input
    startCapturingInput() {
        this.isCapturing = true;
    }

    // Stop capturing input
    endCapturingInput() {
        this.isCapturing = false;
    }

    // Capture input until the enter key is pressed
    captureInputUntilEnter() {
        this.isCapturing = true;
        this.captureCallback = (key) => {
            if (key === 'Enter') {
                this.isCapturing = false;
            }
        };
    }

    // Reporter block to return the captured text
    getTextInput() {
        return this.textInput;
    }

    // Clear the current text input
    clearTextInput() {
        this.textInput = '';
    }

    // Set the text input manually
    setTextInput(args) {
        this.textInput = args.TEXT;
    }

    // Boolean block to check if input is being captured
    isCapturingInput() {
        return this.isCapturing;
    }

    // Handle keydown events
    handleKeyDown(event) {
        if (this.isCapturing) {
            const key = event.key;

            if (key === 'Backspace') {
                // Handle deleting whole words when holding Ctrl
                if (event.ctrlKey) {
                    this.textInput = this.textInput.replace(/\s*\S+$/, ''); // Deletes the last word
                } else {
                    this.textInput = this.textInput.slice(0, -1); // Deletes last character
                }
            } else if (key === 'Enter') {
                // End capturing if we're using "capture input until enter"
                if (this.captureCallback) {
                    this.captureCallback('Enter');
                    this.captureCallback = null;
                }
            } else if (key.length === 1) {
                // Add the pressed key to the input (handles key repetition)
                this.textInput += key;
            }
        }
    }
}

Scratch.extensions.register(new KeyboardInputExtension());
