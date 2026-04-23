import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

    // ── STATE ──
    const state = {
        isAuthenticated: false,
        currentView: 'dashboard',
        activeModal: null,
        selectedDocument: null,
        selectedStaffProfile: null,
        selectedPayment: null,
        orderQuantity: 1,
        paymentFilter: 'all',
        paymentSearch: '',
        activeTrackId: 101,
        rushConfirmId: null,
        requestTab: 'new',   // 'new' | 'history'
        loginType: 'alumni', // 'alumni' | 'staff'
        loginStep: 'select', // 'select' | 'biometric'
        bioAuthMethod: null, // 'biometric' | 'face-id'
        biometricEnabled: false,
        user: {
            name: 'Maria Clara Santos',
            studentNo: '20180234',
            course: 'Bachelor of Science in Computer Science',
            graduated: 'March 2022',
            honors: 'Cum Laude',
            email: 'maria.santos@addu.edu.ph',
            phone: '+63 912 345 6789',
            address: 'Davao City, Philippines',
            initials: 'MC'
        }
    };

    // ── DATA ──
    const documentsList = [
        { id: 1, title: 'Transcript of Records', desc: 'Official academic transcript with all courses and grades.', fee: '₱150', time: '5-7 business days', icon: 'fa-file-lines' },
        { id: 2, title: 'Certified True Copy of Diploma', desc: 'Authenticated copy of your diploma.', fee: '₱200', time: '3-5 business days', icon: 'fa-certificate' },
        { id: 3, title: 'Certificate of Graduation', desc: 'Official certificate confirming degree completion.', fee: '₱100', time: '2-3 business days', icon: 'fa-graduation-cap' },
        { id: 4, title: 'Certificate of Enrollment', desc: 'Proof of current or past enrollment.', fee: '₱80', time: '1-2 business days', icon: 'fa-file-signature' },
        { id: 5, title: 'Certificate of General Weighted Average', desc: 'Official GWA certification.', fee: '₱80', time: '2-3 business days', icon: 'fa-chart-bar' },
        { id: 6, title: 'Honorable Dismissal', desc: 'Certificate of good standing for transfer.', fee: '₱100', time: '3-5 business days', icon: 'fa-handshake-angle' },
        { id: 7, title: 'Document Authentication', desc: 'Red ribbon authentication service.', fee: '₱250', time: '7-10 business days', icon: 'fa-stamp' },
        { id: 8, title: 'Certification, Authentication & Verification (CAV)', desc: 'Complete document verification package.', fee: '₱300', time: '10-14 business days', icon: 'fa-shield-halved' }
    ];

    const requestHistory = [
        { id: 'H1', title: 'Transcript of Records', date: 'Feb 15, 2026', ref: '#TOR-2026-0021', icon: 'fa-file-lines' },
        { id: 'H2', title: 'Certificate of Graduation', date: 'Oct 18, 2024', ref: '#COG-2024-0620', icon: 'fa-graduation-cap' },
    ];

    const trackedRequests = [
        {
            id: 101, title: 'Official Transcript of Records', requestNo: '#TOR-2024-0342',
            status: 'pending', statusLabel: 'Pending Upload', date: 'Oct 24, 2024', icon: 'fa-file-lines',
            requirements: ['Valid Government ID', 'Payment Receipt (₱150)'],
            requirementsDone: [false, false],
            rushFee: '₱200',
            hasRush: true,
            expiresIn: null,
            steps: [
                { name: 'Submitted',   label: 'Request Submitted',    desc: 'Your request has been received and logged.', date: 'Oct 24, 2024', done: true },
                { name: 'Verified',    label: 'Documents Verified',   desc: 'Verifying student records and requirements.', date: 'Pending', done: false },
                { name: 'Processed',   label: 'Document Processed',   desc: 'Registrar is preparing the document.', date: '', done: false },
                { name: 'Ready',       label: 'Ready for Download',   desc: 'Document is digitally signed and ready.', date: '', done: false }
            ]
        },
        {
            id: 102, title: 'Certified Diploma Copy', requestNo: '#DIP-2024-0198',
            status: 'processing', statusLabel: 'Processing', date: 'Oct 20, 2024', icon: 'fa-certificate',
            requirements: ['Valid Government ID', 'Payment Receipt (₱200)'],
            requirementsDone: [true, true],
            rushFee: '₱300',
            hasRush: true,
            expiresIn: null,
            steps: [
                { name: 'Submitted',   label: 'Request Submitted',    desc: 'Your request has been received and logged.', date: 'Oct 20, 2024', done: true },
                { name: 'Verified',    label: 'Documents Verified',   desc: 'All documents and payment verified.', date: 'Oct 21, 2024', done: true },
                { name: 'Processed',   label: 'Document Processed',   desc: 'Registrar is preparing the document.', date: 'Processing…', done: false },
                { name: 'Ready',       label: 'Ready for Download',   desc: 'Document is digitally signed and ready.', date: '', done: false }
            ]
        },
        {
            id: 103, title: 'Certificate of Graduation', requestNo: '#COG-2024-0521',
            status: 'ready', statusLabel: 'Ready', date: 'Oct 15, 2024', icon: 'fa-graduation-cap',
            requirements: ['All requirements submitted'],
            requirementsDone: [true],
            hasRush: false,
            expiresIn: '11 days 8 hours',
            steps: [
                { name: 'Submitted',   label: 'Request Submitted',    desc: 'Your Certificate of Graduation request was submitted with reference #COG-2024-0521.', date: 'Feb 15, 2026', done: true },
                { name: 'Verified',    label: 'Documents Verified',   desc: 'All submitted documents and payment verified successfully.', date: 'Feb 17, 2026', done: true },
                { name: 'Processed',   label: 'Document Processed',   desc: 'Your certificate has been processed and digitally signed by the registrar.', date: 'Feb 14, 2026', done: true },
                { name: 'Ready',       label: 'Ready for Download',   desc: 'Document is ready for download. Valid until March 1, 2026 (14 days remaining).', date: 'Feb 15, 2026', done: true }
            ]
        }
    ];

    const staffDocumentLogs = [
        { id: '#TOR-2024-0342', student: 'Maria Clara Santos', doc: 'Transcript of Records', date: '2026-02-15', status: 'Ready', ref: 'Available', qr: 'TOR-2024-0342' },
        { id: '#DIP-2024-0198', student: 'Juan Dela Cruz', doc: 'Certified Diploma', date: '2026-02-14', status: 'Processing', ref: 'QR-2024-0198', qr: 'DIP-2024-0198' },
        { id: '#COG-2024-0521', student: 'Emma Wilson', doc: 'Certificate of Graduation', date: '2026-02-12', status: 'Ready', ref: 'Available', qr: 'COG-2024-0521' }
    ];

    const staffInventory = [
        { name: 'Diploma Paper', current: 150, reorder: 500, status: 'Critical', icon: 'fa-exclamation-circle', unit: 'sheets' },
        { name: 'Certificate Stock', current: 450, reorder: 500, status: 'Normal', icon: 'fa-check-circle', unit: 'units' },
        { name: 'Verification Seals', current: 780, reorder: 1000, status: 'Normal', icon: 'fa-check-circle', unit: 'packs' },
        { name: 'Binding Materials', current: 200, reorder: 300, status: 'Warning', icon: 'fa-exclamation-triangle', unit: 'sets' }
    ];

    const staffPayments = [
        { id: '#PAY-2024-001', amount: '₱45,200.50', student: 'Maria Clara Santos', doc: 'Transcript + Diploma', date: '2026-02-15', status: 'Pending', flagged: true },
        { id: '#PAY-2024-002', amount: '₱12,500.00', student: 'Juan Dela Cruz', doc: 'Certificate', date: '2026-02-14', status: 'Verified', flagged: false },
        { id: '#PAY-2024-003', amount: '₱8,750.25', student: 'Emma Wilson', doc: 'Enrollment Cert', date: '2026-02-12', status: 'Verified', flagged: true }
    ];

    // ── RENDER ──
    function render() {
        const root = document.getElementById('meteor-root');
        if (!state.isAuthenticated) {
            root.innerHTML = viewLogin();
        } else if (state.loginType === 'staff') {
            root.innerHTML = viewStaffShell();
        } else {
            root.innerHTML = viewShell();
        }
        // modals
        const mc = document.getElementById('modal-container');
        if (mc) mc.innerHTML = state.activeModal ? viewModal() : '';
    }

    // ── ACTIONS ──
    window.actionLogin = (e) => { if (e) e.preventDefault(); state.isAuthenticated = true; state.currentView = 'dashboard'; render(); };
    window.actionLogout = () => { state.isAuthenticated = false; state.loginType = 'alumni'; state.loginStep = 'select'; render(); };
    window.navigate = (v) => { state.currentView = v; render(); };
    window.setRequestTab = (t) => { state.requestTab = t; render(); };
    window.setLoginType = (type) => { state.loginType = type; render(); };
    window.useBiometricAuth = (type) => { state.loginType = type; state.loginStep = 'biometric'; render(); };
    window.authenticateWithBiometric = () => {
        state.bioAuthMethod = 'biometric';
        alert('Biometric authentication initiated...');
        setTimeout(() => {
            state.isAuthenticated = true;
            state.currentView = 'dashboard';
            state.loginStep = 'select';
            render();
        }, 1500);
    };
    window.authenticateWithFaceId = () => {
        state.bioAuthMethod = 'face-id';
        alert('Face ID authentication initiated...');
        setTimeout(() => {
            state.isAuthenticated = true;
            state.currentView = 'dashboard';
            state.loginStep = 'select';
            render();
        }, 1500);
    };
    window.backToLoginSelect = () => { state.loginStep = 'select'; render(); };
    window.enableBiometrics = () => {
        state.biometricEnabled = true;
        alert('Biometric authentication has been successfully enabled!');
        render();
    };
    window.openModal = (name, data) => { state.activeModal = name; if (data !== undefined) state.selectedDocument = data; render(); };
    window.openQrCode = (id) => { state.selectedDocument = staffDocumentLogs.find(log => log.id === id); state.activeModal = 'qr-code'; render(); };
    window.openPaperOrder = (name) => { state.selectedDocument = staffInventory.find(item => item.name === name); state.orderQuantity = 1; state.activeModal = 'order-paper'; render(); };
    window.openPaperOrderVerify = () => { state.activeModal = 'verify-paper-order'; render(); };
    window.confirmPaperOrder = () => {
        const item = state.selectedDocument;
        if (item) {
            item.current += state.orderQuantity;
            alert(`Order verified: ${state.orderQuantity} ${item.unit} added to ${item.name}.`);
        }
        window.closeModal();
    };
    window.openPaymentVerify = (id) => {
        state.selectedPayment = staffPayments.find(payment => payment.id === id);
        state.activeModal = 'payment-verify';
        render();
    };
    window.confirmPaymentVerification = () => {
        if (state.selectedPayment) {
            state.selectedPayment.status = 'Verified';
            alert(`Payment ${state.selectedPayment.id} verified successfully.`);
        }
        window.closeModal();
    };
    window.setPaymentFilter = (filter) => { state.paymentFilter = filter; render(); };
    window.setPaymentSearch = (value) => { state.paymentSearch = value; render(); };
    window.openStaffProfile = (id) => { state.selectedStaffProfile = staffDocumentLogs.find(log => log.id === id); state.activeModal = 'staff-profile'; render(); };
    window.changeRequestStatus = (id, status) => {
        const log = staffDocumentLogs.find(item => item.id === id);
        if (log) {
            log.status = status;
        }
        const tracked = trackedRequests.find(item => item.requestNo === id);
        if (tracked) {
            tracked.status = status === 'Ready' ? 'ready' : (status === 'Processed' ? 'processing' : 'pending');
            tracked.statusLabel = status === 'Ready' ? 'Ready' : (status === 'Processed' ? 'Processing' : 'Pending Upload');
            const order = ['Submitted', 'Verified', 'Processed', 'Ready'];
            const currentIndex = order.indexOf(status);
            tracked.steps = tracked.steps.map(step => ({
                ...step,
                done: order.indexOf(step.name) <= currentIndex,
                date: order.indexOf(step.name) <= currentIndex && step.date ? step.date : step.date
            }));
        }
        state.selectedStaffProfile = staffDocumentLogs.find(item => item.id === id);
        render();
    };
    window.setPaperQuantity = (value) => {
        const quantity = parseInt(value, 10);
        state.orderQuantity = Number.isNaN(quantity) || quantity < 1 ? 1 : quantity;
    };
    window.closeModal = () => { state.activeModal = null; state.selectedDocument = null; state.selectedStaffProfile = null; state.selectedPayment = null; state.rushConfirmId = null; render(); };
    window.setActiveTrack = (id) => { state.activeTrackId = id; render(); };
    window.openPurpose = (doc) => { state.selectedDocument = doc; state.activeModal = 'purpose'; render(); };
    window.openVerify = (doc) => { state.selectedDocument = doc; state.activeModal = 'verify'; render(); };
    window.submitRequest = () => { alert('Request submitted successfully!'); window.closeModal(); window.navigate('track'); };
    window.openRushConfirm = (id) => { state.rushConfirmId = id; state.activeModal = 'rush-confirm'; render(); };
    window.confirmRush = () => { alert('Rush processing activated!'); window.closeModal(); };
    window.openPdfPreview = (id) => { state.activeTrackId = id; state.activeModal = 'pdf-preview'; render(); };

    // ── SHELL ──
    function viewShell() {
        const views = { dashboard: viewDashboard, request: viewRequest, track: viewTrack, profile: viewProfile };
        const content = (views[state.currentView] || viewDashboard)();
        return `
        <div class="app-shell">
            ${viewSidebar()}
            <div class="main-area">
                ${viewTopbar()}
                <div class="page-content">${content}</div>
            </div>
        </div>
        <div id="modal-container"></div>`;
    }

    function viewStaffShell() {
        const staffViews = { dashboard: viewStaffDashboard, 'profile-mgmt': viewProfileManagement, 'doc-log': viewDocumentLog, 'inventory': viewInventoryAlerts, 'payment': viewPaymentVerification, 'profile': viewStaffProfile };
        const content = (staffViews[state.currentView] || viewStaffDashboard)();
        return `
        <div class="app-shell">
            ${viewStaffSidebar()}
            <div class="main-area">
                ${viewStaffTopbar()}
                <div class="page-content">${content}</div>
            </div>
        </div>
        <div id="modal-container"></div>`;
    }

    function viewSidebar() {
        const nav = (view, icon, label) => `
            <button onclick="window.navigate('${view}')" class="nav-btn ${state.currentView === view ? 'active' : ''}">
                <i class="fa-solid ${icon}"></i> ${label}
            </button>`;
        return `
        <nav class="sidebar">
            <div class="sidebar-brand">
                <div class="sidebar-brand-icon"><img src="/aknight-01.png" alt="Logo" width="40" height="40" style="object-fit: contain;"></div>
                <div class="sidebar-brand-text">
                    <h2>Alumni Knights' Hub</h2>
                    <p>Ateneo de Davao University</p>
                </div>
            </div>
            <div class="sidebar-nav">
                <div class="nav-label">Main</div>
                ${nav('dashboard', 'fa-house', 'Home')}
                ${nav('profile', 'fa-id-card', 'My Profile')}
                <div class="nav-label" style="margin-top:8px;">Documents</div>
                ${nav('request', 'fa-file-circle-plus', 'Request Documents')}
                ${nav('track', 'fa-bars-progress', 'Process Documents')}
            </div>
            <div class="sidebar-footer">
                <button onclick="window.actionLogout()" class="nav-btn danger">
                    <i class="fa-solid fa-right-from-bracket"></i> Sign Out
                </button>
            </div>
        </nav>`;
    }

    const pageTitles = {
        dashboard: { title: 'Welcome, Blue Knight', sub: 'Your verified academic records' },
        profile:   { title: 'My Academic Passport', sub: 'Verified Digital Credential' },
        request:   { title: 'Request Documents', sub: 'Order transcripts & certifications' },
        track:     { title: 'Process Documents', sub: 'Track your document requests' }
    };

    const staffPageTitles = {
        dashboard: { title: 'Welcome, Staff', sub: 'Registrar Management Portal' },
        'profile-mgmt': { title: 'Profile Management', sub: 'Manage user accounts' },
        'doc-log': { title: 'Document Log', sub: 'Track all document requests' },
        'inventory': { title: 'Inventory Alerts', sub: 'Monitor document stock levels' },
        'payment': { title: 'Payment Verification', sub: 'Verify and process payments' }
    };

    function getInventoryStatus(item) {
        const healthy = item.current > item.reorder;
        if (healthy) {
            return { label: 'Normal', color: 'var(--green)', bg: 'var(--green-light)', button: 'var(--green)' };
        }
        if (item.status === 'Critical') {
            return { label: 'Critical', color: 'var(--red)', bg: 'var(--red-light)', button: 'var(--red)' };
        }
        if (item.status === 'Warning') {
            return { label: 'Warning', color: 'var(--orange)', bg: 'var(--orange-light)', button: 'var(--orange)' };
        }
        return { label: item.status, color: 'var(--blue)', bg: 'var(--blue-pale)', button: 'var(--blue)' };
    }

    function viewStaffSidebar() {
        const nav = (view, icon, label) => `
            <button onclick="window.navigate('${view}')" class="nav-btn ${state.currentView === view ? 'active' : ''}">
                <i class="fa-solid ${icon}"></i> ${label}
            </button>`;
        return `
        <nav class="sidebar" style="background: linear-gradient(180deg, #0d1557 0%, #1a237e 25%, #283593 50%, #1f2f7e 100%);">
            <div class="sidebar-brand">
                <div class="sidebar-brand-icon"><img src="/aknight-01.png" alt="Logo" width="40" height="40" style="object-fit: contain;"></div>
                <div class="sidebar-brand-text">
                    <h2>Alumni Knights</h2>
                    <p>Registrar Portal</p>
                </div>
            </div>
            <div class="sidebar-nav">
                <div class="nav-label">Management</div>
                ${nav('dashboard', 'fa-chart-line', 'Dashboard')}
                ${nav('profile-mgmt', 'fa-users', 'Profile Management')}
                <div class="nav-label" style="margin-top:8px;">Operations</div>
                ${nav('doc-log', 'fa-file-lines', 'Document Log')}
                ${nav('inventory', 'fa-boxes-stacked', 'Inventory Alerts')}
                ${nav('payment', 'fa-credit-card', 'Payment Verification')}
                <div class="nav-label" style="margin-top:8px;">Account</div>
                ${nav('profile', 'fa-user-circle', 'My Profile')}
            </div>
            <div class="sidebar-footer">
                <button onclick="window.actionLogout()" class="nav-btn danger">
                    <i class="fa-solid fa-right-from-bracket"></i> Sign Out
                </button>
            </div>
        </nav>`;
    }

    function viewStaffTopbar() {
        const pg = staffPageTitles[state.currentView] || staffPageTitles.dashboard;
        return `
        <header class="topbar">
            <div class="topbar-left">
                <h1>${pg.title}</h1>
                <p>${pg.sub}</p>
            </div>
            <div class="topbar-right">
                <button class="icon-btn" title="Settings"><i class="fa-solid fa-gear"></i></button>
                <button class="icon-btn" title="Notifications">
                    <i class="fa-regular fa-bell"></i>
                    <span class="notif-dot"></span>
                </button>
                <div class="avatar-chip" onclick="window.navigate('dashboard')">
                    <div class="avatar-chip-text">
                        <p>Admin Staff</p>
                        <p>Registrar</p>
                    </div>
                    <div class="avatar">AS</div>
                </div>
            </div>
        </header>`;
    }

    function viewTopbar() {
        const pg = pageTitles[state.currentView] || pageTitles.dashboard;
        return `
        <header class="topbar">
            <div class="topbar-left">
                <h1>${pg.title}</h1>
                <p>${pg.sub}</p>
            </div>
            <div class="topbar-right">
                <button class="icon-btn" title="Settings"><i class="fa-solid fa-gear"></i></button>
                <button class="icon-btn" title="Notifications">
                    <i class="fa-regular fa-bell"></i>
                    <span class="notif-dot"></span>
                </button>
                <div class="avatar-chip" onclick="window.navigate('profile')">
                    <div class="avatar-chip-text">
                        <p>${state.user.name.split(' ').slice(0,2).join(' ')}</p>
                        <p>Alumni</p>
                    </div>
                    <div class="avatar">${state.user.initials}</div>
                </div>
            </div>
        </header>`;
    }

    // ── DASHBOARD ──
    function viewDashboard() {
        return `
        <div class="dash-grid">
            <div>
                <!-- Profile Banner -->
                <div class="profile-banner">
                    <div class="profile-avatar-lg"><i class="fa-solid fa-user"></i></div>
                    <div class="profile-info-banner">
                        <h2>${state.user.name}</h2>
                        <p>Student No. ${state.user.studentNo}</p>
                        <span class="verified-pill"><i class="fa-solid fa-circle-check"></i> Verified by Registrar</span>
                        <div class="profile-meta-grid">
                            <div class="profile-meta-item"><i class="fa-solid fa-graduation-cap"></i>${state.user.course}</div>
                            <div class="profile-meta-item"><i class="fa-solid fa-envelope"></i>${state.user.email}</div>
                            <div class="profile-meta-item"><i class="fa-solid fa-calendar"></i>Graduated ${state.user.graduated}</div>
                            <div class="profile-meta-item"><i class="fa-solid fa-award"></i>${state.user.honors}</div>
                        </div>
                    </div>
                    <div class="profile-actions-banner">
                        <button class="btn-share" onclick="window.navigate('profile')"><i class="fa-solid fa-share-nodes"></i> Share Credential</button>
                        <button class="btn-share" onclick="window.navigate('profile')"><i class="fa-solid fa-download"></i> Download PDF</button>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="section-title">Quick Actions</div>
                <div class="quick-actions-grid" style="margin-bottom:20px;">
                    <div class="qa-card" onclick="window.navigate('profile')">
                        <div class="qa-icon blue"><i class="fa-solid fa-id-card"></i></div>
                        <div class="qa-text"><h4>View Profile</h4><p>Access verified academic records</p></div>
                        <i class="fa-solid fa-arrow-right qa-arrow"></i>
                    </div>
                    <div class="qa-card" onclick="window.navigate('request')">
                        <div class="qa-icon green"><i class="fa-solid fa-file-circle-plus"></i></div>
                        <div class="qa-text"><h4>Request Document</h4><p>Order transcripts &amp; certifications</p></div>
                        <i class="fa-solid fa-arrow-right qa-arrow"></i>
                    </div>
                </div>

                <!-- What You Can Do -->
                <div class="section-title">What You Can Do</div>
                <div class="what-you-can-do">
                    <div class="wycd-card" onclick="window.navigate('request')">
                        <div class="wycd-icon blue"><i class="fa-solid fa-file-export"></i></div>
                        <h4>Request Documents</h4>
                        <p>Order transcripts</p>
                    </div>
                    <div class="wycd-card" onclick="window.navigate('track')">
                        <div class="wycd-icon green"><i class="fa-solid fa-bars-progress"></i></div>
                        <h4>Process Documents</h4>
                        <p>Pendin</p>
                    </div>
                </div>

                <!-- Need Help -->
                <div class="help-banner">
                    <div class="help-banner-icon"><i class="fa-solid fa-headset"></i></div>
                    <div class="help-banner-text">
                        <h4>Need Help?</h4>
                        <p>Chat with our support team</p>
                    </div>
                    <button class="help-banner-btn"><i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>

            <!-- Right column -->
            <div>
                <div class="section-title">Latest Notifications</div>
                <div class="card">
                    <div class="notif-list">
                        <div class="notif-item unread">
                            <div class="notif-icon blue"><i class="fa-solid fa-file-circle-check"></i></div>
                            <div class="notif-body">
                                <h5>Transcript Request Approved</h5>
                                <p>Your Official Transcript of Records is ready for download</p>
                                <span>2 hours ago</span>
                            </div>
                        </div>
                        <div class="notif-item">
                            <div class="notif-icon gray"><i class="fa-solid fa-lock"></i></div>
                            <div class="notif-body">
                                <h5>Biometrics Setup Success</h5>
                                <p>You have successfully linked your face ID to your Blue Knight hub.</p>
                                <span>Yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="security-badge" style="margin-top:14px;">
                    <i class="fa-solid fa-circle-dot"></i>
                    <p>All credentials are cryptographically secured and verified by the AdDU Registrar's Office</p>
                </div>
            </div>
        </div>`;
    }

    // ── REQUEST ──
    function viewRequest() {
        return `
        <div style="max-width:1100px;">
            <div class="req-toolbar">
                <div class="req-tabs">
                    <button class="req-tab ${state.requestTab === 'new' ? 'active' : ''}" onclick="window.setRequestTab('new')">New Request</button>
                    <button class="req-tab ${state.requestTab === 'history' ? 'active' : ''}" onclick="window.setRequestTab('history')">Request History</button>
                </div>
                <div class="search-bar">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search document…">
                </div>
            </div>

            ${state.requestTab === 'new' ? viewNewRequest() : viewRequestHistory()}
        </div>`;
    }

    function viewNewRequest() {
        return `
        <p style="font-size:13px;color:var(--gray-400);margin-bottom:16px;">Select a document type to request</p>
        <div class="doc-grid">
            ${documentsList.map(doc => `
                <div class="doc-card">
                    <div class="doc-card-head">
                        <div class="doc-icon"><i class="fa-solid ${doc.icon}"></i></div>
                        <div class="doc-card-head-text">
                            <h3>${doc.title}</h3>
                            <p>${doc.desc}</p>
                        </div>
                    </div>
                    <div class="doc-card-footer">
                        <div class="doc-meta">
                            <p>${doc.fee}</p>
                            <p><i class="fa-regular fa-clock"></i> ${doc.time}</p>
                        </div>
                        <button class="btn-request" onclick='window.openModal("confirm-request", ${JSON.stringify(doc)})'>
                            Request <i class="fa-solid fa-arrow-right" style="font-size:10px;"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    function viewRequestHistory() {
        return `
        <div class="history-list">
            ${requestHistory.map(h => `
                <div class="hist-item">
                    <div class="hist-icon"><i class="fa-solid ${h.icon}"></i></div>
                    <div class="hist-body">
                        <h4>${h.title}</h4>
                        <p>${h.ref} · ${h.date}</p>
                    </div>
                    <span class="badge-verified"><i class="fa-solid fa-circle-check"></i> Verified</span>
                    <button class="btn-share-sm" style="margin-left:8px;"><i class="fa-solid fa-share-nodes"></i> Share</button>
                </div>
            `).join('')}
        </div>`;
    }

    // ── TRACK ──
    function viewTrack() {
        const active = trackedRequests.find(r => r.id === state.activeTrackId) || trackedRequests[0];
        const pendingCount = trackedRequests.filter(r => r.status !== 'ready').length;
        const attentionCount = trackedRequests.filter(r => r.status === 'pending').length;

        return `
        <div class="track-layout">
            <!-- Master -->
            <div class="track-master">
                <div class="track-summary-bar">
                    <div class="summary-pill blue">
                        <div class="summary-pill-header"><i class="fa-regular fa-clock"></i> PENDING</div>
                        <div class="number">${pendingCount}</div>
                        <div class="label">Documents in process</div>
                    </div>
                    <div class="summary-pill orange">
                        <div class="summary-pill-header"><i class="fa-solid fa-circle-exclamation"></i> ATTENTION</div>
                        <div class="number">${attentionCount}</div>
                        <div class="label">Require uploads</div>
                    </div>
                </div>
                <div class="track-list-head">Your Document Requests</div>
                <div class="track-list">
                    ${trackedRequests.map(doc => `
                        <div class="track-card ${active.id === doc.id ? 'active' : ''}" onclick="window.setActiveTrack(${doc.id})">
                            <div class="track-card-top">
                                <div class="track-card-icon"><i class="fa-solid ${doc.icon}"></i></div>
                                <div class="track-card-info">
                                    <h4>${doc.title}</h4>
                                    <p>${doc.requestNo}</p>
                                </div>
                                <i class="fa-solid fa-arrow-right" style="margin-left:auto;color:var(--gray-300);font-size:11px;margin-top:3px;"></i>
                            </div>
                            <div class="track-card-bottom">
                                <span class="status-pill ${doc.status}">${doc.statusLabel}</span>
                                ${doc.hasRush ? `<span class="rush-pill">Rush Processing (+${doc.rushFee})</span>` : ''}
                                ${doc.status === 'ready' && doc.expiresIn ? `<span style="font-size:10px;color:var(--orange);font-weight:700;"><i class="fa-regular fa-clock"></i> Expires in ${doc.expiresIn}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Detail -->
            <div class="track-detail">
                <div class="detail-header">
                    <div class="detail-header-left">
                        <h2>${active.title}</h2>
                        <p>Request ID: ${active.requestNo}</p>
                    </div>
                    <div class="detail-header-right">
                        <div class="lbl">Requested On</div>
                        <div class="val">${active.date}</div>
                    </div>
                </div>
                <div class="detail-scroll">
                    <!-- Stepper -->
                    <div class="stepper" style="margin-bottom:24px;">
                        ${active.steps.map((s, i) => {
                            const allDone = active.steps.every(x => x.done);
                            const isCurrent = !s.done && (i === 0 || active.steps[i-1].done);
                            return `
                            <div class="step-item ${s.done ? 'done' : ''} ${isCurrent ? 'current' : ''}">
                                <div class="step-dot ${s.done ? 'done' : ''} ${isCurrent ? 'current' : ''}">
                                    ${s.done ? '<i class="fa-solid fa-check" style="font-size:10px;"></i>' : (i+1)}
                                </div>
                                <div class="step-label">${s.name}</div>
                            </div>`;
                        }).join('')}
                    </div>

                    <!-- Rush button (only if not ready) -->
                    ${active.hasRush && active.status !== 'ready' ? `
                        <button class="btn-rush" onclick="window.openRushConfirm(${active.id})">
                            <i class="fa-solid fa-bolt"></i> Rush Processing (+${active.rushFee})
                        </button>
                    ` : ''}

                    <!-- Expiry notice -->
                    ${active.expiresIn ? `
                        <div class="expiry-notice">
                            <i class="fa-solid fa-circle-info"></i>
                            <span><strong>Download before expiration</strong> — This document will be automatically deleted after 14 days. Expires in <strong>${active.expiresIn}</strong>.</span>
                        </div>
                    ` : ''}

                    <!-- Timeline -->
                    <div style="font-size:12px;font-weight:700;color:var(--gray-500);text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px;">Request Status</div>
                    <div class="timeline">
                        ${active.steps.map(s => `
                            <div class="tl-step ${!s.done ? 'faded' : ''}">
                                <div class="tl-dot ${s.done ? 'done' : 'pending'}"></div>
                                <h4>${s.label}</h4>
                                <p>${s.desc}</p>
                                ${s.date ? `<span class="tl-date">${s.date}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>

                    <!-- Checklist -->
                    <div class="checklist-section">
                        <h4>Required Documents</h4>
                        ${active.requirements.map((r, i) => `
                            <div class="checklist-item">
                                <i class="fa-solid ${active.requirementsDone[i] ? 'fa-circle-check done' : 'fa-circle pending'}"></i>
                                ${r}
                            </div>
                        `).join('')}
                    </div>

                    <!-- Download / Processing indicator -->
                    ${active.status === 'ready' ? `
                        <button class="btn-download" onclick="window.openPdfPreview(${active.id})">
                            <i class="fa-solid fa-file-arrow-down"></i> Download Document
                        </button>
                    ` : `
                        <div style="padding:14px;background:var(--gray-50);border:1px dashed var(--gray-300);border-radius:10px;text-align:center;font-size:12px;color:var(--gray-400);display:flex;align-items:center;justify-content:center;gap:8px;">
                            <i class="fa-solid fa-spinner fa-spin" style="color:var(--blue);"></i>
                            Official file will be available here once processing completes.
                        </div>
                    `}

                    <!-- Office–Alumni Chat -->
                    <div class="chat-section" style="margin-top:20px;">
                        <div class="chat-header">Office–Alumni Chat</div>
                        <div class="chat-body"><p>No messages yet. Start a conversation with the office…</p></div>
                        <div class="chat-input-row">
                            <input type="text" placeholder="Type a message…">
                            <button class="chat-send"><i class="fa-solid fa-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // ── PROFILE ──
    function viewProfile() {
        return `
        <div class="profile-page">
            <!-- Passport Card -->
            <div class="profile-passport-card">
                <div class="passport-top">
                    <div class="passport-avatar"><i class="fa-solid fa-user"></i></div>
                    <div class="passport-info">
                        <h2>${state.user.name}</h2>
                        <p>Student No. ${state.user.studentNo}</p>
                        <span class="verified-pill" style="margin-top:6px;"><i class="fa-solid fa-circle-check"></i> Verified by Registrar</span>
                    </div>
                </div>
                <div class="passport-fields">
                    <div class="passport-field">
                        <div class="lbl">Degree</div>
                        <div class="val"><i class="fa-solid fa-graduation-cap"></i>${state.user.course}</div>
                    </div>
                    <div class="passport-field">
                        <div class="lbl">Graduated</div>
                        <div class="val"><i class="fa-solid fa-calendar"></i>${state.user.graduated}</div>
                    </div>
                    <div class="passport-field">
                        <div class="lbl">Honors</div>
                        <div class="val"><i class="fa-solid fa-award"></i>${state.user.honors}</div>
                    </div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 320px;gap:16px;">
                <div>
                    <!-- Contact -->
                    <div class="profile-section-card">
                        <h3>Contact Information</h3>
                        <div class="contact-grid">
                            <div class="contact-item">
                                <div class="contact-item-icon"><i class="fa-solid fa-envelope"></i></div>
                                <div class="contact-item-text"><div class="lbl">Email</div><div class="val">${state.user.email}</div></div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-item-icon"><i class="fa-solid fa-phone"></i></div>
                                <div class="contact-item-text"><div class="lbl">Phone</div><div class="val">${state.user.phone}</div></div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-item-icon"><i class="fa-solid fa-location-dot"></i></div>
                                <div class="contact-item-text"><div class="lbl">Location</div><div class="val">${state.user.address}</div></div>
                            </div>
                        </div>
                    </div>

                    <!-- AdDU Badge -->
                    <div class="addu-badge">
                        <div class="addu-badge-smol"><img src="/aknight-01.png" alt="AdDU Logo"></div>
                        <div class="addu-badge-text">
                            <h4>Ateneo de Davao University</h4>
                            <p>This credential is cryptographically secured and synced with the AdDU Registrar's Office. Share it instantly with employers for verification.</p>
                        </div>
                    </div>

                    <!-- Quick Login Settings -->
                    <div class="profile-section-card">
                        <h3>Quick Login Settings</h3>
                        <div class="biometric-row">
                            <div class="biometric-info">
                                <div class="biometric-icon"><i class="fa-solid fa-fingerprint"></i></div>
                                <div class="biometric-text">
                                    <h4>Biometric Login</h4>
                                    <p>Enable biometric authentication for faster login</p>
                                </div>
                            </div>
                            <button class="btn-enable" ${state.biometricEnabled ? 'disabled style="background:var(--green);cursor:default;"' : ''} onclick="window.enableBiometrics()">${state.biometricEnabled ? 'Enabled' : 'Enable'}</button>
                        </div>
                    </div>
                </div>

                <!-- Actions column -->
                <div>
                    <div class="profile-section-card">
                        <h3>Actions</h3>
                        <div class="profile-action-btns">
                            <button class="btn-secondary-blue"><i class="fa-solid fa-share-nodes"></i> Share Credential</button>
                            <button class="btn-outline-gray"><i class="fa-solid fa-download"></i> Download PDF</button>
                            <button class="btn-danger-outline" onclick="window.actionLogout()"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // ── STAFF VIEWS ──
    function viewStaffDashboard() {
        const pendingRequests = 42;
        const verifiedToday = 128;
        const alertsCount = 5;
        return `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px;">
            <div class="stat-card">
                <div class="stat-icon blue"><i class="fa-solid fa-hourglass-half"></i></div>
                <div class="stat-text"><div class="stat-label">Pending Verification</div><div class="stat-value">${pendingRequests}</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green"><i class="fa-solid fa-circle-check"></i></div>
                <div class="stat-text"><div class="stat-label">Verified Today</div><div class="stat-value">${verifiedToday}</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange"><i class="fa-solid fa-triangle-exclamation"></i></div>
                <div class="stat-text"><div class="stat-label">Critical Alerts</div><div class="stat-value">${alertsCount}</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon purple"><i class="fa-solid fa-credit-card"></i></div>
                <div class="stat-text"><div class="stat-label">Pending Payments</div><div class="stat-value">₱12,450</div></div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="card">
                <h3 style="margin-bottom: 12px; font-size: 14px; font-weight: 700;">Recent Requests</h3>
                <div class="request-list" style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="padding: 12px; background: var(--gray-50); border-radius: 8px; font-size: 12px;">
                        <div style="font-weight: 600; color: var(--gray-800);">Transcript - Maria Clara Santos</div>
                        <div style="color: var(--gray-500); margin-top: 4px;">2 minutes ago</div>
                    </div>
                    <div style="padding: 12px; background: var(--gray-50); border-radius: 8px; font-size: 12px;">
                        <div style="font-weight: 600; color: var(--gray-800);">Diploma - Juan Dela Cruz</div>
                        <div style="color: var(--gray-500); margin-top: 4px;">15 minutes ago</div>
                    </div>
                    <div style="padding: 12px; background: var(--gray-50); border-radius: 8px; font-size: 12px;">
                        <div style="font-weight: 600; color: var(--gray-800);">Certificate - Emma Wilson</div>
                        <div style="color: var(--gray-500); margin-top: 4px;">1 hour ago</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3 style="margin-bottom: 12px; font-size: 14px; font-weight: 700;">Critical Alerts</h3>
                <div class="alert-list" style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="padding: 12px; background: #fff3e0; border-left: 4px solid var(--orange); border-radius: 6px; font-size: 12px;">
                        <div style="font-weight: 600; color: var(--orange);">Stock Low</div>
                        <div style="color: var(--gray-600); margin-top: 2px;">Diploma Paper: 150 units left</div>
                    </div>
                    <div style="padding: 12px; background: #ffebee; border-left: 4px solid var(--red); border-radius: 6px; font-size: 12px;">
                        <div style="font-weight: 600; color: var(--red);">Unverified Payment</div>
                        <div style="color: var(--gray-600); margin-top: 2px;">₱45,200 pending verification</div>
                    </div>
                </div>
            </div>
        </div>`;
    }

function viewStaffProfile() {
    return `
    <div class="profile-page" style="background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; padding: 20px;">
        
        <div style="background: #3b4d9b; border-radius: 20px; padding: 40px; color: white; margin-bottom: 30px; max-width: 1100px; margin-left: auto; margin-right: auto; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            <div style="display: flex; align-items: center; gap: 25px; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-user-shield" style="font-size: 40px; color: white;"></i>
                </div>
                <div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700;">John Administrator</h1>
                    <p style="margin: 4px 0; opacity: 0.9; font-size: 14px;">Staff ID: Staff_2024_001</p>
                    <span style="background: #4ade80; color: #064e3b; font-size: 11px; padding: 4px 12px; border-radius: 20px; font-weight: 600;">
                        <i class="fas fa-check-circle"></i> Active Status
                    </span>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 25px;">
                <div>
                    <label style="display: block; font-size: 11px; text-transform: uppercase; opacity: 0.8; margin-bottom: 8px;">Position</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-briefcase"></i>
                        <span style="font-weight: 600; font-size: 15px;">System Administrator</span>
                    </div>
                </div>
                <div>
                    <label style="display: block; font-size: 11px; text-transform: uppercase; opacity: 0.8; margin-bottom: 8px;">Department</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-building"></i>
                        <span style="font-weight: 600; font-size: 15px;">Operations</span>
                    </div>
                </div>
                <div>
                    <label style="display: block; font-size: 11px; text-transform: uppercase; opacity: 0.8; margin-bottom: 8px;">Access Level</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-key"></i>
                        <span style="font-weight: 600; font-size: 15px;">Verified Administrator</span>
                    </div>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 25px; max-width: 1100px; margin: 0 auto;">
            
            <div style="display: flex; flex-direction: column; gap: 25px;">
                <div style="background: white; border-radius: 15px; padding: 24px; border: 1px solid #edf2f7; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="font-size: 14px; text-transform: uppercase; color: #1e3a8a; margin-bottom: 20px; letter-spacing: 0.5px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">Contact Information</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="background: #f1f5f9; padding: 10px; border-radius: 8px;"><i class="fas fa-envelope" style="color: #3b4d9b;"></i></div>
                            <div>
                                <small style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Email</small>
                                <span style="font-size: 14px; color: #334155;">john.admin@alumni.edu.ph</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="background: #f1f5f9; padding: 10px; border-radius: 8px;"><i class="fas fa-phone" style="color: #3b4d9b;"></i></div>
                            <div>
                                <small style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Phone Number</small>
                                <span style="font-size: 14px; color: #334155;">+63 917 123 4567</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="background: #f1f5f9; padding: 10px; border-radius: 8px;"><i class="fas fa-map-marker-alt" style="color: #3b4d9b;"></i></div>
                            <div>
                                <small style="color: #64748b; display: block; font-size: 10px; text-transform: uppercase;">Location</small>
                                <span style="font-size: 14px; color: #334155;">Makati, Metro Manila</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="background: white; border-radius: 15px; padding: 24px; border: 1px solid #edf2f7; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="font-size: 14px; text-transform: uppercase; color: #1e3a8a; margin-bottom: 20px;">Quick Login Settings</h3>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="background: #f1f5f9; padding: 10px; border-radius: 8px;"><i class="fas fa-fingerprint" style="color: #3b4d9b;"></i></div>
                            <div>
                                <div style="font-weight: 600; color: #334155; font-size: 14px;">Biometric Login</div>
                                <p style="font-size: 12px; color: #64748b; margin: 0;">Fingerprint or Face ID</p>
                            </div>
                        </div>
                        <button class="btn-enable" style="background: #3b4d9b; color: white; border: none; padding: 8px 24px; border-radius: 6px; font-weight: 600; cursor: pointer;" ${state.biometricEnabled ? 'disabled style="background:#4ade80;cursor:default;"' : ''} onclick="window.enableBiometrics()">
                            ${state.biometricEnabled ? 'Enabled' : 'Enable'}
                        </button>
                    </div>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 25px;">
                <div style="background: white; border-radius: 15px; padding: 24px; border: 1px solid #edf2f7; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="font-size: 14px; text-transform: uppercase; color: #1e3a8a; margin-bottom: 20px;">Account Actions</h3>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <button style="width: 100%; padding: 12px; background: #eef2ff; border: none; border-radius: 8px; color: #3b4d9b; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <i class="fas fa-key"></i> Change Password
                        </button>
                        <button style="width: 100%; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; color: #334155; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <i class="fas fa-history"></i> Activity Log
                        </button>
                        <button style="width: 100%; padding: 12px; background: white; border: 1px solid #fee2e2; border-radius: 8px; color: #ef4444; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;" onclick="window.actionLogout();">
                            <i class="fas fa-sign-out-alt"></i> Sign Out
                        </button>
                    </div>
                </div>

                <div style="background: white; border-radius: 15px; padding: 24px; border: 1px solid #edf2f7; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3 style="font-size: 14px; text-transform: uppercase; color: #1e3a8a; margin-bottom: 20px;">Quick Stats</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
                            <div style="font-size: 20px; font-weight: 700; color: #3b4d9b;">24</div>
                            <div style="font-size: 10px; color: #64748b; margin-top: 4px; text-transform: uppercase;">Documents</div>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
                            <div style="font-size: 20px; font-weight: 700; color: #4ade80;">18</div>
                            <div style="font-size: 10px; color: #64748b; margin-top: 4px; text-transform: uppercase;">Orders</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>`;
}
    function viewProfileManagement() {
        return `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div>
                    <h3>Profile Management</h3>
                    <p style="font-size: 12px; color: var(--gray-600);">Manage requested documents and update status centrally.</p>
                </div>
                <button class="btn-secondary-blue" style="padding: 8px 16px; font-size: 12px;"><i class="fa-solid fa-user-plus"></i> Add User</button>
            </div>
            <div style="display: grid; gap: 16px;">
                ${staffDocumentLogs.map(log => `
                    <div style="background: var(--gray-50); border-radius: 16px; padding: 18px; display: grid; gap: 12px;">
                        <div style="display:flex; justify-content: space-between; align-items: flex-start; gap: 14px;">
                            <div>
                                <div style="font-size: 15px; font-weight: 700; color: var(--gray-800);">${log.student}</div>
                                <div style="font-size: 12px; color: var(--gray-500);">${log.doc} · ${log.date}</div>
                            </div>
                            <span class="status-pill ${log.status === 'Ready' ? 'ready' : log.status === 'Processing' ? 'processing' : 'pending'}" style="font-size: 11px;">${log.status}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <i class="fa-solid fa-file-lines" style="color: var(--blue);"></i>
                                <div>
                                    <div style="font-size: 13px; font-weight: 600; color: var(--gray-800);">${log.doc}</div>
                                    <div style="font-size: 12px; color: var(--gray-500);">₱${log.doc === 'Transcript of Records' ? '150' : log.doc === 'Certified Diploma' ? '200' : '100'} · 5-7 business days</div>
                                </div>
                            </div>
                            <button class="btn-sm" style="background: var(--blue-light); color: white;" onclick="window.openStaffProfile('${log.id}')">View Details</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    function viewDocumentLog() {
        const logs = staffDocumentLogs;
        return `
        <div class="card">
            <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                <input type="text" placeholder="Search by name, ID, or request ID..." style="flex: 1; padding: 10px; border: 1px solid var(--gray-200); border-radius: 8px; font-size: 13px;">
                <button class="btn-secondary-blue" style="padding: 10px 16px; font-size: 12px;"><i class="fa-solid fa-filter"></i> Filter</button>
            </div>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--gray-200); background: var(--gray-50);">
                            <th style="text-align: left; padding: 12px; font-weight: 700; color: var(--gray-600);">Request ID</th>
                            <th style="text-align: left; padding: 12px; font-weight: 700; color: var(--gray-600);">Student Name</th>
                            <th style="text-align: left; padding: 12px; font-weight: 700; color: var(--gray-600);">Document</th>
                            <th style="text-align: left; padding: 12px; font-weight: 700; color: var(--gray-600);">Date</th>
                            <th style="text-align: left; padding: 12px; font-weight: 700; color: var(--gray-600);">Status</th>
                            <th style="text-align: left; padding: 12px; font-weight: 700; color: var(--gray-600);">Reference</th>
                            <th style="text-align: center; padding: 12px; font-weight: 700; color: var(--gray-600);">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logs.map(log => `
                            <tr style="border-bottom: 1px solid var(--gray-100);">
                                <td style="padding: 12px; color: var(--blue); font-weight: 600;">${log.id}</td>
                                <td style="padding: 12px; color: var(--gray-800);">${log.student}</td>
                                <td style="padding: 12px; color: var(--gray-600);">${log.doc}</td>
                                <td style="padding: 12px; color: var(--gray-600);">${log.date}</td>
                                <td style="padding: 12px;"><span class="status-pill ${log.status === 'Ready' ? 'ready' : 'processing'}">${log.status}</span></td>
                                <td style="padding: 12px; color: var(--gray-600);">${log.ref}</td>
                                <td style="padding: 12px; text-align: center;">
                                    ${log.ref.startsWith('QR') ? `<button class="btn-sm" style="background: var(--blue-light); color: white;" onclick="window.openQrCode('${log.id}')">View QR</button>` : `<button class="btn-sm" style="background: var(--gray-200); color: var(--gray-700);" disabled>No QR</button>`}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    function viewInventoryAlerts() {
        const inventory = staffInventory;
        return `
        <div class="card">
            <h3 style="margin-bottom: 16px; font-size: 14px; font-weight: 700;">Document Inventory</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
                ${inventory.map(item => {
                    const status = getInventoryStatus(item);
                    return `
                    <div style="padding: 16px; border: 1px solid var(--gray-200); border-radius: 10px; background: var(--gray-50);">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                            <h4 style="font-size: 13px; font-weight: 700; color: var(--gray-800);">${item.name}</h4>
                            <i class="fa-solid ${item.icon}" style="color: ${status.color}; font-size: 14px;"></i>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--gray-600); margin-bottom: 6px;">
                                <span>Current Stock</span>
                                <span style="font-weight: 600;">${item.current} units</span>
                            </div>
                            <div style="width: 100%; height: 6px; background: var(--gray-200); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${Math.min(100, (item.current / item.reorder) * 100)}%; height: 100%; background: ${status.color}; border-radius: 3px;"></div>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 16px;">
                            <div style="font-size: 11px; color: var(--gray-500);">
                                Reorder Point: ${item.reorder} ${item.unit}
                            </div>
                            <button class="btn-sm" style="background: ${status.button}; color: white;" onclick="window.openPaperOrder('${item.name}')">
                                Order Paper
                            </button>
                        </div>
                    </div>
                `;
                }).join('')}
            </div>
        </div>`;
    }

    function viewPaymentVerification() {
        const searchValue = state.paymentSearch.toLowerCase();
        const payments = staffPayments.filter(payment => {
            const matchesFilter = state.paymentFilter === 'all'
                || (state.paymentFilter === 'pending' && payment.status === 'Pending')
                || (state.paymentFilter === 'flagged' && payment.flagged);
            const matchesSearch = searchValue === '' || payment.student.toLowerCase().includes(searchValue)
                || payment.id.toLowerCase().includes(searchValue)
                || payment.doc.toLowerCase().includes(searchValue);
            return matchesFilter && matchesSearch;
        });
        const pendingCount = staffPayments.filter(p => p.status === 'Pending').length;
        const verifiedCount = staffPayments.filter(p => p.status === 'Verified').length;
        const flaggedCount = staffPayments.filter(p => p.flagged).length;
        return `
        <div style="display: grid; gap: 18px; max-width: 1000px;">
            <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 800; color: var(--gray-800); margin-bottom: 6px;">Payment Verification</h3>
                    <p style="font-size: 13px; color: var(--gray-500); margin: 0;">Review latest transactions and verify student payments securely.</p>
                </div>
                <button class="btn-secondary-blue" style="padding: 12px 18px; font-size: 12px; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-sliders"></i> Advanced Filters</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
                <div style="padding: 18px; background: var(--white); border-radius: 18px; box-shadow: 0 12px 40px rgba(15,23,42,.05); border: 1px solid var(--gray-100);">
                    <div style="font-size: 11px; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 10px;">Pending Verification</div>
                    <div style="font-size: 34px; font-weight: 800; color: var(--blue);">${pendingCount}</div>
                    <span style="display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; padding: 6px 10px; border-radius: 999px; background: #fdf3db; color: #b87b00; font-size: 11px; font-weight: 700;">High Priority</span>
                </div>
                <div style="padding: 18px; background: var(--white); border-radius: 18px; box-shadow: 0 12px 40px rgba(15,23,42,.05); border: 1px solid var(--gray-100);">
                    <div style="font-size: 11px; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 10px;">Verified Today</div>
                    <div style="font-size: 34px; font-weight: 800; color: #1f8e4b;">${verifiedCount}</div>
                    <div style="font-size: 11px; color: #1f8e4b; margin-top: 10px;">+12% vs yesterday</div>
                </div>
                <div style="padding: 18px; background: var(--white); border-radius: 18px; box-shadow: 0 12px 40px rgba(15,23,42,.05); border: 1px solid var(--gray-100); display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size: 11px; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 10px;">Flagged</div>
                    <div style="font-size: 34px; font-weight: 800; color: #d32f2f;">${flaggedCount}</div>
                    <div style="font-size: 11px; color: var(--gray-400); margin-top: 10px;">Awaiting review</div>
                </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
                <button class="btn-sm ${state.paymentFilter === 'all' ? 'active' : ''}" onclick="window.setPaymentFilter('all')" style="background: ${state.paymentFilter === 'all' ? 'var(--blue)' : 'var(--gray-100)'}; color: ${state.paymentFilter === 'all' ? '#fff' : 'var(--gray-600)'};">All Transactions</button>
                <button class="btn-sm ${state.paymentFilter === 'pending' ? 'active' : ''}" onclick="window.setPaymentFilter('pending')" style="background: ${state.paymentFilter === 'pending' ? 'var(--blue)' : 'var(--gray-100)'}; color: ${state.paymentFilter === 'pending' ? '#fff' : 'var(--gray-600)'};">Pending</button>
                <button class="btn-sm ${state.paymentFilter === 'flagged' ? 'active' : ''}" onclick="window.setPaymentFilter('flagged')" style="background: ${state.paymentFilter === 'flagged' ? 'var(--blue)' : 'var(--gray-100)'}; color: ${state.paymentFilter === 'flagged' ? '#fff' : 'var(--gray-600)'};">Flagged ${flaggedCount > 0 ? `<span style='margin-left:6px;background:#f3f4f6;color:#475569;border-radius:999px;padding:2px 8px;font-size:10px;'>${flaggedCount}</span>` : ''}</button>
                <div style="margin-left:auto; min-width:280px;">
                    <div class="search-bar" style="width:100%;"><i class="fa-solid fa-magnifying-glass"></i><input type="text" value="${state.paymentSearch}" oninput="window.setPaymentSearch(this.value)" placeholder="Search unique payment code (e.g. ATN-99X-2023)" style="width:100%; padding: 12px 14px 12px 34px; border-radius: 14px; border: 1px solid var(--gray-200); outline: none; font-size: 13px;" /></div>
                </div>
            </div>
            <div style="display: grid; gap: 14px;">
                ${payments.map(payment => {
                    const verified = payment.status === 'Verified';
                    return `
                        <div style="background: var(--white); border-radius: 20px; border: 1px solid var(--gray-200); box-shadow: 0 12px 30px rgba(15,23,42,.05); padding: 18px; display: flex; flex-wrap: wrap; align-items: center; gap: 16px; justify-content: space-between;">
                            <div style="min-width: 220px; flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                    <div style="width: 10px; height: 10px; border-radius: 50%; background: ${verified ? '#1f8e4b' : '#f59e0b'};"></div>
                                    <div style="font-size: 13px; font-weight: 700; color: var(--gray-800);">${payment.student}</div>
                                </div>
                                <div style="font-size: 12px; color: var(--gray-500); margin-bottom: 10px;">${payment.doc.toUpperCase()} · TUITION FEE</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; font-size: 12px; color: var(--gray-500);">
                                    <span><i class="fa-regular fa-calendar"></i> ${payment.date}</span>
                                    <span><i class="fa-brands fa-google-pay"></i> GCash</span>
                                    <span style="background: var(--gray-100); padding: 6px 10px; border-radius: 10px;">${payment.id.replace('#PAY', 'ATN-')}</span>
                                </div>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-end;">
                                <div style="font-size: 18px; font-weight: 800; color: var(--gray-800);">${payment.amount}</div>
                                <button class="btn-grad${verified ? '' : ''}" style="padding: 10px 18px; min-width: 140px; background: ${verified ? 'var(--green)' : 'var(--blue)'}; color: #fff; border: none; border-radius: 12px; cursor: pointer;" onclick="window.openPaymentVerify('${payment.id}')">${verified ? 'Verified' : 'Verify Payment'}</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>`;
    }

    // ── MODALS ──
    function viewModal() {
        if (state.activeModal === 'confirm-request' && state.selectedDocument) {
            const doc = state.selectedDocument;
            return `
            <div class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-head">
                        <h3>Confirm Request</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="doc-summary-block">
                            <div class="doc-summary-icon"><i class="fa-solid ${doc.icon}"></i></div>
                            <div class="doc-summary-text">
                                <h4>${doc.title}</h4>
                                <p>Official document request</p>
                            </div>
                        </div>
                        <div>
                            <div class="fee-row"><span class="label">Processing Time</span><span class="value">${doc.time}</span></div>
                            <div class="fee-row"><span class="label">Processing Fee</span><span class="value big">${doc.fee}</span></div>
                        </div>
                        <div class="info-box">
                            <i class="fa-solid fa-circle-info" style="flex-shrink:0;margin-top:1px;"></i>
                            <span>You will be directed to payment after confirming this request. Required documents must be uploaded within 48 hours.</span>
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button class="modal-cancel" onclick="window.closeModal()">Cancel</button>
                        <button class="modal-confirm" onclick='window.openPurpose(${JSON.stringify(doc).replace(/"/g, "&quot;")})'>Continue</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'purpose') {
            const purposes = [
                { icon: 'fa-briefcase', iconBg: '#e8eaf6', iconColor: '#3949ab', title: 'Employment / Work', desc: 'Documents needed for job applications or employment verification' },
                { icon: 'fa-earth-asia', iconBg: '#e8f5e9', iconColor: '#2e7d32', title: 'Working / Studying Abroad', desc: 'Documents for international opportunities requiring authentication' },
                { icon: 'fa-scale-balanced', iconBg: '#fff3e0', iconColor: '#e65100', title: 'Board Exam / Licensure', desc: 'Requirements for professional board examinations' },
                { icon: 'fa-graduation-cap', iconBg: '#fce4ec', iconColor: '#c62828', title: 'Graduate School', desc: "Application to master's or doctoral programs" },
                { icon: 'fa-file-lines', iconBg: 'var(--gray-100)', iconColor: 'var(--gray-600)', title: 'Other Purpose', desc: 'Browse all available documents' }
            ];
            return `
            <div class="modal-overlay">
                <div class="modal-box" style="max-width:480px;">
                    <div class="modal-head">
                        <h3>What do you need this for?</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-size:13px;color:var(--gray-500);">Please select the purpose for requesting this document</p>
                        <div class="purpose-list">
                            ${purposes.map(p => `
                                <div class="purpose-item" onclick='window.openVerify(${JSON.stringify(state.selectedDocument).replace(/"/g, "&quot;")})'>
                                    <div class="purpose-item-icon" style="background:${p.iconBg};color:${p.iconColor};"><i class="fa-solid ${p.icon}"></i></div>
                                    <div class="purpose-item-text">
                                        <h4>${p.title}</h4>
                                        <p>${p.desc}</p>
                                    </div>
                                    <i class="fa-solid fa-arrow-right purpose-item-arrow"></i>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-foot" style="justify-content:flex-end;">
                        <button class="modal-cancel" onclick="window.closeModal()" style="flex:0;padding:11px 24px;">Cancel</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'verify') {
            return `
            <div class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-head">
                        <h3>Verify Your Identity</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <p style="font-size:13px;color:var(--gray-500);">For security purposes, please authenticate before proceeding with your document request.</p>
                        <div class="verify-tabs">
                            <button class="verify-tab active"><i class="fa-solid fa-lock"></i> Password</button>
                            <button class="verify-tab"><i class="fa-solid fa-fingerprint"></i> Biometric</button>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Enter Password</label>
                            <div class="input-wrap">
                                <i class="input-icon fa-solid fa-lock"></i>
                                <input type="password" class="form-input" placeholder="Enter your password">
                            </div>
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button class="modal-cancel" onclick="window.closeModal()">Cancel</button>
                        <button class="modal-confirm" onclick="window.submitRequest()">Verify Password</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'payment-verify' && state.selectedPayment) {
            const payment = state.selectedPayment;
            return `
            <div class="modal-overlay">
                <div class="modal-box" style="max-width:420px;">
                    <div class="modal-head">
                        <h3>Verify Payment</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body" style="text-align:center; gap: 20px;">
                        <p style="font-size:13px;color:var(--gray-500);">For security purposes, please authenticate before proceeding with the student's request.</p>
                        <div style="padding: 24px 20px; background: var(--gray-50); border-radius: 18px;">
                            <div style="font-size: 42px; font-weight: 800; color: var(--blue); line-height: 1;">${payment.amount}</div>
                            <div style="margin-top: 10px; font-size: 14px; color: var(--gray-500);">${payment.student}</div>
                            <div style="margin-top: 4px; font-size: 11px; letter-spacing: .13em; color: var(--blue); font-weight: 700;">${payment.doc.toUpperCase()}</div>
                        </div>
                        <div style="font-size: 13px; color: var(--gray-600);">Reference: ${payment.id}</div>
                    </div>
                    <div class="modal-foot">
                        <button class="modal-cancel" onclick="window.closeModal()">Cancel</button>
                        <button class="modal-confirm" onclick="window.confirmPaymentVerification()">Verify Payment</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'qr-code' && state.selectedDocument) {
            const log = state.selectedDocument;
            return `
            <div class="modal-overlay">
                <div class="modal-box" style="max-width:420px;">
                    <div class="modal-head">
                        <h3>Document QR Code</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body" style="text-align:center;">
                        <p style="font-size:13px;color:var(--gray-500);margin-bottom:16px;">Scan this code to retrieve the document request details.</p>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(log.qr)}" alt="QR Code" style="width:220px;height:220px;margin:auto;display:block;border-radius:20px;">
                        <div style="margin-top:16px;font-size:13px;color:var(--gray-600);">Request ID: <strong>${log.id}</strong></div>
                        <div style="margin-top:6px;font-size:13px;color:var(--gray-600);">Document: <strong>${log.doc}</strong></div>
                    </div>
                    <div class="modal-foot">
                        <button class="modal-cancel" onclick="window.closeModal()">Close</button>
                        <button class="modal-confirm" onclick="alert('QR code copied!');">Copy Code</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'order-paper' && state.selectedDocument) {
            const item = state.selectedDocument;
            return `
            <div class="modal-overlay">
                <div class="modal-box" style="max-width:460px;">
                    <div class="modal-head">
                        <h3>Order Paper</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body" style="padding: 0 0 16px;">
                        <div style="background: var(--gray-50); border-radius: 22px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,.08);">
                            <div style="background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%); padding: 18px; color: white; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
                                <div>
                                    <div style="font-size: 14px; text-transform: uppercase; letter-spacing: .1em; opacity: .85;">Item tag</div>
                                    <div style="font-size: 20px; font-weight: 700; margin-top: 6px;">${item.name}</div>
                                </div>
                                <div style="background: rgba(255,255,255,.15); padding: 8px 12px; border-radius: 999px; font-size: 12px;">${item.unit.toUpperCase()}</div>
                            </div>
                            <div style="padding: 18px; display: grid; gap: 14px;">
                                <div style="display:flex; justify-content: space-between; align-items:center; gap:12px;">
                                    <div>
                                        <div style="font-size:12px; color: var(--gray-500);">Current Level</div>
                                        <div style="font-size:18px; font-weight:700; color: var(--gray-800);">${item.current} ${item.unit}</div>
                                    </div>
                                    <div style="text-align:right;">
                                        <div style="font-size:12px; color: var(--gray-500);">Reorder Point</div>
                                        <div style="font-size:18px; font-weight:700; color: var(--gray-800);">${item.reorder} ${item.unit}</div>
                                    </div>
                                </div>
                                <div style="width:100%; height: 9px; background: var(--gray-200); border-radius: 999px; overflow:hidden;">
                                    <div style="width: ${Math.min(100, (item.current / item.reorder) * 100)}%; height: 100%; background: ${item.status === 'Critical' ? 'var(--red)' : item.status === 'Warning' ? 'var(--orange)' : 'var(--green)'};"></div>
                                </div>
                                <div style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;">
                                    <div style="background: white; border-radius: 16px; border:1px solid var(--gray-200); padding: 12px;">
                                        <div style="font-size: 11px; color: var(--gray-500); text-transform: uppercase; letter-spacing: .08em;">Min. Required</div>
                                        <div style="font-size: 16px; font-weight: 700; color: var(--gray-800);">${item.reorder} ${item.unit}</div>
                                    </div>
                                    <div style="background: white; border-radius: 16px; border:1px solid var(--gray-200); padding: 12px;">
                                        <div style="font-size: 11px; color: var(--gray-500); text-transform: uppercase; letter-spacing: .08em;">Est. Days Left</div>
                                        <div style="font-size: 16px; font-weight: 700; color: var(--gray-800);">~ 4 Days</div>
                                    </div>
                                </div>
                                <div style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;">
                                    <div style="background: white; border-radius: 16px; border:1px solid var(--gray-200); padding: 12px;">
                                        <div style="font-size: 11px; color: var(--gray-500); text-transform: uppercase; letter-spacing: .08em;">Daily Usage</div>
                                        <div style="font-size: 16px; font-weight: 700; color: var(--gray-800);">35 / avg</div>
                                    </div>
                                    <div style="background: white; border-radius: 16px; border:1px solid var(--gray-200); padding: 12px;">
                                        <div style="font-size: 11px; color: var(--gray-500); text-transform: uppercase; letter-spacing: .08em;">Last Order</div>
                                        <div style="font-size: 16px; font-weight: 700; color: var(--gray-800);">Jan 12</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top:16px; display:grid; gap:12px;">
                            <label style="font-size:12px;color:var(--gray-600);">Order Quantity</label>
                            <input type="number" min="1" value="${state.orderQuantity}" oninput="window.setPaperQuantity(this.value)" style="width:100%; padding: 12px; border: 1px solid var(--gray-200); border-radius: 14px; font-size: 14px;" />
                            <button class="btn-grad-dark" style="width:100%;" onclick="window.openPaperOrderVerify()">Order More Now</button>
                            <button class="btn-sm" style="width:100%; background: var(--gray-200); color: var(--gray-700);" onclick="window.closeModal()">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>`;
        }
        if (state.activeModal === 'verify-paper-order' && state.selectedDocument) {
            const item = state.selectedDocument;
            return `
            <div class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-head">
                        <h3>Verify Payment</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body" style="text-align:center; gap: 20px;">
                        <p style="font-size:13px;color:var(--gray-500);">For security purposes, please authenticate before proceeding with the staff request.</p>
                        <div style="padding: 24px 20px; background: var(--gray-50); border-radius: 18px;">
                            <div style="font-size: 44px; font-weight: 800; color: var(--blue); line-height: 1;">${state.orderQuantity} ${item.unit}</div>
                            <div style="margin-top: 8px; font-size: 14px; color: var(--gray-500);">${item.name}</div>
                            <div style="margin-top: 4px; font-size: 11px; letter-spacing: .13em; color: var(--blue); font-weight: 700;">INVENTORY ORDER</div>
                        </div>
                        <div style="font-size: 13px; color: var(--gray-600);">Santos, Maria Clara</div>
                    </div>
                    <div class="modal-foot">
                        <button class="modal-cancel" onclick="window.closeModal()">Cancel</button>
                        <button class="modal-confirm" onclick="window.confirmPaperOrder()">Verify Order</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'staff-profile' && state.selectedStaffProfile) {
            const profile = state.selectedStaffProfile;
            const statusOptions = ['Submitted', 'Verified', 'Processed', 'Ready'];
            return `
            <div class="modal-overlay">
                <div class="modal-box" style="max-width:460px;">
                    <div class="modal-head">
                        <h3>Request Details</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:14px; margin-bottom:18px;">
                            <div>
                                <div style="font-size:16px; font-weight:700; color:var(--gray-800);">${profile.student}</div>
                                <div style="font-size:12px; color:var(--gray-500);">${profile.doc} · ${profile.date}</div>
                            </div>
                            <span class="status-pill ${profile.status === 'Ready' ? 'ready' : profile.status === 'Processing' ? 'processing' : 'pending'}" style="font-size:11px; padding:6px 12px;">${profile.status}</span>
                        </div>
                        <div style="padding: 16px; background: var(--gray-50); border-radius: 14px; margin-bottom: 18px;">
                            <h4 style="font-size: 13px; font-weight: 700; color: var(--gray-800); margin-bottom: 8px;">Documents Requested</h4>
                            <div style="background: white; border: 1px solid var(--gray-200); border-radius: 14px; padding: 14px;">
                                <div style="font-size: 14px; font-weight: 700; color: var(--gray-800);">${profile.doc}</div>
                                <div style="font-size: 12px; color: var(--gray-500); margin-top: 6px;">Official academic transcript with all courses and grades.</div>
                                <div style="display:flex; align-items:center; justify-content:space-between; margin-top: 12px; font-size: 12px; color: var(--gray-600);">
                                    <span>₱${profile.doc === 'Transcript of Records' ? '150' : profile.doc === 'Certified Diploma' ? '200' : '100'}</span>
                                    <span>5-7 business days</span>
                                </div>
                            </div>
                        </div>
                        <div style="margin-bottom: 18px;">
                            <div style="font-size: 13px; font-weight:700; color: var(--gray-800); margin-bottom: 12px;">Request Status</div>
                            <div style="display: flex; gap: 12px;">
                                ${statusOptions.map(option => `
                                    <button class="btn-sm" style="background: ${profile.status === option ? 'var(--blue-light)' : 'var(--gray-200)'}; color: ${profile.status === option ? 'white' : 'var(--gray-700)'}; width: 100%;" onclick="window.changeRequestStatus('${profile.id}', '${option}')">${option}</button>
                                `).join('')}
                            </div>
                        </div>
                        <div style="font-size:12px; color:var(--gray-500); line-height:1.5;">
                            <strong>Timeline:</strong>
                            <div style="margin-top:8px; display:grid; gap:8px;">
                                <div>Submitted — ${profile.date}</div>
                                <div>Verified — ${profile.status === 'Verified' || profile.status === 'Processed' || profile.status === 'Ready' ? 'Completed' : 'Pending'}</div>
                                <div>Processed — ${profile.status === 'Processed' || profile.status === 'Ready' ? 'Completed' : 'Pending'}</div>
                                <div>Ready — ${profile.status === 'Ready' ? 'Completed' : 'Pending'}</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button class="modal-cancel" onclick="window.closeModal()">Close</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'rush-confirm') {
            const req = trackedRequests.find(r => r.id === state.rushConfirmId);
            return `
            <div class="modal-overlay">
                <div class="modal-box">
                    <div class="modal-head" style="background:linear-gradient(135deg,#e65100,#fb8c00);">
                        <h3>Confirm Rush Processing</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="rush-confirm-box">
                            <h4><i class="fa-solid fa-bolt"></i> Rush Processing</h4>
                            <p>An additional fee of <strong>${req ? req.rushFee : ''}</strong> will be added. Processing time will be reduced to <strong>1-2 days</strong>.</p>
                        </div>
                        <div class="fee-row"><span class="label">Additional Rush Fee</span><span class="value" style="color:var(--orange);">${req ? req.rushFee : ''}</span></div>
                        <div class="info-box">
                            <i class="fa-solid fa-circle-info" style="flex-shrink:0;margin-top:1px;"></i>
                            <span>The rush fee will be charged to your university e-wallet.</span>
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button class="modal-cancel" onclick="window.closeModal()">Cancel</button>
                        <button class="modal-confirm" style="background:linear-gradient(135deg,#e65100,#fb8c00);" onclick="window.confirmRush()">Confirm Rush</button>
                    </div>
                </div>
            </div>`;
        }

        if (state.activeModal === 'pdf-preview') {
            const req = trackedRequests.find(r => r.id === state.activeTrackId);
            return `
            <div class="modal-overlay">
                <div class="modal-box" style="max-width:500px;">
                    <div class="modal-head">
                        <h3>Document Preview</h3>
                        <button class="modal-close" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="modal-body" style="padding-top:16px;">
                        <div style="font-size:11px;color:var(--gray-400);margin-bottom:8px;">${req ? req.title : ''}</div>
                        <div class="pdf-preview">
                            <div class="uni-logo"><img src="/aknight-01.png" alt="Logo" width="50" height="50" style="object-fit: contain;"></div>
                            <h3>ATENEO DE DAVAO UNIVERSITY</h3>
                            <p class="address">E. Jacinto Street, Davao City 8000, Philippines<br>Tel (082) 221-2411 | registrar@addu.edu.ph</p>
                            <div class="pdf-divider"></div>
                            <div style="font-size:11px;font-weight:700;color:var(--gray-500);letter-spacing:.1em;">OFFICE OF THE UNIVERSITY REGISTRAR</div>
                            <div class="pdf-divider"></div>
                            <div class="cert-title">${req ? req.title.toUpperCase() : ''}</div>
                            <div class="cert-body">This is to certify that the records of this University show that</div>
                            <div style="font-size:16px;font-weight:800;color:var(--gray-800);margin:12px 0;">${state.user.name.toUpperCase()}</div>
                            <div class="cert-body">has satisfactorily completed the requirements for the degree.</div>
                            <div class="pdf-meta">Document No.: CERT-2024-0012 · Date Issued: February 15, 2026</div>
                        </div>
                    </div>
                    <div class="modal-foot">
                        <button class="modal-cancel" onclick="window.closeModal()">Close</button>
                        <button class="modal-confirm" onclick="alert('Downloading PDF…'); window.closeModal()"><i class="fa-solid fa-download"></i> Download PDF</button>
                    </div>
                </div>
            </div>`;
        }

        return '';
    }

    // ── LOGIN ──
    function viewLogin() {
        if (state.loginStep === 'biometric') {
            return viewBiometricAuth();
        }
        if (state.loginType === 'staff') {
            return viewStaffLogin();
        }
        return viewAlumniLogin();
    }

    function viewBiometricAuth() {
        const isStaff = state.loginType === 'staff';
        const title = isStaff ? 'Staff Portal' : 'Blue Knight';
        const subtitle = isStaff ? 'Registrar Portal' : "Alumni Knights' Hub";
        const message = isStaff 
            ? 'Use biometric authentication to securely access your staff account and registrar management system.'
            : 'Forgot your student ID from years ago? No problem! Use biometric authentication to securely link to your alumni record.';
        return `
        <div class="login-shell">
            <div class="login-left ${isStaff ? 'login-left-dark' : ''}">
                <div class="login-brand-block">
                    <div class="login-logo"><img src="/aknight-01.png" alt="Logo" width="150" height="150" style="object-fit: contain;"></div>
                    <h1>Welcome Back,<br><span>${title}</span></h1>
                    <p style="margin-top:6px; opacity:.75;">${subtitle}</p>
                </div>
            </div>
            <div class="login-right">
                <div class="login-card" style="text-align:center;">
                    <div style="margin-bottom: 24px;">
                        <p style="font-size:13px; color: var(--gray-600); line-height: 1.6;">${message}</p>
                    </div>
                    <div style="margin-bottom: 32px;">
                        <div style="width: 140px; height: 140px; border-radius: 50%; background: var(--blue-pale); display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 8px 24px rgba(26, 35, 126, .15);">
                            <i class="fa-solid fa-fingerprint" style="font-size: 56px; color: var(--blue);"></i>
                        </div>
                    </div>
                    <div style="margin-bottom: 24px;">
                        <p style="font-size: 14px; color: var(--gray-600); font-weight: 600;">Ready to authenticate</p>
                    </div>
                    <div style="display: grid; gap: 12px;">
                        <button class="btn-grad" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #1a237e 0%, #f5c518 100%); color: #fff; border: none; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;" onclick="window.authenticateWithBiometric()"><i class="fa-solid fa-fingerprint"></i> Authenticate with Biometrics</button>
                        <button class="btn-outline-google" style="display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="window.authenticateWithFaceId()"><i class="fa-solid fa-face-smile"></i> Use Face ID</button>
                    </div>
                    <div style="margin-top: 24px;">
                        <button onclick="window.backToLoginSelect()" style="background: transparent; border: none; color: var(--blue); text-decoration: underline; cursor: pointer; font-size: 13px; font-weight: 600;">← Back to Login</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function viewAlumniLogin() {
        return `
        <div class="login-shell">
            <div class="login-left">
                <div class="login-brand-block">
                    <div class="login-logo"><img src="/aknight-01.png" alt="Logo" width="150" height="150" style="object-fit: contain;"></div>
                    <h1>Welcome, <span>Blue Knight</span></h1>
                    <p>Alumni Knights' Hub</p>
                    <div class="login-features">
                        <div class="login-feat">
                            <div class="login-feat-icon"><i class="fa-solid fa-id-card"></i></div>
                            <div class="login-feat-text"><p>Verified Digital Academic Records</p><p>Synced with AdDU Registrar's Office</p></div>
                        </div>
                        <div class="login-feat">
                            <div class="login-feat-icon"><i class="fa-solid fa-file-circle-plus"></i></div>
                            <div class="login-feat-text"><p>Request Official Documents</p><p>Transcripts, diplomas &amp; more</p></div>
                        </div>
                        <div class="login-feat">
                            <div class="login-feat-icon"><i class="fa-solid fa-bars-progress"></i></div>
                            <div class="login-feat-text"><p>Real-Time Status Tracking</p><p>Monitor your requests anywhere</p></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="login-right">
                <div class="login-card">
                    <div class="login-card-header">
                        <h2>Welcome, <span>Blue Knight</span></h2>
                        <p>Alumni Knights' Hub</p>
                    </div>

                    <form onsubmit="window.actionLogin(event)">
                        <div class="form-group">
                            <label class="form-label">Student Number</label>
                            <div class="input-wrap">
                                <i class="input-icon fa-solid fa-user"></i>
                                <input type="text" class="form-input" placeholder="e.g. 20210001" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-row">
                                <label class="form-label">Password</label>
                                <a href="#" class="link-sm">Forgot password?</a>
                            </div>
                            <div class="input-wrap">
                                <i class="input-icon fa-solid fa-lock"></i>
                                <input type="password" class="form-input" placeholder="Enter your password" required>
                            </div>
                        </div>
                        <button type="submit" class="btn-grad">Sign In</button>
                    </form>

                    <div class="divider"><span>OR</span></div>
                    <button class="btn-outline-google" onclick="window.actionLogin()">
                        <i class="fa-brands fa-google"></i>
                        Sign in University Email
                    </button>

                    <div class="register-link">Don't have an account? <a href="#">Register</a></div>
                    <div style="border-top: 1px solid var(--gray-200); margin-top: 20px; padding-top: 16px; text-align: center;">
                        <button class="btn-outline-google" onclick="window.useBiometricAuth('alumni')" style="width: 100%; padding: 10px; border: none; background: var(--blue-pale); color: var(--blue); border-radius: 10px; font-weight: 600; cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">
                            <i class="fa-solid fa-fingerprint"></i> Use Biometric Login
                        </button>
                        <p style="font-size: 12px; color: var(--gray-500); margin-bottom: 8px;">Are you a staff member?</p>
                        <button class="btn-outline-gray" onclick="window.setLoginType('staff')" style="width: 100%; padding: 10px; border: 1.5px solid var(--gray-300); border-radius: 10px; background: transparent; color: var(--gray-700); font-weight: 600; cursor: pointer; transition: all .15s;">
                            Login as Staff
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    function viewStaffLogin() {
        return `
        <div class="login-shell">
            <div class="login-left login-left-dark">
                <div class="login-brand-block">
                    <div class="login-logo"><img src="/aknight-01.png" alt="Logo" width="150" height="150" style="object-fit: contain;"></div>
                    <h1>Welcome, <span>Staff</span></h1>
                    <p>Registrar's Management Portal</p>
                    <div class="login-features">
                        <div class="login-feat">
                            <div class="login-feat-icon"><i class="fa-solid fa-file-list"></i></div>
                            <div class="login-feat-text"><p>Manage Document Requests</p><p>Process student applications</p></div>
                        </div>
                        <div class="login-feat">
                            <div class="login-feat-icon"><i class="fa-solid fa-users"></i></div>
                            <div class="login-feat-text"><p>User Management</p><p>Monitor system activity</p></div>
                        </div>
                        <div class="login-feat">
                            <div class="login-feat-icon"><i class="fa-solid fa-chart-line"></i></div>
                            <div class="login-feat-text"><p>Analytics & Reports</p><p>Track request statistics</p></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="login-right">
                <div class="login-card">
                    <div class="login-card-header">
                        <h2>Staff <span>Portal</span></h2>
                        <p>Registrar's Management System</p>
                    </div>

                    <form onsubmit="window.actionLogin(event)">
                        <div class="form-group">
                            <label class="form-label">Staff ID</label>
                            <div class="input-wrap">
                                <i class="input-icon fa-solid fa-badge"></i>
                                <input type="text" class="form-input" placeholder="e.g. STAFF-2024-001" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="form-row">
                                <label class="form-label">Password</label>
                                <a href="#" class="link-sm">Forgot password?</a>
                            </div>
                            <div class="input-wrap">
                                <i class="input-icon fa-solid fa-lock"></i>
                                <input type="password" class="form-input" placeholder="Enter your password" required>
                            </div>
                        </div>
                        <button type="submit" class="btn-grad-dark">Sign In</button>
                    </form>

                    <div class="divider"><span>OR</span></div>
                    <button class="btn-outline-google" onclick="window.actionLogin()">
                        <i class="fa-brands fa-google"></i>
                        Sign in with University Email
                    </button>

                    <div class="register-link" style="border-top: 1px solid var(--gray-200); margin-top: 20px; padding-top: 16px;">
                        <button class="btn-outline-google" onclick="window.useBiometricAuth('staff')" style="width: 100%; padding: 10px; border: none; background: var(--blue-pale); color: var(--blue); border-radius: 10px; font-weight: 600; cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">
                            <i class="fa-solid fa-fingerprint"></i> Use Biometric Login
                        </button>
                        <p style="font-size: 12px; color: var(--gray-500); margin-bottom: 8px;">Are you an alumnus?</p>
                        <button class="btn-outline-gray" onclick="window.setLoginType('alumni')" style="width: 100%; padding: 10px; border: 1.5px solid var(--gray-300); border-radius: 10px; background: transparent; color: var(--gray-700); font-weight: 600; cursor: pointer; transition: all .15s;">
                            Login as Alumni
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // ── INIT ──
    render();

}); // end Meteor.startup