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

client.on('interactionCreate', interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'matsignal') {
    interaction.reply(`
        <@1231895075580280903>, <@${interaction.user.id}> needs you. https://tenor.com/view/batman-mayank-mayank-signal-yang-gang-gif-18383790
        `);
    }
    if (interaction.commandName === 'signer') {
        interaction.reply(`
            @everyone, on peut signer ! https://tenor.com/view/rajini-signature-cute-gif-15784204
            `);
    }

})

client.login(process.env.TOKEN);
