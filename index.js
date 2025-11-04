const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

// WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "whatsapp-bot-codespaces"
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR Code Generation
client.on('qr', (qr) => {
    console.log('\n🔄 SCAN THIS QR CODE WITH YOUR WHATSAPP:');
    console.log('=========================================');
    qrcode.generate(qr, { small: true });
    console.log('\n📱 INSTRUCTIONS:');
    console.log('1. Open WhatsApp on your phone');
    console.log('2. Tap Menu → Linked Devices');
    console.log('3. Tap "Link a Device"');
    console.log('4. Scan the QR code above');
    console.log('=========================================\n');
});

client.on('ready', () => {
    console.log('✅ WhatsApp Bot is READY and ONLINE!');
});

client.on('authenticated', () => {
    console.log('🔐 WhatsApp authenticated successfully!');
});

// Message Handling
client.on('message', async (message) => {
    if (message.body.startsWith('.')) {
        const command = message.body.split(' ')[0].toLowerCase();
        const query = message.body.slice(command.length).trim();

        try {
            let response = '';
            
            switch (command) {
                case '.movie':
                    response = query ? `🎬 Movie Search: "${query}"\n🔗 https://www.themoviedb.org/search?query=${encodeURIComponent(query)}` : '🎬 Usage: .movie <query>';
                    break;
                case '.ping':
                    response = '🏓 Bot is active! Type .menu for commands';
                    break;
                case '.tt':
                    response = query ? `📱 TikTok Search: "${query}"\n🔗 https://www.tiktok.com/search?q=${encodeURIComponent(query)}` : '📱 Usage: .tt <query>';
                    break;
                case '.gg':
                    response = query ? `🔍 Google Search: "${query}"\n🔗 https://www.google.com/search?q=${encodeURIComponent(query)}` : '🔍 Usage: .gg <query>';
                    break;
                case '.yt':
                    response = query ? `📺 YouTube Search: "${query}"\n🔗 https://www.youtube.com/results?search_query=${encodeURIComponent(query)}` : '📺 Usage: .yt <query>';
                    break;
                case '.menu':
                    response = `🤖 BOT MENU\n🎬 .movie <query> - Search movies\n📺 .yt <query> - Search YouTube\n🔍 .gg <query> - Search Google\n📱 .tt <query> - Search TikTok\n🏓 .ping - Bot status`;
                    break;
                default:
                    response = '❌ Unknown command. Type .menu for available commands.';
            }
            
            await message.reply(response);
            
        } catch (error) {
            console.error('Command error:', error);
            await message.reply('❌ Error processing command. Please try again.');
        }
    }
});

// Web interface
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>WhatsApp Bot</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .status { background: #4CD964; color: white; padding: 20px; border-radius: 10px; }
            </style>
        </head>
        <body>
            <h1>🤖 WhatsApp Bot</h1>
            <div class="status">
                <h2>✅ Bot is Running</h2>
                <p>Check terminal for QR code</p>
            </div>
        </body>
        </html>
    `);
});

// Initialize WhatsApp
client.initialize();

// Start web server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Web interface: http://localhost:${PORT}`);
    console.log('🚀 Bot starting... Wait for QR code...');
});
