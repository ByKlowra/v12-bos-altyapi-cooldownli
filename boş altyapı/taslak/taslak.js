const { MessageEmbed } = require("discord.js");  //bu kısıma komutunuzun ihtiyaç duyduğu modulleri tanımlamanız gerekmekte örneğin const db = require('quick.db'); gibi vb.. 

module.exports = {
  name: "", //komut ismi
  aliases: [""], //komut alternatifleri // "","","" bu şekilde istediğiniz kadar ekleyebilirsiniz
  cooldown: 1, //kaç saniyede bir kullanabiliceğini ayarlarsınız
  description: "", //açıklama
  categori: "", //kategori

  execute(message, args, client) {

     //buraya komut

  }
};