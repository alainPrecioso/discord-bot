require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { loadCommands, loadEvents } = require('./client');
const { registerSlashCommands } = require('./registerSlashCommands');

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

client.once('ready', () => {
    console.log(`${client.user.username} is online.`);
    registerSlashCommands(client);
});

loadCommands(client);
loadEvents(client);

module.exports = client;