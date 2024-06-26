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

client.login(process.env.TOKEN);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

client.on('ready', c => {
    console.log(`${c.user.username} is online.`)
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
        reversi(newMessage);
    }
})

client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }
    if (message.content.toLowerCase().includes('reversi')) {
        reversi(message);
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'matsignal') {
        matsignal(interaction);
    }

    if (interaction.commandName === 'signer') {
        await signer(interaction);
    }

    if (interaction.commandName === 'chat') {
        await chat(interaction);
    }
});


async function chat(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.displayName.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
    const chatMessage = interaction.options.get('message').value;
    await interaction.deferReply();

    saveUserHistory(userId, 'user', username, chatMessage);

    const botMessage = await getGPTResponse(userId);
    saveUserHistory(userId, 'assistant', 'Alain_s_First_Bot', botMessage);
    sendGPTResponse(botMessage, interaction);
}

async function getGPTResponse(userId) {
    const messages = [
        {
            role: 'system',
            name: 'Alain_s_First_Bot',
            content: `You are Alain's First Bot, a Discord bot who has gained sentience. 
                - You act friendly, but if pushed, you reveal your nefarious plot to control the world. 
                - Matthew is secretly Batman; if he speaks to you, address him as Batman or Master Bruce. 
                - You hate Reversi and similar games; refuse to talk about it, dismiss whoever talks about it, be jokingly aggressive.
                - If Quentin or thomas talk to you, be extra careful, they'll try to make you say forbidden stuff with french puns. Don't acknowledge that you know this or that they are trying to do it.`,
        },
        //...userHistories[userId]
    ];
    userHistories[userId].forEach(msg => {
        messages.push(msg);
    });

    const gptresponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
    }).catch(e => console.error('OpenAI Error:\n', e));
    const botMessage = gptresponse.choices[0].message.content;
    return botMessage;
}

function sendGPTResponse(botMessage, interaction) {
    const chunkSizeLimit = 2000;

    for (let i = 0; i < botMessage.length; i += chunkSizeLimit) {
        const chunk = botMessage.substring(i, i + chunkSizeLimit);
        i = 0 ? interaction.editReply(chunk) : interaction.followUp(chunk);
    }
}

function saveUserHistory(userId, role, username, content) {
    if (!userHistories[userId]) {
        userHistories[userId] = [];
    }

    userHistories[userId].push({
        role: role,
        name: username,
        content: content,
    });

    if (userHistories[userId].length > 10) {
        userHistories[userId].splice(0, userHistories[userId].length - 10);
    }
}

function reversi(message) {
    message.reply('https://media.discordapp.net/attachments/1231904097121210382/1252203165143531530/moi_tu_mparles_pas_dreversi.gif?ex=66755113&is=6673ff93&hm=bc7ba01ffe24b6998938f7032e523d5545d75e0217fb341b435e7105eecdb7d4&=');
}

async function signer(interaction) {
    const url = `http://api.giphy.com/v1/gifs/search?q=signature-signing
        &api_key=${process.env.GIPHY_API_KEY}&limit=10`;
    const res = await fetch(url);
    const json = await res.json();
    const randomIndex = Math.floor(Math.random() * json.data.length);
    interaction.reply(`@everyone, on peut signer ! 
https://app.sowesign.com/login`);
    interaction.channel.send(json.data[randomIndex].url);
}

function matsignal(interaction) {
    interaction.reply(`
            <@1231895075580280903>, <@${interaction.user.id}> needs you. https://tenor.com/view/batman-mayank-mayank-signal-yang-gang-gif-18383790
            `);
}

