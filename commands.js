const { MessageEmbed, Permissions } = require("discord.js");

const config = require("./config.js");
const botUtils = require("./botUtils");

//this file will process the commands and call the right function if possible
exports.processCommands = (message, client, dcHandler) => {
    if(!message.content) {console.error("ERROR processCommands: message does not include content"); return null;}
    if(!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
        botUtils.displayErrorMessage(message.channel, "Invalid Permissions", "You do not have admin")
        return null;
    }
    //split the message
    let fields = message.content.slice(3,message.content.length).split(' ');
    if(fields.length[0] == "") {
        botUtils.displayErrorMessage(message.channel, "No subcommand specified", "You seem to have not added a subcommand, use the help command to see what are valid options");
        return null;
    }

    switch (fields[0]){
        //Disconnect [user] based on time
        //FORMAT: [user] [time]
        //USAGE: disconnect [user] in [time]
        case "timer":
            if(fields.length != 3){
                botUtils.displayErrorMessage(message.channel, "Incorrect amount of arguments", 
                                             "Either not enough or too many arguments");
                return null;
            } //check if the arguments are in the correct format
            else if (botUtils.userRegex.test(fields[1]) &&    // user
                     botUtils.timeRegex.test(fields[2])){ // time
                disconnectUser(message.guild.members.cache.get(fields[1].slice(3, fields[1].length-1)), // member 
                               fields[2], message.channel,dcHandler)                                    // time, msgChannel, dcHandler
                return true;
            } else {
                botUtils.displayErrorMessage(message.channel, "Invalid arguments",
                                             "arguments were not in the correct format")
                return null;
            }

        //Disconnect user now
        //FORMAT: [user]
        //USAGE: disconnect [user]
        case "now":
            if(fields.length == 2){
                if(botUtils.userRegextest(fields[1])){
                    message.guild.members.cache.get(fields[1].slice(3, fields[1].length-1)).voice.disconnect();
                    return true;
                } else {
                    botUtils.displayErrorMessage(message.channel, "Invalid arguments",
                                                 "arguments were not in the correct format")
                    return null;
                }
            } else {
                botUtils.displayErrorMessage(message.channel, "Incorrect amount of arguments",
                                             "Either not enough or too many arguments");
                return null
            }

        //Cancel a user from disconnecting
        //FORMAT: [user]
        //USAGE: Cancel [user] from disconnecting by dc!timer
        case "cancel":
            if(fields.length == 2){
                if(botUtils.userRegex.test(fields[1])){
                    dcHandler.removeUser(fields[1].slice(3, fields[1].length-1), message.member.guild.id)
                    return true;
                } else {
                    botUtils.displayErrorMessage(message.channel, "Invalid arguments",
                                                 "arguments were not in the correct format")
                    return null;                   
                }
            } else {
                botUtils.displayErrorMessage(message.channel, "Incorrect amount of arguments",
                                             "Either not enough or too many arguments");
                return null
            }

        case "queue":
            if (fields.length == 1){
                const embed = new MessageEmbed()
                    .setColor(config.QUEUE_COLOR)
                    .setTitle("Disconnect Queue");
                for(const x of dcHandler.list(message.guild.id)){
                    embed.addField(x.member.displayName, `time ${x.time}`);
                }
                message.channel.send({embeds: [embed]});
                return true;
            } else {
                botUtils.displayErrorMessage(message.channel, "Too many arguments",
                                             "There are too many arguments, expected 0");
            }

        case "help":
            const commandEmbed = new MessageEmbed()
                .setColor(config.HELP_COLOR)
                .setTitle("Commands:")
                .addField("dc!**now** @user", "Disconnects the given user")
                .addField("dc!**timer** @user time", "Disconnects the user after a certain time")
                .addField("dc!**queue**", "Lists all people who will get disconnected in this server")
                .addField("dc!**cancel** @user", "Stops a certain user from disconnecting who was going to be disconnected by this bot");
            const helpEmbed = new MessageEmbed()
                .setColor(config.HELP_COLOR)
                .setTitle("Help:")
                .addField("Time", "Time is specified using the following format: `123h`. First come numbers and last comes `s`,`m`or`h` for seconds, minutes & hours respectively");
            message.channel.send({embeds: [commandEmbed, helpEmbed]});
            return true;

        // case "test":
        //     console.log(fields);
        //     return true;

        default:
            botUtils.displayErrorMessage(message.channel, "Unknown command:", `Could not find command: **${fields[0]}**`)
            return null;
    }
}

//function & helper functions to disconnect users
function disconnectUser (member, time, messageChannel, dcHandler){
    //convert the time if necessary 
    if (typeof(time) == "string") time = processTimeMsg(time);

    //disconnect user
    console.log(`dc-timer: u:${member.id} g:${member.guild.id} t:${time}`);
    botUtils.displayInfoMessage(messageChannel, `disconnecting **${member.displayName}** in: **${time / 1000}** seconds`);
    dcHandler.addUser(new botUtils.UserToDisconnect(member, time, dcHandler));
}

function processTimeMsg (msg){
    msg.toLowerCase(); //make sure the message is in lowercase
    let timeIdentifier = msg[msg.length-1];
    switch(timeIdentifier){
        case "s":
            multiplier = 1000;
            break;
        case "m":
            multiplier = 60 * 1000;
            break;
        case "h":
            multiplier = 60 * 60 * 1000;
    }
    let timeAmount = msg.slice(0,msg.length-1);
    return multiplier * timeAmount;
}