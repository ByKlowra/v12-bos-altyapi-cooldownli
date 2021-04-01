const { MessageEmbed } = require("discord.js");
const { PREFIX } = require("../config.json");

module.exports = {
  name: "yardım",
  aliases: ["help"],
  cooldown: 5,
  description: "Botun içerisinde bulunan tüm komutları gösterir.",
  categori: "help",

  execute(message) {

    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setAuthor(`${message.client.user.username} Yardım`)
      .setColor("BLACK") //isterseniz buraya .setThumbnail ile embed sağ üst köşesine istediğiniz fotoğrafı koyabilirsiniz örn: .setThumbnail('https://images-ext-1.discordapp.net/external/jvkZWXW67z5oCgDD64M1dLeO3wEzFeype8L1uK4p16w/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/737004955528986745/a_b0a28eb7779dce680d9731b788bdd304.gif') gibi vb..
      .setDescription("**Komutlarım.**")
      .setFooter(`${message.author.username}`)
      .setTimestamp()

    commands.forEach((cmd) => {
      helpEmbed
      .addField(
        `**${PREFIX}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description} ${cmd.cooldown} saniyede bir kullanılabilir.`,
        
        true
      );
    });

    return message.channel.send(helpEmbed).catch(console.error);
  }
};