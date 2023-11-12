const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const token = 'MTE2OTAyNDQyMzE2NTE3Mzc4MQ.GNLFKs.ay-9oTzRvWzm0LtuIpZaoxzVhMZx7gWxB2W9U4';
const clientId = '1169024423165173781';
const guildId = '1168706785310408704';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get server statistics')
        .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(token);

async function getServerStatistics() {
    try {
        const { stdout, stderr } = await exec(`
            hostnamectl &&
            echo "CPU Usage: $(top -n 1 -b | grep '%Cpu' | awk '{print $2 + $4}')%" &&
            echo "Memory Usage: $(free -h | awk '/Mem:/{print $3 " used / " $2 " total"}')" &&
            echo "Disk Space: $(df -h | awk '$NF == "/" {print $3 " used / " $2 " total"}')" &&
            ifconfig
        `);

        return stdout;
    } catch (error) {
        console.error(error);
        return 'Failed to fetch server statistics.';
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'stats') {
        // Collect server statistics and send as an embed message
        const serverStats = await getServerStatistics();

        const embed = new EmbedBuilder()
            .setTitle('Server Statistics')
            .setDescription('Here are the server statistics:');

        // Split the long message into multiple fields
        const chunks = serverStats.match(/[\s\S]{1,1000}/g) || [];
        chunks.forEach((chunk, index) => {
            embed.addFields({ name: `Statistics Part ${index + 1}`, value: `\`\`\`${chunk}\`\`\``});
        });


        interaction.reply({ embeds: [embed] });
    }
});

client.login(token);