//Require basic classes
const {Client,RichEmbed} = require("discord.js")
const config = require("../config.json")
module.exports.run = (client,message)=>{
    command = message.content.split(" ").shift()
    
    const eb = new RichEmbed()
        .setTitle("Help:")
        .setColor(0x49C4EF)
        .addField("Utility", "> **-info** \r\n > • Provides bot info. " +
            "\r\n > **-help** \r\n > • Provides list of commands and how to use them.", false)
        .addField("General", "> **-lfg <link> <message (optional)>** \r\n > • Creates an LFG posting with <link> and <message>.", false)
        .setTimestamp()
        .setFooter("KrunkerLFG")
    message.channel.send(eb)
}
module.exports.config = {
    name: "help",
    aliases: ["h", "hlp","wlp","welp","ifkingforgothowthebotworks"],
}
module.exports.help = {
    usage : `\`${config.prefix}help <module>\``, //Example usage of command
    User : 0, //Who this command can be used by, 1 for Everyone 2 for Restricted Roles 3 for Moderators and 4 for Admins 5 for Server Owner
    description : `${config.prefix}help lists all available modules.\n \`${config.prefix}help <module-name>\`\nLists the module help` //Description to come when you use config.prefix help <command name>
}