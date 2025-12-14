>[!CAUTION]
>**This project is a proof of concept and using it may lead to an account block according to the [Discord TOS](https://discord.com/terms).**
>**I do not take responsability for any blocked account.**

# About

**Welcome to Cdiscord** a CLI interface for discord! 

# Capabilities

1. Message your friends via the shell!

# Dependencies

- [Node.js](https://nodejs.org/en)
- [Npm](https://www.npmjs.com/)

## Manual Installation

Run those commands
```bash
git clone https://github.com/you/mycli
cd mycli
npm install
npx pkg .
```

Run the command cdiscord to run!


## Get your discord token

To use Cdiscord, you'll need to get your discord token. 

**Run this on the Discord Console - [Ctrl + Shift + I]**

```js
window.webpackChunkdiscord_app.push([
	[Symbol()],
	{},
	req => {
		if (!req.c) return;
		for (let m of Object.values(req.c)) {
			try {
				if (!m.exports || m.exports === window) continue;
				if (m.exports?.getToken) return copy(m.exports.getToken());
				for (let ex in m.exports) {
					if (m.exports?.[ex]?.getToken && m.exports[ex][Symbol.toStringTag] !== 'IntlMessagesProxy') return copy(m.exports[ex].getToken());
				}
			} catch {}
		}
	},
]);

window.webpackChunkdiscord_app.pop();
console.log('%cWorked!', 'font-size: 50px');
console.log(`%cYou now have your token in the clipboard!`, 'font-size: 16px');
```
- Based: [findByProps](https://discord.com/channels/603970300668805120/1085682686607249478/1085682686607249478)

## Credits
- [Discord.js](https://github.com/discordjs/discord.js)
- [Discord.js-Selfbot](https://github.com/aiko-chan-ai/discord.js-selfbot-v13)


