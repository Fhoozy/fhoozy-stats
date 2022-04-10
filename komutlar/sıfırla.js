const { MessageEmbed, Permissions } = require("discord.js");
const { prefix } = require("../ayarlar.json");
const db = require('quick.db');
module.exports.run = async(client, message, args) => {

    
    let etiket = message.mentions.users.first();
    let member = message.guild.members.cache.get(etiket);
    let baş = message.autgor;
    let embed = new MessageEmbed().setDescription(`**Bu komutu kullanabilmek için "\`Yönetici\`" yetkisine sahip olmalısın.**`);
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTARTOR)) return message.channel.send({embeds: embed});
   

    let arg = args[0]

    if(arg == 'ses'){
        if(member){
         await db.delete(`messageData.${member.id}.channel`) || {};
         let embed1 = new MessageEmbed().setDescription(`${member} adlı kişinin tüm ses statı sıfırlandı`);
            message.channel.send({embeds: [embed1]})
        }
        else{
            await db.delete(`voiceData`) || {};
            let embed2 = new MessageEmbed().setDescription(`tüm ses statı sıfırlandı`);
            message.channel.send({embeds: [embed2]})
        }
    }

    if(arg == 'mesaj'){
        if(member){
            await db.delete(`voiceData.${member.id}.channel`) || {};
            let embed3 = new MessageEmbed().setDescription(`${member} adlı kişinin tüm mesaj statı sıfırlandı`)
            message.channel.send({embeds: [embed3]})
        }
        else{
            await db.delete(`messageData`) || {};
            let embed4 = new MessageEmbed().setDescription(`tüm mesaj statı sıfırlandı`)
            message.channel.send({embeds: [embed4]})
        }
    }

    if(arg == 'hepsi'){
        if(member){
            await db.delete(`messageData.${member.id}.channel`) || {};
            await db.delete(`voiceData.${member.id}.channel`) || {};
            let embed5 = new MessageEmbed().setDescription(`${member} adlı kişinin tüm statı sıfırlandı`)
            message.channel.send({embeds: [embed5]})
        }
        else{
            await db.delete(`voiceData`) || {};
            await db.delete(`messageData`) || {};
            let embed6 = new MessageEmbed().setDescription(`tüm stat sıfırlandı`);
            message.channel.send({embeds: [embed6]})
        }
    }

    if(!arg) return message.channel.send({ content: 'Lütfen Bir Arg belirtin `ses/mesaj/hepsi`'});

};
    exports.conf = {
        commands: ["sıfırla"],
        usage: "sıfırla",
        enabled: true,
        guildOnly: true
    };