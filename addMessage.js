const Discord = require("discord.js")
const mongoose = require('mongoose');
const { msgRoles } = require('./dataSets/bot.json');
const canGainRep = new Set();
const canGainBal = new Set();

mongoose.connect(require('./dataSets/bot.json').mongoose, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Data = require('./models/data.js');

module.exports.run = async (bot, message, arguments) => {
    if (message.author.bot) return;
    let user = message.author;

    Data.findOne({
        userID: user.id
    }, (err, data) => {
        if(err) throw err;

        if (!data) {
            var createTable = require('../../createTable');
            createTable.create(user.username, user.id);
        }
        
            const rng = Math.floor(Math.random() * Math.floor(1000));
            const money = Math.floor(Math.random() * Math.floor(100));


            if (!canGainRep.has(user.id)) {
                canGainRep.add(user.id);
                setTimeout(() => {
                    canGainRep.delete(user.id);
                }, 10 * 60 * 1000);
            } 
            if (rng >= (1000 - 750)) {
                if (!canGainBal.has(user.id)) {
                    canGainBal.add(user.id);
                    data.balance += money;
                    setTimeout(() => {
                        canGainBal.delete(user.id);
                    }, 15 * 1000);
                }
            }

            data.messages += 1;

            var sendCongrats = false;
            var role;
            if (data.messages === 100) {
                role = msgRoles.role1;
                sendCongrats = true;
            }
            else if (data.messages === 500) {
                role = msgRoles.role2;
                sendCongrats = true;
            }
            else if (data.messages === 1000) {
                role = msgRoles.role3;
                sendCongrats = true;
            }
            else if (data.messages === 2000) {
                role = msgRoles.role4;
                sendCongrats = true;
            }
            else if (data.messages === 5000) {
                role = msgRoles.role5;
                sendCongrats = true;
            }

            if (sendCongrats) {
                const setRole = message.guild.roles.cache.find(_role => _role.id === role);
                message.guild.members.cache.find(member => member.id === message.author.id).roles.add(setRole);
    
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTitle('Blahoželáme!')
                .setDescription(`Používateľ ${user.username} práve napísal svoju ${data.messages}. správu!`);
                message.channel.send(exampleEmbed);

                data.rep += 5;

                var role;
                var msgs = data.messages += 5;
                if(msgs >= 100 && msgs < 500) role = msgRoles.role1;
                else if(msgs >= 500 && msgs < 1000) role = msgRoles.role2;
                else if(msgs >= 1000 && msgs < 2000) role = msgRoles.role3;
                else if(msgs >= 2000 && msgs < 5000) role = msgRoles.role4;
                else if(msgs >= 5000) role = msgRoles.role5;
                const _setRole = message.guild.roles.cache.find(_role => _role.id === role);
                message.member.roles.add(_setRole);
            }
            data.save().catch(err => console.log(err));
        })
}

module.exports.config = {
    name: "rep",
    description: "",
    usage: "rep",
    accessableby: "Members",
    aliases: []
}