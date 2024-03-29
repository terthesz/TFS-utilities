const Discord = require("discord.js")

module.exports.run = async (bot, message, arguments) => {
    let args = message.content.split(" ");
            
    if (message.deletable) {
        message.delete();
    }

    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        return message.reply("Haha to predsa nemôžeš.").then(m => m.delete(2000));
    }

    if (isNaN(args[1]) || parseInt(args[1]) <= 0) {
        return message.reply("Toto nie je číslo").then(m => m.delete(2000));
    }

    let deleteAmount;
    if (parseInt(args[1]) > 100) {
        deleteAmount = 100;
    } else if (parseInt(args[1]) > 1) {
        deleteAmount = parseInt(args[1]);
    } else {
        return message.reply("Musíš použiť väčšie číslo ako 1.");
    }

    message.channel.bulkDelete(deleteAmount, true)
    .catch(err => message.reply(`Niečo sa pokazilo :(`));

}

module.exports.config = {
    name: "clear",
    description: "Vymaže daný počet správ",
    usage: "!clear",
    accessableby: "Members",
    aliases: ['c', 'purge']
}