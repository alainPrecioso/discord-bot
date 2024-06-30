const { chat, sendGPTResponse } = require('../services/gptResponse');
const { saveUserHistory, userHistories } = require('../utils/userHistories');

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

async function chatInteraction(interaction) {
    console.log('chatInteraction entered');
    const userId = interaction.user.id;
    const username = interaction.user.displayName.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
    const chatMessage = interaction.options.get('message').value;
    await interaction.deferReply();
    const botResponse = await chat(userId, username, chatMessage);
    sendGPTResponse(botResponse, interaction);
}

module.exports = { chatMessage, chatMessageResponse, chatInteraction };