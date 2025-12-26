#!/usr/bin/env node

const ui = require("../src/ui.js");
const discordLogic = require("../src/discord-logic.js");
const loginLogic = require("../src/login-logic.js");
const clientLogic = require('../src/client.js');
const keytar = require('../src/keytar-utils.js');

const client = clientLogic.client;
let cdiscordActive = false;

(async () => {
    const screen = ui.initScreen();
    let loginLayout;
    let discordLayout;

    function loadLoginScreen() {
        if (discordLayout != null){
            screen.remove(discordLayout)
            discordLayout = null;
        }

        loginLayout = ui.createLoginLayout();
        loginLayout.tokenInput.focus(); 

        screen.render();
        loginLogic.attach(screen, loginLayout, clientLogic);
    }

    function loadCdiscord() {
        if (loginLayout != null){
            screen.remove(loginLayout)
            loginLayout = null;
        }

        discordLayout = ui.createDiscordLayout();
        // Force focus onto the container or a stable child immediately
        // This prevents the screen from trying to focus a "ghost" element
        discordLayout.friends.focus(); 

        screen.render();
        discordLogic.attach(screen, discordLayout, clientLogic);
        discordLayout.logoutButton.on("click", async (element) => {
            keytar.deleteToken();
            client.destroy(); 
            cdiscordActive = false; 
            loadLoginScreen();
        })
    }

    const token = await keytar.getToken();

    client.on('ready', async () => {
        if (cdiscordActive) return;
                
        keytar.setToken(client.token);
        cdiscordActive = true;

        loadCdiscord();
    });

    if (!token) { 
        loadLoginScreen();
    } else {
        try {
            await clientLogic.client.login(token);
        }
        catch (err) { // Invalid Token or Error.
            loadLoginScreen();
        }
    }

})();
