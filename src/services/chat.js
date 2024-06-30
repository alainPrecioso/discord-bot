const { chat } = require('./gptResponse');
const { saveUserHistory, userHistories } = require('../utils/userHistories');

async function chatMessage(message) {
    const userId = message.author.id;
    const username = message.author.displayName.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
    const messageContent = message.content.replace(/^<@1232224045424971788>/, '');
    await chat(userId, username, messageContent, message);
}

async function chatMessageResponse(message, referencedMessage) {
    const userId = message.author.id;
    const username = message.author.displayName.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');
    const messageContent = message.content.replace(/^<@1232224045424971788>/, '');
    const referencedUserId = referencedMessage.author.id;
    const referencedMessageContent = referencedMessage.content.replace(/^<@1232224045424971788>/, '');
    saveUserHistory(referencedUserId, 'assistant', 'Alain_s_First_Bot', referencedMessageContent);
    await chat(userId, username, messageContent, message);
}

module.exports = { chatMessage, chatMessageResponse };