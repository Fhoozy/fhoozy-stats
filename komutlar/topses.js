const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports.run = async(client, message, args) => {

        let dataVoice = await db.get(`voiceData`) || {};

        const topVoice = Object.keys(dataVoice).map(id => {
            return {
                userID: id,
                data: Object.values(dataVoice[id].channel || {}).reduce((a, b) => a + b, 0)
            }
        }).sort((a, b) => b.data - a.data).slice(0, 15).map((data, i) => `⦁ ${message.guild.members.cache.get(data.userID)}: \`${moment.duration(data.data).format("M [Ay], W [Hafta], DD [Gün], HH [Saat], mm [Dakika], ss [Saniye]")}\``)

        let topses = topVoice;
        if(topses.length >= 1){  topses = topVoice; } else { topses = "Veri Yok"; }
        const embed = new MessageEmbed()
            .setFooter(message.guild.name, message.guild.iconURL())
            .setColor('BLACK')
            .addField("**Sesli | Top 15**", `${topses}`)
        return message.channel.send({ embeds: [embed] });
    };

exports.conf = {
    commands: ["topvoice", "topses", "ses"],
    usage: "[p]topvoice",
    enabled: true,
    guildOnly: true
};