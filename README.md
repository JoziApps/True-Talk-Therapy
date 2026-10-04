# True Talk Therapy

A free, mobile-friendly AI support chatbot designed as a safe space for real talk.

**Live demo:** (after you deploy) `https://your-project.vercel.app`

---

## What is this?

True Talk Therapy is a web-based AI companion that offers warm, non-judgmental conversation.  
It is **not** professional therapy or medical advice.

Features:
- Consent gate before entering the chat
- Clean dark mobile-first design
- Uses your own free Google Gemini API key (privacy-friendly)
- Strong crisis disclaimer + SADAG number
- Works well when shared on WhatsApp, Facebook, X, etc.

---

## How to Deploy on Vercel (Recommended)

### 1. Push this folder to GitHub
1. Create a new repository on GitHub (name it `true-talk-therapy`)
2. Upload all the files in this folder (or use Git)

### 2. Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **Add New Project**
4. Import your `true-talk-therapy` repository
5. Click **Deploy**

Your site will be live in under a minute.

### 3. (Optional) Custom Domain
In the Vercel dashboard you can add your own domain later.

---

## How Users Use It

1. They land on the consent page
2. They must tick the checkbox and click “Enter”
3. On first visit they paste their own free Gemini API key (get one at [aistudio.google.com](https://aistudio.google.com/app/apikey))
4. They start chatting

The API key stays only in their browser (localStorage). Nothing is stored on any server.

---

## Local Testing

Just open `index.html` in a browser, or use a simple local server:

```bash
npx serve .
