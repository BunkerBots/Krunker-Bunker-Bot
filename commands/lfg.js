const { MessageEmbed } = require("discord.js"),
    logger = require('../logger');

module.exports.run = async(client, message) => {
    const args = message.content.indexOf('$lfg') == 0 ? message.content.substring(5).split(' ') : message.content.split(' ');
    const link = args.shift();

    if (link.indexOf("https://krunker.io/?") == 0) { //Checks if its a krunker game link
        let eb = new MessageEmbed()
            .setTitle(message.member.displayName + ' is looking to party! :tada:')
            .setAuthor(message.member.displayName + ' (' + message.author.tag + ')', message.author.avatarURL(), null)
            .addField('Link: ', link)
            .setFooter('KrunkerLFG')
            .setTimestamp()

        if (args.length > 0) {
            var desc = args.join(' ')
            if (desc.indexOf('krunker.io') == -1) eb.setDescription(desc == desc.toUpperCase() ? desc.toLowerCase() : desc)
        }

        if (link.indexOf("https://krunker.io/?game=") == 0 && link.split('=')[1].split(':')[1].length == 5) {
            switch (link.split('=')[1].split(':')[0]) {
                case 'SV':
                    eb.setColor('BLURPLE')
                    break;
                case 'MIA':
                    eb.setColor('BLUE')
                    break;
                case 'NY':
                    eb.setColor('AQUA')
                    break;
                case 'FRA':
                    eb.setColor('GOLD')
                    break;
                case 'TOK':
                    eb.setColor('ORANGE')
                    break;
                case 'SIN':
                    eb.setColor('LUMINOUS_VIVID_PINK')
                    break;
                case 'BLR':
                    eb.setColor('DARK_VIVID_PINK')
                    break;
                case 'SYD':
                    eb.setColor('GREEN')
                    break;
            }
            message.reply(eb).then(msg => { msg.delete({ timeout: 1800000 }) }).catch(console.error);
        } else if (link.indexOf('https://krunker.io/?party=') == 0 && link.split('=')[1].length == 6) {
            eb.setColor('BLACK')
            message.reply(eb).then(msg => { msg.delete({ timeout: 1800000 }) }).catch(console.error);
        } else {
            error(message)
        }
    } else {
        error(message)
    }
    logger.messageDeleted(message, 'LFG');
    message.delete();
}

function error(message) {
    message.reply(new MessageEmbed()
        .setColor('RED')
        .setTitle('Error')
        .setDescription('Misuse of <#688434522072809500>. Please only send game links with an optional description afterwards.')
        .setTimestamp()
        .setFooter(`${message.member.displayName} (${message.author.tag})`, message.author.avatarURL())
    ).then(msg => { msg.delete({ timeout: 7000 }) }).catch(console.error);
}

module.exports.config = {
    name: "lfg",
}