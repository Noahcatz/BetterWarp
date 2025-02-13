(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "docs",
                "name": "Documents (Risky)",
                "color1": "#cb9557",
                "color2": "#bb782a",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "docwrite",
        blockType: Scratch.BlockType.COMMAND,
        text: "write [text] into document",
        arguments: {
            "text": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, foo bar.',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["docwrite"] = async (args, util) => {
        document.write(args.text);;
    };

    blocks.push({
        opcode: "doc",
        blockType: Scratch.BlockType.REPORTER,
        text: "html document",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["doc"] = async (args, util) => {
        return document.documentElement.outerHTML
    };

    blocks.push({
        opcode: "body",
        blockType: Scratch.BlockType.REPORTER,
        text: "html body",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["body"] = async (args, util) => {
        return document.body.innerHTML
    };

    blocks.push({
        opcode: "gettitle",
        blockType: Scratch.BlockType.REPORTER,
        text: "document title",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["gettitle"] = async (args, util) => {
        return document.title
    };

    blocks.push({
        opcode: "changetitle",
        blockType: Scratch.BlockType.COMMAND,
        text: "Set document title to [text]",
        arguments: {
            "text": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Scratch',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["changetitle"] = async (args, util) => {
        return document.title = args.text;
    };

    blocks.push({
        opcode: "elemcreate",
        blockType: Scratch.BlockType.COMMAND,
        text: "Create Element called [text]",
        arguments: {
            "text": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Scratch',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["elemcreate"] = async (args, util) => {
        return document.createElement(args.text);
    };

    Scratch.extensions.register(new Extension());
})(Scratch);