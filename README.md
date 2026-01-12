# Clarity - Quick Reference

## 🚀 Two Ways to Use

### Option 1: Demo Mode (Quick Start - No Setup)
1. Open `index.html` in browser
2. Click "Simulate Notifications"
3. Watch notifications get classified
4. See digest batching in action

✅ **Works immediately** - No configuration needed!

---

### Option 2: Real Email Mode (Gmail Integration)

#### Setup (One-time, ~10 minutes)

**1. Install Backend**
```bash
cd backend
npm install
```

**2. Get Gmail Credentials**
- Visit [Google Cloud Console](https://console.cloud.google.com/)
- Create project → Enable Gmail API
- Create OAuth 2.0 Client ID
- Add redirect: `http://localhost:3000/oauth2callback`
- Copy Client ID & Secret

**3. Configure**
```bash
cd backend
copy .env.example .env
# Edit .env - add your Client ID & Secret
```

**4. Start Backend**
```bash
npm start
```

#### Usage

1. Open `index.html` in browser
2. Click **"Login with Gmail"**
3. Authorize in popup
4. Click **"Fetch Latest Emails"**
5. Watch your real emails get classified! 🎉

---

## 📊 What You'll See

### Stats Dashboard
- **Interruptions Prevented** - Count of deferred notifications
- **Focus Time** - Uninterrupted work blocks
- **Decisions Auto-Handled** - Automated actions

### Live Classification
- **Incoming** → **Urgent** (show now)
- **Incoming** → **Deferred** (batched to digest)
- Real-time routing with smooth animations

### Digest Preview
- Grouped by type (email, social, apps)
- One-click batch actions
- Scheduled delivery (3x daily)

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main app |
| `app.js` | Classification logic + email integration |
| `styles.css` | UI styling |
| `backend/server.js` | Gmail OAuth & API |
| `QUICKSTART.md` | Detailed setup guide |
| `EMAIL_INTEGRATION.md` | Email feature docs |

---

## 🐛 Troubleshooting

**"Login with Gmail" button doesn't appear**
- Reload the page
- Check browser console for errors

**Backend connection failed**
- Make sure server is running: `cd backend && npm start`
- Check it's on port 3000
- Look for "✅ Backend Server running" message

**OAuth error: redirect_uri_mismatch**
- Verify `http://localhost:3000/oauth2callback` in Google Cloud Console
- Remove any trailing slashes

**No emails showing up**
- Check browser console (F12) for errors
- Verify you have emails in Gmail inbox
- Ensure Gmail API is enabled in Google Cloud Console

**"Access blocked"**
- Add your email to "Test users" in OAuth consent screen
- Make sure app is in testing mode

---

## 📖 Documentation

- **Problem Breakdown**: `docs/problem_breakdown.md`
- **Product Design**: `docs/product_design.md`
- **AI Logic**: `docs/intelligence_layer.md`
- **Validation Plan**: `docs/validation_plan.md`

---

**Live demo:**
- Use demo mode (instant) OR
- Use email mode (impressive but requires setup)

---

## 💡 Tips

✨ **For demo mode:** Just open and click "Simulate" - works instantly  
🔐 **For email mode:** Follow QUICKSTART.md step-by-step  
📹 **Record a video:** Show live email classification (very impressive!)  
🎨 **Customize:** Edit urgency thresholds in `app.js` if needed  

---

**Need help?** Check [QUICKSTART.md](file:///f:/IITR/productathon/clarity/QUICKSTART.md) for detailed instructions.
