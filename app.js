// Clarity - Intelligent Notification Manager
// Core logic for context-aware filtering and decision reduction

// ============================================
// Configuration
// ============================================

const API_BASE_URL = 'http://localhost:3000';
let isEmailMode = false;
let userEmail = null;

// ============================================
// Mock Data & Configuration
// ============================================

const NOTIFICATION_TYPES = {
    EMAIL: 'email',
    SLACK: 'slack',
    CALENDAR: 'calendar',
    SOCIAL: 'social',
    APP: 'app'
};

const URGENCY_LEVELS = {
    URGENT: 'urgent',
    DEFERRED: 'deferred'
};

const CONTEXT_MODES = {
    DEEP_FOCUS: {
        name: 'Deep Focus',
        filter: 'High Priority Only',
        threshold: 0.8
    },
    MEETINGS: {
        name: 'In Meeting',
        filter: 'Critical Only',
        threshold: 0.9
    },
    AVAILABLE: {
        name: 'Available',
        filter: 'Normal',
        threshold: 0.5
    }
};

// Sample notifications for simulation
const SAMPLE_NOTIFICATIONS = [
    { type: NOTIFICATION_TYPES.EMAIL, sender: 'CEO', content: 'Urgent: Q4 review meeting moved', urgency: 0.95 },
    { type: NOTIFICATION_TYPES.SLACK, sender: 'DevOps', content: 'Production alert: high CPU', urgency: 0.9 },
    { type: NOTIFICATION_TYPES.EMAIL, sender: 'Marketing', content: 'Weekly newsletter draft ready', urgency: 0.3 },
    { type: NOTIFICATION_TYPES.SOCIAL, sender: 'LinkedIn', content: 'Someone viewed your profile', urgency: 0.2 },
    { type: NOTIFICATION_TYPES.APP, sender: 'Amazon', content: 'Package delivered', urgency: 0.4 },
    { type: NOTIFICATION_TYPES.SLACK, sender: 'Design Team', content: 'Feedback on wireframes', urgency: 0.5 },
    { type: NOTIFICATION_TYPES.EMAIL, sender: 'Client', content: 'Re: Project timeline update', urgency: 0.75 },
    { type: NOTIFICATION_TYPES.CALENDAR, sender: 'Calendar', content: 'Meeting in 15 minutes', urgency: 0.85 },
    { type: NOTIFICATION_TYPES.EMAIL, sender: 'Newsletter', content: 'Your daily tech digest', urgency: 0.15 },
    { type: NOTIFICATION_TYPES.APP, sender: 'Banking', content: 'Subscription payment successful', urgency: 0.25 },
];

// Sample emails for demo mode (realistic Gmail-style)
const SAMPLE_EMAILS = [
    { sender: 'Sarah Chen (CEO)', senderEmail: 'sarah@company.com', subject: 'URGENT: Board meeting moved to 2pm today', snippet: 'Hi team, due to a scheduling conflict, we need to move the board meeting...', isUnread: true, isImportant: true },
    { sender: 'DevOps Alert', senderEmail: 'alerts@monitoring.com', subject: 'Production: High CPU usage detected', snippet: 'Alert triggered at 14:32 - Server load at 89%. Immediate action required...', isUnread: true, isImportant: true },
    { sender: 'LinkedIn', senderEmail: 'noreply@linkedin.com', subject: 'Your weekly profile views', snippet: '47 people viewed your profile this week. See who\'s interested in your experience...', isUnread: false, isImportant: false },
    { sender: 'Amazon', senderEmail: 'shipment@amazon.com', subject: 'Your package has been delivered', snippet: 'Good news! Your order #123-4567890 has been delivered to your doorstep...', isUnread: true, isImportant: false },
    { sender: 'Marketing Team', senderEmail: 'marketing@company.com', subject: 'Q1 Campaign Performance Report', snippet: 'Attached is the Q1 marketing campaign analysis. Overall performance exceeded targets...', isUnread: false, isImportant: false },
    { sender: 'Client: John Davis', senderEmail: 'john.davis@client.com', subject: 'Re: Project timeline update', snippet: 'Thanks for the update. Can we schedule a call to discuss the deliverables?...', isUnread: true, isImportant: false },
    { sender: 'Google Calendar', senderEmail: 'calendar@google.com', subject: 'Event reminder: Design review in 15 minutes', snippet: 'Your event "Design Review - Q1 Roadmap" starts at 3:00 PM...', isUnread: true, isImportant: true },
    { sender: 'Tech Newsletter', senderEmail: 'newsletter@techcrunch.com', subject: 'Today\'s top tech stories', snippet: 'AI breakthrough, startup funding news, and the latest in tech policy...', isUnread: false, isImportant: false },
    { sender: 'HR Department', senderEmail: 'hr@company.com', subject: 'Benefits enrollment deadline: Jan 31', snippet: 'Reminder: Open enrollment for health benefits closes at end of month...', isUnread: true, isImportant: false },
    { sender: 'GitHub', senderEmail: 'noreply@github.com', subject: 'Pull request merged: Feature/user-auth', snippet: 'Your pull request #234 was merged into main by @teammate...', isUnread: false, isImportant: false },
    { sender: 'Slack', senderEmail: 'feedback@slack.com', subject: '[Design Team] 5 new messages', snippet: '@you were mentioned in #design-team. @Alex: "Can you review the mockups?"...', isUnread: true, isImportant: false },
    { sender: 'Security Alert', senderEmail: 'security@company.com', subject: 'New login from unknown device', snippet: 'We detected a login to your account from a new device in San Francisco...', isUnread: true, isImportant: true },
    { sender: 'Substack', senderEmail: 'noreply@substack.com', subject: 'New post: The future of remote work', snippet: 'Your favorite author just published: "Why hybrid work is here to stay"...', isUnread: false, isImportant: false },
    { sender: 'Finance Team', senderEmail: 'finance@company.com', subject: 'Expense report approved', snippet: 'Your expense report #ER-2024-001 has been approved. Reimbursement processed...', isUnread: true, isImportant: false },
    { sender: 'Twitter', senderEmail: 'notify@twitter.com', subject: 'Someone liked your tweet', snippet: '@influencer and 12 others liked your tweet about AI trends...', isUnread: false, isImportant: false },
];

// ============================================
// State Management
// ============================================

let currentContext = CONTEXT_MODES.DEEP_FOCUS;
let statsCounter = {
    blocked: 47,
    focusTime: 3.2,
    decisionsHandled: 12
};

// ============================================
// Context Detection Engine
// ============================================

class ContextDetector {
    constructor() {
        this.currentMode = CONTEXT_MODES.DEEP_FOCUS;
    }

    detectContext() {
        // In real implementation, this would check:
        // - Calendar events
        // - Active application
        // - Time of day
        // - Keyboard/mouse activity patterns
        // - Historical focus patterns

        const hour = new Date().getHours();

        if (hour >= 9 && hour <= 12) {
            return CONTEXT_MODES.DEEP_FOCUS;
        } else if (hour >= 14 && hour <= 16) {
            return CONTEXT_MODES.MEETINGS;
        } else {
            return CONTEXT_MODES.AVAILABLE;
        }
    }

    updateDisplay() {
        const mode = this.currentMode;
        document.getElementById('currentContext').textContent = mode.name;
        document.getElementById('modeValue').textContent = mode.name;
        document.getElementById('filterValue').textContent = mode.filter;

        // Update until time (mock)
        const nextDigest = new Date();
        nextDigest.setHours(15, 0, 0);
        document.getElementById('untilValue').textContent = nextDigest.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });

        // Update calendar (mock)
        document.getElementById('calendarValue').textContent = 'Design Review';
    }
}

// ============================================
// Notification Classifier
// ============================================

class NotificationClassifier {
    constructor(contextDetector) {
        this.contextDetector = contextDetector;
    }

    classify(notification) {
        // AI-powered classification logic
        // In real implementation, this would use ML model
        // For demo, we use rule-based + urgency score

        const currentThreshold = this.contextDetector.currentMode.threshold;

        // Check urgency score against context threshold
        if (notification.urgency >= currentThreshold) {
            return URGENCY_LEVELS.URGENT;
        }

        // Additional rules
        if (notification.type === NOTIFICATION_TYPES.CALENDAR && notification.urgency > 0.7) {
            return URGENCY_LEVELS.URGENT;
        }

        return URGENCY_LEVELS.DEFERRED;
    }

    getReasoningExplanation(notification, classification) {
        // Transparency layer - explain why decision was made
        if (classification === URGENCY_LEVELS.URGENT) {
            return `High urgency (${(notification.urgency * 100).toFixed(0)}%) + sender importance`;
        } else {
            return `Below urgency threshold for ${this.contextDetector.currentMode.name} mode`;
        }
    }
}

// ============================================
// Notification Manager
// ============================================

class NotificationManager {
    constructor() {
        this.contextDetector = new ContextDetector();
        this.classifier = new NotificationClassifier(this.contextDetector);
        this.incomingQueue = [];
        this.urgentQueue = [];
        this.deferredQueue = [];
    }

    processNotification(notification) {
        // Add to incoming
        this.addToIncoming(notification);

        // Classify after delay
        setTimeout(() => {
            const classification = this.classifier.classify(notification);
            this.routeNotification(notification, classification);

            // Update stats
            if (classification === URGENCY_LEVELS.DEFERRED) {
                statsCounter.blocked++;
                this.updateStats();
            }
        }, 1500);
    }

    addToIncoming(notification) {
        const incomingList = document.getElementById('incomingList');
        const item = this.createNotificationElement(notification);
        incomingList.appendChild(item);

        this.incomingQueue.push({ element: item, data: notification });
    }

    routeNotification(notification, classification) {
        // Find and animate out from incoming
        const incoming = this.incomingQueue.find(n => n.data === notification);
        if (!incoming) return;

        incoming.element.classList.add('moving');

        setTimeout(() => {
            incoming.element.remove();
            this.incomingQueue = this.incomingQueue.filter(n => n.data !== notification);

            // Add to appropriate queue
            if (classification === URGENCY_LEVELS.URGENT) {
                this.addToUrgent(notification);
            } else {
                this.addToDeferred(notification);
            }
        }, 250);
    }

    addToUrgent(notification) {
        const urgentList = document.getElementById('urgentList');
        const item = this.createNotificationElement(notification, true);
        urgentList.appendChild(item);
        this.urgentQueue.push({ element: item, data: notification });
    }

    addToDeferred(notification) {
        const deferredList = document.getElementById('deferredList');
        const item = this.createNotificationElement(notification, false, true);
        deferredList.appendChild(item);
        this.deferredQueue.push({ element: item, data: notification });
    }

    createNotificationElement(notification, isUrgent = false, isDeferred = false) {
        const div = document.createElement('div');
        div.className = 'notification-item';

        let badgeHTML = '';
        if (isUrgent) {
            badgeHTML = '<span class="notification-badge urgent">Show Now</span>';
        } else if (isDeferred) {
            badgeHTML = '<span class="notification-badge deferred">Digest</span>';
        }

        div.innerHTML = `
            <span class="notification-sender">${notification.sender}</span>
            <span class="notification-content">${notification.content}</span>
            ${badgeHTML}
        `;

        return div;
    }

    updateStats() {
        document.getElementById('blockedCount').textContent = statsCounter.blocked;
        document.getElementById('focusTime').textContent = statsCounter.focusTime.toFixed(1) + 'h';
        document.getElementById('decisionsHandled').textContent = statsCounter.decisionsHandled;
    }

    simulateBatch() {
        // Clear existing
        document.getElementById('incomingList').innerHTML = '';
        document.getElementById('urgentList').innerHTML = '';
        document.getElementById('deferredList').innerHTML = '';

        this.incomingQueue = [];
        this.urgentQueue = [];
        this.deferredQueue = [];

        // Simulate 5 random notifications
        const batch = this.getRandomNotifications(5);
        batch.forEach((notification, index) => {
            setTimeout(() => {
                this.processNotification(notification);
            }, index * 800);
        });
    }

    getRandomNotifications(count) {
        const shuffled = [...SAMPLE_NOTIFICATIONS].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}

// ============================================
// UI Controllers
// ============================================

class UIController {
    constructor(notificationManager, emailIntegration) {
        this.notificationManager = notificationManager;
        this.emailIntegration = emailIntegration;
        this.initEventListeners();
        this.initEmailControls();
    }

    initEventListeners() {
        const simulateBtn = document.getElementById('simulateBtn');
        simulateBtn.addEventListener('click', () => {
            this.notificationManager.simulateBatch();
        });

        // Demo Email Mode
        const demoEmailBtn = document.getElementById('demoEmailBtn');
        if (demoEmailBtn) {
            demoEmailBtn.addEventListener('click', () => {
                this.simulateDemoEmails();
            });
        }
        // Digest action buttons
        const digestActions = document.querySelectorAll('.digest-action');
        digestActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const originalText = e.target.textContent;
                e.target.textContent = '✓ Done';
                e.target.style.opacity = '0.5';

                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.opacity = '1';
                }, 1500);

                statsCounter.decisionsHandled++;
                this.notificationManager.updateStats();
            });
        });
    }

    simulateDemoEmails() {
        document.getElementById('incomingList').innerHTML = '';
        document.getElementById('urgentList').innerHTML = '';
        document.getElementById('deferredList').innerHTML = '';

        const shuffled = [...SAMPLE_EMAILS].sort(() => 0.5 - Math.random());
        const batch = shuffled.slice(0, 10);

        batch.forEach((email, index) => {
            setTimeout(() => {
                let urgency = 0.3;
                if (email.isImportant) urgency += 0.3;
                if (email.isUnread) urgency += 0.2;
                if (['urgent', 'asap', 'important', 'critical'].some(k => email.subject.toLowerCase().includes(k))) urgency += 0.3;
                if (email.senderEmail.includes('noreply')) urgency -= 0.3;
                urgency = Math.min(urgency, 1.0);

                this.notificationManager.processNotification({
                    type: NOTIFICATION_TYPES.EMAIL,
                    sender: email.sender,
                    content: email.subject,
                    urgency: urgency
                });
            }, index * 800);
        });
    }

    initialize() {
        // Update context display
        this.notificationManager.contextDetector.updateDisplay();

        // Update stats
        this.notificationManager.updateStats();

        // Check if backend is available
        this.checkBackendStatus();

        // Auto-simulate after 2 seconds (demo mode)
        setTimeout(() => {
            if (!isEmailMode) {
                this.notificationManager.simulateBatch();
            }
        }, 2000);
    }

    async checkBackendStatus() {
        const isAuth = await this.emailIntegration.checkAuthStatus();
        if (isAuth) {
            this.showEmailMode();
        }
    }

    initEmailControls() {
        // Add email mode button to hero section
        const heroSection = document.querySelector('.hero');
        const emailControls = document.createElement('div');
        emailControls.className = 'email-controls';
        emailControls.innerHTML = `
            <button class="btn-primary" id="loginBtn" style="display: none;">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="margin-right: 8px;">
                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                    <path d="M10 5v5l4 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Login with Gmail
            </button>
            <div id="emailStatus" style="display: none;">
                <span id="userEmailDisplay"></span>
                <button class="btn-secondary" id="fetchEmailsBtn">Fetch Latest Emails</button>
                <button class="btn-secondary" id="logoutBtn">Logout</button>
            </div>
        `;
        heroSection.appendChild(emailControls);

        // Event listeners
        document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
        document.getElementById('fetchEmailsBtn')?.addEventListener('click', () => this.handleFetchEmails());
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());

        // Show login button
        document.getElementById('loginBtn').style.display = 'inline-flex';
    }

    async handleLogin() {
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.textContent = 'Authenticating...';
        loginBtn.disabled = true;

        const success = await this.emailIntegration.login();

        if (success) {
            this.showEmailMode();
        } else {
            loginBtn.textContent = 'Login with Gmail';
            loginBtn.disabled = false;
        }
    }

    async showEmailMode() {
        isEmailMode = true;

        // Get user profile
        const profile = await this.emailIntegration.fetchProfile();
        if (profile) {
            userEmail = profile.email;
            document.getElementById('userEmailDisplay').textContent = `📧 ${profile.email}`;
        }

        // Hide login, show email status
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('emailStatus').style.display = 'flex';

        // Auto-fetch emails
        this.handleFetchEmails();
    }

    async handleFetchEmails() {
        const fetchBtn = document.getElementById('fetchEmailsBtn');

        // Check if we're in demo mode
        if (userEmail === 'demo@example.com') {
            // Demo mode - generate more sample emails
            fetchBtn.textContent = 'Generating...';
            fetchBtn.disabled = true;

            document.getElementById('incomingList').innerHTML = '';
            document.getElementById('urgentList').innerHTML = '';
            document.getElementById('deferredList').innerHTML = '';

            const randomEmails = this.getRandomEmails(10);
            randomEmails.forEach((emailData, index) => {
                setTimeout(() => {
                    const notification = this.convertEmailDataToNotification(emailData);
                    this.notificationManager.processNotification(notification);
                }, index * 800);
            });

            fetchBtn.textContent = '✓ Generated 10 emails';
            setTimeout(() => {
                fetchBtn.textContent = 'Generate More Emails';
                fetchBtn.disabled = false;
            }, 2000);
            return;
        }

        // Real Gmail mode
        fetchBtn.textContent = 'Fetching...';
        fetchBtn.disabled = true;

        // Clear existing notifications
        document.getElementById('incomingList').innerHTML = '';
        document.getElementById('urgentList').innerHTML = '';
        document.getElementById('deferredList').innerHTML = '';

        // Fetch emails
        const emails = await this.emailIntegration.fetchEmails(15);

        if (emails.length === 0) {
            alert('No emails found or unable to fetch. Check the console for errors.');
            fetchBtn.textContent = 'Fetch Latest Emails';
            fetchBtn.disabled = false;
            return;
        }

        // Process each email
        emails.forEach((email, index) => {
            setTimeout(() => {
                const notification = this.emailIntegration.convertToNotification(email);
                this.notificationManager.processNotification(notification);
            }, index * 800);
        });

        fetchBtn.textContent = `✓ Fetched ${emails.length} emails`;
        setTimeout(() => {
            fetchBtn.textContent = 'Fetch Latest Emails';
            fetchBtn.disabled = false;
        }, 2000);
    }

    handleLogout() {
        fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' });

        isEmailMode = false;
        userEmail = null;

        document.getElementById('loginBtn').style.display = 'inline-flex';
        document.getElementById('emailStatus').style.display = 'none';

        // Clear notifications
        document.getElementById('incomingList').innerHTML = '';
        document.getElementById('urgentList').innerHTML = '';
        document.getElementById('deferredList').innerHTML = '';
    }
}

// ============================================
// Email Integration
// ============================================

class EmailIntegration {
    constructor(notificationManager) {
        this.notificationManager = notificationManager;
        this.isAuthenticated = false;
    }

    async checkAuthStatus() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/status`);
            const data = await response.json();
            return data.isAuthenticated;
        } catch (error) {
            console.log('Backend not available, using demo mode');
            return false;
        }
    }

    async login() {
        try {
            // Get auth URL from backend
            const response = await fetch(`${API_BASE_URL}/auth/gmail`);
            const data = await response.json();

            // Open OAuth popup
            const width = 500;
            const height = 600;
            const left = (screen.width - width) / 2;
            const top = (screen.height - height) / 2;

            window.open(
                data.authUrl,
                'Gmail Authorization',
                `width=${width},height=${height},left=${left},top=${top}`
            );

            // Listen for auth success message
            return new Promise((resolve) => {
                window.addEventListener('message', (event) => {
                    if (event.data.type === 'AUTH_SUCCESS') {
                        this.isAuthenticated = true;
                        resolve(true);
                    }
                });
            });
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to connect to backend. Make sure the server is running!');
            return false;
        }
    }

    async fetchProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Profile fetch error:', error);
            return null;
        }
    }

    async fetchEmails(limit = 20) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/emails?limit=${limit}`);
            const data = await response.json();
            return data.emails || [];
        } catch (error) {
            console.error('Email fetch error:', error);
            return [];
        }
    }

    convertToNotification(email) {
        // Convert email data to notification format
        return {
            type: NOTIFICATION_TYPES.EMAIL,
            sender: email.sender,
            content: email.subject,
            snippet: email.snippet,
            urgency: this.calculateEmailUrgency(email),
            timestamp: email.timestamp,
            isUnread: email.isUnread,
            emailData: email
        };
    }

    calculateEmailUrgency(email) {
        let score = 0.3; // Base score for emails

        // Check if important
        if (email.isImportant) score += 0.3;

        // Check if unread
        if (email.isUnread) score += 0.2;

        // Check for urgent keywords in subject
        const urgentKeywords = ['urgent', 'asap', 'important', 'critical', 'emergency', 're:', 'fwd:'];
        const subjectLower = email.subject.toLowerCase();
        if (urgentKeywords.some(keyword => subjectLower.includes(keyword))) {
            score += 0.3;
        }

        // Check sender (simple heuristic)
        if (email.senderEmail.includes('noreply') || email.senderEmail.includes('no-reply')) {
            score -= 0.3; // Likely automated
        }

        return Math.min(score, 1.0);
    }
}

// ============================================
// Application Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const notificationManager = new NotificationManager();
    const emailIntegration = new EmailIntegration(notificationManager);
    const uiController = new UIController(notificationManager, emailIntegration);

    uiController.initialize();

    console.log('✓ Clarity initialized');
    console.log('Context:', notificationManager.contextDetector.currentMode.name);
});
