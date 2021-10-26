const { MessageEmbed } = require("discord.js");
const config = require("./config.js");
//sends a stylized error message, TODO:
function displayErrorMessage (channel, error, errorDescription){
    //send error message to the user
    const embed = new MessageEmbed()
        .setColor(config.ERROR_COLOR)
        .setTitle(error)
        .setDescription(errorDescription);

    channel.send({embeds: [embed]});
}

//sends a stylized info message
function displayInfoMessage (channel, message, title = ""){
    //send info message to the user
    const embed = new MessageEmbed()
        .setColor(config.TIMER_COLOR)
        .setTitle(title)
        .setDescription(message);

    channel.send({embeds: [embed]});
}
//object for disconnecting users
class UserToDisconnect{
    constructor(guildMember, time, dcHandler){
        this.member = guildMember;
        this.time = time;
        this.cancel = null;

        this.promise = new Promise((resolve, reject) => {
            this.cancel = reject;
            
            setTimeout(() => {resolve();}, this.time);})
        .then(() => {
            this.member.voice.disconnect();
            
            dcHandler.removeUser(this.member.id, this.member.guild.id)});
    }
}

class DisconnectQueueHandler{
    constructor(){
        this.disconnectQueue = {}
    }

    addUser (userToDc){
        this.disconnectQueue[userToDc.member.id + userToDc.member.guild.id] = userToDc;
    }

    //this will remove the user from the list
    removeUser(userId, guildId){
        let key = userId + guildId;
        if(this.disconnectQueue[key]) {
            this.disconnectQueue[key].cancel();
            delete this.disconnectQueue[key]
        }
    }

    list(guildId){
        const queuedDisconnects = []
        for(const [key,value] of Object.entries(this.disconnectQueue)){
            if(key.endsWith(guildId)) queuedDisconnects.push(value);
        }
        return queuedDisconnects
    }
}


//exports
exports.displayInfoMessage  = displayInfoMessage;
exports.displayErrorMessage = displayErrorMessage;
exports.UserToDisconnect = UserToDisconnect;
exports.DisconnectQueueHandler = DisconnectQueueHandler;

exports.timeRegex = new RegExp(/^[0-9]+[m|s|h]$/i);
exports.userRegex = new RegExp(/^<@![0-9]+>$/);