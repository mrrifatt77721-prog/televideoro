// Node.js Telegram Bot to launch the Mini App
// Requires: telegraf, dotenv
import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.WEBAPP_URL || 'https://YOUR_USERNAME.github.io/${appName}/';

if (!token) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN is missing in .env!');
  process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
  const firstName = ctx.from?.first_name || 'Friend';
  ctx.reply(
    `👋 Hello ${firstName}!\n\nWelcome to ${process.env.APP_TITLE || '${appTitle}'}.\nClick the button below to launch the Mini App:`,
    Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 Open Mini App', webAppUrl)]
    ])
  );
});

bot.help((ctx) => {
  ctx.reply('Commands:\n/start - Open Mini App\n/help - Show this guide');
});

bot.launch().then(() => {
  console.log('🤖 Telegram Mini App Bot is running successfully!');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));