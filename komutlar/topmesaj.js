const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports.run = async(client, message, args) => {

        let dataMessage = await db.get(`messageData`) || {};

        const topMessage = Object.keys(dataMessage).map(id => {
            return {
                userID: id,
                data: Object.values(dataMessage[id].channel || {}).reduce((a, b) => a + b, 0)
            }
        }).sort((a, b) => b.data - a.data).slice(0, 15).map((data, i) => `⦁ ${message.guild.members.cache.get(data.userID)}: \`${data.data} Mesaj\``)

        let topmesaj = topMessage;
        
        if(topmesaj.length >= 1){
            topmesaj = topMessage;
        }
        else{
            topmesaj = "Veri Yok";
        }
        const embed1 = new MessageEmbed()
            .setFooter(message.guild.name, message.guild.iconURL())
            .setColor('BLACK')
            .addField("**Mesaj | Top 15**", `${topmesaj}`,false)
        return message.channel.send({ embeds: [embed1] });
    };

exports.conf = {
    commands: ["toptext", "topmesaj", "mesaj"],
    usage: "[p]toptext",
    enabled: true,
    guildOnly: true
};