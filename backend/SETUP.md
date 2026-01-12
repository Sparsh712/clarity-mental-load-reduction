# Setup Instructions for Email Integration

## Prerequisites
1. Node.js installed (v16 or higher)
2. A Google account for testing
3. Google Cloud Console access

## Step 1: Set up Google Cloud credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Name: "Clarity Email Integration"
   - Add Authorized redirect URI: `http://localhost:3000/oauth2callback`
   - Click "Create"
   - Copy the Client ID and Client Secret

## Step 2: Configure backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   copy .env.example .env
   ```

4. Edit `.env` and add your credentials:
   ```
   GMAIL_CLIENT_ID=your_actual_client_id
   GMAIL_CLIENT_SECRET=your_actual_client_secret
   ```

## Step 3: Start the server

```bash
npm start
```

Server will run on http://localhost:3000

## Step 4: Open the app

Open `index.html` in your browser (it should auto-connect to the backend)

## Testing

1. Click "Login with Gmail" button
2. Authorize the app
3. See your real emails classified in real-time!

## Troubleshooting

**Error: "redirect_uri_mismatch"**
- Make sure `http://localhost:3000/oauth2callback` is added to authorized redirect URIs in Google Cloud Console

**Error: "Access blocked: This app's request is invalid"**
- Your OAuth consent screen needs to be configured in Google Cloud Console
- Add your test email to "Test users" if app is in testing mode

**Error: "invalid_client"**
- Check that CLIENT_ID and CLIENT_SECRET are correct in `.env` file
