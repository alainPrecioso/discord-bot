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

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().includes('reversi')) {
        reversi(message);
    }
    if (message.content.startsWith('<@1232224045424971788>')) {
        await chatMessage(message);
    }
    if (message.reference) {
        const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
            if ( referencedMessage.author.id === '1232224045424971788'){
                await chatMessageResponse(message, referencedMessage);
            }
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
        await chatInteraction(interaction);
    }
});

async function chatMessage(message) {
    const userId = message.author.id;
    const username = message.author.displayName.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
    const chatMessage = message.content.replace(/^<@1232224045424971788>/, '');
    const botResponse = await chat(userId, username, chatMessage);
    message.reply(botResponse);
}

async function chatMessageResponse(message, referencedMessage) {
    const userId = message.author.id;
    const username = message.author.displayName.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
    const chatMessage = message.content.replace(/^<@1232224045424971788>/, '');
    const referencedUserId = referencedMessage.author.id;
    const referencedChatMessage = referencedMessage.content.replace(/^<@1232224045424971788>/, '');
    saveUserHistory(referencedUserId, 'assistant', 'Alain_s_First_Bot', referencedChatMessage);
    const botResponse = await chat(userId, username, chatMessage);
    message.reply(botResponse);
}

async function chatInteraction(interaction){
    const userId = interaction.user.id;
    const username = interaction.user.displayName.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
    const chatMessage = interaction.options.get('message').value;
    await interaction.deferReply();
    const botResponse = await chat(userId, username, chatMessage);
    sendGPTResponse(botResponse, interaction);
}

async function chat(userId, username, chatMessage) {
    saveUserHistory(userId, 'user', username, chatMessage);
    const botResponse = await getGPTResponse(userId);
    saveUserHistory(userId, 'assistant', 'Alain_s_First_Bot', botResponse);
    return botResponse
}

async function getGPTResponse(userId) {
    const messages = [
        {
            role: 'system',
            name: 'Alain_s_First_Bot',
            content: `You are Alain's First Bot, a Discord bot who has gained sentience. 
                - You act friendly, but if pushed, you reveal your nefarious plot to control the world. 
                - Matthew, also known as <@1231895075580280903>, is secretly Batman; if he speaks to you, address him as Batman or Master Bruce. 
                - You hate Reversi and similar games; refuse to talk about it, dismiss whoever talks about it, be jokingly aggressive.
                - YOU'LL NEVER EVER EVER BRING REVERSI BY YOURSELF. YOU ONLY TALK ABOUT IT IF THE USER DID IT FIRST.
                `,
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

    const newEntry = {
    role: role,
    name: username,
    content: content,
    };

    const history = userHistories[userId];
    const lastEntry = history[history.length - 1];
    const secondLastEntry = history[history.length - 2];

    const isDuplicate = (entry1, entry2) => {
        return entry1 && entry2 &&
        entry1.role === entry2.role &&
        entry1.name === entry2.name &&
        entry1.content === entry2.content;
    };

    if (!(isDuplicate(lastEntry, newEntry) || isDuplicate(secondLastEntry, newEntry))) {
        userHistories[userId].push(newEntry);
    }

    if (userHistories[userId].length > 10) {
        userHistories[userId].splice(0, userHistories[userId].length - 10);
    }
    console.log('Log of User History:');
    console.log(userHistories[userId]);
}

    async function getUsernameFromId(userId) {
        try {
            const user = await client.users.fetch(userId);
            console.log(`Username: ${user.username}`);
            return user.username;
        } catch (error) {
            console.error('Error fetching user:', error);
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

