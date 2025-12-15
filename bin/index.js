#!/usr/bin/env node

const { createInterface} = require('../src/ui.js');
const { client, getFriends, sendMessage, getMessages} = require('../src/client.js');

const ui = createInterface();
const { screen, sidebar, main, messages, messageInput, friendSearchInput} = ui;

let loggedIn = false;

let selectedChannel = "";

messageInput.on('submit', async (text) => {
  if (!text.trim()) {
      messageInput.clearValue();
      messageInput.focus();
      return; 
  }

  if (!loggedIn) {
    messageInput.clearValue();
    messageInput.focus();
    return; 
  }

  const time = new Date().toLocaleTimeString();
  try {
    await sendMessage(selectedChannel,text);
    messages.writeMessage(`{blue-fg}${client.user.globalName}:{/blue-fg} ${text}`);
  }
  catch (error) {
    messages.writeMessage('{red-fg}System:{/red-fg} An error has occured'); // Change to index
    if (process.env.DEBUG == "true") {
      messages.writeMessage(`Debug: ${error.message}`);
    }
  }
  finally {
    messageInput.clearValue();
    messageInput.focus();
    messages.setScrollPerc(100);
    screen.render();
  }
});

messages.writeMessage('{blue-fg}System:{/blue-fg} Welcome to Cdiscord!'); // Change to index
screen.render();

client.on('ready', async () => {
  messages.writeMessage(`{blue-fg}System:{/blue-fg} Discord loaded. Welcome, ${client.user.globalName}`); // Change to index
  loadMessages ();
  loadFriends ();
  
  loggedIn =  true;
  screen.render();
})

client.on('messageCreate', async message => {
    if (message.author.dmChannel == undefined) return;
    if (message.author.dmChannel.id != selectedChannel) return;

    messages.pushLine(`{blue-fg}${message.author.username}:{/blue-fg} ${message.content}`);
    screen.render();
});

client.login(process.env.DISCORD_TOKEN);

async function loadMessages () {
  messages.setContent('');

  const chatHistory = await getMessages(selectedChannel);
  for (let i = chatHistory.length - 1; i > -1; i--) {
    let message = chatHistory[i];
    let nameColor = "blue";
    if (message.author == client.user.globalName) {
      nameColor = "cyan";
    }
    messages.writeMessage(`{${nameColor}-fg}${message.author}:{/${nameColor}-fg} ${message.content}`);
  }
  messages.setScrollPerc(100);
  screen.render();
}

async function loadFriends () {
  let friendList = getFriends();
  
  sidebar.children.slice().forEach(child => {
    if (child.options.label == "Search") return;
    child.destroy();
  });

  for (let i = 0; i < friendList.length; i++) {
    let friendItem = sidebar.createFriendElement (friendList[i].name, i);
    
      friendItem.on("click", (element) => {
            selectedChannel = friendList[i].channelId;
            loadMessages();
      })
  }

  screen.render();
}

//let channel = await client.channels.fetch(friendObject.dmChannel.id);
//await channel.send(MESSAGE);       