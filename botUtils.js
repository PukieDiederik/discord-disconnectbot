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
        .setColor(config.INFO_COLOR)
        .setTitle(title)
        .setDescription(message);

    channel.send({embeds: [embed]});
}
//object for disconnecting users
class UserToDisconnect{
    constructor(guildMember, channel, time, dcHandler){
        this.member = guildMember;
        this.channel = channel;
        this.time = time;
        this.cancel = null;

        this.promise = new Promise((resolve, reject) => {
            this.cancel = reject;
            
            setTimeout(() => {resolve();}, time);
        })  .then(() => {
                guildMember.voice.disconnect();
                dcHandler.removeUser(this.member.id + this.member.guild.id)})
            .catch(() => console.log(`dc-tFinish: u:${this.member.id} g:${this.member.guild.id} c:${this.channel}`));
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
}


//exports
exports.displayInfoMessage  = displayInfoMessage;
exports.displayErrorMessage = displayErrorMessage;
exports.UserToDisconnect = UserToDisconnect;
exports.DisconnectQueueHandler = DisconnectQueueHandler;