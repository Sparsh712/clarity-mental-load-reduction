# Email Integration - Quick Start

## Option 1: Use Demo Mode (No Setup Required)
If you don't want to set up Gmail API, the app works in **demo mode** with simulated notifications. Just open `index.html` and click "Simulate Notifications".

## Option 2: Real Email Integration

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Get Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Gmail API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Configure consent screen if prompted:
     - User Type: External
     - App name: "Clarity"
     - Add your email as test user
   - Application type: "Web application"
   - Name: "Clarity Email Integration"
   - Authorized redirect URIs: `http://localhost:3000/oauth2callback`
   - Click "Create"
   - **Copy the Client ID and Client Secret**

### Step 3: Configure Environment Variables

1. Create `.env` file in `/backend` directory:
```bash
cd backend
copy .env.example .env
```

2. Edit the `.env` file with your credentials:
```
GMAIL_CLIENT_ID=your_actual_client_id_here
GMAIL_CLIENT_SECRET=your_actual_client_secret_here
PORT=3000
```

### Step 4: Start the Backend Server

```bash
npm start
```

You should see:
```
✅ Clarity Backend Server running on http://localhost:3000
```

### Step 5: Open the App

Open `index.html` in your browser (or use Live Server in VS Code)

### Step 6: Login and Test

1. Click "Login with Gmail" button
2. Authorize the app in the popup window
3. Click "Fetch Latest Emails"
4. Watch your real emails get classified in real-time!

## Troubleshooting

**"Failed to connect to backend"**
- Make sure the backend server is running: `cd backend && npm start`
- Check that it's on port 3000

**"redirect_uri_mismatch"**
- Ensure `http://localhost:3000/oauth2callback` is in authorized redirect URIs
- Check there are no trailing slashes

**"Access blocked: This app's request is invalid"**
- Configure OAuth consent screen in Google Cloud Console
- Add your email to "Test users" list
- Make sure Gmail API is enabled

**No emails showing up**
- Check browser console for errors (F12)
- Verify you have emails in your Gmail inbox
- Try increasing the limit in fetch call

## Security Note

This is a demo/prototype. In production:
- Store tokens securely (encrypted database)
- Use HTTPS
- Implement token refresh
- Add rate limiting
- Validate all inputs
