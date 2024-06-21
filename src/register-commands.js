require('dotenv').config();
const {REST, Routes} = require('discord.js');

const commands = [
    {
        name: 'matsignal',
        description: 'Shines the Mat-Signal'
    },
    {
        name: 'signer',
        description: 'On peut signer !'
    }
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...')
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, process.env.GUILD_ID_ENI
            ),
            {body: commands}
        );

        console.log('Slash commands registered');
    } catch (e) {
        console.log(`Error: ${e}`)
    }
})();