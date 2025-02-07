class MemeExtension {
    constructor() {
        this.memeList = [];
    }

    getInfo() {
        return {
            id: 'memeExtension',
            name: 'Meme Generator',
            blocks: [
                {
                    opcode: 'getRandomMeme',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Get a random meme',
                    color: '#00f' // Setting block color to blue
                },
                {
                    opcode: 'getMemeUrl',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Get meme URL',
                    color: '#00f' // Setting block color to blue
                }
            ],
        };
    }

    getRandomMeme() {
        return fetch('https://api.imgflip.com/get_memes')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.data && data.data.memes.length > 0) {
                    const memes = data.data.memes;
                    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
                    this.memeList.push(randomMeme.url);
                    console.log('Fetched meme:', randomMeme.url);
                } else {
                    console.error('No memes found in the response:', data);
                }
            })
            .catch(error => {
                console.error('Error fetching meme:', error);
            });
    }

    getMemeUrl() {
        if (this.memeList.length === 0) {
            return 'No meme available';
        }
        return this.memeList[this.memeList.length - 1];
    }
}

// Register the MemeExtension with Scratch
Scratch.extensions.register(new MemeExtension());
