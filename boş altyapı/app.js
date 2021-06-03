const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const moment = require("moment");
const request = require("request");
const mongoose = require("mongoose");
const { TOKEN, PREFIX, durm, status, typeR } = require("./config.json");
const express = require("express")
const app2 = express()

app2.get('/', (req, res) => {
    res.status(404).send('Merhaba!');
});

app2.listen(4200)
const app = new Client();

app.commands = new Collection();
const cooldowns = new Collection();
app.login(TOKEN);

app.on("ready", () => {
  console.log(`[${moment().format("DD MMMM YYYY | HH:mm")}] APP: Aktif, Komutlar Yüklendi!`);
  console.log(`[${moment().format("DD MMMM YYYY | HH:mm")}] APP: ${app.user.tag} Olarak Giriş Yapıldı.`);
  app.user.setPresence({ status: durm, activity:{ name: status, type: typeR }});
  console.log(`[${moment().format("DD MMMM YYYY | HH:mm")}] APP: Aktivite Ayarlandı!`);
  console.log(`[${moment().format("DD MMMM YYYY | HH:mm")}] APP: ${app.user.username} Kullanıma Hazır!`);
});
app.on("warn", info => console.log(info));
app.on("error", console.error);

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  app.commands.set(command.name, command);
}

app.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      app.commands.get(commandName) ||
      app.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.channel.send(`** :warning: | ${command.name} komutunu tekrardan kullanmak için ${timeLeft.toFixed(1)} saniye beklemelisin. **`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    
      command.execute(message, args);

      try {
        command.execute(message, args);
      } catch (error) {
        console.error(error);
        message.channel.send("** :warning: | Bu komut uygulanırken hata oluştu. Botun yapımcısıyla yada sahibiyle görüşünüz. **").catch(console.error);
      }
  }
})
