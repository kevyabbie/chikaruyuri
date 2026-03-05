function initMobileDrawers() {
  if (window.innerWidth > 768) return; 

  const backdrop = document.createElement('div');
  backdrop.className = 'mobile-backdrop';
  backdrop.id = 'mobile-backdrop';
  document.body.appendChild(backdrop);


  const leftDrawer = document.createElement('div');
  leftDrawer.className = 'mobile-drawer';
  leftDrawer.id = 'drawer-channels';
  leftDrawer.innerHTML = `
    <div class="drawer-server-header">
      ☂ ChikaruYuri Company
    </div>
    <div class="channels-list" id="mobile-channels-list"></div>
  `;
  document.body.appendChild(leftDrawer);

  const rightDrawer = document.createElement('div');
  rightDrawer.className = 'mobile-drawer';
  rightDrawer.id = 'drawer-members';
  rightDrawer.innerHTML = `
    <div class="drawer-header">
      <span class="drawer-header-title">Members</span>
      <button class="drawer-close" id="close-members">&#x2715;</button>
    </div>
    <div id="drawer-members-inner"></div>
  `;
  document.body.appendChild(rightDrawer);

  const fabBar = document.createElement('div');
  fabBar.className = 'mobile-fab-bar';
  fabBar.id = 'mobile-fab-bar';
  fabBar.innerHTML = `
    <button class="mobile-fab" id="fab-channels" aria-label="Open channels">☰</button>
    <div class="mobile-fab-center">
      <div class="mobile-fab-channel">
        <span class="mobile-fab-channel-hash">#</span>
        <span id="fab-channel-name">staffs</span>
      </div>
      <div class="mobile-fab-server">ChikaruYuri Company</div>
    </div>
    <button class="mobile-fab" id="fab-members" aria-label="Open members">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    </button>
  `;
  document.body.appendChild(fabBar);

  const desktopChannels    = document.querySelector('.sidebar .channels-list');
  const mobileChannelsList = document.getElementById('mobile-channels-list');

  if (desktopChannels && mobileChannelsList) {
    mobileChannelsList.innerHTML = desktopChannels.innerHTML;

    mobileChannelsList.querySelectorAll('.channel-item[data-channel]').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.channel-item[data-channel]').forEach(i => i.classList.remove('active'));
        document.querySelectorAll(`[data-channel="${item.dataset.channel}"]`).forEach(i => i.classList.add('active'));

        const badge = item.querySelector('.badge');
        if (badge) badge.remove();

        const ch    = item.dataset.channel;
        const desc  = item.dataset.desc || '';
        const voice = item.querySelector('.ch-icon.voice');

        document.getElementById('header-hash').textContent         = voice ? '🔊' : '#';
        document.getElementById('header-channel-name').textContent = ch;
        document.getElementById('header-channel-desc').textContent = desc;

        document.querySelectorAll('.content-area').forEach(p => p.classList.add('hidden'));
        const panel = document.getElementById('content-' + ch);
        if (panel) {
          panel.classList.remove('hidden');
          const scroll = panel.querySelector('.messages-scroll');
          if (scroll) scroll.scrollTop = scroll.scrollHeight;
        }

        const fabName = document.getElementById('fab-channel-name');
        if (fabName) fabName.textContent = ch;

        closeAll();
      });
    });
  }

  const desktopMembers = document.getElementById('member-list');
  const mobileMembers  = document.getElementById('drawer-members-inner');

  if (desktopMembers && mobileMembers) {
    mobileMembers.innerHTML = desktopMembers.innerHTML;
    mobileMembers.querySelectorAll('.member-row').forEach(row => {
      row.addEventListener('click', () => {
        closeAll();
        openProfile(parseInt(row.dataset.id));
      });
    });
  }

  function openLeft() {
    leftDrawer.classList.add('open');
    backdrop.classList.add('show');
    document.getElementById('fab-channels').classList.add('active');
  }
  function openRight() {
    rightDrawer.classList.add('open');
    backdrop.classList.add('show');
    document.getElementById('fab-members').classList.add('active');
  }
  function closeAll() {
    leftDrawer.classList.remove('open');
    rightDrawer.classList.remove('open');
    backdrop.classList.remove('show');
    document.getElementById('fab-channels').classList.remove('active');
    document.getElementById('fab-members').classList.remove('active');
  }

  document.getElementById('fab-channels').addEventListener('click', () => {
    leftDrawer.classList.contains('open') ? closeAll() : (closeAll(), openLeft());
  });
  document.getElementById('fab-members').addEventListener('click', () => {
    rightDrawer.classList.contains('open') ? closeAll() : (closeAll(), openRight());
  });
  document.getElementById('close-members').addEventListener('click', closeAll);
  backdrop.addEventListener('click', closeAll);

  let touchStartX = null;
  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (leftDrawer.classList.contains('open')  && dx < -60) closeAll();
    if (rightDrawer.classList.contains('open') && dx >  60) closeAll();
    touchStartX = null;
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initMobileDrawers, 0);
});
