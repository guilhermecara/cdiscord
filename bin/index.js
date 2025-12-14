#!/usr/bin/env node

console.log("Hello world");

/*

require("dotenv").config();

const { Client, RelationshipManager } = require('discord.js-selfbot-v13');
const client = new Client();

const args = process.argv.slice(2);
const TARGET = args[0];          // username
const MESSAGE = args[1] || "";   // message

client.on('ready', async () => {
  console.log(client.channels);
  let friendListCache = client.relationships.friendCache;

  for (let friend of friendListCache) {
    if (friend[1]) {
      let friendObject = friend[1];
      if (friendObject.globalName == TARGET) {
          console.log("sendming msg");
          let channel = await client.channels.fetch(friendObject.dmChannel.id);
          channel.send(MESSAGE);
          process.exit(0);
      }
    }
  }
  console.log("Invalid target name. Have you put the correct name?");
  process.exit(0);

})

client.login(process.env.DISCORD_TOKEN);

*/