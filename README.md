# Auto Post App 🚀

A centralized "Control Room" for social media automation. Write your content once (text, image, or video), schedule it, and automatically publish to LinkedIn, X (Twitter), Facebook, and Instagram.

![App Screenshot](https://via.placeholder.com/1200x600?text=Auto+Post+Dashboard+Preview)

## ✨ Features

*   **Unified Post Creator**: Drag-and-drop support for Images and Videos.
*   **Weekly Queue System**: Visual timeline of your upcoming content with Drag & Drop reordering.
*   **Smart Scheduling**: Auto-slots posts into daily 10 AM slots (configurable).
*   **Multi-Platform Support**:
    *   LinkedIn (Personal & Company Pages)
    *   X (Twitter)
    *   Facebook
    *   Instagram
*   **Analytics Dashboard**: Track engagement and growth across all channels.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Database**: SQLite (Local) / PostgreSQL (Production) via [Prisma ORM](https://www.prisma.io/)
*   **Styling**: Tailwind CSS + Lucide Icons
*   **File Storage**: Local filesystem (MVP) or Cloudinary/S3 (Production)

## 🚀 Getting Started

### 1. Prerequisities
*   Node.js 18+ installed

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/auto-post-app.git

# Navigate to directory
cd auto-post-app/web-app

# Install dependencies
npm install

# Initialize Database
npx prisma db push
```

### 3. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

To make this available for others or run 24/7:
1.  **Database**: Switch `schema.prisma` to use PostgreSQL.
2.  **Hosting**: Deploy to [Vercel](https://vercel.com).
3.  **Storage**: Configure an external object store (like AWS S3 or Vercel Blob) for image/video uploads.

See `deployment_guide.md` for full instructions.

## 🔒 Configuration

Create a `.env` file in the root based on `.env.example`:
```env
DATABASE_URL="file:./dev.db"

# Social Keys (Optional for local dev)
FACEBOOK_CLIENT_ID=""
LINKEDIN_CLIENT_ID=""
TWITTER_API_KEY=""
```

## 📄 License
MIT
