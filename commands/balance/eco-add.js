const Discord = require("discord.js")
const mongoose = require('mongoose');
const { repRoles } = require('../../dataSets/bot.json');
const talkedRecently = new Set();
const dotEnv = require('dotenv').config();

mongoose.connect(require('../../dataSets/bot.json').mongoose, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Data = require('../../models/data.js');

module.exports.run = async (bot, message, arguments) => {
    arguments = message.content.split(' ').slice(1);

    if (!message.member.hasPermission('ADMINISTRATOR')) return;
    if (!arguments[1]) return;
    if (arguments[1] != parseInt(arguments[1], 10)) return;
    let user = message.mentions.members.first() || arguments[0];
    if (user) {
        Data.findOne({
            userID: user.id
        }, (err, data) => {
            if(err) throw err;

            if (!data) {
                var createTable = require('../../createTable');
                createTable.create(user.username, user.id);
            }

            var bal = parseInt(arguments[1]);
            data.balance += bal;
            data.save().catch(err => console.log(err));
            message.channel.send('Added ' + arguments[1] + ' bal');
        })
    } else {message.channel.send('Tohoto človeka nepoznám :(')}
}

module.exports.config = {
    name: "eco-add",
    description: "",
    usage: "eco-add",
    accessableby: "Admins",
    aliases: ['eco-give ']
}