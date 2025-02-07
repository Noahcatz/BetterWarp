// Name: URL Music
// ID: golbourlmusic
// Description: Play, pause, seek, set the volume and get data about songs from URL-s!
// By: golbo

class URLMusicExtension {
    constructor() {
        this.audio = null;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.isPlaying = false;
        this.isLoaded = false;
        this.loadStatus = 'false';
        this.loudness = 0;
        this.maxLoudness = 0;  // Track max loudness value
        this.volume = 1;  // Volume ranges from 0 to 1
        this.rafId = null;
    }

    getInfo() {
        return {
            id: 'urlMusic',
            name: 'URL Music',
            blocks: [
                {
                    opcode: 'loadSong',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'load song from url [URL]',
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://example.com/song.mp3'
                        }
                    }
                },
                {
                    opcode: 'startPlayingSong',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'start playing song'
                },
                {
                    opcode: 'pauseSong',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'pause song'
                },
                {
                    opcode: 'resumeSong',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'resume song'
                },
                {
                    opcode: 'getSongLength',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'song length'
                },
                {
                    opcode: 'getCurrentPosition',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'current position in song'
                },
                {
                    opcode: 'setPositionInSong',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set position in song to [SECONDS]',
                    arguments: {
                        SECONDS: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'isSongPlaying',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'song playing?'
                },
                {
                    opcode: 'isSongLoaded',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'song loaded?'
                },
                {
                    opcode: 'clearSong',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clear song'
                },
                {
                    opcode: 'getSongLoudness',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'song loudness',
                    disableMonitor: true
                },
                {
                    opcode: 'getMaxLoudness',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'song max loudness',
                    disableMonitor: true
                },
                {
                    opcode: 'mapPosition',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'map current song position from [START] to [END]',
                    arguments: {
                        START: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        END: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    },
                    disableMonitor: true
                },
                {
                    opcode: 'setVolume',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set volume to [VOLUME]',
                    arguments: {
                        VOLUME: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'changeVolume',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'change volume by [VOLUME]',
                    arguments: {
                        VOLUME: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'getCurrentVolume',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get current volume'
                }
            ]
        };
    }

    loadSong(args) {
        const url = args.URL;
        this.clearSong();

        this.audio = new Audio(url);
        this.audio.crossOrigin = 'anonymous';

        this.audio.oncanplaythrough = () => {
            this.loadStatus = 'true';
            this.setupAudioContext(); // Set up Web Audio API
            this.isLoaded = true;
            console.log('Song loaded successfully');
        };

        this.audio.onerror = (e) => {
            this.isLoaded = false;
            this.loadStatus = 'null';  // Loading failed
            console.error('Error loading audio:', e);
        };
    }

    startPlayingSong() {
        if (this.audio && this.isLoaded) {
            this.audio.volume = this.volume;  // Set initial volume
            this.audio.play();
            this.isPlaying = true;
            this.updateLoudness();
        }
    }

    pauseSong() {
        if (this.audio && this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            cancelAnimationFrame(this.rafId);
        }
    }

    resumeSong() {
        if (this.audio && !this.isPlaying && this.isLoaded) {
            this.audio.play();
            this.isPlaying = true;
            this.updateLoudness();
        }
    }

    getSongLength() {
        if (this.audio) {
            return this.audio.duration;
        }
        return 0;
    }

    getCurrentPosition() {
        if (this.audio) {
            return this.audio.currentTime;
        }
        return 0;
    }

    setPositionInSong(args) {
        const seconds = args.SECONDS;
        if (this.audio) {
            this.audio.currentTime = Math.min(Math.max(seconds, 0), this.audio.duration);
        }
    }

    isSongPlaying() {
        return this.isPlaying;
    }

    isSongLoaded() {
        return this.loadStatus;
    }

    clearSong() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
            this.isLoaded = false;
            this.isPlaying = false;
            this.loadStatus = 'false';
            cancelAnimationFrame(this.rafId);

            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
                this.analyser = null;
            }
        }
    }

    setupAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.sourceNode = this.audioContext.createMediaElementSource(this.audio);
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.analyser.fftSize = 256;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    updateLoudness() {
        if (this.analyser) {
            this.analyser.getByteFrequencyData(this.dataArray);

            let sum = 0;
            for (let i = 0; i < this.dataArray.length; i++) {
                sum += this.dataArray[i];
            }

            const avgVolume = sum / this.dataArray.length;
            this.loudness = avgVolume;  // Keep raw loudness

            // Track max loudness
            if (avgVolume > this.maxLoudness) {
                this.maxLoudness = avgVolume;
            }

            this.rafId = requestAnimationFrame(() => this.updateLoudness());
        }
    }

    getSongLoudness() {
        return this.loudness;
    }

    getMaxLoudness() {
        return this.maxLoudness;
    }

    mapPosition(args) {
        const start = args.START;
        const end = args.END;
        const position = this.getCurrentPosition();
        const length = this.getSongLength();

        if (length === 0) return 0;

        // Map current position to the given range
        const mapped = (position / length) * (end - start) + start;
        return mapped;
    }

    setVolume(args) {
        const volume = Math.min(Math.max(args.VOLUME / 100, 0), 1);
        this.volume = volume;
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }

    changeVolume(args) {
        const change = args.VOLUME / 100;
        this.volume = Math.min(Math.max(this.volume + change, 0), 1);
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }

    getCurrentVolume() {
        return this.volume * 100;
    }
}

Scratch.extensions.register(new URLMusicExtension());
