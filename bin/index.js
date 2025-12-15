#!/usr/bin/env node

const { createInterface} = require('../src/ui.js');
const { client, getFriends, sendMessage } = require('../src/client.js');

const ui = createInterface();
const { screen, sidebar, main, messages, messageInput, friendSearchInput} = ui;

let loggedIn = false;

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
    await sendMessage(getFriends(),text);
    messages.pushLine(`{grey-fg}[${time}]{/grey-fg} {bold}${client.user.globalName}:{/bold} ${text}`);
  }
  catch (error) {
    messages.pushLine('{red-fg}System:{/red-fg} An error has occured'); // Change to index
    if (process.env.DEBUG == "true") {
      messages.pushLine(`Debug: ${error.message}`);
    }
  }
  finally {
    messageInput.clearValue();
    messageInput.focus();
    messages.setScrollPerc(100);
    screen.render();
  }
});

messages.pushLine('{blue-fg}System:{/blue-fg} Welcome to Cdiscord!'); // Change to index
screen.render();

client.on('ready', async () => {
  messages.pushLine(`{blue-fg}System:{/blue-fg} Discord loaded. Welcome, ${client.user.globalName}`); // Change to index
  loggedIn =  true;
  screen.render();
})

client.login(process.env.DISCORD_TOKEN);

//let channel = await client.channels.fetch(friendObject.dmChannel.id);
//await channel.send(MESSAGE);       