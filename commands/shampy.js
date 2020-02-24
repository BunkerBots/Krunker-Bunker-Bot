//Require basic classes
const {Client,RichEmbed} = require("discord.js")
const config = require("../config.json")

module.exports.run = (client,message)=>{
    message.channel.send("haiii");
}

module.exports.config = {
    name: "shampy",
    aliases: ["shamps",],
}

module.exports.help = {
    usage : `\`${config.prefix}info\``, //Example usage of command
    User : 0, //Who this command can be used by, 1 for Everyone 2 for Restricted Roles 3 for Moderators and 4 for Admins 5 for Server Owner
    description : `info lists all the info about the bot.` //Description to come when you use config.prefix help <command name>
}