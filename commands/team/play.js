const Discord = require("discord.js")
const mongoose = require('mongoose');
const pending = new Set();
const playedRecently = new Set();
const client = new Discord.Client();
const dotEnv = require('dotenv').config();

mongoose.connect(require('../../dataSets/bot.json').mongoose, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Data = require('../../models/data.js');

module.exports.run = async (bot, message, arguments) => {
    var user = message.mentions.members.first();
    console.log(user); 
    if (!user) return;
    if (!pending.has(user.id)) {
        console.log('prd');
        if (user && arguments[1]) {
            console.log('1');
            var embed = new Discord.MessageEmbed()
                .setTitle('Pozvánka do hry.')
                .setDescription('Pozval si používateľa: **<@' + user.id + '>** do hry: **' + arguments[1] + '**.')
                .setColor('BLUE')
                .setThumbnail(user.displayAvatarURL)
                .addField('Informácie', 'Ak sa o používateľovy chceš dozvedieť viac použi command `!stats <meno>` na serveri TFS.')
            message.author.send(embed);
            var embed2 = new Discord.MessageEmbed()
                .setTitle('Pozvánka do hry.')
                .setDescription('Používateľ: **<@' + message.member.id + '>** ťa pozval do hry: **' + arguments[1] + '**.')
                .setColor('BLUE')
                .setThumbnail(user.displayAvatarURL)
                .addField('Informácie', 'Ak sa o používateľovy chceš dozvedieť viac použi command `!stats <meno>` na serveri TFS.')
                .addField('Prijatie & Odmietnutie', 'Ak pozvánku prijímaš napíš `accept` alebo `potvrdiť`.\nAk pozvánku odmietaš napíš `decline` alebo `odmietnuť`\n(Pozvánka platí jednú minútu)')
            user.send(embed2);
            var infoEmbed = new Discord.MessageEmbed()
                .setDescription()
                .setDescription('Používateľ `' + message.author.username + '` pozval hráča `' + user.user.username + '` do hry **' + arguments[1] + '**')
                .setColor('BLUE');
            message.channel.send(infoEmbed);

            console.log('2');
            Data.findOne({
                userID: user.id
            }, (err, data) => {
                if(err) throw err;

                if (!data) {
                    var createTable = require('../../createTable');
                    createTable.create(user.username, user.id);
                }

                    data.pending = message.author.id;
                    data.save().catch(err => console.log(err));
                });

            pending.add(user.id);
            setTimeout(() => {
                if (pending.has(user.id)) {
                    pending.delete(user.id);
                    Data.findOne({
                        userID: user.id
                    }, (err, data) => {
                        if(err) throw err;
                            data.pending = 'null';
                            data.save().catch(err => console.log(err));
                        });
                    var embed = new Discord.MessageEmbed()
                    .setTitle('Pozvánka do hry vypršala.')
                    .setDescription('Pozvánka do hry **' + arguments[1] + '** vypršala.')
                    .setColor('RED')
                    .setThumbnail(user.displayAvatarURL)
                    message.author.send(embed);
                    var embed2 = new Discord.MessageEmbed()
                    .setTitle('Pozvánka do hry vypršala.')
                    .setDescription('Pozvánka do hry **' + arguments[1] + '** vypršala.')
                    .setColor('RED')
                    .setThumbnail(user.displayAvatarURL)
                    user.send(embed2);
                }
            }, 60000);
        }
    }
}

module.exports.config = {
    name: "play",
    accessableby: "Members",
    aliases: ['invite', 'inv']
}

module.exports.pending = pending;
module.exports.pendingdelete = (value) => {
    pending.delete(value);
}
module.exports.add = (user, player) => {
    if (!playedRecently.has(user.id)) {
        Data.findOne({
            userID: user.id
        }, (err, data) => {
            if(err) throw err;

            if (!data) {
                var createTable = require('../../createTable');
                createTable.create(user.username, user.id);
            }

                data.balance += 100;
                data.gamesPlayied += 1;
                data.save().catch(err => console.log(err));
        });
        playedRecently.add(user.id);
        setTimeout(() => {
            playedRecently.delete(user.id);
        }, 3600000);
    }
    if (!playedRecently.has(player.id)) {
        Data.findOne({
            userID: player.id
        }, (err, data) => {
            if(err) throw err;

            if (!data) {
                var createTable = require('../../createTable');
                createTable.create(player.username, player.id);
            }

                data.balance += 100;
                data.gamesPlayied += 1;
                data.save().catch(err => console.log(err));
            });
        playedRecently.add(player.id);
        setTimeout(() => {
            playedRecently.delete(player.id);
        }, 3600000);
    }
}

/*
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                  talkedRecently.delete(message.author.id);
                }, 300000);

                talkedRecently.has(message.author.id)

                const talkedRecently = new Set();

*/