#!/usr/bin/env node

const ui = require("../src/ui.js");
const discordLogic = require("../src/discord-logic.js");
const clientLogic = require('../src/client.js');

const client = clientLogic.client;

let screen = ui.initScreen();

let discordLayout = ui.createDiscordLayout(screen);

client.login(process.env.DISCORD_TOKEN);
discordLogic.attach(screen, discordLayout, clientLogic);

screen.render();
discordLayout.container.show();
