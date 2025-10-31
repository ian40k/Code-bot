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
    console.log('🔄 Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
    console.log('📱 WhatsApp → Linked Devices → Scan QR Code');
});

client.on('ready', () => {
    console.log('✅ WhatsApp Bot is READY and ONLINE!');
    console.log('🤖 Bot is running 24/7 on GitHub Codespaces');
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
                    if (!query) {
                        response = '🎬 Usage: .movie <query>\nExample: .movie avengers';
                    } else {
                        response = `🎬 Movie Search: "${query}"\n🔗 https://www.themoviedb.org/search?query=${encodeURIComponent(query)}`;
                    }
                    break;
                    
                case '.ping':
                    response = `🏓 Bot is active!\n\n📢 WhatsApp Channel:\nhttps://whatsapp.com/channel/0029Vb71mgIElaglZCU0je0x\n\nType .menu for all commands`;
                    break;
                    
                case '.tt':
                    if (!query) {
                        response = '📱 Usage: .tt <query>\nExample: .tt dance tutorial';
                    } else {
                        response = `📱 TikTok Search: "${query}"\n🔗 https://www.tiktok.com/search?q=${encodeURIComponent(query)}`;
                    }
                    break;
                    
                case '.gg':
                    if (!query) {
                        response = '🔍 Usage: .gg <query>\nExample: .gg weather today';
                    } else {
                        response = `🔍 Google Search: "${query}"\n🔗 https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    }
                    break;
                    
                case '.yt':
                    if (!query) {
                        response = '📺 Usage: .yt <query>\nExample: .yt funny cats';
                    } else {
                        response = `📺 YouTube Search: "${query}"\n🔗 https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                    }
                    break;
                    
                case '.menu':
                    response = `🤖 BOT MENU 🤖\n\n🎬 .movie <query> - Search movies\n📺 .yt <query> - Search YouTube\n🔍 .gg <query> - Search Google\n📱 .tt <query> - Search TikTok\n🏓 .ping - Bot status\n📖 .menu - Show this menu`;
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
            <title>WhatsApp Bot - GitHub Codespaces</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .status { background: #4CD964; color: white; padding: 20px; border-radius: 10px; }
            </style>
        </head>
        <body>
            <h1>🤖 WhatsApp Bot</h1>
            <div class="status">
                <h2>✅ Bot is Running on GitHub Codespaces</h2>
                <p>Check your terminal for QR code to scan with WhatsApp</p>
            </div>
        </body>
        </html>
    `);
});

// Initialize
client.initialize();

// Start web server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Web interface: http://localhost:${PORT}`);
    console.log('🚀 Bot starting... Wait for QR code...');
});
