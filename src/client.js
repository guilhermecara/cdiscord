require("./env.js");

const { Client, RelationshipManager, Message } = require('discord.js-selfbot-v13');
const client = new Client();

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

async function getMessages (channelId) {
  let channel = await client.channels.fetch(channelId);
  const fetchedMessages = await channel.messages.fetch({ limit: 100 });
  const messages = [];

  fetchedMessages.forEach(msg => {
    messages.push({
      author: msg.author.globalName,
      content: msg.content,
    });
  });

  return messages;
}

async function sendMessage (channelId, message) {
    let channel = await client.channels.fetch(channelId);
    await channel.send(message);       
}

module.exports = {client, getFriends, sendMessage, getMessages};
