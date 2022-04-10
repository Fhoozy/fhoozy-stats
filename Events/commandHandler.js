const Discord = require("discord.js");
const { prefix, token } = require("../ayarlar.json");
/**
 * @param {Discord.Message} message 
 */
exports.execute = async (message) => {
    if(message.author.bot || !message.content.startsWith(prefix)) return;

    let args = message.content.split(" ");
    let commandName = args[0].substring(prefix.length);
    args = args.splice(1);
    let command = global.Commands.get(commandName);
    if(!command || !command.conf.enabled || (command.conf.guildOnly && message.channel.type != "GUILD_TEXT")) return;
    if(command)
        command.run(message.client, message, args);
};

exports.conf = {
    event: "messageCreate"
}