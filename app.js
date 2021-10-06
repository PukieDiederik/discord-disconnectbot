require("dotenv").config();

const { Client, Intents} = require("discord.js");
const config = require("./config.js");
const commands = require("./commands.js")

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});


client.once("ready", () => {
    console.log("app has started");
});

client.on("messageCreate", (msg) => {
    if(msg.content.startsWith(config.COMMAND_PREFIX)){
        console.log("Found possible command, start processing");
        commands.processCommands(msg, client);
    }
})
        
client.login(process.env.BOT_TOKEN);