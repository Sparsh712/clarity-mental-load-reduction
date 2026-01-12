// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Gmail API Configuration
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

let oauth2Client;

// Initialize OAuth2 client
function initOAuth() {
    const CLIENT_ID = process.env.GMAIL_CLIENT_ID || 'YOUR_CLIENT_ID';
    const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
    const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

    oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    console.log('OAuth initialized with:', CLIENT_ID.substring(0, 20) + '...');
}

initOAuth();

// Generate auth URL
app.get('/auth/gmail', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });
    res.json({ authUrl });
});

// OAuth callback
app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('No authorization code received');
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        res.send(`
            <html>
                <body>
                    <h2>✅ Authentication Successful!</h2>
                    <p>You can close this window and return to Clarity.</p>
                    <script>
                        window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
                        setTimeout(() => window.close(), 2000);
                    </script>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.status(500).send('Authentication failed');
    }
});

// Get recent emails
app.get('/api/emails', async (req, res) => {
    try {
        if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const maxResults = parseInt(req.query.limit) || 20;
        const messagesResponse = await gmail.users.messages.list({
            userId: 'me',
            maxResults: maxResults,
            q: 'in:inbox'
        });

        if (!messagesResponse.data.messages || messagesResponse.data.messages.length === 0) {
            return res.json({ emails: [] });
        }

        const emailPromises = messagesResponse.data.messages.map(async (message) => {
            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
                format: 'full'
            });

            return parseGmailMessage(msg.data);
        });

        const emails = await Promise.all(emailPromises);
        res.json({ emails });

    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ error: 'Failed to fetch emails', details: error.message });
    }
});

// Get user profile
app.get('/api/profile', async (req, res) => {
    try {
        if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const profile = await gmail.users.getProfile({ userId: 'me' });

        res.json({
            email: profile.data.emailAddress,
            messagesTotal: profile.data.messagesTotal
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Check auth status
app.get('/api/auth/status', (req, res) => {
    const isAuthenticated = !!(oauth2Client.credentials && oauth2Client.credentials.access_token);
    res.json({ isAuthenticated });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    oauth2Client.setCredentials({});
    res.json({ success: true });
});

// Helper function to parse Gmail messages
function parseGmailMessage(message) {
    const headers = message.payload.headers;

    const getHeader = (name) => {
        const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
        return header ? header.value : '';
    };

    const from = getHeader('From');
    const subject = getHeader('Subject');
    const date = getHeader('Date');

    const fromMatch = from.match(/(.*?)\s*<(.+?)>/) || [null, from, from];
    const senderName = fromMatch[1] ? fromMatch[1].replace(/"/g, '').trim() : fromMatch[2];
    const senderEmail = fromMatch[2] || from;

    const snippet = message.snippet || '';

    const labels = message.labelIds || [];
    const isImportant = labels.includes('IMPORTANT');
    const isUnread = labels.includes('UNREAD');

    return {
        id: message.id,
        threadId: message.threadId,
        sender: senderName,
        senderEmail: senderEmail,
        subject: subject,
        snippet: snippet,
        date: new Date(date).toISOString(),
        timestamp: new Date(date).getTime(),
        isUnread: isUnread,
        isImportant: isImportant,
        labels: labels,
        content: `${subject} ${snippet}`,
        type: 'email'
    };
}

// Server Start
app.listen(PORT, () => {
    console.log(`\n✅ Clarity Backend Server running on http://localhost:${PORT}`);
    console.log(`\n📝 Setup Instructions:`);
    console.log(`1. Go to https://console.cloud.google.com/apis/credentials`);
    console.log(`2. Create OAuth 2.0 Client ID (Web application)`);
    console.log(`3. Add redirect URI: http://localhost:3000/oauth2callback`);
    console.log(`4. Set environment variables:`);
    console.log(`   GMAIL_CLIENT_ID=your_client_id`);
    console.log(`   GMAIL_CLIENT_SECRET=your_client_secret`);
    console.log(`\n🚀 Ready to authenticate!\n`);
});
