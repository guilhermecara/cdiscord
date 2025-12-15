// MAIN UI LAYOUT FACTORY. //

const blessed = require('neo-blessed');

const UNACTIVE_COLOR = 'blue';
const ACTIVE_COLOR = 'cyan';

let screen = null;

function initScreen () {
    if (screen) return screen;

    screen = blessed.screen({
        smartCSR: true,
        title: 'CDiscord',
        fullUnicode: true,
        dockBorders: true
    });

    screen.enableMouse();
    screen.key(['q','C-c'], () => process.exit(0));
    return screen;
}

function createLoginLayout() {
    const container = blessed.box({
        parent: screen,
        width: '100%',
        height: '100%',
        mouse: true,
        hidden: false,
    });

    const main = blessed.box({
        parent: container,
        width: '80%',
        height: '80%',
        top: 'center',
        left: 'center',
        label: "Welcome to Cdiscord",
        border: 'line',
        mouse: true,
        hidden: false,
    })

    const label = blessed.box ({
        parent: main,
        top: "15%",
        left: 'center',
        width: '60%',
        height: 4,
        content: ' Input a valid discord Token. (Refer to the GitHub page for instructions on how to acquire one) ',
        border: 'line',
    })

    const form = blessed.box({
        parent: main,
        top: 'center',
        left: 'center',
        width: '50%',
        height: 12,
        label: ' Login ',
        border: 'line',
        tags: true,
        mouse: true
    });

    const tokenInput = blessed.textbox({
        parent: form,
        top: 2,
        left: 'center',
        width: '90%',
        height: 3,
        label: ' Discord Token ',
        border: 'line',
        style: { border: { fg: 'blue' }, focus: { border: { fg: 'cyan' } } },
        inputOnFocus: true,
        censor: false, // Hide the token with asterisks
        keys: true,
        mouse: true
    });

    const submitBtn = blessed.button({
        parent: form,
        bottom: 1,
        left: 'center',
        width: '50%',
        height: 3,
        content: 'Connect',
        align: 'center',
        valign: 'middle',
        border: 'line',
        style: { 
            border: { fg: 'cyan' },
            hover: { bg: 'cyan', fg: 'black' },
            focus: { bg: 'cyan', fg: 'black' } // Visual feedback
        },
        mouse: true,
        keys: true
    });

    return { container, form, tokenInput, submitBtn };
}

function createDiscordLayout() {

    const container = blessed.box ({
        parent: screen,
        width: '100%',
        height: '100%',
        mouse: true,
        hidden: false,
    })

    const sidebar = blessed.box({
        parent: container,
        top: 0,
        left: 0,
        width: '20%',
        height: '100%',
        border: 'line',
        mouse: true,
        tags: true
    });

    const friends = blessed.box({
        parent: sidebar,
        width: '100%-2',
        height: '100%',
        label: ' Friends ',
        scrollable: true,
        alwaysScroll: true,
        mouse: true,
        scrollbar: {
            style: { bg: UNACTIVE_COLOR }
        },
        tags: true
    });

    const main = blessed.box({
        parent: container,
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
        height: '100%-5',
        scrollable: true,
        alwaysScroll: true,
        mouse: true,
        scrollbar: {
            style: { bg: UNACTIVE_COLOR }
        },
        tags: true
    });

    const friendSearchInput = blessed.textbox({
        parent: friends,
        top: 0, 
        width: '100%-3', 
        height: 3, 
        inputOnFocus: true, 
        border: 'line', 
        label: 'Search', 
        keys: true, 
        mouse: true, 
        style: {
            border: { fg: UNACTIVE_COLOR },
            focus: { border: { fg: ACTIVE_COLOR } }
        }
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

    const backgroundElements = [sidebar, main, messages, friends];
    const textInputs = [messageInput, friendSearchInput];

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

    // --- UI Functions ---

    messages.writeMessage = function(message) { 
        let currentRow = "";
        let visibleInRow = 0;
        
        let rowSize = this.rowSize

        let i = 0;
        while (i < message.length) {
            const tagStart = message.indexOf("{", i);
            
            if (tagStart === -1) {
                const remaining = message.substring(i);
                i = message.length;
                
                for (const char of remaining) {
                    currentRow += char;
                    visibleInRow++;
                    
                    if (visibleInRow >= rowSize) {
                        this.pushLine(currentRow);
                        currentRow = "";
                        visibleInRow = 0;
                    }
                }
            } else {
                const visibleText = message.substring(i, tagStart);
                for (const char of visibleText) {
                    currentRow += char;
                    visibleInRow++;
                    
                    if (visibleInRow >= rowSize) {
                        this.pushLine(currentRow);
                        currentRow = "";
                        visibleInRow = 0;
                    }
                }
                
                const tagEnd = message.indexOf("}", tagStart + 1);
                if (tagEnd === -1) {
                    const remaining = message.substring(tagStart);
                    for (const char of remaining) {
                        currentRow += char;
                        visibleInRow++;
                        if (visibleInRow >= rowSize) {
                            this.pushLine(currentRow);
                            currentRow = "";
                            visibleInRow = 0;
                        }
                    }
                    break;
                }
                
                const fullTag = message.substring(tagStart, tagEnd + 1);
                currentRow += fullTag;
                
                i = tagEnd + 1;
            }
        }
        
        if (currentRow.length > 0) {
            this.pushLine(currentRow);
        }
    };

    friends.createFriendElement = function (name, index) {
        let safeName = Array.from(name).slice(0, 10 - 3).join('') + "...";

        const friendItem = blessed.box({
            parent: friends,
            top: index * 2 + 3,
            width: '100%-3',
            height: 3,
            content: name,   
            border: 'line',
            mouse: true,
            tags: true,
            wrap: false,    
            style: {
                border: { fg: UNACTIVE_COLOR },
                focus: { border: { fg: ACTIVE_COLOR } }
            }
        });

        return friendItem;
    };

    return {
        container,
        sidebar,
        main,
        messages,
        friends,
        messageInput,
        friendSearchInput
    }; 
}

module.exports = { initScreen, createLoginLayout, createDiscordLayout };