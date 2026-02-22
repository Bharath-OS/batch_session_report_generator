# QuickReport 🚀
**The fastest way to generate and sync batch session reports.**

QuickReport is a lightweight web application built with **Next.js** designed to help batch coordinators and students generate professional session reports in seconds. It automates the tedious parts of reporting—like tracking attendance and formatting text—while keeping everything synced with a **Google Sheets** backend.

Live Demo: [https://batch-session-report-generator.vercel.app/](https://batch-session-report-generator.vercel.app/)

---

## ✨ Key Features

- **Smart Attendance Logic:** Instead of manually checking every name, use the **Invert Toggle**. Mark the few students who are absent (or present), and let the system handle the rest.
- **Instant Report Generation:** Converts form data into a perfectly formatted text summary ready for sharing on WhatsApp or Slack.
- **Google Sheets Integration:** No expensive database needed. Uses Google Apps Script to securely Add, Edit, and Delete student records in real-time.
- **Role-Based Workflow:** - **Admin:** Manage the student roster (CRUD operations).
  - **Students:** Fill out daily session details and generate reports.
- **Mobile Responsive:** Built with Tailwind CSS to ensure reporting can be done from any device.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Google Sheets API / Apps Script](https://developers.google.com/apps-script)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 How It Works

1. **Setup Batch:** The Admin adds the student list via the Admin Dashboard.
2. **Input Session Details:** The reporter enters the Date, Trainer Name, and a brief Session Summary.
3. **Smart Attendance:** - Select the few students who are absent.
   - Click "Invert" to automatically mark everyone else as present.
4. **Generate & Share:** Click "Generate Report" to get a clean text summary. Use the "Copy" button to share it with your group instantly.

---

## ⚙️ Configuration (For Developers)

To run this locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/quickreport.git](https://github.com/your-username/quickreport.git)
