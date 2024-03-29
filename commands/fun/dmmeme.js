const Discord = require('discord.js');
const got = require('got');

module.exports.run = async (bot, message, args) => {
    const subReddits = ["memes", "me_irl", "dankmemes", "pewdiepiesubmissions", "duklock", "madlad", "mildlyvandalised"]
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];

    const embed = new Discord.MessageEmbed();
    got('https://www.reddit.com/r/' + random + '/random/.json?sort=top&t=week').then(response => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeNumComments = content[0].data.children[0].data.num_comments;
        embed.setTitle(`${memeTitle}`);
        embed.setURL(`${memeUrl}`)
        embed.setColor('RANDOM')
        embed.setImage(memeImage);
        embed.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments}\n\nFrom r/${random}`);
        message.author.send(embed)
    }).catch(console.error);
}

module.exports.config = {
    name: "dmmeme",
    aliases: []
}