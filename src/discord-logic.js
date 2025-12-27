const nodeEmoji = require('node-emoji');

const USER_MESSAGE_COLOR = "cyan";
const OTHER_MESSAGE_COLOR = "blue";

function attach (screen, ui, clientLogic) {

  const { container, sidebar, main, messages, friends, messageInput, friendSearchInput, logoutButton, serverList, channelList, highlightBoxElement, blurBoxElement} = ui;
  let client = clientLogic.getClient();

  let loggedIn = false;

  let selectedChannel = "";
  let selectedServer;

  // --- Initial Setup ---

  messages.writeMessage(`{blue-fg}System:{/blue-fg} Discord loaded. Welcome, ${client.user.username}`); // Change to index
  loadMessages ();
  loadFriends ();
  loadServers ();
  
  loggedIn =  true;
  screen.render();
  
  // --- Discord Client Events ---
  
  client.on('messageCreate', async message => {
      if (message.channelId != selectedChannel) return;

      let nameColor = OTHER_MESSAGE_COLOR;
      if (message.author.username == client.user.username) {
        nameColor = USER_MESSAGE_COLOR;
      }

      let parsedMessage = `{${nameColor}-fg}${message.author.username}:{/${nameColor}-fg} ${message.content}`;
      messages.writeMessage(parsedMessage)

      messages.setScrollPerc(messages.getScrollPerc() + 1);
      screen.render();
  });

  // Helper Functions

  async function loadMessages () {
    if (!selectedChannel) return;
    
    let channelInfo = await clientLogic.getChannelInfo(selectedChannel);
    if (!channelInfo) return;

    messages.setContent('');
    messages.writeMessage('{yellow-fg}Loading...{/yellow-fg}')
    screen.render();

    messages.setContent(''); 
    try {
      const chatHistory = await clientLogic.getMessages(selectedChannel);
      for (let i = chatHistory.length - 1; i > -1; i--) {
        let message = chatHistory[i];
        let nameColor = OTHER_MESSAGE_COLOR;
        if (message.author == client.user.username) {
          nameColor = USER_MESSAGE_COLOR;
        }

        let parsedMessage = `{${nameColor}-fg}${message.author}:{/${nameColor}-fg} ${message.content}`;
        messages.writeMessage(parsedMessage);
      }
      messages.setScrollPerc(100);
    }
    catch {
      messages.writeMessage('{red-fg}System:{/red-fg} Unable to retrieve the message history');
      channelInfo.canSend = false;
    }

    messageInput.hidden = !channelInfo.canSend;

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

        channelList.children.slice().forEach(child => { // Bugfix with message history selection
          blurBoxElement(child);
        });

        friends.children.slice().forEach(child => {
          if (child.options.content == friendList[i].name) {
            highlightBoxElement(child);
            return;
          }
          blurBoxElement(child);
        });

        selectedChannel = friendList[i].channelId;
        loadMessages();
      })
      
      imagePos++;
    }

    screen.render();
  }

  async function loadServers () {
    let servers = await clientLogic.getServers();

    serverList.children.forEach(child => {
      child.destroy();
    });
    serverList.setContent('');

    for (let i = 0; i < servers.length; i++) {
      let serverItem = serverList.createServerListElement(servers[i].name, i);
      serverItem.on("click", (element) => {
        screen.focusPop();

        channelList.children.forEach(child => {
          child.destroy();
        });

        serverList.children.slice().forEach(child => {
          if (child.options.content == servers[i].name) {
            highlightBoxElement(child);
            return;
          }
          blurBoxElement(child);
        });
        selectedServer = servers[i].id;
        loadChannels(selectedServer);

        messages.setContent('');
        messageInput.hidden = true;
        screen.realloc(); 
        screen.render();
      })
    }
    
    screen.render();
  }

  async function loadChannels(serverId) {
    let channels = await clientLogic.getChannels(serverId);

    channelList.children.forEach(child => {
      child.destroy();
    });
    channelList.setContent('');

    for (let i = 0; i < channels.length; i++) {
      if (channels[i].type != "GUILD_TEXT") continue;

      let channelName = nodeEmoji.strip(channels[i].name);
      let channelItem = channelList.createChannelListElement(channelName, i);

      channelItem.on("click", (element) => {
        screen.focusPop();
        friends.children.slice().forEach(child => {
          blurBoxElement(child);
        });
        channelList.children.slice().forEach(child => {
          if (child.options.content == channelName) {
            highlightBoxElement(child);
            return;
          }
          blurBoxElement(child);
        });
        selectedChannel = channels[i].id;
        loadMessages();
      })
    }

    channelList.setScrollPerc(0);
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
      await clientLogic.sendMessage(selectedChannel,text);
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