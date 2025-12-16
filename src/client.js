const { Client, RelationshipManager, Message } = require('discord.js-selfbot-v13');
const client = new Client();

function getFriends () {
    let friends = [];
    let friendListCache = client.relationships.friendCache;
    for (let friend of friendListCache) {
        if (friend[1] && friend[1].dmChannel != "") {
          if (friend[1].dmChannel != undefined) {
            friends.push({
              name: friend[1].username,
              globalName: friend[1].globalName,
              channelId: friend[1].dmChannel.id 
            })
          }
        }
    }

    return friends;
}

async function sendMessage (channelId, message) {
    let channel = await client.channels.fetch(channelId);
    await channel.send(message);       
}

async function getMessages (channelId) {
  let channel 
  try {
    channel = await client.channels.fetch(channelId);
  }
  catch {
    return [];
  }
  const fetchedMessages = await channel.messages.fetch({ limit: 100 });
  const messages = [];

  fetchedMessages.forEach(msg => {
    messages.push({
      author: msg.author.username,
      globalName: msg.author.globalName,
      content: msg.content
    });
  });

  return messages;
}

module.exports = {client, getFriends, sendMessage, getMessages};
