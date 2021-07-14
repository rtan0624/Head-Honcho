const Discord = require("discord.js")
const client = new Discord.Client()
const config = require('./config.json');
const { prefix } = require('./config.json');
const { Collection } = require("discord.js");
const voiceCollection = new Collection();
const command = require('./command.js');

const mySecret = process.env['TOKEN']

client.on('ready', () => {
  console.log('Client is ready')

  command(client, ['ping'], (message) => {
    message.channel.send('pong')
  })
  command(client, ['cc'], (message) => {
    const name = message.content.replace(`${prefix}cc `, '')
    console.log(name)
    message.guild.channels
    .create(name, {
      type: 'voice',
    }).then((channel) => {
      channel.setParent('861704279152263211')
      console.log(channel)
    })
  })
})

client.on('voiceStateUpdate', async (oldState,newState) => {
  const user = await client.users.fetch(newState.id);
  const member = newState.guild.member(user);
  const userValue = user.id

  if(!oldState.channel && newState.channel.id === '864602195126124556'){
    const channel = await newState.guild.channels.create(user.tag, {
      type: 'voice',
      parent: "864654875442806794",
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
    console.log(channel)
  }else if(!newState.channel){
    if(oldState.channelID === voiceCollection.get(newState.id)) return oldState.channel.delete()
  }
})

client.login(mySecret)
