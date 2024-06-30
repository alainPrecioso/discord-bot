const { reversi } = require('../services/reactions');

module.exports = {
    name: 'messageUpdate',
    execute(oldMessage, newMessage) {
        if (oldMessage.author.bot) return;

        if (oldMessage.content.toLowerCase().includes('reversi')) return;
        if (newMessage.content.toLowerCase().includes('reversi')) {
            reversi(newMessage);
        }
    },
};