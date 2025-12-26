#!/usr/bin/env node

const ui = require("../src/ui.js");
const discordLogic = require("../src/discord-logic.js");
const loginLogic = require("../src/login-logic.js");
const clientLogic = require('../src/client.js');
const keytar = require('../src/keytar-utils.js');
let cdiscordActive = false;

(async () => {
    const screen = ui.initScreen();
    let loginLayout;
    let discordLayout;

    function loadLoginScreen() {
        screen.focusPop();
        if (discordLayout != null){
            screen.remove(discordLayout)
            discordLayout = null;
        }
        
        loginLayout = ui.createLoginLayout();
        loginLayout.tokenInput.focus(); 

        screen.realloc(); // Expensive, but assures a full reload.
        screen.render();
        setupListeners ();
        loginLogic.attach(screen, loginLayout, clientLogic);
    }

    function loadCdiscord() {
        screen.focusPop();
        if (loginLayout != null){
            screen.remove(loginLayout)
            loginLayout = null;
        }

        discordLayout = ui.createDiscordLayout();
        // Force focus onto the container or a stable child immediately
        // This prevents the screen from trying to focus a "ghost" element
        discordLayout.friends.focus(); 

        discordLogic.attach(screen, discordLayout, clientLogic);
        discordLayout.logoutButton.on("click", async (element) => {
            keytar.deleteToken();
            clientLogic.destroyClient();
            cdiscordActive = false; 
            loadLoginScreen();
        })

        screen.realloc(); // Expensive, but assures a full reload.
        screen.render();
    }

    const token = await keytar.getToken();

    function setupListeners () {
        clientLogic.getClient().on('ready', async () => {
            if (cdiscordActive) return;
            
            keytar.setToken(clientLogic.getClient().token);
            cdiscordActive = true;
            
            loadCdiscord();
        });
    }

    if (!token) { 
        loadLoginScreen();
    } else {
        try {
            await clientLogic.getClient().login(token);
        }
        catch (err) { // Invalid Token or Error.
            loadLoginScreen();
        }
    }

})();
