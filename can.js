const Discord = require("discord.js");
const fs = require("fs");
const { Collection, Client, Message, MessageEmbed, Intents } = require("discord.js");
const db = require("quick.db");
const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES
  ]
});
const { prefix, token, geçersizkanal } = require("./ayarlar.json");
console.log("Bot Başlatılıyor");

const Commands = global.Commands = new Map();

console.log("--------------------------------");

fs.readdirSync("./komutlar", { encoding: "utf-8" }).filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./komutlar/${file}`);
    if (prop.conf.commands == undefined || prop.run == undefined) return console.error(`[COMMAND] ${file} yüklenirken hata oluştu.`);
    if (prop.conf.commands && prop.conf.commands.length > 0) {
        prop.conf.commands.forEach(aliase => Commands.set(aliase, prop));
    }
    if (prop.onLoad != undefined && typeof (prop.onLoad) == "function") prop.onLoad(client);
    console.log(`[KOMUT] ${file} yüklendi.`);
});
console.log("--------------------------------");
console.log("Eventler Yükleniyor...");
fs.readdirSync("./Events", { encoding: "utf-8" }).filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Events/${file}`);
    client.on(prop.conf.event, prop.execute);
    console.log(`[EVENT] ${file} yüklendi.`);
});

console.log("--------------------------------");



//#region Invite Manager
const Invites = new Collection();

const Activites = new Map();

client.on('messageCreate', async(message) => {
    if (message.channel.id === geçersizkanal) return;
    if(!message.guild || message.author.bot || message.content.startsWith(prefix)) return;
    db.add(`messageData.${message.author.id}.channel.${message.channel.id}`, 1);
    db.push(`messageData.${message.author.id}.times`, {time: Date.now(), puan: 1})
  });
  
  client.on('voiceStateUpdate', (oldState, newState) => {
    if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return
    if(!oldState.channelID && newState.channelID) { 
      Activites.set(oldState.id, Date.now());
    }
        let data;
      if(!Activites.has(oldState.id)){
          data = Date.now();
          Activites.set(oldState.id, data); 
      } else data = Activites.get(oldState.id);
    
      let duration = Date.now() - data;
      if(oldState.channelID && !newState.channelID) { 
          Activites.delete(oldState.id);
          db.add(`voiceData.${oldState.id}.channel.${oldState.channelID}`, duration);
          db.push(`voiceData.${oldState.id}.times`, {time: Date.now(), puan:  duration})
      } else if(oldState.channelID && newState.channelID){
          Activites.set(oldState.id, Date.now());
          db.add(`voiceData.${oldState.id}.channel.${oldState.channelID}`, duration);
          db.push(`voiceData.${oldState.id}.times`, {time: Date.now(), puan:  duration})
      }
});


const logs = require('discord-logs');
logs(client);


      client.once('ready', () => { //Client hazır olduğunda
        console.log(`[HAZIR] Bot Başlatıldı, Giriş Yapılan hesap ==> ${client.user.tag}`);
        client.user.setActivity("Fhoozy Stats", { 
        type: "WATCHING"
      });
      })

client.login(token);
