const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

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
[SoWeSign](https://app.sowesign.com/login)`);

        try {
            const res = await fetch(url);
            const json = await res.json();
            const filteredResults = json.results.filter(result => {
                const excludedKeywords = ['hancock', 'benjammins', 'dance', 'contract signature', 'contract official'];
                return !excludedKeywords.some(keyword => 
                    result.content_description.toLowerCase().includes(keyword)
                );
            });
            const randomIndex = Math.floor(Math.random() * filteredResults.length);
            const gifUrl = filteredResults[randomIndex].media_formats.gif.url;

            const embed = new EmbedBuilder()
                .setColor('#FF9900')
                //.setTitle('Signez ici :')
                //.setDescription(`[SoWeSign](https://app.sowesign.com/login)`)
                .setImage(gifUrl)
                .setFooter({text:'Via Tenor - Check out more GIFs on https://tenor.com', iconURL:'https://tenor.com/favicon.ico'})
                ;

            interaction.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching data from Tenor:', error);
        }
    },
};