require("dotenv").config();

const { Client, Intents} = require("discord.js");
const config = require("./config.js");
const commands = require("./commands.js")
const botUtils = require("./botUtils.js")

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const dcHandler = new botUtils.DisconnectQueueHandler();

client.once("ready", () => {
    console.log("app has started");
});

client.on("messageCreate", (msg) => {
    if(msg.content.startsWith(config.COMMAND_PREFIX)){
        commands.processCommands(msg, client, dcHandler);
    }
})
        
client.login(process.env.BOT_TOKEN);