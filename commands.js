const {COMMAND_PREFIX} = require("./config.js")
//this file will process the commands and call the right function if possible
exports.processCommands = (message, client) => {
    if(!message.content) {console.error("ERROR processCommands: message does not include content"); return null;}

    //split the message
    let fields = message.content.slice(3,message.content.length).split(' ');
    if(fields.length < 1) {
        console.error("ERROR processCommands: command does not have enough options"); 
        message.channel.send("not enough options")
        return null;
    }

    if(fields[0] == "me"){
        console.log("possibly disconnecting user");
        message.member.voice.disconnect();
        return true;
    } else if (fields[0] == "timer"){
        if (fields[0].length < 2) {
            console.error("ERROR processCommands/timer: command does not have enough options"); 
            message.channel.send("not enough options");
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
            message.channel.send(`disconneting you in: ${timeAmount * multiplier / 1000}`);
            //disconnect person
            setTimeout(() => message.member.voice.disconnect(), timeAmount * multiplier);
        }
    }
}