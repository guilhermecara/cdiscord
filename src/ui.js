
const blessed = require('blessed');

const UNACTIVE_COLOR = 'blue';
const ACTIVE_COLOR = 'cyan';


function createInterface() {
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

    friendSearchInput.on('submit', (text) => {}); // Implement search mechanic locally?

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

    screen.writeMessage = function(message) {
        messages.pushLine(`${message}`);
    };

    return {
        screen,
        sidebar,
        main,
        messages,
        messageInput,
        friendSearchInput
    }; 
}

module.exports = { createInterface, writeMessage };