module.exports = {
    name: 'matsignal',
    description: 'Shines the Mat-signal!',
    async execute(interaction) {
        interaction.reply(`
            <@1231895075580280903>, <@${interaction.user.id}> needs you. https://tenor.com/view/batman-mayank-mayank-signal-yang-gang-gif-18383790
        `);
    },
};