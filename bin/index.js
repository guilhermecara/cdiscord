#!/usr/bin/env node

const ui = require("../src/ui.js");
const discordLogic = require("../src/discord-logic.js");
const loginLogic = require("../src/login-logic.js");
const clientLogic = require('../src/client.js');

const client = clientLogic.client;

let screen = ui.initScreen();

let loginLayout = ui.createLoginLayout();
//let discordLayout = ui.createDiscordLayout();

//discordLayout.container.hide();
loginLayout.container.hide();

loginLogic.attach(screen, loginLayout, clientLogic);
//discordLogic.attach(screen, discordLayout, clientLogic);

loginLayout.container.show();

screen.render();