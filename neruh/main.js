// Ensure buttons are clickable by adding event listeners to dynamically created elements
function enableDynamicButtonClicks() {
  document.body.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('.nav-btn')) {
      const view = target.getAttribute('onclick').match(/navigate\('(.*?)'\)/)?.[1];
      if (view) {
        window.navigate(view);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  enableDynamicButtonClicks();
});

// Removed the three offered features under the welcome message
function viewDashboard() {
  return `
  <div class="dash-grid">
    <div>
      <div class="dash-hero">
        <div class="dash-hero-avatar"><i class="fa-solid fa-user"></i></div>
        <div class="dash-hero-info">
          <h2>${state.user.name}</h2>
          <p>Student No. ${state.user.studentNo}</p>
          <div class="verified-tag"><i class="fa-solid fa-circle-check"></i>Verified by Registrar</div>
          <div class="hero-meta-grid">
            <div class="hero-meta-item"><i class="fa-solid fa-graduation-cap"></i>${state.user.course}</div>
            <div class="hero-meta-item"><i class="fa-solid fa-calendar"></i>Graduated ${state.user.graduated}</div>
            <div class="hero-meta-item"><i class="fa-solid fa-envelope"></i>${state.user.email}</div>
            <div class="hero-meta-item"><i class="fa-solid fa-award"></i>${state.user.honors}</div>
          </div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fa-solid fa-file-lines"></i></div>
          <div><div class="stat-label">Active Requests</div><div class="stat-value">3</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="fa-solid fa-circle-check"></i></div>
          <div><div class="stat-label">Completed</div><div class="stat-value">2</div></div>
        </div>
      </div>

      <div class="help-strip" onclick="">
        <i class="fa-solid fa-headset"></i>
        <div class="help-strip-text"><h4>Need Help?</h4><p>Chat with our support team for assistance</p></div>
        <i class="fa-solid fa-arrow-right" style="margin-left:auto;color:var(--blue);font-size:12px;"></i>
      </div>
    </div>

    <div>
      <div class="section-label">Notifications</div>
      <div class="card" style="margin-bottom:14px;">
        <div class="notif-list">
          <div class="notif-item unread">
            <div class="notif-icon blue"><i class="fa-solid fa-file-circle-check"></i></div>
            <div>
              <div class="notif-title">Transcript Request Approved</div>
              <div class="notif-desc">Your Official Transcript is ready for download</div>
              <div class="notif-time">2 hours ago</div>
            </div>
          </div>
          <div class="notif-item">
            <div class="notif-icon gray"><i class="fa-solid fa-circle-check"></i></div>
            <div>
              <div class="notif-title">Request #COG-2024-0521 Ready</div>
              <div class="notif-desc">Certificate of Graduation is available</div>
              <div class="notif-time">Yesterday</div>
            </div>
          </div>
          <div class="notif-item">
            <div class="notif-icon gray"><i class="fa-solid fa-clock"></i></div>
            <div>
              <div class="notif-title">Processing Update</div>
              <div class="notif-desc">Diploma copy is now being processed</div>
              <div class="notif-time">2 days ago</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-label">Document Status</div>
      <div class="card">
        ${trackedRequests.map(r => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--gray-100);" onclick="window.navigate('track');window.setActiveTrack(${r.id})">
            <div style="width:32px;height:32px;border-radius:8px;background:var(--blue-pale);display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--blue);flex-shrink:0;"><i class="fa-solid ${r.icon}"></i></div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13px;font-weight:700;color:var(--gray-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.title}</div>
              <div style="font-size:11px;color:var(--gray-400);margin-top:2px;">${r.requestNo}</div>
            </div>
            <span class="pill ${r.status}">${r.statusLabel}</span>
          </div>
        `).join('')}
      </div>

      <div class="security-note" style="margin-top:14px;">
        <i class="fa-solid fa-shield-halved" style="font-size:16px;flex-shrink:0;margin-top:1px;"></i>
        <p style="font-size:12px;color:var(--green-mid);line-height:1.5;">All credentials are cryptographically secured by the AdDU Registrar's Office</p>
      </div>
    </div>
  </div>`;
}