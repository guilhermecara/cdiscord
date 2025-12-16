const keytar = require('./keytar-utils.js');

function attach (screen, ui, clientLogic) {

  const { container, sidebar, main, messages, friends, messageInput, friendSearchInput} = ui;
  const client = clientLogic.client;

  let loggedIn = false;

  let selectedChannel = "";

  messages.writeMessage('{blue-fg}System:{/blue-fg} Welcome to Cdiscord!');
  screen.render();
  
  // Discord Client Events
  
    messages.writeMessage(`{blue-fg}System:{/blue-fg} Discord loaded. Welcome, ${client.user.username}`); // Change to index
    loadMessages ();
    loadFriends ();
    
    loggedIn =  true;
    screen.render();

  client.on('messageCreate', async message => {
      if (message.channelId != selectedChannel) return;

      messages.pushLine(`{blue-fg}${message.author.username}:{/blue-fg} ${message.content}`);
      messages.setScrollPerc(messages.getScrollPerc() + 1);
      screen.render();
  });

  // Helper Functions

  async function loadMessages () {
    if (!selectedChannel) return;
    
    messages.setContent('');
    messages.pushLine('{yellow-fg}Loading...{/yellow-fg}');
    screen.render();

    messages.setContent(''); 
    const chatHistory = await clientLogic.getMessages(selectedChannel);
    for (let i = chatHistory.length - 1; i > -1; i--) {
      let message = chatHistory[i];
      let nameColor = "blue";
      if (message.author == client.user.username) {
        nameColor = "cyan";
      }
      messages.writeMessage(`{${nameColor}-fg}${message.author}:{/${nameColor}-fg} ${message.content}`);
    }
    messages.setScrollPerc(100);

    screen.realloc(); // Expensive, but assures a full reload.
    screen.render();
  }

  async function loadFriends (searchValue) {
    let friendList = await clientLogic.getFriends();
    
    friends.children.slice().forEach(child => {
      if (child.options.label == "Search") return;
      child.destroy();
    });

    let imagePos = 0;
    for (let i = 0; i < friendList.length; i++) {
      if (!filterSearchBarInput(friendList[i].name, searchValue)) continue;

      let friendItem = friends.createFriendElement(friendList[i].name, imagePos);
      friendItem.on("click", (element) => {
        screen.focusPop();
        friends.children.slice().forEach(child => {
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

  // UI-Events

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

  friendSearchInput.on("keypress", async (ch, key) => {
    setTimeout(() => {
      loadFriends(friendSearchInput.value);
    }, 0);
  })
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

module.exports = { attach };