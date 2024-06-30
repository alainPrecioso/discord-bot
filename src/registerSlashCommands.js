require('dotenv').config();
const {REST, Routes, Options, ApplicationCommandOptionType} = require('discord.js');

const { readdirSync } = require('fs');
const path = require('path');


function fetchCommandFiles() {
    const commandFiles = readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
    return commandFiles.map(file => {
        const command = require(`./commands/${file}`);
        return {
            name: command.name,
            description: command.description,
            options: command.options || [],
        };
    });
}

async function registerSlashCommands(client) {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    const commands = fetchCommandFiles();

    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), // FTS ou ENI
            { body: commands }
        );

        console.log('Slash commands registered');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
}

module.exports = { registerSlashCommands };