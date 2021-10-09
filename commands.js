const {COMMAND_PREFIX} = require("./config.js");
const botUtils = require("./botUtils");

//this file will process the commands and call the right function if possible
exports.processCommands = (message, client) => {
    if(!message.content) {console.error("ERROR processCommands: message does not include content"); return null;}

    //split the message
    let fields = message.content.slice(3,message.content.length).split(' ');
    if(fields.length[0] == "") {
        botUtils.displayErrorMessage(message.channel, "No subcommand specified", "You seem to have not added a subcommand, use the help command to see what are valid options");
        return null;
    }

    if(fields[0] == "me"){
        disconnectUser(message.channel, message.member, 0)
        return true;
    } 
    
    else if (fields[0] == "timer"){
        if (fields.length < 2) {
            botUtils.displayErrorMessage(message.channel, "Not enough args", "Not enough arguments were given, make sure you added all the required arguments");
            return null;
        //check if a valid time has been given
        } else if (new RegExp(/^[0-9]+[m|s|h]$/i).test(fields[1])){
            disconnectUser(message.channel, message.member, fields[1]);
            return true;
        }
    }
}

//function & helper functions to disconnect users
function disconnectUser (channel, member, time){
    //convert the time if necessary 
    if (typeof(time) == "string") time = processTimeMsg(time);

    //disconnect user
    console.log("disconnecting user: " + member.displayName);
    botUtils.displayInfoMessage(channel, `disconneting **${member.displayName}** in: **${time / 1000}** seconds`);
    setTimeout(() => member.voice.disconnect(), time);
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