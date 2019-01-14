const Discord = require('discord.js');
/* token.js is a file that contains the private key required to host the bot */
const data = require('./token.json');
/* bot-config.json is a file that contains important information for the 
bot's functions to work properly */
const config = require('./bot-config.json');
const fs = require('fs');
const client = new Discord.Client();

const token = data.token;

let prefix = config.prefix;

client.on('ready', () => {
  console.log("*****Console Log*****");
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
  if ((msg.content.startsWith(prefix + "help")) && (ArgCount(msg.content) == 1))
  	msg.channel.send(`\`${prefix}ping - Pings the server\n${prefix}prefix - Changes the bot's prefix\n${prefix}oso - Bot helps you decide with a yes or no answer\n${prefix}time - Prints the current time\``);

  //Pings the bot and returns the latency in milliseconds
  if ((msg.content.startsWith(prefix + "ping")) && (ArgCount(msg.content) == 1))
  	msg.channel.send(`Bot ping is: \`${client.ping}ms\` :ping_pong:`);

  //Function that changes the bot's prefix through user input
  if ((msg.content.startsWith(prefix + "prefix")) && (ArgCount(msg.content) == 2) && (msg.member.permissions.has("MANAGE_GUILD", 1))) {
    let newPrefix = msg.content.split(" ").slice(1,2)[0];
    config.prefix = newPrefix;

    fs.writeFile("./bot-config.json", JSON.stringify(config), (err) => {
      if (err) throw err;
      console.error;
    });

    msg.channel.send("The new prefix \'" + newPrefix + "\' has been set!");
  }

  //function that generates a random number and outputs a yes or no answer
  if ((msg.content.startsWith(prefix + "oso")) && (ArgCount(msg.content) == 1)) {
    let randNumb = Math.floor((Math.random() * 100) + 1);
    
  	if (randNumb % 2 == 0)
  		msg.channel.send(":bear: Go for it!!!:bear:");
  	else
  		msg.channel.send("No. :japanese_goblin:");
  }

  //Function that prints the current time.
  if ((msg.content.startsWith(prefix + "time")) && (ArgCount(msg.content)) == 1) {
    let currDate = new Date();
    msg.channel.send(`Current time is: ${currDate}`);
  }

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


client.login(token);