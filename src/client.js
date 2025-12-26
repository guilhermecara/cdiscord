const { Client, RelationshipManager, Message } = require('discord.js-selfbot-v13');
let client = null;

function createClient () {
  if (client) {
      try { client.destroy(); } catch (e) {}
  }
  client = new Client({
      checkUpdate: false
  });
  return client;
}

function getClient () {
  if (client == null) {
    createClient();
  }
  return client;
}

function destroyClient() {
    if (client) {
        client.removeAllListeners();
        client.destroy();
        client = null;
    }
}

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

module.exports = {getClient, getFriends, sendMessage, getMessages, createClient, destroyClient};
