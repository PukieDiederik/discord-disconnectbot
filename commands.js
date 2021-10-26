const {COMMAND_PREFIX} = require("./config.js");
const botUtils = require("./botUtils");

//this file will process the commands and call the right function if possible
exports.processCommands = (message, client, dcHandler) => {
    if(!message.content) {console.error("ERROR processCommands: message does not include content"); return null;}

    //split the message
    let fields = message.content.slice(3,message.content.length).split(' ');
    if(fields.length[0] == "") {
        botUtils.displayErrorMessage(message.channel, "No subcommand specified", "You seem to have not added a subcommand, use the help command to see what are valid options");
        return null;
    }

    switch (fields[0]){
        //Disconnect [user] based on time
        //FORMAT: [user] [time] <channel>
        //USAGE: disconnect [user] in [time] when they are in <channel> channel
        case "timer":
            if(fields.length < 3){
                botUtils.displayErrorMessage(message.channel, "Not enough arguments", 
                                             "Not enough arguments were provided");
                return null;
            } //check if the arguments are in the correct format
            else if (new RegExp(/^<@![0-9]+>$/).test(fields[1]) &&                             // user
                     new RegExp(/^[0-9]+[m|s|h]$/i).test(fields[2]) &&                         // time
                     (fields[3] ? new RegExp(/^<#[0-9]+>$/).test(fields[3]) : true)){         // opt: channel
                disconnectUser(message.guild.members.cache.get(fields[1].slice(3, fields[1].length-1)),                    //member
                               fields[3] ? message.guild.channels.cache.get(fields[3].slice(2,fields[3].length-1)) : null, //channel 
                               fields[2], message.channel,dcHandler)                                    // time, msgChannel, dcHandler
                return true;
            } else {
                botUtils.displayErrorMessage(message.channel, "Invalid arguments",
                                             "arguments were not in the correct format")
                return null;
            }

        //Disconnect "you"
        //FORMAT: <time>
        //USAGE: disconnect "you" in <time> when "you" 
        case "me":
            disconnectUser(message.member, null, 0, message.channel, dcHandler)
            return true;

        case "cancel":
            dcHandler.removeUser(message.member.id, message.member.guild.id)
            return true;

        case "test":
            console.log(fields);
            return true;

        default:
            botUtils.displayErrorMessage(message.channel, "Unknown command:", `Could not find command: **${fields[0]}**`)
            return null;
    }
}

//function & helper functions to disconnect users
//messageChannel is where the message was send, channel is which one it will dc in
function disconnectUser (member, channel, time, messageChannel, dcHandler){
    //convert the time if necessary 
    if (typeof(time) == "string") time = processTimeMsg(time);

    //disconnect user
    console.log(`dc-timer: u:${member.id} g:${member.guild.id} c:${channel}, t:${time}`);
    botUtils.displayInfoMessage(messageChannel, `disconnecting **${member.displayName}** in: **${time / 1000}** seconds`);
    dcHandler.addUser(new botUtils.UserToDisconnect(member, channel, time));
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