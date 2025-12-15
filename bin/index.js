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
    messages.writeMessage(`{cyan-fg}${client.user.globalName}:{/cyan-fg} ${text}`);
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
    if (message.channelId != selectedChannel) return;

    messages.pushLine(`{blue-fg}${message.author.username}:{/blue-fg} ${message.content}`);
    messages.setScrollPerc(messages.getScrollPerc() + 1);
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

friendSearchInput.on("keypress", async (ch, key) => {
  setTimeout(() => {
    loadFriends(friendSearchInput.value);
  }, 0);
})

async function loadFriends (searchValue) {
  let friendList = await getFriends();
  
  sidebar.children.slice().forEach(child => {
    if (child.options.label == "Search") return;
    child.destroy();
  });

  let imagePos = 0;
  for (let i = 0; i < friendList.length; i++) {
    if (!filterSearchBarInput(friendList[i].name, searchValue)) continue;

    let friendItem = sidebar.createFriendElement(friendList[i].name, imagePos);
    friendItem.on("click", (element) => {
      screen.focusPop();
      sidebar.children.slice().forEach(child => {
        if (child.options.content == friendList[i].name) {
          child.style.border.fg = "cyan";
          return;
        }
        child.style.border.fg = "blue";
      });
      selectedChannel = friendList[i].channelId;
      loadMessages();
    })
    
    imagePos++;
  }

  screen.render();
}

function filterSearchBarInput(friendName, searchValue) {
  if (!searchValue || searchValue.trim() === "") {
      return true;
  }
  
  if (!friendName) return false;

  let normalizedName = friendName.toLowerCase().trim();
  let normalizedSearch = searchValue.toLowerCase().trim();
  
  return normalizedName.includes(normalizedSearch);
}    