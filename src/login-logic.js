const keytar = require('./keytar-utils.js');

async function attach (screen, ui, clientLogic) {
    const client = clientLogic.client;

    ui.submitBtn.on("click", async (element) => {
        const tokenInput = ui.tokenInput.value.trim();
        if (tokenInput === "") return;

        const originalText = ui.submitBtn.content;
        ui.submitBtn.setContent("Logging in...");

        try {
            await client.login(tokenInput);
        }
        catch (error) {
            ui.submitBtn.setContent(originalText);
            ui.errorMessage.show();
            screen.render();
        }
    })
}

module.exports = {attach};