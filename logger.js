const { MessageEmbed } = require("discord.js");

module.exports = {
    messageDeleted(message, reason) {
        message.client.channels.cache.get('770758419737083944').send(new MessageEmbed()
            .setTitle('Message Deleted')
            .setColor('RED')
            .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
            .setDescription(`► Channel: **${message.channel.name}** \n► Message ID: ${message.id} \n► Content: \n> ${message.content}`)
            .addField('Reason:', reason)
            .setFooter('Bitch I\'m a truck!', message.client.user.displayAvatarURL())
            .setTimestamp());
    }
}