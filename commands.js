const {COMMAND_PREFIX} = require("./config.js");
const botUtils = require("./botUtils");

//this file will process the commands and call the right function if possible
exports.processCommands = (message, client) => {
    if(!message.content) {console.error("ERROR processCommands: message does not include content"); return null;}

    //split the message
    let fields = message.content.slice(3,message.content.length).split(' ');
    if(!fields.length[0]) {
        botUtils.displayErrorMessage(message.channel, "No subcommand specified", "You seem to have not added a subcommand, use the help command to see what are valid options");
        return null;
    }

    if(fields[0] == "me"){
        console.log("possibly disconnecting user");
        message.member.voice.disconnect();
        return true;
    } else if (fields[0] == "timer"){
        if (fields.length < 2) {
            botUtils.displayErrorMessage(message.channel, "Not enough args", "Not enough arguments were given, make sure you added all the required arguments");
            return null;
        //check if a valid time has been given
        } else if (new RegExp(/^[0-9]+[m|s|h]$/i).test(fields[1])){
            fields[1].toLowerCase();
            //process time
            let timeIdentifier = fields[1][fields[1].length-1];
            let multiplier = 0;
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
            let timeAmount = fields[1].slice(0,fields[1].length-1);
            botUtils.displayInfoMessage(message.channel, `disconneting **you** in: **${timeAmount * multiplier / 1000}** seconds`);
            //disconnect person
            setTimeout(() => message.member.voice.disconnect(), timeAmount * multiplier);
        }
    }
}