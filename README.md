---
# 📇 Universal Card Reader

Smart platform to **capture, convert, and follow up** with leads from **business cards, badges, and conversations** — all in one place.
Built with a **mobile-first design**, modern UI (ShadCN + Tailwind), and a **Node.js backend**.
---

## 🚀 Features

- 🔍 **OCR Badge Scan** – Digitize cards & badges with vision AI.
- 🧠 **AI Enrichment** – Pull CRM data, intent signals, and history.
- 🎙 **Voice Summary** – Auto-generate summaries of conversations.
- 📩 **1-Tap Follow-up** – Send docs, book meetings, or sync to CRM.
- 📱 **Responsive UI** – Optimized for mobile-first experience.

---

## 🏗 Project Structure

```
universal-card-reader/
│── client/        # React + Tailwind + ShadCN UI (frontend)
│── server/        # Node.js + Express (backend)
│── package.json   # root-level scripts to run both
│── README.md
│── .gitignore
```

---

## ⚡️ Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/universal-card-reader.git
cd universal-card-reader
```

### 2. Install Dependencies

Install client & server packages:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Run Development Servers

Frontend & backend together:

```bash
npm run dev
```

Or separately:

```bash
npm run client   # React app
npm run server   # Node backend
```

---

## 🔑 Environment Variables

Create a `.env` file in `server/` for backend config:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_api_key
```

---

## 📦 Deployment

- **Frontend** → Vercel / Netlify
- **Backend** → Render / Railway / Heroku

---

## 📸 Demo Preview

> _Add screenshots or GIF of scanning flow, form submission, and dashboard here_

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---
