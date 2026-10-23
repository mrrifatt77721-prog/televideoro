# ${appTitle} (TeleVideo Pro Telegram Mini App)

${description}

---

## 📱 How This Architecture Works
- **Frontend (TMA UI)**: Hosted for free on **GitHub Pages** (via automated GitHub Actions in `.github/workflows/deploy.yml`).
- **Backend (Telegram Bot)**: Runs 24/7 on **Render.com** (Free Node.js Web/Background Service) or Railway.

---

## 🛠️ Step 1: Deploy Frontend to GitHub Pages
1. Push this project to a new GitHub repository named `${appName}`.
2. Go to **Settings > Pages** and select **GitHub Actions** as the source.
3. Once the workflow completes, copy your live URL (e.g. `https://YOUR_USERNAME.github.io/${appName}/`).

---

## 🤖 Step 2: Configure Telegram Bot with @BotFather
1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/newbot` to create your bot and copy the **HTTP API Token**.
3. Send `/newapp` to register the Mini App:
   - Select your bot.
   - Enter a title and short description.
   - When asked for the **Web App URL**, paste your GitHub Pages link from Step 1.
   - Choose a short name (e.g. `${appName.slice(0, 10)}`).

---

## ⚡ Step 3: Run the Bot Backend
1. Copy `.env.example` to `.env`.
2. Fill in:
   ```env
   TELEGRAM_BOT_TOKEN=your_token_from_botfather
   WEBAPP_URL=https://YOUR_USERNAME.github.io/${appName}/
   ```
3. Run locally:
   ```bash
   cd server
   npm install telegraf dotenv
   node bot.js
   ```
4. For 24/7 hosting, connect this repository to **Render.com** as a "Web Service" or "Background Worker".