const Discord = require("discord.js")
const mongoose = require('mongoose');
const { repRoles } = require('../../dataSets/bot.json');
const talkedRecently = new Set();
const dotEnv = require('dotenv').config();

mongoose.connect('mongodb://TFS-Utilities:4ZkDIIpHZXBTWItg@tfs-utilities-shard-00-00.ljali.mongodb.net:27017,tfs-utilities-shard-00-01.ljali.mongodb.net:27017,tfs-utilities-shard-00-02.ljali.mongodb.net:27017/UserData?ssl=true&replicaSet=atlas-kw31y7-shard-0&authSource=admin&retryWrites=true&w=majority', {
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
            if(!data) {
                const newData = new Data({
                    name: user.username,
                    userID: user.id,
                    rep: arguments[1],
                    messages: 0,
                    balance: 0,
                    steamLinked: 'null',
                    gamesPlayied: 0,
                    pending: 'null',
                    inventory: [],
                });
                data = newData;
                newData.save().catch(err => console.log(err));
                console.log('Created database table for ' + user.username);
                message.channel.send('Added ' + arguments[1] + ' rep');
            } else {
                var bal = parseInt(arguments[1]);
                data.rep += bal;
                data.save().catch(err => console.log(err));
                message.channel.send('Added ' + arguments[1] + ' rep');
            }
        })
    } else {message.channel.send('Tohoto človeka nepoznám :(')}
}

module.exports.config = {
    name: "rep-add",
    description: "",
    usage: "rep-add",
    accessableby: "Admins",
    aliases: []
}