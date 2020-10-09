const {google} = require('googleapis');

const Discord = require('discord.js');
/* token.js is a file that contains the private key required to host the bot */
const data = require('./token.json');
/* bot-config.json is a file that contains important information for the 
bot's functions to work properly */
const config = require('../config/bot-config.json');
const fs = require('fs');
const client = new Discord.Client();
const ytdl = require('ytdl-core'); // API used to reproduce audio
// const opus = require('node-opus');

const token = data.token;
const API_KEY = data.ytkey;

let prefix = config.prefix;

let waifu_inter = new Map();
let channels = new Map();

let youtube =  google.youtube({
  version: 'v3',
  auth: `${API_KEY}`
});


client.on('ready', () => {
  console.log('*****Console Log*****');
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	prefix = config.prefix;
  //console.log(msg.content);

  //checks if the message is directed towards the bot
  //Otherwise returns
  if (!msg.content.startsWith(prefix) || msg.author.bot)
  	return;

  //Lists all the available commands
  if ((msg.content === (prefix + 'help')) && (ArgCount(msg.content) == 1))
  	msg.channel.send(`\`${prefix}ping - Pings the server\n${prefix}prefix - Changes the bot's prefix\n${prefix}oso - Bot helps you decide with a yes or no answer\n${prefix}time - Prints the current time\n${prefix}play - Searches a song on Youtube and plays it on a Voice Channel\n${prefix}leave - Kicks the bot from its current voice channel\n${prefix}waifus - Configures automatic waifu rolling the current channel.\``);

  //Pings the bot and returns the latency in milliseconds
  if ((msg.content === (prefix + 'ping')) && (ArgCount(msg.content) == 1))
  	msg.channel.send(`Bot ping is: \`${client.ping}ms\` :ping_pong:`);

  //Function that changes the bot's prefix through user input
  if ((msg.content === (prefix + 'prefix')) && (ArgCount(msg.content) == 2) && (msg.member.permissions.has('MANAGE_GUILD', 1))) {
    let newPrefix = msg.content.split(" ").slice(1,2)[0];
    config.prefix = newPrefix;

    fs.writeFile('./bot-config.json', JSON.stringify(config), (err) => {
      if (err) throw err;
      console.error;
    });

    msg.channel.send("The new prefix \'" + newPrefix + "\' has been set!");
  }

  //function that generates a random number and outputs a yes or no answer
  if ((msg.content === (prefix + "oso")) && (ArgCount(msg.content) == 1)) {
    let randNumb = Math.floor((Math.random() * 100) + 1);
    
  	if (randNumb % 2 == 0)
  		msg.channel.send(":bear: Go for it!!!:bear:");
  	else
  		msg.channel.send("No. :japanese_goblin:");
  }

  // Function that prints the current time.
  if ((msg.content === (prefix + "time")) && (ArgCount(msg.content)) == 1) {
    let currDate = new Date();
    currDate.setHours(currDate.getUTCHours() - 6)
    msg.channel.send(`Current time is: ${currDate}`);
  }

  // Function that enables waifu rolling with the specified timing
  // Format = "waifus <enable/disable> <rolls per hour>"
  if ((msg.content.startsWith(prefix + "waifus") && (ArgCount(msg.content)) > 1 && (ArgCount(msg.content)) <= 3)) {
    let MsgArgs = msg.content.split(' ');

    if (MsgArgs[1] == "enable") {
      if (ArgCount(msg.content) == 3) {
        if (parseInt(MsgArgs[2]) <= 60) {
          channels.set(msg.channel.name, msg.channel);
          waifu_inter.set(msg.channel.name, setInterval(() => {
            msg.channel.send("$wa");
          }
          , 3600 / parseInt(MsgArgs[2]) * 1000));
        }
        else {
          msg.channel.send("Please enter a number that is less than 60.");
        }
      } 
      else {
        msg.channel.send(`Format is \`waifus <"enable"/"disable"> <rolls per hour>\``);
      }
    }
    if (MsgArgs[1] == "disable") {
      if (ArgCount(msg.content) == 2 && waifu_inter.get(msg.channel.name)) {
        if (waifu_inter.get(msg.channel.name) === undefined) {
          msg.channel.send("Rolling not configured in this channel!\n");
        }
        else {
          clearInterval(waifu_inter.get(msg.channel.name));
          waifu_inter.delete(msg.channel.name);
        }

      }
    }
  }
  else if ((msg.content === (prefix + "waifus")) && ArgCount(msg.content) == 1) {
    msg.channel.send(`Format is \`waifus <"enable"/"disable"> <rolls per hour>\``);
  }

  if ((msg.content.startsWith(prefix + "play")) && (ArgCount(msg.content)) > 1) {
    let searchParam = msg.content.split(' ');
    searchParam.shift();
    searchParam = searchParam.join(' ');

    youtube.search.list({
      part: 'snippet',
      type: 'video',
      q: `${searchParam}`,
      order: 'viewCount',
      maxResults: '10'
    }, (err, data) => {
      if (err) {
        console.error(err);
      }
      if (data) {
        // console.log(data.data.items[0].id.videoId);
        // console.log(data.data.items);
        results = data.data;  
        
        const streamOptions = { seek: 0, volume: 1 };
        const vChannel = msg.member.voice.channel;
        if (!vChannel) msg.channel.send("You need to be in a voice channel to execute this command.")


        vChannel.join()
          .then(connection => {
            const stream = ytdl(`https://www.youtube.com/watch?v=${data.data.items[0].id.videoId}`, { filter : 'audioonly' });
            stream.on('error', console.error)
            connection.play(stream, streamOptions)
          })
          .catch(err => console.error(err));
      }
    });    
  }

  if ((msg.content === (prefix + "leave")) && (ArgCount(msg.content)))
    msg.member.voice.channel.leave();
    


});


/*
------------------------------------------------------------------------------------------
 Section that contains any and all supplementary functions that will/may help with the bot's commands 
------------------------------------------------------------------------------------------
 */


//Function that counts how many arguments the message has.
function ArgCount(str) { 
    return str.split(" ").length;
  }


class parameters{
  parameters(){};
}

let discordLogin = (login) => {
  return new Promise((resolve, reject) => {
    client.login(token);
  })
}

client.login(token).catch(err => console.log(`Invalid code: ${token} \n ${err}`));