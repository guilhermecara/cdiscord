function attach (screen, ui, clientLogic) {
    const client = clientLogic.client;

    try {
        client.login(process.env.DISCORD_TOKEN);
    }
    catch {
        
    }

    ui.submitBtn.on("click", (element) => {

    })
}

module.exports = {attach};