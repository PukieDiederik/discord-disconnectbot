const { MessageEmbed } = require("discord.js");
const config = require("./config.js");
//sends a stylized error message, TODO:
function displayErrorMessage (channel, error, errorDescription){
    //log the error message in console
    console.error(`ERR:${error}`);
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

//exports
exports.displayInfoMessage  = displayInfoMessage;
exports.displayErrorMessage = displayErrorMessage;