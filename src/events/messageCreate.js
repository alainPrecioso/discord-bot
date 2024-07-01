const { chatMessage, chatMessageResponse } = require('../services/chat');
const { reversi, goat, hello } = require('../services/reactions');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;
        
        if(message.author.id === '1231895075580280903') {
            goat(message);
        }
        if (message.content.toLowerCase().includes('reversi')) {
            reversi(message);
        }
        const helloKeywords = ['bonjour', 'salut', 'hello', '\\bhi\\b'];
        if (helloKeywords.some(keyword => new RegExp(keyword, 'i').test(message.content))) {
            hello(message);
        }
        if (message.content.startsWith('<@1232224045424971788>')) {
            await chatMessage(message);
        }
        if (message.reference) {
            const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
            if (referencedMessage.author.id === '1232224045424971788') {
                await chatMessageResponse(message, referencedMessage);
            }
        }
    },
};