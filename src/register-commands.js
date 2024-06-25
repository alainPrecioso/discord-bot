require('dotenv').config();
const {REST, Routes, Options, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'matsignal',
        description: 'Shines the Mat-Signal'
    },
    {
        name: 'signer',
        description: 'On peut signer !'
    },
    {
        name: 'chat',
        description: 'Discuter avec le bot',
        options: [
            {
                name: 'message',
                description: 'Votre message au bot',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...')
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, process.env.GUILD_ID_ENI //FTS or ENI
            ),
            {body: commands}
        );

        console.log('Slash commands registered');
    } catch (e) {
        console.log(`Error: ${e}`)
    }
})();