const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("messageCreate", (message) => {

  if (message.author.bot) return;

  if (message.content === "!taixiu") {

    let d1 = Math.floor(Math.random()*6)+1;
    let d2 = Math.floor(Math.random()*6)+1;
    let d3 = Math.floor(Math.random()*6)+1;

    let total = d1+d2+d3;

    let result = total >= 11 ? "TÀI" : "XỈU";

    message.reply(`🎲 ${d1} | ${d2} | ${d3} = ${total} → ${result}`);
  }

});

client.login("MTQ4NjczMjM3Mzg0MzI1MTM3Mg.GfHKHt.JuUZ2Ss5r7Ie33gA0xbHs5j2BnRkeFJmv5DcZg");