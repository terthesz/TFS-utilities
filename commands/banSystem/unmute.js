const Discord = require('discord.js');
const unmute = require('./mute');

module.exports.run = async (bot, message, args) => {
    let member = message.mentions.members.first();
    if(!message.member.hasPermission('MANAGE_MESSAGES')) {
        message.channel.send("Toto nepôjde.");
    } else {
        let mutedRole = member.guild.roles.cache.find(role => role.name === '↬ Mute');
        member.roles.remove(mutedRole);
        unmute.unmute(member.user, message);
        message.channel.send("Používateľ bol odmlčaný.");
    }
}

module.exports.config = {
    name: "unmute",
    description: "",
    usage: "!unmute",
    accessableby: "Admins",
    aliases: []
}