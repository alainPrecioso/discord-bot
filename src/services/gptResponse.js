const { OpenAI } = require('openai');
const { saveUserHistory, userHistories } = require('../utils/userHistories');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

async function chat(userId, username, chatMessage) {
    saveUserHistory(userId, 'user', username, chatMessage);
    const botResponse = await getGPTResponse(userId);
    saveUserHistory(userId, 'assistant', 'Alain_s_First_Bot', botResponse);
    return botResponse;
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
        i === 0 ? interaction.editReply(chunk) : interaction.followUp(chunk);
    }
}

module.exports = { chat, getGPTResponse, sendGPTResponse };