const Discord = require("discord.js")
const mongoose = require('mongoose');
const shopJson = require('../../dataSets/shop.json');
const dotEnv = require('dotenv');

mongoose.connect(require('../../dataSets/bot.json').mongoose, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Data = require('../../models/data.js');

module.exports.run = async (bot, message, args) => {
    var objects = [];
    shopJson.forEach(data => {
        objects.push(JSON.parse(JSON.stringify(data)));
    })
    if (args.length === 0) {
        const shopEmbed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle('TFS - Shop')
        .setDescription('Na nákup použi command !buy <názov>');

        objects.forEach(object => {
            shopEmbed.addField(
                object.title + '  (**' + object.cost + '€**)',
                object.description
            );
        }); 

        message.channel.send(shopEmbed);
    } else {
        var object = objects.find(data => data.title === args[0]);
        if (!object) return message.channel.send('Takýto predmet som nenašiel :(');

        Data.findOne ({
            userID: message.author.id
        }, (err, data) => {
            if (err => console.log(err));

            if (!data) {
                var createTable = require('../../createTable');
                createTable.create(message.author.username, message.author.id);
            }

                if (data.balance >= object.cost) {
                    data.balance -= object.cost;
                    const inv = data.inventory;
                    inv.push(object.title);
                    data.inventory = inv;
                    data.save().catch(err => console.log(err));
                    const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`Používateľ **${message.author.username}** si zakúpil predmet: **${object.title}**!!\nPoužiješ ho commandom **!use ${object.title}**`)
                    message.channel.send(exampleEmbed);
                } else return message.channel.send('Nemáš na to lóve (Pls nechoď robiť drogy ok pls ok)');
        });
    }
}

module.exports.config = {
    name: "shop",
    accessableby: "Members",
    aliases: ['buy']
}