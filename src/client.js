const { Client, RelationshipManager, Message, ChannelType } = require('discord.js-selfbot-v13');
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

function getServers () {
  let servers = [];
  let serverListCache = client.guilds.cache;

  for (let serverObj of serverListCache) {
    const server = serverObj[1]; 
    servers.push({
      name: server.name,
      id: server.id,
    })
  }

  return servers;
}

async function getChannels(guildId) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return [];

  const finalOrderedList = [];

  try {
    const allChannels = await guild.channels.fetch();
    const categories = allChannels.filter(c => c.type === 'GUILD_CATEGORY');
    const textChannels = allChannels.filter(c => c.type === 'GUILD_TEXT');

    const topLevelChannels = textChannels
      .filter(c => !c.parentId)
      .sort((a, b) => a.position - b.position);

    finalOrderedList.push(...topLevelChannels.values());

    const sortedCategories = categories.sort((a, b) => a.position - b.position);

    for (const category of sortedCategories.values()) {
      finalOrderedList.push(category);

      const children = textChannels
        .filter(c => c.parentId === category.id)
        .sort((a, b) => a.position - b.position);

      finalOrderedList.push(...children.values());
    }

  } catch (error) {
    return [];
  }

  let channels = [];

  for (const channel of finalOrderedList) {
    if (!channel) continue;

    channels.push({
      name: channel.name,
      id: channel.id,
      type: channel.type, 
      position: channel.position
    });
  }

  return channels;
}

async function getChannelInfo (channelId) {
  const channel = client.channels.cache.get(channelId);
  
  if (!channel) {
    return null;
  }

  if (channel.type === 'DM' || !channel.guild) {
    return {
      id: channel.id,
      name: channel.recipient ? channel.recipient.username : 'DM', 
      canSend: true
    };
  }

  const perms = channel.permissionsFor(channel.guild.members.me);
  const canSend = perms.has('SEND_MESSAGES') && perms.has('VIEW_CHANNEL');

  return {
    id: channel.id,
    name: channel.name,
    canSend: canSend
  };
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

module.exports = {getClient, getFriends, getServers, getChannels, getChannelInfo, sendMessage, getMessages, createClient, destroyClient};
