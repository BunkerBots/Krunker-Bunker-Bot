const id = require("../id.json"),
    { MessageEmbed, MessageAttachment } = require("discord.js"),
    submissions_db = require('../app').db.submissions,
    moderator_db = require('../app').db.moderator,
    logger = require("../logger");

const roles = [
    '692870902005629041', //Trial Mod
    '448207247215165451', //Mod
    '448195089471111179', //CM
    '638129127555072028', //Yendis
    '448198031041495040', //Dev
];
const requirements = {
    'clan-board': ['Clan Name:', 'Clan Level:', 'Clan Info:', 'discord.gg/'],
    'customizations': ['Type:', 'Name:'],
    'community-maps': ['Map Name:', 'Map Link:', 'Description:'],
    'community-mods': ['Mod Name:', 'Modifies:'],
    'skin-vote-submissions': ['Skin name:'],
    'bug-reports': ['Platform:', 'Operating System:', 'Report:', 'Reported by:', 'IGN:'],
}

module.exports.run = async(client, message) => {
    var canBypass = false;
    if (!canBypass) roles.forEach(role => { if (message.member.roles.cache.has(role)) canBypass = true; return });
    if (!canBypass) {
        let denyReasons = '';
        let eb = new MessageEmbed();

        if (message.content.toUpperCase().startsWith('SUGGEST')) {
            if (message.attachments.size > 1) denyReasons += '- ***Too many attachments*** \n';

            if (denyReasons == '') {
                eb.setTitle('Suggestions submission request')
                    .setColor('YELLOW')
                    .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                    .setDescription(message.content.substring(message.content.indexOf(' ') + 1))
                    .setTimestamp();
                if (message.attachments.size != 0) eb.setImage(message.attachments.array()[0].url);
            }
        } else if (message.content.toUpperCase().includes('CLAN NAME')) {
            requirements["clan-board"].forEach(requirement => {
                if (!message.content.toUpperCase().split(" ").join("").includes(requirement.toUpperCase().split(" ").join(""))) denyReasons += `- Missing field: ***${requirement}*** \n`;
            });

            if (!message.content.startsWith('```')) message.content = '```' + message.content;
            if (!message.content.endsWith('```')) message.content += '\n```';

            if (denyReasons == '') {
                eb.setTitle('Clan boards submission request')
                    .setColor('YELLOW')
                    .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                    .setDescription(message.content)
                    .setTimestamp();
            }
        } else if (message.content.toUpperCase().includes('TYPE')) {
            if (message.attachments.size == 0) denyReasons += '- ***Missing attachment*** \n';
            else if (message.attachments.size > 1) denyReasons += '- ***Too many attachments*** \n';
            requirements["customizations"].forEach(requirement => {
                if (!message.content.toUpperCase().split(" ").join("").includes(requirement.toUpperCase().split(" ").join(""))) denyReasons += `- Missing field: ***${requirement}*** \n`;
            });

            if (denyReasons == '') {

                eb.setTitle('Customizations submission request')
                    .setColor('YELLOW')
                    .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                    .setDescription(message.content)
                    .setImage(message.attachments.array()[0].url)
                    .setTimestamp();
            }
        } else if (message.content.toUpperCase().includes('MAP NAME')) {
            if (message.attachments.size > 1) denyReasons += '- ***Too many attachments*** \n';
            requirements["community-maps"].forEach(requirement => {
                if (!message.content.toUpperCase().split(" ").join("").includes(requirement.toUpperCase().split(" ").join(""))) denyReasons += `- Missing field: ***${requirement}*** \n`;
            });

            if (denyReasons == '') {
                eb.setTitle('Community maps submission request')
                    .setColor('YELLOW')
                    .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                    .setDescription(message.content)
                    .setTimestamp();
                if (message.attachments.size != 0) eb.setImage(message.attachments.array()[0].url);
            }
        } else if (message.content.toUpperCase().includes('MOD NAME')) {
            if (message.attachments.size > 1) denyReasons += '- ***Too many attachments*** \n';
            requirements["community-mods"].forEach(requirement => {
                if (!message.content.toUpperCase().split(" ").join("").includes(requirement.toUpperCase().split(" ").join(""))) denyReasons += `- Missing field: ***${requirement}*** \n`;
            });

            if (denyReasons == '') {
                eb.setTitle('Community mods submission request')
                    .setColor('YELLOW')
                    .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                    .setDescription(message.content)
                    .setTimestamp();
                if (message.attachments.size != 0) eb.setImage(message.attachments.array()[0].url);
            }
        } else if (message.content.toUpperCase().includes('SKIN NAME')) {
            if (message.attachments.size == 0) denyReasons += '- ***Missing attachment*** \n';
            if (message.attachments.size > 1) denyReasons += '- ***Too many attachments*** \n';

            if (denyReasons == '') {
                const proxy = await client.channels.resolve(id.channels["submissions-extra"]).send({ files: [new MessageAttachment(message.attachments.array()[0].url)] });

                const eb = new MessageEmbed()
                    .setTitle('Skin vote submission request')
                    .setColor('YELLOW')
                    .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                    .setDescription(message.content)
                    .setImage(proxy.attachments.array()[0].url)
                    .setTimestamp();

                client.channels.resolve(id.channels["skin-vote-submissions"]).send(eb);

                message.reply(new MessageEmbed()
                    .setTitle('Submission sent for review')
                    .setColor('GREEN')
                    .setDescription('To receive updates about your submission, please ensure that you do not have me blocked.')
                    .setTimestamp()).then(m => m.delete({ timeout: 10000 }));
            } else {
                autoDeny(message, denyReasons);
            }
            return logger.messageDeleted(message, 'Modmail', 'NAVY');
        } else if (message.content.toUpperCase().includes('REPORT')) {
            if (message.attachments.size > 1) denyReasons += '- ***Too many attachments*** \n';
            requirements["bug-reports"].forEach(requirement => {
                if (!message.content.toUpperCase().split(" ").join("").includes(requirement.toUpperCase().split(" ").join(""))) denyReasons += `- Missing field: ***${requirement}*** \n`;
            });

            if (denyReasons == '') {
                eb.setTitle('Bug reports submission request')
                    .setColor('YELLOW')
                    .setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
                    .setDescription(message.content)
                    .setTimestamp();
                if (message.attachments.size != 0) eb.setImage(message.attachments.array()[0].url);
            }
        } else {
            message.reply(new MessageEmbed()
                .setTitle('INVALID INPUT')
                .setColor('RED')
                .setDescription('Invalid input. Please read the pinned message on how to use this channel.')
            ).then(m => { m.delete({ timeout: 30000 }) });
            logger.messageDeleted(message, 'Modmail', 'NAVY');
            return;
        }

        if (denyReasons == '') {
            const fetchData = await submissions_db.get(message.guild.id);
            approvalRequest(client, message, eb.setTitle(`${eb.title} #${fetchData.subID}`));
            const updateData = await submissions_db.set(message.guild.id, { subID: fetchData.subID + 1 });
        } else autoDeny(message, denyReasons);
        logger.messageDeleted(message, 'Modmail', 'NAVY');
    }
}
module.exports.react = async(client, reaction, user) => {
    await reaction.fetch();
    await reaction.message.fetch();
    let embed = reaction.message.embeds[0];
    if (!embed || embed.hexColor != id.colours["YELLOW"]) return;

    const member = await client.users.fetch(embed.author.name.match(/\((\d{17,19})\)/)[1], true, true);

    switch (reaction.emoji.id) {
        case id.emojis.yes:
            let sentMsg;
            const post = new MessageEmbed()
                .setAuthor(`${member.tag} (${member.id})`, member.displayAvatarURL())
                .setDescription(embed.description)
                .setFooter('Go to #submissions to submit a request')
                .setTimestamp();
            if (embed.image) post.setImage(embed.image.url);
            if (reaction.message.attachments.size > 0) post.attachFiles(reaction.message.attachments.array());
            let title = embed.title.split(' ');
            title.pop();
            switch (title.join(' ')) {
                case 'Suggestions submission request':
                    sentMsg = await client.channels.resolve(id.channels["suggestions"]).send(post.setColor('YELLOW'));
                    sentMsg.react("👍");
                    sentMsg.react("👎");
                    break;
                case 'Clan boards submission request':
                    sentMsg = await client.channels.resolve(id.channels["clan-boards"]).send(post);
                    break;
                case 'Customizations submission request':
                    sentMsg = await client.channels.resolve(id.channels["customizations"]).send(post.setImage(embed.image.url));
                    break;
                case 'Community maps submission request':
                    sentMsg = await client.channels.resolve(id.channels["community-maps"]).send(post);
                    break;
                case 'Community mods submission request':
                    sentMsg = await client.channels.resolve(id.channels["community-mods"]).send(post);
                    break;
                    // case 'Bug reports submission request':
                    //     break;
            }
            if (sentMsg) {
                member.createDM(true).then(dm => {
                    dm.send(new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle('Submission Posted')
                        .setDescription(`Thank you for your submission. View your submission [here](${sentMsg.url}).`)
                        .setFooter('Submission approved by: ' + user.username, user.displayAvatarURL())
                        .setTimestamp());
                });
                embed.setColor('GREEN')
                    .setTitle(embed.title.replace('request', 'approved'))
                    .addField('Posted:', `[Here](${sentMsg.url})`)
                    .setFooter('Approved by ' + user.username, user.displayAvatarURL())
                    .setTimestamp();
            } else {
                reaction.message.channel.send(new MessageEmbed()
                    .setTitle('Error posting message')
                    .setColor('RED')
                    .setDescription('If this issue continues to persist, please contact JJ or Jytesh')
                    .setTimestamp());
            }
            break;
        case id.emojis.no:
            const m = await reaction.message.channel.send(`<@${user.id}> Please provide a reason:`);
            const messages = await reaction.message.channel.awaitMessages(m => m.author.id == user.id, { max: 1, time: 60000, errors: ['time'] }).catch(e => reaction.message.channel.send("Timeout. Please go react again."));
            embed = denyRequest(member, user, messages.first().content, embed);
            m.delete();
            messages.first().delete();
            break;
        case id.emojis.formatting:
            embed = denyRequest(member, user, 'Incorrect formatting.', embed);
            break;
        case id.emojis.missing:
            embed = denyRequest(member, user, 'Missing information.', embed);
            break;
        case id.emojis.script:
            //const m = await reaction.message.channel.send(`<@${user.id}> Please provide an edited version:`);
            //const messages = await reaction.message.channel.awaitMessages(m => m.author.id == user.id, { max: 1, time: 60000, errors: ['time'] }).catch(e => reaction.message.channel.send("Timeout. Please go react again."));
        default:
            return;
    }

    reaction.message.edit(embed);

    //DB stuff
    const fetchUser = await moderator_db.get(user.id);
    const submissions = fetchUser ? fetchUser.submissions + 1 : 1;
    const update = await moderator_db.set(user.id, { submissions: submissions });
    if (!update) {
        reaction.mesage.channel.send(new MessageEmbed()
            .setTitle('Database Error')
            .setColor('RED')
            .setDescription('A database error has occured. Please contact JJ if he has not been contacted already. Your submission approval was not documented in your stats.')
            .setTimestamp());
    }
}

function autoDeny(message, denyReasons) {
    message.reply(new MessageEmbed()
        .setTitle('Missing info')
        .setColor('RED')
        .setDescription(denyReasons)
    ).then(m => { m.delete({ timeout: 30000 }) });
}

async function approvalRequest(client, message, embed) {
    if (embed.image) embed = await proxyEmbedImage(client, embed);
    embed = AttachEmbedImages(embed)

    message.reply(new MessageEmbed()
        .setTitle('Submission sent for review')
        .setColor('GREEN')
        .setDescription('To receive updates about your submission, please ensure that you do not have me blocked. Check your DMs with me for you submission ID.')
        .setTimestamp()).then(m => {
        m.delete({ timeout: 10000 })
    });
    message.author.createDM().then(dm => dm.send(new MessageEmbed()
        .setTitle(`Submission ID: #${embed.title.split('#')[1]}`)
        .setColor('YELLOW')
        .setTimestamp()));

    client.channels.resolve(id.channels["submissions-review"]).send(embed).then(m => {
        m.react(client.emojis.cache.get(id.emojis.yes));
        m.react(client.emojis.cache.get(id.emojis.no));
        m.react(client.emojis.cache.get(id.emojis.formatting));
        m.react(client.emojis.cache.get(id.emojis.missing));
        m.react(client.emojis.cache.get(id.emojis.script));
    });
}

function denyRequest(member, user, reason, embed) {
    member.createDM().then(dm => {
        dm.send(new MessageEmbed()
            .setTitle('Submission request denied')
            .setColor('ORANGE')
            .setDescription('Your submission request has been denied. For help, please check out the guide [here](https://discord.com/channels/448194623580667916/779620494328070144/782082253345390592). If you think this is a mistake, please contact ' + user.tag)
            .addField('Reason:', reason)
            .setFooter('Submission denied by ' + user.username, user.displayAvatarURL())
            .setTimestamp());
    });
    return embed.setColor('RED')
        .setTitle(embed.title.replace('request', 'denied'))
        .setFooter('Denied by ' + user.username, user.displayAvatarURL())
        .addField('Reason', reason)
        .setTimestamp();
}

async function proxyEmbedImage(client, embed) {
    const proxy = await client.channels.resolve(id.channels["submissions-extra"]).send({ files: [new MessageAttachment(embed.image.url)] });
    return embed.setImage(proxy.attachments.array()[0].url);
}

function AttachEmbedImages(embed) {
    const array = embed.description.replace(/\r?\n|\r/g, ' ').split(' ');
    const links = new Array();
    let description = new Array();
    array.forEach(t => {
        if (t.startsWith('https://')) {
            if ((t.endsWith('.png') || t.endsWith('.gif') || t.endsWith('.mp4') || t.endsWith('.mov') || t.endsWith('.jpeg')) || t.endsWith('.jpg')) {
                links.push(new MessageAttachment(t));
            } else if (t.includes('discord.gg')) description.push(t);
        } else description.push(t);
    });
    if (description.length > 0) embed.description = description.join(' ');
    return embed.attachFiles(links);
}

module.exports.config = {
    name: 'modmail',
}