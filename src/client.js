const { readdirSync } = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

async function loadCommands(client) {
    const commandFiles = fetchFiles('commands', '.js');

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
}

async function loadEvents(client) {
    const eventFiles = fetchFiles('events', '.js');

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

async function registerSlashCommands(client) {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    const commands = fetchCommandFiles();

    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

        console.log('Slash commands registered');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
}

function fetchFiles(directory, extension) {
    const files = readdirSync(path.join(__dirname, directory)).filter(file => file.endsWith(extension));
    return files;
}

function fetchCommandFiles() {
    const commandFiles = fetchFiles('commands', '.js');
    return commandFiles.map(file => {
        const command = require(`./commands/${file}`);
        return {
            name: command.name,
            description: command.description,
            options: command.options || [],
        };
    });
}

module.exports = { loadCommands, loadEvents, registerSlashCommands };