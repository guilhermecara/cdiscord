#!/usr/bin/env node

const blessed = require('blessed');

const UNACTIVE_COLOR = 'blue';
const ACTIVE_COLOR = 'cyan';

const screen = blessed.screen({
  smartCSR: true,
  title: 'Cdiscord',
  fullUnicode: true
});

screen.enableMouse();
screen.key(['q', 'C-c'], () => process.exit(0));

const sidebar = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: '20%',
  height: '100%',
  label: ' Friends ',
  border: 'line',
  mouse: true,
});

const main = blessed.box({
  parent: screen,
  top: 0,
  left: '20%',
  width: '80%',
  height: '100%',
  label: ' Chat ',
  border: 'line',
  mouse: true,
});

const messages = blessed.box({
  parent: main,
  top: 0,
  left: 0,
  width: '100%-2',
  height: '100%-4',
  scrollable: true,
  alwaysScroll: true,
  mouse: true,
  scrollbar: {
    style: { bg: 'yellow' }
  },
  tags: true
});

// Text Inputs

const messageInput = blessed.textbox({
  parent: main,
  bottom: 0,
  left: 0,
  width: '100%-2',
  height: 3,
  inputOnFocus: true,
  border: 'line',
  label: ' Message ',
  keys: true,
  mouse: true,
  style: {
    border: { fg: UNACTIVE_COLOR },
    focus: { border: { fg: ACTIVE_COLOR } }
  }
});

const friendSearchInput = blessed.textbox({
  parent: sidebar,
  top: 0, 
  width: '100%-2', 
  height: 3, 
  inputOnFocus: true, 
  border: 'line', 
  label: '', 
  keys: true, 
  mouse: true, 
  style: {
    border: { fg: UNACTIVE_COLOR },
    focus: { border: { fg: ACTIVE_COLOR } }
  } 
});

const backgroundElements = [sidebar, main, messages];
const textInputs = [messageInput, friendSearchInput];

messageInput.on('submit', (text) => {
  if (!text.trim()) {
    messageInput.clearValue();
    messageInput.focus();
    return; 
  }
  const time = new Date().toLocaleTimeString();
  messages.pushLine(`{grey-fg}[${time}]{/grey-fg} {bold}Me:{/bold} ${text}`);
  messages.setScrollPerc(100);
  messageInput.clearValue();
  messageInput.focus();
  screen.render();
});

friendSearchInput.on('submit', (text) => {});

// --- Defocus Logic ---

backgroundElements.forEach((element) => {
  element.on('click', () => {
    textInputs.forEach(input => input.cancel());
    element.focus();
    screen.render();
  });
});

textInputs.forEach((element) => {
  element.on("click", () => {
    textInputs.forEach((_element) => {
      if (element != _element) {
        textInputs.forEach(input => input.cancel());
      }
    })
  });
});

messages.pushLine('{blue-fg}System:{/blue-fg} Welcome to Cdiscorda!');

screen.render();

/*
require("../src/env.js");

const { Client, RelationshipManager, Message } = require('discord.js-selfbot-v13');
const client = new Client();

const args = process.argv.slice(2);
const TARGET = args[0];          // username
const MESSAGE = args[1] || "";   // message

client.on('ready', async () => { // Like my main entrypoint
  console.log(client.channels);
  let friendListCache = client.relationships.friendCache;
  mouse: true,

  for (let friend of friendListCache) {
    if (friend[1]) {
      let friendObject = friend[1];
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

client.login(process.env.DISCORD_TOKEN);
*/