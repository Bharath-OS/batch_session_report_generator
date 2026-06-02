# QuickReport

> **Generate professional batch session reports in seconds.**

QuickReport is a Next.js web application that streamlines daily session reporting for coding academies. It combines a live report preview, AI-powered summary generation (via Groq), smart attendance tracking, and a Google Sheets-backed admin dashboard — all in one responsive interface.

**Live Demo →** [batch-session-report-generator.vercel.app](https://batch-session-report-generator.vercel.app/)

---

## Features

### AI Session Summaries
Write a quick bullet-point prompt of what was covered, and the built-in AI (Groq + Llama 3.3 70B) generates a well-written paragraph summary in first person — structured as task, activity, and improvement.

### Live Report Preview
All fields — session details, AI summary, attendance, and TLDV link — update a live preview in real time. No need to open a modal to see your report.

### Smart Attendance
An accordion-based attendance panel shows a summary count when collapsed. Use the **Invert** toggle to flip attendance with one click. Marking a student present/absent updates the preview instantly.

### One-Click Copy
A **Copy Report** button sits in the top-right corner of the preview card. Click it to copy the full formatted report to your clipboard. The button validates that all required fields are filled before copying, showing inline red hints on any missing fields.

### Google Sheets Admin Dashboard
An admin panel (`/admin`) provides full CRUD over the student roster — add, edit, delete, and search students by name. Data is stored in Google Sheets via a Google Apps Script proxy.

### IP-Based Rate Limiting
The AI summary endpoint is rate-limited to 10 requests per minute per IP address (identified via `x-forwarded-for`), ensuring fair usage across multiple users within the free-tier quota.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| AI | [Groq](https://groq.com/) — `llama-3.3-70b-versatile` |
| Data | [Google Sheets](https://www.google.com/sheets/about/) via Apps Script |
| Deployment | [Vercel](https://vercel.com/) |

---

## How It Works

1. **Admin adds students** via the admin dashboard (`/admin`). Each student has a name, group, and status.
2. **Select your group** and fill in session details: date, trainer name, coordinators, prepared by.
3. **Write a quick prompt** about what was covered and click **Generate Session Summary** — the AI returns a polished paragraph.
4. **Mark attendance** by expanding the accordion and clicking student names. Use **Invert** to flip all at once.
5. **Copy the report** using the button in the preview card header. The formatted text is ready to share on WhatsApp, Slack, or email.

---

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):

| Variable | Description |
|---|---|
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `GROQ_API_KEY` | Groq API key (free at [console.groq.com](https://console.groq.com)) |
| `GROQ_MODEL` | Groq model ID (default: `llama-3.3-70b-versatile`) |

Optional:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_GOOGLE_SHEET_URL` | Google Apps Script web app URL for the student roster |

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/Bharath-OS/batch_session_report_generator.git
cd batch_session_report_generator

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your API keys and admin credentials

# 4. Start the dev server
npm run dev

# 5. Open http://localhost:3000
```

---

## Project Structure

```
src/
├── app/
│   ├── admin/               # Admin dashboard (login, student CRUD)
│   ├── api/
│   │   ├── ai/summarize/    # Groq AI summary endpoint
│   │   ├── auth/login/      # Server-side login endpoint
│   │   └── sheets/          # Google Sheets proxy endpoint
│   ├── layout.tsx
│   └── page.tsx             # Main session report page
├── components/
│   ├── FormElements.tsx     # Input, Select, Textarea, Button, Label
│   ├── Modal.tsx
│   └── Toast.tsx            # Auto-dismiss notification toast
└── lib/
    ├── config.ts            # Env configuration
    └── sheets.ts            # Sheets API client (get/add/update/delete)
```

---

## Deployment

The app is designed to deploy seamlessly on [Vercel](https://vercel.com/):

```bash
npm run build    # Build for production
npm start        # Start the production server
```

On Vercel, add all environment variables from the `.env` file in your project dashboard under **Settings → Environment Variables**, then deploy. The `main` branch auto-deploys.

---

## License

MIT
