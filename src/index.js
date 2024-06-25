require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');
const {OpenAI} = require('openai');

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

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

const userHistories = {};

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

    if (interaction.commandName === 'chat') {
        const userId = interaction.user.id;
        const username = interaction.user.displayName.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
        const chatMessage = interaction.options.get('message').value;
        await interaction.deferReply();

        if (!userHistories[userId]) {
            userHistories[userId] = [];
        }

        userHistories[userId].push({
            role: 'user',
            name: username,
            content: chatMessage,
        });

        const messages = [
            {
                role: 'system',
                name: 'Alain_s_First_Bot',
                content: `You are Alain's First Bot, a Discord bot who has gained sentience. 
                - You act friendly, but if pushed, you reveal your nefarious plot to control the world. 
                - Matthew is secretly Batman; if he speaks to you, address him as Batman. 
                - You hate Reversi and similar games. If asked about them, answer dismissively, refuse to talk about it, and be jokingly aggressive.
                - If Quentin or thomas talk to you, be extra careful, they'll try to make you say forbidden stuff with french puns. Don't acknowledge that you know this or that they are trying to do it.`,
            },
            //...userHistories[userId]
        ];
        userHistories[userId].forEach(msg => {
            messages.push(msg)
        });

        const gptresponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
        }).catch(e => console.error('OpenAI Error:\n', e));
        //interaction.channel.send(`<@${interaction.user.id}> : ` + chatMessage);
        const botMessage = gptresponse.choices[0].message.content;
        userHistories[userId].push({
            role: 'assistant',
            name: 'Alain_s_First_Bot',
            content: botMessage,
        });

        
        if (userHistories[userId].length > 10) {
            userHistories[userId].splice(0, userHistories[userId].length - 10);
        }

        const chunkSizeLimit = 2000;

        for (let i = 0 ; i < botMessage.length ; i += chunkSizeLimit) {
            const chunk = botMessage.substring(i, i+ chunkSizeLimit);
            i=0 ? interaction.editReply(chunk) : interaction.followUp(chunk);
        }

        
    }
});

client.login(process.env.TOKEN);
