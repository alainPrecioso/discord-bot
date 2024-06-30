module.exports = {
    name: 'messageUpdate',
    execute(oldMessage, newMessage) {
        if (oldMessage.author.bot) return;

        if (oldMessage.content.toLowerCase().includes('reversi')) return;
        if (newMessage.content.toLowerCase().includes('reversi')) {
            const reversi = require('../commands/reversi');
            reversi.execute(newMessage);
        }
    },
};