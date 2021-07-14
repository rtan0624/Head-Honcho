const Discord = require("discord.js")
const client = new Discord.Client()
const config = require('./config.json');
const { prefix } = require('./config.json');
const { Collection } = require("discord.js");
const voiceCollection = new Collection();
const command = require('./command.js');
const Database = require("@replit/database")

const mySecret = process.env['TOKEN']
const db = new Database()


client.on('ready', () => {
  console.log('Client is ready')

  command(client, ['ping'], (message) => {
    message.channel.send('pong')
  })
  command(client, ['cc'], (message) => {
    if(message.member.guild.me.hasPermission("ADMINISTRATOR")){
    const name = message.content.replace(`${prefix}cc `, '')
    console.log(name)
    message.guild.channels
    .create(name, {
      type: 'voice',
    }).then((channel) => {
      channel.setParent('861704279152263211')
      console.log(channel)
    })
    }
  })
  command(client, ['setup', 'start'], (message) => {
    if(message.member.guild.me.hasPermission("ADMINISTRATOR")){
      message.channel.send("Completed Setup")
    if(message.guild.channels.cache.find(channel => channel.name === "=>||Private Channels||<="))
    {
      const cHID = message.guild.channels.cache.find(channel => channel.name === "-Private Channels-");
      //console.log(cHID.parentID)
      cHID.parent.delete()
      cHID.delete()
    }
    message.guild.channels.create("=>||Private Channels||<=", {
      type: "category",
    }).then((category) => {
      const categoryID = category.id
      //console.log(categoryID)
       // << try now?
      message.guild.channels.create("-Private Channels-", {
      type: "voice",
      parent: categoryID
      }).then((dbChannel) => {
      const dbChannelID = dbChannel.id
      const guildID = "" + message.guild.id
      //console.log(dbChannelID)
      db.set(guildID, [categoryID, dbChannelID])
      //db.get(guildID, { raw: false }).then(console.log);
  })
})
    }
  })})

client.on('voiceStateUpdate', async (oldState,newState) => {
  const user = await client.users.fetch(newState.id);
  const member = newState.guild.member(user);
  const userValue = user.id
  const guildID = "" + member.voice.guild.id
  let dbArray = await db.get(guildID);
  let dBChannelID = "" + dbArray[1]
  let dBCategoryID = "" + dbArray[0]
  //console.log(dBChannelID)
  if(!oldState.channel && newState.channel.id === dBChannelID){
    const channel = await newState.guild.channels.create(user.tag, {
      type: 'voice',
      parent: dBCategoryID,
      permissionOverwrites: [
        {
			id: newState.guild.id,
			deny: ['CONNECT','VIEW_CHANNEL'],
		},
		{
			id: user.id,
			allow: ['CONNECT','MOVE_MEMBERS','VIEW_CHANNEL', 'MANAGE_CHANNELS', 'ADMINISTRATOR', 'MANAGE_ROLES'],
		}, {
      id: client.user.id,
      			allow: ['CONNECT','MOVE_MEMBERS','VIEW_CHANNEL', 'MANAGE_CHANNELS','ADMINISTRATOR'],
    }    ]
    });
    member.voice.setChannel(channel);
    voiceCollection.set(user.id, channel.id);
    //console.log(channel)
  }else if(!newState.channel){
    if(oldState.channelID === voiceCollection.get(newState.id)) return oldState.channel.delete()
  }
})

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('ok');
});
server.listen(3000);


client.login(mySecret)
