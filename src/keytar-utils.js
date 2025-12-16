const keytar = require("keytar");

const SERVICE = "cdiscord";
const ACCOUNT = "discord-token";

async function setToken (token) {
    await keytar.setPassword(SERVICE, ACCOUNT,token);
}

async function getToken () {
    return await keytar.getPassword(SERVICE,ACCOUNT);
}

async function hasToken () {
    if (await getToken() == undefined)
        return false;
    return true;
}

async function deleteToken (params) {
    await keytar.deletePassword(SERVICE,ACCOUNT);
}

module.exports = {setToken, hasToken, getToken, deleteToken};