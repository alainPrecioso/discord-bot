require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { loadCommands, loadEvents, registerSlashCommands } = require('./client');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.commands = new Map();

client.login(process.env.TOKEN);

client.once('ready', async () => {
    console.log(`${client.user.username} is online.`);
    await loadCommands(client);
    await loadEvents(client);
    await registerSlashCommands(client);
});

module.exports = client;