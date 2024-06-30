const fetch = require('node-fetch');

module.exports = {
    name: 'signer',
    async execute(interaction) {
        const url = `http://api.giphy.com/v1/gifs/search?q=signature-signing&api_key=${process.env.GIPHY_API_KEY}&limit=10`;
        const res = await fetch(url);
        const json = await res.json();
        const randomIndex = Math.floor(Math.random() * json.data.length);

        interaction.reply(`@everyone, on peut signer ! 
https://app.sowesign.com/login`);
        interaction.channel.send(json.data[randomIndex].url);
    },
};