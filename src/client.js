require("./env.js");

const { Client, RelationshipManager, Message } = require('discord.js-selfbot-v13');
const client = new Client();

/*
client.on('ready', async () => {
  console.log(client.channels);
  let friendListCache = client.relationships.friendCache;
  for (let friend of friendListCache) {
    if (friend[1]) {
      let friendObject = friend[1];z
      if (friendObject.username == TARGET) {
          console.log(`Sending a message to ${friendObject.globalName}`);
          let channel = await client.channels.fetch(friendObject.dmChannel.id);
          await channel.send(MESSAGE);
          process.exit(0);
          
      }
    }
  }
  console.log("Invalid target name. Have you put the correct name?");
  process.exit(0);

})
*/

function getFriends () {
    let friends = [];
    let friendListCache = client.relationships.friendCache;
    for (let friend of friendListCache) {
        if (friend[1]) {
          if (friend[1].username == "molho_queijo") {
            return friend[1].dmChannel.id;
          }
        }
    }
}

async function sendMessage (channelId, message) {
    let channel = await client.channels.fetch(channelId);
    await channel.send(message);       
}

module.exports = {client, getFriends, sendMessage};
