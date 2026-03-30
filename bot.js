const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;

let db = {};

function getUser(id){
  if(!db[id]){
    db[id] = {
      money:10000,
      exp:0,
      level:1,
      loan:0
    }
  }
  return db[id];
}

client.once("ready",()=>{
  console.log(`Bot online: ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {

  if(!interaction.isChatInputCommand()) return;

  const user = interaction.user;
  const data = getUser(user.id);

  // ngold
  if(interaction.commandName === "ngold"){

    const embed = new EmbedBuilder()
    .setTitle("💰 Thông tin người chơi")
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      {name:"💰 Tiền",value:`${data.money}`,inline:true},
      {name:"📈 Level",value:`${data.level}`,inline:true},
      {name:"⭐ EXP",value:`${data.exp}`,inline:true}
    )
    .setColor("Gold");

    interaction.reply({embeds:[embed]});
  }

  // tài xỉu
  if(interaction.commandName === "taixiu"){

    const bet = interaction.options.getInteger("tien");
    const choice = interaction.options.getString("chon");

    if(bet > data.money)
      return interaction.reply("❌ Không đủ tiền");

    const dice1 = Math.floor(Math.random()*6)+1;
    const dice2 = Math.floor(Math.random()*6)+1;
    const dice3 = Math.floor(Math.random()*6)+1;

    const total = dice1+dice2+dice3;

    let result = total >=11 ? "tai":"xiu";

    let win = choice === result;

    if(win) data.money += bet;
    else data.money -= bet;

    const embed = new EmbedBuilder()
    .setTitle("🎲 Tài Xỉu")
    .setDescription(`🎲 ${dice1} | ${dice2} | ${dice3}\nTổng: **${total}**`)
    .addFields(
      {name:"Bạn chọn",value:choice,inline:true},
      {name:"Kết quả",value:result,inline:true},
      {name:"💰 Tiền",value:`${data.money}`,inline:true}
    )
    .setColor(win ? "Green":"Red");

    interaction.reply({embeds:[embed]});
  }

  // bầu cua
  if(interaction.commandName === "baucua"){

    const items=["bau","cua","tom","ca","ga","nai"];

    const bet = interaction.options.getInteger("tien");
    const choice = interaction.options.getString("chon");

    if(bet > data.money)
      return interaction.reply("❌ Không đủ tiền");

    const r1 = items[Math.floor(Math.random()*6)];
    const r2 = items[Math.floor(Math.random()*6)];
    const r3 = items[Math.floor(Math.random()*6)];

    let win = (choice===r1 || choice===r2 || choice===r3);

    if(win) data.money += bet;
    else data.money -= bet;

    const embed = new EmbedBuilder()
    .setTitle("🦀 Bầu Cua")
    .setDescription(`${r1} | ${r2} | ${r3}`)
    .addFields(
      {name:"Bạn chọn",value:choice,inline:true},
      {name:"💰 Tiền",value:`${data.money}`,inline:true}
    )
    .setColor(win?"Green":"Red");

    interaction.reply({embeds:[embed]});
  }

  // đua ngựa
  if(interaction.commandName === "duangua"){

    const horse = Math.floor(Math.random()*3)+1;

    const bet = interaction.options.getInteger("tien");
    const pick = interaction.options.getInteger("ngua");

    if(bet > data.money)
      return interaction.reply("❌ Không đủ tiền");

    let win = horse===pick;

    if(win) data.money += bet*2;
    else data.money -= bet;

    const embed = new EmbedBuilder()
    .setTitle("🐎 Đua Ngựa")
    .setDescription(`Ngựa thắng: **${horse}**`)
    .addFields(
      {name:"Bạn chọn",value:`${pick}`,inline:true},
      {name:"💰 Tiền",value:`${data.money}`,inline:true}
    )
    .setColor(win?"Green":"Red");

    interaction.reply({embeds:[embed]});
  }

  // vay
  if(interaction.commandName === "vay"){

    const amount = interaction.options.getInteger("tien");

    if(amount > 600000 || amount < 5000)
      return interaction.reply("❌ Vay từ 5000 - 600000");

    data.money += amount;
    data.loan += amount;

    interaction.reply(`🏦 Bạn đã vay ${amount}`);
  }

  // trả nợ
  if(interaction.commandName === "trano"){

    if(data.loan ===0)
      return interaction.reply("Bạn không có nợ");

    if(data.money < data.loan)
      return interaction.reply("Không đủ tiền trả");

    data.money -= data.loan;
    data.loan = 0;

    interaction.reply("✅ Đã trả nợ");
  }

  // addmoney
  if(interaction.commandName === "addmoney"){

    const target = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("tien");

    const t = getUser(target.id);

    t.money += amount;

    interaction.reply(`Đã cộng ${amount} cho ${target.username}`);
  }

});

client.login(TOKEN);