const fetch = require('node-fetch');
const gifs = [
    'https://giphy.com/gifs/CBSAllAccess-fight-good-the-oyGpShr0FL7Fmdu1CG',
    'https://tenor.com/view/waiver-sighn-signature-risky-gif-10443165282523180661',
    'https://tenor.com/view/breakup-peach-and-goma-angry-gif-24105232',
    'https://tenor.com/view/rajini-signature-cute-gif-15784204',
    'https://tenor.com/view/homer-simpsons-signature-gif-10450721',
    'https://tenor.com/view/donte-hall-taedatea-donth8tae-dear-diary-writing-gif-20012396',


]


module.exports = {
    name: 'signer',
    description: 'On peut signer !',
    async execute(interaction) {
        const apikey = process.env.GIF_API_KEY;
        const clientkey = "discord-bot";
        const lmt = 20;
        const search_term = "signature";
        const url = `https://tenor.googleapis.com/v2/search?q=${search_term}&key=${apikey}&client_key=${clientkey}&limit=${lmt}&media_filter=gif`;
       
        interaction.reply(`@everyone, on peut signer ! 
https://app.sowesign.com/login`);

        try {
            const res = await fetch(url);
            const json = await res.json();
            console.log(json)
            const filteredResults = json.results.filter(result => {
                const excludedKeywords = ['hancock', 'benjammins', 'dance', 'contract signature', 'contract official'];
                return !excludedKeywords.some(keyword => 
                    result.content_description.toLowerCase().includes(keyword)
                );
            });
            const randomIndex = Math.floor(Math.random() * filteredResults.length);
            const gifUrl = filteredResults[randomIndex].media_formats.gif.url;
            interaction.channel.send(gifUrl);
        } catch (error) {
            console.error('Error fetching data from Tenor:', error);
            interaction.reply('Sorry, something went wrong while fetching the GIF.');
        }
    },
};