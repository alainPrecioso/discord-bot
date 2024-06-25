require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js')

const client = new Client ({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', c => {
    console.log(`${c.user.username} is online.`)
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    if (oldMessage.author.bot) {
        return;
    }
    if (oldMessage.content.toLowerCase().includes('reversi')) {
        return;
    }
    if (newMessage.content.toLowerCase().includes('reversi')) {
        newMessage.reply('https://media.discordapp.net/attachments/1231904097121210382/1252203165143531530/moi_tu_mparles_pas_dreversi.gif?ex=66755113&is=6673ff93&hm=bc7ba01ffe24b6998938f7032e523d5545d75e0217fb341b435e7105eecdb7d4&=')
    }
})

client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }
    if (message.content.toLowerCase().includes('reversi')) {
        message.reply('https://media.discordapp.net/attachments/1231904097121210382/1252203165143531530/moi_tu_mparles_pas_dreversi.gif?ex=66755113&is=6673ff93&hm=bc7ba01ffe24b6998938f7032e523d5545d75e0217fb341b435e7105eecdb7d4&=')
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'matsignal') {
        interaction.reply(`
            <@1231895075580280903>, <@${interaction.user.id}> needs you. https://tenor.com/view/batman-mayank-mayank-signal-yang-gang-gif-18383790
            `);
    }

    if (interaction.commandName === 'signer') {
        const url = `http://api.giphy.com/v1/gifs/search?q=signature-signing
        &api_key=${process.env.GIPHY_API_KEY}&limit=10`;
        const res = await fetch(url);
        const json = await res.json();
        const randomIndex = Math.floor(Math.random() * json.data.length);
        interaction.reply(`@everyone, on peut signer ! 
https://app.sowesign.com/login`);
        interaction.channel.send(json.data[randomIndex].url);
    }

})

client.login(process.env.TOKEN);
