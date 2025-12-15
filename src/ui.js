
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
        scrollable: true,
        alwaysScroll: true,
        mouse: true,
        scrollbar: {
            style: { bg: UNACTIVE_COLOR }
        },
        tags: true
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
        parent: sidebar,
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

    const backgroundElements = [sidebar, main, messages];
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

    messages.writeMessage = function(message, rowSize) { 
        let currentRow = "";
        let visibleInRow = 0;
        
        if (rowSize == "") {
            rowSize = messages.rowSize
        }

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

    // ---  Activations ---

    sidebar.createFriendElement = function (name, index) {
        let safeName = Array.from(name).slice(0, 10 - 3).join('') + "...";

        const friendItem = blessed.box({
            parent: sidebar,
            top: index * 3 + 5,
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
        screen,
        sidebar,
        main,
        messages,
        messageInput,
        friendSearchInput
    }; 
}

module.exports = { createInterface };