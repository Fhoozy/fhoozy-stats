const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

exports.run = async (client, message, args) => {

    let etiket = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;
    let member = message.guild.members.cache.get(etiket.id);
    let dataMessage = await db.get(`messageData.${member.id}.channel`) || {};
    let dataVoice = await db.get(`voiceData.${member.id}.channel`) || {};
    let messageData = Object.keys(dataMessage).map(id => {
    return {
        channelID: id,
        totalMessage: dataMessage[id]
    }
}).sort((a, b) => b.totalMessage - a.totalMessage);

let voiceData = Object.keys(dataVoice).map(id => {
    return {
        channelID: id,
        totalTime: dataVoice[id]
    }
}).sort((a, b) => b.totalTime - a.totalTime);

let dataMessage0 = await db.get(`messageData.${member.id}.times`) || [{ time: 0, puan: 0 }, { time: 0, puan: 0 }];
let dataVoice0 = await db.get(`voiceData.${member.id}.times`) || [{ time: 0, puan: 0 }, { time: 0, puan: 0 }];
let messageData0 = Object.values(dataMessage0).map(id => {
    return {
        time: id.time,
        puan: id.puan
    };
})
let voiceData0 = Object.values(dataVoice0).map(id => {
    return {
        time: id.time,
        puan: id.puan
    };
})

let message14 = messageData0.filter(data => (Date.now() - (86400000 * 30)) < data.time).reduce((a, b) => a + b.puan, 0);
let message7 = messageData0.filter(data => (Date.now() - (86400000 * 7)) < data.time).reduce((a, b) => a + b.puan, 0);
let message24 = messageData0.filter(data => (Date.now() - 86400000) < data.time).reduce((a, b) => a + b.puan, 0);
let totalmessage = messageData0.filter(data => (Date.now())).reduce((a, b) => a + b.puan, 0);

let ses14 = voiceData0.filter(data => (Date.now() - (86400000 * 30)) < data.time).reduce((a, b) => a + b.puan, 0);
let ses7 = voiceData0.filter(data => (Date.now() - (86400000 * 7)) < data.time).reduce((a, b) => a + b.puan, 0);
let ses24 = voiceData0.filter(data => (Date.now() - 86400000) < data.time).reduce((a, b) => a + b.puan, 0);
let totalVoice = voiceData0.filter(data => (Date.now())).reduce((a, b) => a + b.puan, 0);

let cDurum = member.presence?.status;
    let cdurum;
    if(cDurum === 'online') cdurum = "??evrimi??i"
    if(cDurum === 'idle') cdurum = "Bo??ta"
    if(cDurum === 'dnd') cdurum = "Rahats??z Etmeyin"
    if(cDurum === 'Invisible') cdurum = "G??r??nmez/??evrimd??????"

    const embed = new MessageEmbed()
    .setColor("#5765f1")
    .setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic:true , size :2048}))
    .setFooter(message.guild.name + ` ??? ` + message.author.tag + ` taraf??ndan istendi. `, message.guild.iconURL())
    .setThumbnail(member.user.avatarURL({ dynamic: true }))
    .setTimestamp()
    .setDescription(`${member} - **(\`${member.id}\`)**
    
    __Kullan??c?? Bilgisi__:
    **\`???\`Profil: <@${(member.id)}>**
    **\`???\`ID: \`${member.id}\`**
    **\`???\`Durum: \`${cdurum} \`**
    **\`???\`Sunucuya Kat??lma: \`${moment(member.joinedAt).format("DD/MM/YYYY")}\`**

    __Toplam ??statistikleri__:
    **\`???\`Ses: \`${moment.duration(totalVoice).format("HH [Saat], mm [Dakika]")}\`**
    **\`???\`Mesaj: \`${totalmessage} mesaj\`**   

    __Aktif Oldu??u Kanallar__:
    **\`???\`Mesaj: ${messageData[0] ? `<#${messageData[0].channelID}>` : "Veri Yok"}: \`${messageData[0] ? messageData[0].totalMessage : 0} Mesaj\`**
    **\`???\`Ses: ${voiceData[0] ? `<#${voiceData[0].channelID}>` : 'Veri Yok!'}: \`${voiceData[0] ? moment.duration(voiceData[0].totalTime).format("HH [Saat], mm [Dakika]") : 'Veri Yok!'}\`**
     
     __**Son 14 G??n i??indeki kullan??c?? ses ve Mesaj istatistikleri.**__
     `).addFields({
        name: `**__Mesaj__:**`,
        value: `**\`???\`24 Saat: \`${message24} mesaj\` \n \`???\`1 Hafta: \`${message7} mesaj\`\n \`???\`14 G??n: \`${message14} mesaj\`**`,
        inline: true
      }, {
        name: `**__Ses__:**`,
        value: `**\`???\`24 Saat: \`${moment.duration(ses24).format("HH [Saat], mm [Dakika]")}\`\n \`???\`1 Hafta: \`${moment.duration(ses7).format("HH [Saat], mm [Dakika]")}\`\n \`???\`14 G??n: \`${moment.duration(ses14).format("HH [Saat], mm [Dakika]")}\`**`,
        inline: true
});
message.channel.send({ embeds: [embed] });

};

exports.conf = {
    commands: ["me", "i", "stat"],
    usage: "[p]me",
    enabled: true,
    guildOnly: true
};