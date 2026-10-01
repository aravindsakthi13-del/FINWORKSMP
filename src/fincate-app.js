// ==========================================================================
// FINCATE - Core Application Engine
// A Gamified Financial Education and Dynamic Market Simulation Platform
// ==========================================================================

import { FINCATE_DATA } from './fincate-data.js';

class FincateEngine {
  constructor() {
    this.storageKey = 'fincate_user_state_v1';
    this.data = FINCATE_DATA;
    this.initState();
    this.activeTab = 'home';
    this.activeLesson = null;
    this.activeAsset = this.data.assets[0];
    this.selectedTimeframe = '1M';
    this.chartType = 'candlestick';
    this.simSpeed = 1;
    this.isSimRunning = true;
    this.simInterval = null;
    this.lessonMode = 'simple'; // 'simple' or 'advanced'

    this.initDOM();
    this.initAudio();
    this.bindEvents();
    this.startSimulationClock();
    this.render();
  }

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  initState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        this.state = this.getDefaultState();
      }
    } else {
      this.state = this.getDefaultState();
    }

    // Ensure assets dynamic price history is initialized
    this.assetPrices = {};
    this.data.assets.forEach(asset => {
      // Generate initial 30 days of OHLC candles
      const candles = [];
      let base = asset.price * 0.85;
      for (let i = 30; i >= 1; i--) {
        const volatility = asset.volatility;
        const change = (Math.random() - 0.48) * volatility * base;
        const open = base;
        const close = Math.max(1, base + change);
        const high = Math.max(open, close) + Math.random() * volatility * 0.5 * base;
        const low = Math.max(0.5, Math.min(open, close) - Math.random() * volatility * 0.5 * base);
        const volume = Math.floor(10000 + Math.random() * 50000);
        candles.push({ day: 30 - i, open, high, low, close, volume });
        base = close;
      }
      // Set current price to last candle close
      asset.price = candles[candles.length - 1].close;
      this.assetPrices[asset.symbol] = candles;
    });
  }

  getDefaultState() {
    return {
      user: {
        name: 'Alex Rivera',
        level: 1,
        xp: 200,
        fincoins: 10000,
        streak: 3,
        lastActiveDate: new Date().toISOString().split('T')[0],
        assessmentCompleted: false,
        smartScore: 580,
        unlockedBadges: ['first_trade'],
        completedLessons: [],
        quizScores: {},
        caseStudyProgress: {},
        completedChallenges: []
      },
      portfolio: {
        cash: 10000,
        holdings: {}, // { 'APEX': { qty: 10, avgPrice: 175.0 } }
        history: []
      },
      simulationDay: 30,
      activeEvent: null
    };
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.updateUserStatsDisplay();
  }

  // --------------------------------------------------------------------------
  // AUDIO FX SYNTHESIZER (Web Audio API)
  // --------------------------------------------------------------------------
  initAudio() {
    this.audioCtx = null;
    this.soundEnabled = true;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playSound(type) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'coin') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12); // E6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'trade') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(220, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      // Audio not supported or blocked by user gesture
    }
  }

  // --------------------------------------------------------------------------
  // BRAND ASSETS & SVG LOGO GENERATOR
  // --------------------------------------------------------------------------
  getFinacateSymbolSVG(color = 'currentColor', size = '100%') {
    return `
      <svg viewBox="0 0 100 100" fill="none" style="width: ${size}; height: ${size}; display: inline-block; vertical-align: middle;">
        <g fill="${color}">
          <!-- Row 1: Top-Left Leaf Tile -->
          <path d="M 5,20 C 5,10.5 10.5,5 20,5 L 26,5 C 29.5,5 31,6.5 31,10 L 31,26 C 31,29.5 29.5,31 26,31 L 10,31 C 6.5,31 5,29.5 5,26 Z"/>
          <!-- Row 1: Top-Middle Tile -->
          <rect x="37" y="5" width="26" height="26" rx="6" ry="6"/>
          <!-- Row 1: Top-Right Leaf Tile -->
          <path d="M 74,5 L 80,5 C 89.5,5 95,10.5 95,20 L 95,26 C 95,29.5 93.5,31 90,31 L 74,31 C 70.5,31 69,29.5 69,26 L 69,10 C 69,6.5 70.5,5 74,5 Z"/>
          <!-- Row 2: Middle Connected Fluid Shape -->
          <rect x="5" y="37" width="26" height="26" rx="6" ry="6"/>
          <rect x="37" y="37" width="26" height="26" rx="6" ry="6"/>
          <path d="M 5,43 C 5,39 7,37 11,37 L 25,37 C 29,37 31,39 34,43 L 40,51 C 43,55 45,57 49,57 L 58,57 C 61.5,57 63,58.5 63,62 L 63,63 C 63,66.5 61.5,68 58,68 L 44,68 C 40,68 38,66 35,62 L 29,54 C 26,50 24,48 20,48 L 11,48 C 7.5,48 5,46.5 5,43 Z"/>
          <!-- Row 3: Bottom-Left Leaf Tile -->
          <path d="M 5,74 C 5,70.5 6.5,69 10,69 L 26,69 C 29.5,69 31,70.5 31,74 L 31,85 C 31,94.5 25.5,100 16,100 L 10,100 C 6.5,100 5,98.5 5,95 Z"/>
        </g>
      </svg>
    `;
  }

  // --------------------------------------------------------------------------
  // DOM INITIALIZATION
  // --------------------------------------------------------------------------
  initDOM() {
    this.appRoot = document.getElementById('root');
    this.renderSkeleton();
  }

  renderSkeleton() {
    this.appRoot.innerHTML = `
      <!-- Top Navigation Header -->
      <header class="app-header">
        <div class="header-container">
          <div class="brand-wrapper" id="headerBrandLogo">
            <div class="brand-logo-badge" title="Finacate Financial Literacy & Market Platform">
              ${this.getFinacateSymbolSVG('#ffffff', '28px')}
            </div>
            <div>
              <div class="brand-name gradient-text">Finacate</div>
              <div class="brand-tagline">Dynamic Market & Financial Literacy Platform</div>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <nav class="nav-tabs">
            <button class="nav-tab-btn active" data-tab="home"><span>🏠</span> Home</button>
            <button class="nav-tab-btn" data-tab="learn"><span>📚</span> Learn</button>
            <button class="nav-tab-btn" data-tab="simulator"><span>📈</span> Simulator</button>
            <button class="nav-tab-btn" data-tab="cases"><span>💼</span> Case Studies</button>
            <button class="nav-tab-btn" data-tab="glossary"><span>📖</span> Glossary</button>
            <button class="nav-tab-btn" data-tab="leaderboard"><span>🏆</span> Profile & Ranks</button>
            <button class="nav-tab-btn" id="headerTourBtn" style="border: 1px solid rgba(45,212,191,0.3); background: rgba(45,212,191,0.08); color: var(--brand-mint);" title="How to Play & Platform Tour">
              <span>❓</span> Guide
            </button>
          </nav>

          <!-- User Stats Status Bar -->
          <div class="user-stats-bar">
            <div class="stat-pill coins" title="Virtual FinCoins for learning & simulation">
              <span>🪙</span> <span id="headerCoinsVal">0</span> <small>FinCoins</small>
            </div>
            <div class="stat-pill xp" title="Experience Points">
              <span>⚡</span> <span id="headerXPVal">0</span> <small>XP</small>
            </div>
            <div class="stat-pill streak" title="Daily Learning Streak">
              <span>🔥</span> <span id="headerStreakVal">0</span>d
            </div>
            <div class="stat-pill level" title="Current Level">
              <span id="headerLevelIcon">🌱</span> <span id="headerLevelTitle">Beginner</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main App Content Container -->
      <main class="main-wrapper">
        <!-- Toast Stack -->
        <div class="toast-stack" id="toastStack"></div>

        <!-- Tab Content Areas -->
        <section id="tab-home" class="tab-content active"></section>
        <section id="tab-learn" class="tab-content"></section>
        <section id="tab-simulator" class="tab-content"></section>
        <section id="tab-cases" class="tab-content"></section>
        <section id="tab-glossary" class="tab-content"></section>
        <section id="tab-leaderboard" class="tab-content"></section>
      </main>

      <!-- Floating FinAI Assistant Button & Chat Drawer -->
      <div class="finai-fab-btn" id="finAiFab" title="Ask FinAI Assistant">
        ${this.getFinacateSymbolSVG('#ffffff', '28px')}
      </div>
      <div class="finai-chat-drawer" id="finAiDrawer">
        <div class="chat-header">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="width: 28px; height: 28px; background: #145e57; border: 1px solid rgba(45,212,191,0.4); border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 3px;">
              ${this.getFinacateSymbolSVG('#ffffff', '100%')}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem; color: #f3faf8;">FinAI Learning Assistant</div>
              <div style="font-size: 0.7rem; color: var(--accent-cyan);">● Online & Ready to Teach</div>
            </div>
          </div>
          <button class="modal-close-btn" id="closeFinAiBtn">✕</button>
        </div>
        <div class="chat-messages-container" id="finAiMessages">
          <div class="chat-bubble bot">
            👋 Hello! I am <strong>FinAI</strong>, your 24/7 financial tutor powered by Finacate. Ask me to simplify any concept, explain today's market swings, or analyze your portfolio risk!
          </div>
        </div>
        <div class="chat-prompt-chips">
          <span class="prompt-chip" data-prompt="Explain Diversification like I'm 10">🛡️ Diversification</span>
          <span class="prompt-chip" data-prompt="Why do interest rates affect tech stocks?">📉 Rate Hikes</span>
          <span class="prompt-chip" data-prompt="What is Dollar Cost Averaging?">🔄 DCA Strategy</span>
          <span class="prompt-chip" data-prompt="Analyze my current portfolio risk">📊 Analyze My Risk</span>
        </div>
        <div class="chat-input-bar">
          <input type="text" id="finAiInput" placeholder="Ask a financial question..." />
          <button class="btn-primary" id="finAiSendBtn" style="padding: 0.4rem 0.8rem;">Send</button>
        </div>
      </div>

      <!-- Modals Container -->
      <div id="modalContainer"></div>
    `;
  }

  // --------------------------------------------------------------------------
  // BIND DOM EVENTS
  // --------------------------------------------------------------------------
  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab-btn[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Header Tour Button & Logo
    const tourBtn = document.getElementById('headerTourBtn');
    if (tourBtn) {
      tourBtn.addEventListener('click', () => this.showHowToPlayTourModal());
    }

    const brandLogo = document.getElementById('headerBrandLogo');
    if (brandLogo) {
      brandLogo.addEventListener('click', () => this.switchTab('home'));
    }

    // FinAI Chat Widget Toggle
    const fab = document.getElementById('finAiFab');
    const drawer = document.getElementById('finAiDrawer');
    const closeBtn = document.getElementById('closeFinAiBtn');
    const sendBtn = document.getElementById('finAiSendBtn');
    const input = document.getElementById('finAiInput');

    fab.addEventListener('click', () => {
      drawer.classList.toggle('open');
      if (drawer.classList.contains('open')) {
        input.focus();
      }
    });

    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });

    sendBtn.addEventListener('click', () => this.handleFinAiSubmit());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleFinAiSubmit();
    });

    // Prompt chips
    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        input.value = chip.dataset.prompt;
        this.handleFinAiSubmit();
      });
    });

    // Window resize for chart
    window.addEventListener('resize', () => {
      if (this.activeTab === 'simulator') {
        this.renderChart();
      }
    });
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabName}`);
    });

    this.renderTab(tabName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    this.updateUserStatsDisplay();
    this.renderTab(this.activeTab);

    // If assessment not done, show onboarding assessment prompt
    if (!this.state.user.assessmentCompleted) {
      setTimeout(() => this.showOnboardingAssessmentModal(), 500);
    }
  }

  updateUserStatsDisplay() {
    const { user } = this.state;
    const currentLevelObj = this.getLevelObject(user.xp);

    const coinsEl = document.getElementById('headerCoinsVal');
    const xpEl = document.getElementById('headerXPVal');
    const streakEl = document.getElementById('headerStreakVal');
    const levelTitleEl = document.getElementById('headerLevelTitle');
    const levelIconEl = document.getElementById('headerLevelIcon');

    if (coinsEl) coinsEl.textContent = Number(user.fincoins).toLocaleString();
    if (xpEl) xpEl.textContent = user.xp;
    if (streakEl) streakEl.textContent = user.streak;
    if (levelTitleEl) levelTitleEl.textContent = currentLevelObj.title;
    if (levelIconEl) levelIconEl.textContent = currentLevelObj.icon;
  }

  getLevelObject(xp) {
    const levels = this.data.progressionLevels;
    for (let i = levels.length - 1; i >= 0; i--) {
      if (xp >= levels[i].minXP) return levels[i];
    }
    return levels[0];
  }

  showToast(message, type = 'info') {
    const stack = document.getElementById('toastStack');
    if (!stack) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🪙';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    stack.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --------------------------------------------------------------------------
  // TAB ROUTING & RENDERING
  // --------------------------------------------------------------------------
  renderTab(tab) {
    switch (tab) {
      case 'home':
        this.renderHomeTab();
        break;
      case 'learn':
        this.renderLearnTab();
        break;
      case 'simulator':
        this.renderSimulatorTab();
        break;
      case 'cases':
        this.renderCasesTab();
        break;
      case 'glossary':
        this.renderGlossaryTab();
        break;
      case 'leaderboard':
        this.renderLeaderboardTab();
        break;
    }
  }

  // --------------------------------------------------------------------------
  // 1. HOME / DASHBOARD TAB
  // --------------------------------------------------------------------------
  renderHomeTab() {
    const container = document.getElementById('tab-home');
    const { user, portfolio } = this.state;
    const currentLevelObj = this.getLevelObject(user.xp);
    const nextLevelObj = this.data.progressionLevels.find(l => l.level === currentLevelObj.level + 1) || currentLevelObj;
    const xpPercent = Math.min(100, Math.round(((user.xp - currentLevelObj.minXP) / (nextLevelObj.maxXP - currentLevelObj.minXP || 1)) * 100));

    // Calculate total net worth
    let totalStockValue = 0;
    Object.entries(portfolio.holdings).forEach(([symbol, item]) => {
      const asset = this.data.assets.find(a => a.symbol === symbol);
      if (asset) {
        totalStockValue += item.qty * asset.price;
      }
    });
    const netWorth = portfolio.cash + totalStockValue;

    container.innerHTML = `
      <!-- Hero Banner -->
      <div class="hero-banner">
        <div class="hero-main-card glass-card">
          <div class="hero-brand-pill">
            <span style="display:inline-flex; width:14px; height:14px;">${this.getFinacateSymbolSVG('#2dd4bf', '14px')}</span>
            FINACATE FINANCIAL SIMULATOR &amp; ACADEMY
          </div>
          <div class="hero-title">Welcome to <span class="gradient-text">Finacate</span>, ${user.name}!</div>
          <p class="hero-subtitle">
            Master wealth creation, risk-adjusted portfolio management, and market mechanics in an interactive, safe environment. Learn concepts, earn FinCoins, and test strategies in real time.
          </p>
          <div class="hero-actions">
            <button class="btn-primary" id="heroLearnBtn"><span>📚</span> Continue Learning</button>
            <button class="btn-secondary" id="heroSimBtn"><span>📈</span> Enter Market Floor</button>
            <button class="btn-secondary" id="heroCrashBtn" style="border-color: rgba(244,63,94,0.4); color: #fb7185;"><span>🌪️</span> Trigger Market Shock</button>
          </div>
        </div>

        <div class="hero-stats-card glass-card">
          <div>
            <div class="score-metric-row">
              <div>
                <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Smart Learning Score</span>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Risk & Consistency Metric</div>
              </div>
              <div class="smart-score-badge">
                <div class="smart-score-val">${user.smartScore}</div>
                <small style="color: var(--text-muted);">/ 1000 Pts</small>
              </div>
            </div>
            
            <div style="margin-top: 1.25rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                <span>${currentLevelObj.icon} ${currentLevelObj.title}</span>
                <span style="color: var(--text-secondary);">${user.xp} / ${nextLevelObj.maxXP} XP</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${xpPercent}%;"></div>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Simulator Net Worth</div>
              <div style="font-size: 1.2rem; font-weight: 700; color: #34d399;">🪙 ${Math.round(netWorth).toLocaleString()} <small style="font-size: 0.75rem; color: var(--text-muted);">FinCoins</small></div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Badges Unlocked</div>
              <div style="font-size: 1.2rem; font-weight: 700; color: #fbbf24;">🏆 ${user.unlockedBadges.length} / ${this.data.badges.length}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Real News vs Simulator News Distinction Banner -->
      <div class="news-distinction-banner">
        <span class="news-badge badge-sim">SIMULATION SEPARATION</span>
        <div>
          <strong>Educational Notice:</strong> Simulated market assets (APEX, VOLT, BFRG) and events are created for safe learning and risk testing. Real financial news below is curated for macroeconomic context.
        </div>
      </div>

      <!-- Guided 3-Step Learning Roadmap for Beginners -->
      <div class="roadmap-container">
        <div class="section-header" style="margin-bottom: 0.5rem;">
          <h3 class="section-title"><span>🧭</span> Your Quick-Start Learning Roadmap</h3>
          <span style="font-size: 0.8rem; color: var(--brand-mint); font-weight: 600;">Follow steps 1-3 to level up fast</span>
        </div>
        <div class="roadmap-grid">
          <!-- Step 1 -->
          <div class="roadmap-card ${user.completedLessons.length > 0 ? '' : 'active-step'}">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="step-num-badge ${user.completedLessons.length > 0 ? 'done' : 'next'}">
                  ${user.completedLessons.length > 0 ? '✓ COMPLETED' : '👉 STEP 1'}
                </span>
                <span style="font-size: 0.75rem; color: #fbbf24; font-weight: 700;">+200 Coins</span>
              </div>
              <h4 style="font-size: 1.05rem; margin-bottom: 0.35rem;">📚 Learn Cash Flow Basics</h4>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45;">
                Read the 3-minute beginner guide on 50/30/20 budgeting and emergency safety buffers.
              </p>
            </div>
            <button class="btn-primary" id="step1ActionBtn" style="padding: 0.5rem 1rem; font-size: 0.85rem; width: 100%; justify-content: center;">
              ${user.completedLessons.length > 0 ? 'Review Lesson' : 'Start 3-Min Lesson →'}
            </button>
          </div>

          <!-- Step 2 -->
          <div class="roadmap-card ${portfolio.history.length > 0 ? '' : (user.completedLessons.length > 0 ? 'active-step' : '')}">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="step-num-badge ${portfolio.history.length > 0 ? 'done' : 'next'}">
                  ${portfolio.history.length > 0 ? '✓ COMPLETED' : '👉 STEP 2'}
                </span>
                <span style="font-size: 0.75rem; color: #2dd4bf; font-weight: 700;">+25 XP</span>
              </div>
              <h4 style="font-size: 1.05rem; margin-bottom: 0.35rem;">📈 Make First Practice Trade</h4>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45;">
                Use your starter coins to purchase shares of low-risk OMNI Index ETF or defensive Treasury Bonds.
              </p>
            </div>
            <button class="btn-primary" id="step2ActionBtn" style="padding: 0.5rem 1rem; font-size: 0.85rem; width: 100%; justify-content: center;">
              ${portfolio.history.length > 0 ? 'View Open Positions' : 'Open Market Floor →'}
            </button>
          </div>

          <!-- Step 3 -->
          <div class="roadmap-card ${Object.keys(user.caseStudyProgress).length > 0 ? '' : (portfolio.history.length > 0 ? 'active-step' : '')}">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="step-num-badge ${Object.keys(user.caseStudyProgress).length > 0 ? 'done' : 'next'}">
                  ${Object.keys(user.caseStudyProgress).length > 0 ? '✓ COMPLETED' : '👉 STEP 3'}
                </span>
                <span style="font-size: 0.75rem; color: #fbbf24; font-weight: 700;">+150 Coins</span>
              </div>
              <h4 style="font-size: 1.05rem; margin-bottom: 0.35rem;">💼 Test 3-Year Life Dilemma</h4>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45;">
                Decide how to allocate a 10,000 Coin windfall and see how your decision holds up over 3 years.
              </p>
            </div>
            <button class="btn-primary" id="step3ActionBtn" style="padding: 0.5rem 1rem; font-size: 0.85rem; width: 100%; justify-content: center;">
              ${Object.keys(user.caseStudyProgress).length > 0 ? 'Review Case Outcomes' : 'Explore Case Dilemmas →'}
            </button>
          </div>
        </div>
      </div>

      <!-- 1-Click Smart Starter Portfolio Banner -->
      <div class="smart-diversify-card glass-card">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #145e57, #2dd4bf); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; box-shadow: 0 4px 15px rgba(45,212,191,0.3);">
            ✨
          </div>
          <div>
            <h4 style="font-size: 1.05rem; color: #ffffff; margin-bottom: 0.2rem;">New to investing? Deploy a 1-Click Smart Portfolio</h4>
            <p style="font-size: 0.84rem; color: var(--text-secondary);">
              Automatically allocates 50% into OMNI Index ETF + 30% US Treasury Bonds + 20% Tech AI &amp; Clean Utilities with zero manual math!
            </p>
          </div>
        </div>
        <button class="btn-primary" id="homeQuickDeployBtn" style="white-space: nowrap; font-size: 0.9rem; padding: 0.7rem 1.25rem;">
          <span>🚀</span> Deploy 1-Click Portfolio
        </button>
      </div>

      <!-- Live Market Summary Strip -->
      <div class="section-header" style="margin-top: 1.75rem;">
        <h3 class="section-title"><span>📊</span> Live Market Floor Summary</h3>
        <span style="font-size: 0.8rem; color: var(--accent-cyan);">Simulation Day #${this.state.simulationDay}</span>
      </div>
      <div class="market-ticker-grid" id="homeTickerGrid"></div>

      <!-- Dashboard Grid: Daily Challenges & Curated News -->
      <div class="dashboard-grid" style="margin-top: 1.5rem;">
        <!-- Daily Challenges Column -->
        <div class="col-6">
          <div class="glass-card" style="padding: 1.5rem; height: 100%;">
            <div class="section-header">
              <h3 class="section-title"><span>🎯</span> Daily Learning Challenges</h3>
              <span style="font-size: 0.8rem; color: #fbbf24;">Earn FinCoins & XP</span>
            </div>
            <div id="homeChallengesList"></div>
          </div>
        </div>

        <!-- Curated Real News Feed Column -->
        <div class="col-6">
          <div class="glass-card" style="padding: 1.5rem; height: 100%;">
            <div class="section-header">
              <h3 class="section-title"><span>🌐</span> Global Financial Insights (Real Context)</h3>
              <span class="news-badge badge-real">Real World Feed</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${this.data.realNewsFeed.map(news => `
                <div style="padding: 0.85rem; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                  <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--accent-cyan); margin-bottom: 0.25rem;">
                    <span>${news.source} • ${news.category}</span>
                    <span style="color: var(--text-muted);">${news.time}</span>
                  </div>
                  <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.35rem; color: #f8fafc;">${news.title}</div>
                  <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${news.summary}</p>
                  <div style="font-size: 0.75rem; color: #a7f3d0; background: rgba(45, 212, 191, 0.1); padding: 0.4rem 0.6rem; border-radius: 4px; border-left: 2px solid #2dd4bf;">
                    💡 <strong>Learning Takeaway:</strong> ${news.educationalNote}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Render Tickers
    this.renderHomeTickers();
    this.renderHomeChallenges();

    // Bind Button Events
    document.getElementById('heroLearnBtn').addEventListener('click', () => this.switchTab('learn'));
    document.getElementById('heroSimBtn').addEventListener('click', () => this.switchTab('simulator'));
    document.getElementById('heroCrashBtn').addEventListener('click', () => this.triggerMarketEvent('evt_market_crash'));
    
    // Bind Roadmap Step Actions
    const step1Btn = document.getElementById('step1ActionBtn');
    if (step1Btn) {
      step1Btn.addEventListener('click', () => {
        const mod1 = this.data.modules[0];
        if (mod1 && mod1.lessons[0]) {
          this.activeLesson = { ...mod1.lessons[0], moduleTitle: mod1.title };
          this.switchTab('learn');
        }
      });
    }

    const step2Btn = document.getElementById('step2ActionBtn');
    if (step2Btn) {
      step2Btn.addEventListener('click', () => this.switchTab('simulator'));
    }

    const step3Btn = document.getElementById('step3ActionBtn');
    if (step3Btn) {
      step3Btn.addEventListener('click', () => this.switchTab('cases'));
    }

    const quickDeployBtn = document.getElementById('homeQuickDeployBtn');
    if (quickDeployBtn) {
      quickDeployBtn.addEventListener('click', () => this.deploySmartStarterAllocation());
    }
  }

  renderHomeTickers() {
    const grid = document.getElementById('homeTickerGrid');
    if (!grid) return;

    grid.innerHTML = this.data.assets.map(asset => {
      const candles = this.assetPrices[asset.symbol] || [];
      const prevPrice = candles.length > 1 ? candles[candles.length - 2].close : asset.price;
      const changePct = ((asset.price - prevPrice) / prevPrice) * 100;
      const isUp = changePct >= 0;

      return `
        <div class="ticker-card" data-symbol="${asset.symbol}">
          <div class="ticker-top">
            <span class="ticker-symbol" style="color: ${asset.color};">${asset.icon} ${asset.symbol}</span>
            <span class="ticker-change ${isUp ? 'change-up' : 'change-down'}">
              ${isUp ? '▲' : '▼'} ${Math.abs(changePct).toFixed(2)}%
            </span>
          </div>
          <div class="ticker-price">🪙 ${asset.price.toFixed(2)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${asset.name}</div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.ticker-card').forEach(card => {
      card.addEventListener('click', () => {
        const symbol = card.dataset.symbol;
        this.activeAsset = this.data.assets.find(a => a.symbol === symbol) || this.activeAsset;
        this.switchTab('simulator');
      });
    });
  }

  renderHomeChallenges() {
    const list = document.getElementById('homeChallengesList');
    if (!list) return;

    list.innerHTML = this.data.dailyChallenges.map(ch => {
      const isDone = this.state.user.completedChallenges.includes(ch.id);
      return `
        <div class="challenge-item ${isDone ? 'completed' : ''}">
          <div class="challenge-info">
            <h4>${ch.title} ${isDone ? '✅' : ''}</h4>
            <p>${ch.description}</p>
          </div>
          <div style="text-align: right; flex-shrink: 0; margin-left: 1rem;">
            <div style="font-size: 0.8rem; font-weight: 700; color: #fbbf24;">+${ch.rewardCoins} Coins</div>
            <div style="font-size: 0.75rem; color: #2dd4bf;">+${ch.rewardXP} XP</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // 2. LEARN TAB (Modules, Lessons, Mode Switch, Balanced Card, Quizzes)
  // --------------------------------------------------------------------------
  renderLearnTab() {
    const container = document.getElementById('tab-learn');
    if (this.activeLesson) {
      this.renderLessonViewer(container);
      return;
    }

    container.innerHTML = `
      <div class="section-header" style="margin-bottom: 1.5rem;">
        <div>
          <h2 style="font-size: 1.8rem;" class="gradient-text">Interactive Financial Curriculum</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Structured learning modules covering personal finance, stock mechanics, risk management, and market psychology.
          </p>
        </div>
      </div>

      <div class="modules-grid">
        ${this.data.modules.map(mod => {
          const completedCount = mod.lessons.filter(l => this.state.user.completedLessons.includes(l.id)).length;
          const totalCount = mod.lessons.length;
          const isAllDone = completedCount === totalCount && totalCount > 0;

          return `
            <div class="module-card glass-card">
              <div>
                <div class="module-header">
                  <div class="module-icon">${mod.icon}</div>
                  <div>
                    <span class="module-category">${mod.category}</span>
                    <h3 class="module-title">${mod.title}</h3>
                  </div>
                </div>
                <p class="module-desc">${mod.description}</p>
              </div>

              <div>
                <div class="lessons-list">
                  ${mod.lessons.map(les => {
                    const isDone = this.state.user.completedLessons.includes(les.id);
                    return `
                      <button class="lesson-row-btn ${isDone ? 'done' : ''}" data-lesson-id="${les.id}">
                        <span>${isDone ? '✅' : '📖'} ${les.title}</span>
                        <span style="font-size: 0.75rem; color: #fbbf24;">+${les.coinReward} 🪙</span>
                      </button>
                    `;
                  }).join('')}
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
                  <span>Progress: ${completedCount} / ${totalCount} Lessons</span>
                  <span style="color: ${isAllDone ? 'var(--accent-emerald)' : 'inherit'}; font-weight: 600;">
                    ${isAllDone ? 'Mastered' : Math.round((completedCount / totalCount) * 100) + '%'}
                  </span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind lesson buttons
    container.querySelectorAll('.lesson-row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.lessonId;
        this.openLesson(id);
      });
    });
  }

  openLesson(lessonId) {
    for (const mod of this.data.modules) {
      const les = mod.lessons.find(l => l.id === lessonId);
      if (les) {
        this.activeLesson = { ...les, moduleTitle: mod.title };
        this.lessonMode = 'simple';
        this.renderLearnTab();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
  }

  renderLessonViewer(container) {
    const les = this.activeLesson;
    const isCompleted = this.state.user.completedLessons.includes(les.id);

    container.innerHTML = `
      <div class="lesson-viewer-container glass-card">
        <!-- Top Controls Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <button class="btn-secondary" id="backToModulesBtn" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">
            ← Back to All Modules
          </button>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="news-badge badge-sim">⏱️ ${les.readTime}</span>
            <span class="news-badge" style="background: rgba(245,158,11,0.2); color: #fbbf24;">+${les.coinReward} Coins</span>
            <span class="news-badge" style="background: rgba(45,212,191,0.15); color: #2dd4bf;">+${les.xpReward} XP</span>
          </div>
        </div>

        <h1 style="font-size: 1.8rem; margin-bottom: 0.25rem;">${les.title}</h1>
        <div style="font-size: 0.85rem; color: var(--accent-cyan); margin-bottom: 1.5rem;">${les.moduleTitle}</div>

        <!-- Mode Toggle Switch (Simple vs Advanced) -->
        <div class="mode-toggle-bar">
          <div>
            <span style="font-weight: 600; font-size: 0.9rem;">Reading Perspective:</span>
            <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 0.5rem;">
              ${this.lessonMode === 'simple' ? 'Beginner-friendly analogies and intuitive concepts' : 'Quantitative formulas, institutional metrics, and mechanics'}
            </span>
          </div>
          <div class="mode-switch-group">
            <button class="mode-btn ${this.lessonMode === 'simple' ? 'active' : ''}" id="modeSimpleBtn">Simple Mode</button>
            <button class="mode-btn ${this.lessonMode === 'advanced' ? 'active' : ''}" id="modeAdvancedBtn">Advanced Mode</button>
          </div>
        </div>

        <!-- Lesson Body Markdown Text -->
        <div class="lesson-body-text" id="lessonBodyContent">
          ${this.formatMarkdown(this.lessonMode === 'simple' ? les.simpleContent : les.advancedContent)}
        </div>

        <!-- Balanced Perspective Box (Advantages vs Risks) -->
        <div class="balanced-perspective-box">
          <div class="balanced-header">
            <span>⚖️</span> Balanced Perspective: ${les.balancedPerspective.concept}
          </div>
          <div class="balanced-grid">
            <div class="advantage-col">
              <h5><span>✅</span> Advantages & Opportunities</h5>
              <ul class="balanced-col-list">
                ${les.balancedPerspective.advantages.map(a => `<li>${a}</li>`).join('')}
              </ul>
            </div>
            <div class="risk-col">
              <h5><span>⚠️</span> Risks, Costs & Limitations</h5>
              <ul class="balanced-col-list">
                ${les.balancedPerspective.risks.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- Interactive Quiz Section -->
        <div class="lesson-quiz-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span style="font-size: 0.75rem; text-transform: uppercase; color: #2dd4bf; font-weight: 700; letter-spacing: 0.05em;">
              Concept Check Quiz
            </span>
            ${isCompleted ? '<span style="color: var(--accent-emerald); font-weight: 600; font-size: 0.85rem;">✅ Lesson Completed</span>' : ''}
          </div>
          <h4 class="quiz-question-title">${les.quiz.question}</h4>

          <div class="quiz-options-list" id="quizOptionsContainer">
            ${les.quiz.options.map((opt, idx) => `
              <button class="quiz-option-btn" data-index="${idx}">
                <strong style="margin-right: 0.5rem;">${String.fromCharCode(65 + idx)}.</strong> ${opt}
              </button>
            `).join('')}
          </div>

          <div class="quiz-feedback-box" id="quizFeedbackBox"></div>
        </div>
      </div>
    `;

    // Bind Back Button
    document.getElementById('backToModulesBtn').addEventListener('click', () => {
      this.activeLesson = null;
      this.renderLearnTab();
    });

    // Bind Mode Switch Buttons
    document.getElementById('modeSimpleBtn').addEventListener('click', () => {
      this.lessonMode = 'simple';
      this.renderLessonViewer(container);
    });
    document.getElementById('modeAdvancedBtn').addEventListener('click', () => {
      this.lessonMode = 'advanced';
      this.renderLessonViewer(container);
    });

    // Bind Quiz Options
    const optionsContainer = document.getElementById('quizOptionsContainer');
    const feedbackBox = document.getElementById('quizFeedbackBox');

    optionsContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.dataset.index);
        const isCorrect = selectedIdx === les.quiz.correctIndex;

        // Reset previous highlights
        optionsContainer.querySelectorAll('.quiz-option-btn').forEach(b => {
          b.classList.remove('selected', 'correct', 'wrong');
        });

        if (isCorrect) {
          btn.classList.add('correct');
          feedbackBox.style.display = 'block';
          feedbackBox.style.background = 'rgba(16, 185, 129, 0.15)';
          feedbackBox.style.border = '1px solid #10b981';
          feedbackBox.style.color = '#34d399';
          feedbackBox.innerHTML = `
            <strong>🎉 Correct!</strong> ${les.quiz.explanation}
            <div style="margin-top: 0.5rem; font-weight: 700; color: #fbbf24;">
              +${les.coinReward} FinCoins & +${les.xpReward} XP awarded!
            </div>
          `;

          if (!this.state.user.completedLessons.includes(les.id)) {
            this.state.user.completedLessons.push(les.id);
            this.state.user.fincoins += les.coinReward;
            this.state.user.xp += les.xpReward;
            this.state.user.smartScore = Math.min(1000, this.state.user.smartScore + 25);
            this.checkAndAwardBadges();
            this.saveState();
            this.playSound('success');
            this.showToast(`Lesson Completed! Earned ${les.coinReward} FinCoins & ${les.xpReward} XP!`, 'success');
          }
        } else {
          btn.classList.add('wrong');
          feedbackBox.style.display = 'block';
          feedbackBox.style.background = 'rgba(244, 63, 94, 0.15)';
          feedbackBox.style.border = '1px solid #f43f5e';
          feedbackBox.style.color = '#fb7185';
          feedbackBox.innerHTML = `
            <strong>Not quite!</strong> Review the lesson notes above and try again. 
            <br><small style="color: var(--text-secondary);">${les.quiz.explanation}</small>
          `;
          this.playSound('alert');
        }
      });
    });
  }

  formatMarkdown(text) {
    // Simple markdown transformer for headers, bold, bullets, and tables
    let html = text.trim();
    html = html.replace(/### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
    return html;
  }

  // --------------------------------------------------------------------------
  // 3. DYNAMIC MARKET SIMULATOR (Live Candlestick/Area Chart, Orders, Risk)
  // --------------------------------------------------------------------------
  renderSimulatorTab() {
    const container = document.getElementById('tab-simulator');
    const asset = this.activeAsset;
    const { portfolio } = this.state;
    const holding = portfolio.holdings[asset.symbol] || { qty: 0, avgPrice: 0 };
    const currentHoldingValue = holding.qty * asset.price;
    const holdingPnl = holding.qty > 0 ? (asset.price - holding.avgPrice) * holding.qty : 0;
    const holdingPnlPct = holding.qty > 0 ? ((asset.price - holding.avgPrice) / holding.avgPrice) * 100 : 0;

    // Calculate overall portfolio metrics
    let totalStockValue = 0;
    let highRiskValue = 0;
    Object.entries(portfolio.holdings).forEach(([sym, h]) => {
      const a = this.data.assets.find(x => x.symbol === sym);
      if (a) {
        const val = h.qty * a.price;
        totalStockValue += val;
        if (a.riskLevel === 'High Risk' || a.riskLevel === 'Extreme Risk') {
          highRiskValue += val;
        }
      }
    });

    const netWorth = portfolio.cash + totalStockValue;
    const highRiskPct = netWorth > 0 ? Math.round((highRiskValue / netWorth) * 100) : 0;

    container.innerHTML = `
      <!-- Friendly Explainer Helper Banner -->
      <div class="friendly-helper-banner">
        <div class="helper-text-content">
          <h4><span>💡</span> Live Trading Floor — Beginner Cheat Sheet</h4>
          <p>
            Pick an asset on the left, choose how much to invest, and click <strong>Execute Order</strong>.
            Watch your holdings fluctuate as simulation days advance!
          </p>
          <div class="helper-tags-row">
            <span class="helper-tag" style="border-color: rgba(16,185,129,0.4); color: #34d399;">🛡️ Low Risk: OMNI ETF &amp; BOND (Safe compounders)</span>
            <span class="helper-tag" style="border-color: rgba(245,158,11,0.4); color: #fbbf24;">⚡ Moderate: VOLT Utility &amp; GOLD (Steady &amp; Hedged)</span>
            <span class="helper-tag" style="border-color: rgba(244,63,94,0.4); color: #fb7185;">🔥 High Volatility: APEX AI &amp; Crypto (High Risk)</span>
          </div>
        </div>
        <button class="btn-primary" id="btnSimOneClick" style="white-space: nowrap; font-size: 0.85rem; padding: 0.65rem 1.1rem; flex-shrink: 0;">
          <span>✨</span> 1-Click Smart Portfolio
        </button>
      </div>

      <div class="simulator-layout">
        <!-- 1. Left Column: Assets Directory -->
        <div class="asset-list-sidebar">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.25rem;">
            Simulated Asset Universe
          </div>
          ${this.data.assets.map(a => {
            const isSelected = a.symbol === asset.symbol;
            const candles = this.assetPrices[a.symbol] || [];
            const prevPrice = candles.length > 1 ? candles[candles.length - 2].close : a.price;
            const chg = ((a.price - prevPrice) / prevPrice) * 100;
            const isUp = chg >= 0;

            return `
              <div class="asset-nav-card ${isSelected ? 'active' : ''}" data-symbol="${a.symbol}">
                <div class="asset-card-top">
                  <span style="font-weight: 700; color: ${a.color};">${a.icon} ${a.symbol}</span>
                  <span class="asset-badge-tag" style="background: ${a.riskColor}20; color: ${a.riskColor}; border: 1px solid ${a.riskColor}40;">
                    ${a.riskLevel}
                  </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.4rem;">
                  <span style="font-weight: 700; font-size: 1.05rem;">🪙 ${a.price.toFixed(2)}</span>
                  <span class="${isUp ? 'change-up' : 'change-down'}" style="font-size: 0.8rem; font-weight: 600;">
                    ${isUp ? '+' : ''}${chg.toFixed(2)}%
                  </span>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">${a.category}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 2. Middle Column: Interactive Chart & Company Profile -->
        <div>
          <div class="chart-main-card glass-card">
            <!-- Chart Top Header Bar -->
            <div class="chart-header-bar">
              <div class="selected-asset-details">
                <div class="asset-large-icon">${asset.icon}</div>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <h2 style="font-size: 1.4rem;">${asset.name} (${asset.symbol})</h2>
                    <span class="news-badge" style="background: ${asset.riskColor}20; color: ${asset.riskColor};">
                      ${asset.riskLevel}
                    </span>
                  </div>
                  <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">
                    <span>Price: <strong style="color: #fff; font-size: 1.1rem;">🪙 ${asset.price.toFixed(2)}</strong></span>
                    <span>Beta: <strong>${asset.beta}</strong></span>
                    <span>Dividend: <strong>${asset.dividendYield}</strong></span>
                  </div>
                </div>
              </div>

              <!-- Timeframe & Chart Style Controls -->
              <div class="chart-controls-group">
                <button class="chart-timeframe-btn ${this.chartType === 'candlestick' ? 'active' : ''}" id="btnCandleType">Candles</button>
                <button class="chart-timeframe-btn ${this.chartType === 'line' ? 'active' : ''}" id="btnLineType">Area</button>
                <div style="width: 1px; height: 18px; background: var(--border-subtle); margin: 0 0.25rem;"></div>
                <button class="chart-timeframe-btn ${this.selectedTimeframe === '1W' ? 'active' : ''}" data-tf="1W">1W</button>
                <button class="chart-timeframe-btn ${this.selectedTimeframe === '1M' ? 'active' : ''}" data-tf="1M">1M</button>
                <button class="chart-timeframe-btn ${this.selectedTimeframe === 'ALL' ? 'active' : ''}" data-tf="ALL">ALL</button>
              </div>
            </div>

            <!-- Canvas Viewport -->
            <div class="chart-canvas-wrapper">
              <canvas id="marketChartCanvas"></canvas>
            </div>

            <!-- Simulation Clock Controls -->
            <div class="sim-clock-bar">
              <div class="clock-live-indicator">
                <div class="live-dot" style="${this.isSimRunning ? '' : 'animation: none; background: #94a3b8; box-shadow: none;'}"></div>
                <span>Simulation Day #${this.state.simulationDay}</span>
                <span style="color: var(--text-muted); font-size: 0.8rem;">(${this.isSimRunning ? 'Live Ticking' : 'Paused'})</span>
              </div>

              <div class="sim-speed-controls">
                <button class="sim-btn" id="btnNextDay"><span>⏭️</span> Next Day</button>
                <button class="sim-btn ${this.isSimRunning ? 'active' : ''}" id="btnToggleSim">
                  ${this.isSimRunning ? '⏸️ Pause' : '▶️ Run'}
                </button>
                <button class="sim-btn" id="btnTriggerShock" style="color: #fb7185; border-color: rgba(244,63,94,0.3);">
                  <span>⚡</span> Trigger Event
                </button>
              </div>
            </div>
          </div>

          <!-- Company Profile & Fundamentals Card -->
          <div class="asset-profile-card glass-card">
            <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem;">Asset Profile & Fundamentals</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${asset.description}</p>

            <div class="profile-metrics-grid">
              <div class="metric-box">
                <label>Market Cap / AUM</label>
                <span>${asset.marketCap}</span>
              </div>
              <div class="metric-box">
                <label>P/E Ratio</label>
                <span>${asset.peRatio}</span>
              </div>
              <div class="metric-box">
                <label>Market Sentiment</label>
                <span style="color: #34d399;">${asset.sentiment}</span>
              </div>
              <div class="metric-box">
                <label>Balance Sheet Strength</label>
                <span style="color: #2dd4bf; font-size: 0.85rem;">${asset.financialStrength}</span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem; margin-top: 0.5rem;">
              <div style="background: rgba(16, 185, 129, 0.08); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(16, 185, 129, 0.2);">
                <strong style="color: #34d399;">Key Advantage:</strong> ${asset.advantages}
              </div>
              <div style="background: rgba(244, 63, 94, 0.08); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(244, 63, 94, 0.2);">
                <strong style="color: #fb7185;">Key Risk:</strong> ${asset.risks}
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Right Column: Order Execution Panel & Portfolio Health -->
        <div>
          <div class="trading-panel-card glass-card">
            <h3 style="font-size: 1.15rem;">Trading Floor Console</h3>

            <!-- Buy / Sell Order Mode Tabs -->
            <div class="order-type-tabs">
              <button class="order-tab-btn buy-tab active" id="orderBuyTab">BUY</button>
              <button class="order-tab-btn sell-tab" id="orderSellTab">SELL</button>
            </div>

            <!-- Available Balance Display -->
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
              <span style="color: var(--text-secondary);">Available Cash:</span>
              <span style="font-weight: 700; color: #fbbf24;">🪙 ${Math.round(portfolio.cash).toLocaleString()} FinCoins</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
              <span style="color: var(--text-secondary);">You Own:</span>
              <span style="font-weight: 700; color: #38bdf8;">${holding.qty} Shares (${Math.round(currentHoldingValue).toLocaleString()} Coins)</span>
            </div>

            <!-- Shares Input -->
            <div class="order-input-group">
              <label>
                <span>Quantity of Shares</span>
                <span style="color: var(--text-muted);">Est. Price: 🪙${asset.price.toFixed(2)}</span>
              </label>
              <div class="input-with-badge">
                <input type="number" id="tradeQtyInput" value="10" min="1" step="1" />
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">UNITS</span>
              </div>
              
              <!-- Quick Coin Amount Buttons -->
              <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.5rem;">Quick Coin Amount:</div>
              <div class="quick-amount-grid">
                <button class="btn-quick-amount" data-coins="500">+500 🪙</button>
                <button class="btn-quick-amount" data-coins="1000">+1,000 🪙</button>
                <button class="btn-quick-amount" data-coins="2500">+2,500 🪙</button>
                <button class="btn-quick-amount" data-coins="max">All-in 🪙</button>
              </div>

              <!-- Percent Presets -->
              <div class="percent-preset-chips" style="margin-top: 0.5rem;">
                <button class="preset-chip-btn" data-pct="25">25% Cash</button>
                <button class="preset-chip-btn" data-pct="50">50% Cash</button>
                <button class="preset-chip-btn" data-pct="75">75% Cash</button>
                <button class="preset-chip-btn" data-pct="100">100% Cash</button>
              </div>
            </div>

            <!-- Order Cost Breakdown -->
            <div class="order-summary-box">
              <div class="summary-row">
                <span>Share Price</span>
                <span>🪙 ${asset.price.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Trading Fee</span>
                <span style="color: var(--accent-emerald);">0.00 (Zero Fee)</span>
              </div>
              <div class="summary-row total">
                <span>Total Cost</span>
                <span id="orderTotalCost" style="color: #fbbf24;">🪙 ${(10 * asset.price).toFixed(2)}</span>
              </div>
            </div>

            <!-- Plain-English Trade Explanation -->
            <div class="plain-english-box" id="plainEnglishTradeSummary">
              <span>💡</span>
              <div id="plainEnglishSummaryText">
                <strong>Plain-English:</strong> Buying <strong>10 shares</strong> of <strong>${asset.symbol}</strong> costs 🪙${(10 * asset.price).toFixed(2)}. If price rises +5%, your profit is <strong>+🪙${(10 * asset.price * 0.05).toFixed(2)}</strong>.
              </div>
            </div>

            <button class="btn-primary btn-emerald btn-trade-execute" id="btnExecuteTrade" style="margin-top: 0.25rem;">
              EXECUTE BUY ORDER
            </button>
          </div>

          <!-- Portfolio Allocation & Risk Gauge Card -->
          <div class="portfolio-status-card glass-card">
            <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem;">Portfolio Risk Meter</h4>
            
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
              <span style="color: var(--text-secondary);">High-Beta Exposure:</span>
              <span style="font-weight: 700; color: ${highRiskPct > 40 ? '#f43f5e' : '#10b981'};">${highRiskPct}%</span>
            </div>
            <div class="risk-meter-container">
              <div class="risk-meter-bar">
                <div class="risk-meter-fill" style="width: ${Math.min(100, highRiskPct)}%; background: ${highRiskPct > 40 ? '#f43f5e' : highRiskPct > 25 ? '#f59e0b' : '#10b981'};"></div>
              </div>
              <p style="font-size: 0.75rem; color: var(--text-muted);">
                ${highRiskPct > 40 
                  ? '⚠️ High concentration in volatile assets! A market downturn could cause heavy losses.' 
                  : '🛡️ Good risk posture. Balanced across defensive and growth instruments.'}
              </p>
            </div>

            <!-- Current Open Positions -->
            <div style="margin-top: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
              <div style="font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-secondary);">Your Open Positions</div>
              ${Object.keys(portfolio.holdings).length === 0 ? '<div style="font-size: 0.8rem; color: var(--text-muted);">No open holdings. You are 100% in cash.</div>' : ''}
              ${Object.entries(portfolio.holdings).map(([sym, h]) => {
                const a = this.data.assets.find(x => x.symbol === sym);
                if (!a) return '';
                const val = h.qty * a.price;
                const pnl = (a.price - h.avgPrice) * h.qty;
                const isPnlUp = pnl >= 0;

                return `
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
                    <div>
                      <strong style="color: ${a.color};">${sym}</strong> <small style="color: var(--text-muted);">(${h.qty} sh)</small>
                    </div>
                    <div style="text-align: right;">
                      <div>🪙 ${Math.round(val).toLocaleString()}</div>
                      <div class="${isPnlUp ? 'change-up' : 'change-down'}" style="font-size: 0.75rem;">
                        ${isPnlUp ? '+' : ''}${Math.round(pnl)}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize Chart
    this.renderChart();

    // Bind Simulator Events
    this.bindSimulatorEvents();
  }

  bindSimulatorEvents() {
    const asset = this.activeAsset;
    let orderMode = 'BUY'; // 'BUY' or 'SELL'

    // Asset Selector buttons
    document.querySelectorAll('.asset-nav-card').forEach(card => {
      card.addEventListener('click', () => {
        const symbol = card.dataset.symbol;
        this.activeAsset = this.data.assets.find(a => a.symbol === symbol) || this.activeAsset;
        this.renderSimulatorTab();
      });
    });

    // Timeframe buttons
    document.querySelectorAll('.chart-timeframe-btn[data-tf]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedTimeframe = btn.dataset.tf;
        this.renderSimulatorTab();
      });
    });

    // Chart type buttons
    const btnCandle = document.getElementById('btnCandleType');
    const btnLine = document.getElementById('btnLineType');
    if (btnCandle && btnLine) {
      btnCandle.addEventListener('click', () => {
        this.chartType = 'candlestick';
        this.renderSimulatorTab();
      });
      btnLine.addEventListener('click', () => {
        this.chartType = 'line';
        this.renderSimulatorTab();
      });
    }

    // Next day button
    const btnNextDay = document.getElementById('btnNextDay');
    if (btnNextDay) {
      btnNextDay.addEventListener('click', () => {
        this.advanceSimulationDay();
      });
    }

    // Toggle pause/run button
    const btnToggleSim = document.getElementById('btnToggleSim');
    if (btnToggleSim) {
      btnToggleSim.addEventListener('click', () => {
        this.isSimRunning = !this.isSimRunning;
        this.renderSimulatorTab();
      });
    }

    // 1-Click Smart Portfolio Button
    const simOneClickBtn = document.getElementById('btnSimOneClick');
    if (simOneClickBtn) {
      simOneClickBtn.addEventListener('click', () => this.deploySmartStarterAllocation());
    }

    // Trigger shock event button
    const btnTriggerShock = document.getElementById('btnTriggerShock');
    if (btnTriggerShock) {
      btnTriggerShock.addEventListener('click', () => {
        const events = this.data.marketEvents;
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.triggerMarketEvent(randomEvent.id);
      });
    }

    // Order mode tabs
    const buyTab = document.getElementById('orderBuyTab');
    const sellTab = document.getElementById('orderSellTab');
    const executeBtn = document.getElementById('btnExecuteTrade');
    const qtyInput = document.getElementById('tradeQtyInput');
    const totalCostEl = document.getElementById('orderTotalCost');

    const updateCost = () => {
      const qty = parseInt(qtyInput.value) || 0;
      const total = qty * this.activeAsset.price;
      totalCostEl.textContent = `🪙 ${total.toFixed(2)}`;

      const summaryTextEl = document.getElementById('plainEnglishSummaryText');
      if (summaryTextEl) {
        if (orderMode === 'BUY') {
          const upside = (total * 0.05).toFixed(2);
          summaryTextEl.innerHTML = `<strong>Plain-English:</strong> Buying <strong>${qty} shares</strong> of <strong>${this.activeAsset.symbol}</strong> costs 🪙${total.toFixed(2)}. If the price rises +5%, your profit is <strong>+🪙${upside}</strong>.`;
        } else {
          const proceeds = (qty * this.activeAsset.price).toFixed(2);
          summaryTextEl.innerHTML = `<strong>Plain-English:</strong> Selling <strong>${qty} shares</strong> of <strong>${this.activeAsset.symbol}</strong> will return <strong>🪙${proceeds}</strong> cash into your balance.`;
        }
      }
    };

    qtyInput.addEventListener('input', updateCost);

    buyTab.addEventListener('click', () => {
      orderMode = 'BUY';
      buyTab.classList.add('active');
      sellTab.classList.remove('active');
      executeBtn.className = 'btn-primary btn-emerald btn-trade-execute';
      executeBtn.textContent = 'EXECUTE BUY ORDER';
      updateCost();
    });

    sellTab.addEventListener('click', () => {
      orderMode = 'SELL';
      sellTab.classList.add('active');
      buyTab.classList.remove('active');
      executeBtn.className = 'btn-primary btn-rose btn-trade-execute';
      executeBtn.textContent = 'EXECUTE SELL ORDER';
      updateCost();
    });

    // Quick Coin Amount Buttons
    document.querySelectorAll('.btn-quick-amount').forEach(btn => {
      btn.addEventListener('click', () => {
        const coinStr = btn.dataset.coins;
        if (coinStr === 'max') {
          if (orderMode === 'BUY') {
            const maxShares = Math.floor(this.state.portfolio.cash / this.activeAsset.price);
            qtyInput.value = Math.max(1, maxShares);
          } else {
            const holding = this.state.portfolio.holdings[this.activeAsset.symbol] || { qty: 0 };
            qtyInput.value = Math.max(1, holding.qty);
          }
        } else {
          const targetCoins = parseInt(coinStr);
          const targetShares = Math.max(1, Math.floor(targetCoins / this.activeAsset.price));
          qtyInput.value = targetShares;
        }
        updateCost();
      });
    });

    // Preset chips
    document.querySelectorAll('.preset-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pct = parseInt(btn.dataset.pct) / 100;
        if (orderMode === 'BUY') {
          const maxShares = Math.floor((this.state.portfolio.cash * pct) / this.activeAsset.price);
          qtyInput.value = Math.max(1, maxShares);
        } else {
          const holding = this.state.portfolio.holdings[this.activeAsset.symbol] || { qty: 0 };
          const shares = Math.floor(holding.qty * pct);
          qtyInput.value = Math.max(1, shares);
        }
        updateCost();
      });
    });

    // Execute Trade button
    executeBtn.addEventListener('click', () => {
      const qty = parseInt(qtyInput.value);
      if (!qty || qty <= 0) {
        this.showToast('Please enter a valid quantity of shares', 'warning');
        return;
      }

      if (orderMode === 'BUY') {
        const cost = qty * this.activeAsset.price;
        if (this.state.portfolio.cash < cost) {
          this.playSound('alert');
          this.showToast('Insufficient FinCoins cash balance!', 'warning');
          return;
        }

        this.state.portfolio.cash -= cost;
        const currentHolding = this.state.portfolio.holdings[this.activeAsset.symbol] || { qty: 0, avgPrice: 0 };
        const newQty = currentHolding.qty + qty;
        const newAvgPrice = ((currentHolding.qty * currentHolding.avgPrice) + cost) / newQty;

        this.state.portfolio.holdings[this.activeAsset.symbol] = {
          qty: newQty,
          avgPrice: newAvgPrice
        };

        this.state.portfolio.history.unshift({
          type: 'BUY',
          symbol: this.activeAsset.symbol,
          qty,
          price: this.activeAsset.price,
          timestamp: new Date().toLocaleTimeString()
        });

        this.state.user.xp += 20;
        this.playSound('trade');
        this.checkAndAwardBadges();
        this.saveState();
        this.showToast(`Bought ${qty} shares of ${this.activeAsset.symbol} for 🪙${cost.toFixed(2)}`, 'success');
        this.renderSimulatorTab();
      } else {
        // SELL Order
        const currentHolding = this.state.portfolio.holdings[this.activeAsset.symbol];
        if (!currentHolding || currentHolding.qty < qty) {
          this.playSound('alert');
          this.showToast(`You only own ${currentHolding ? currentHolding.qty : 0} shares to sell!`, 'warning');
          return;
        }

        const proceeds = qty * this.activeAsset.price;
        const realizedPnl = (this.activeAsset.price - currentHolding.avgPrice) * qty;

        this.state.portfolio.cash += proceeds;
        currentHolding.qty -= qty;

        if (currentHolding.qty === 0) {
          delete this.state.portfolio.holdings[this.activeAsset.symbol];
        }

        this.state.portfolio.history.unshift({
          type: 'SELL',
          symbol: this.activeAsset.symbol,
          qty,
          price: this.activeAsset.price,
          realizedPnl,
          timestamp: new Date().toLocaleTimeString()
        });

        this.state.user.xp += 25;
        this.playSound('coin');
        this.checkAndAwardBadges();
        this.saveState();
        this.showToast(`Sold ${qty} shares of ${this.activeAsset.symbol}. P&L: 🪙${realizedPnl.toFixed(2)}`, 'success');
        this.renderSimulatorTab();
      }
    });
  }

  // --------------------------------------------------------------------------
  // HIGH PERFORMANCE CANVAS CHART RENDERER
  // --------------------------------------------------------------------------
  renderChart() {
    const canvas = document.getElementById('marketChartCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Get candles for active asset
    let candles = this.assetPrices[this.activeAsset.symbol] || [];
    if (this.selectedTimeframe === '1W') {
      candles = candles.slice(-7);
    } else if (this.selectedTimeframe === '1M') {
      candles = candles.slice(-30);
    }

    if (candles.length === 0) return;

    // Calculate High / Low price ranges
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 0;

    candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    const pricePadding = (maxPrice - minPrice) * 0.12 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;

    const chartHeight = height * 0.75;
    const volumeHeight = height * 0.2;

    const getY = (price) => chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight + 10;
    const getVolY = (vol) => height - (vol / (maxVolume || 1)) * volumeHeight;

    // Clear background
    ctx.fillStyle = '#050d0c';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid lines
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Price labels on right
      const priceAtY = maxPrice - (i / 4) * (maxPrice - minPrice);
      ctx.fillStyle = '#90aba7';
      ctx.font = '10px Inter';
      ctx.fillText(priceAtY.toFixed(2), width - 45, y - 4);
    }

    const candleWidth = Math.max(3, (width - 60) / candles.length - 3);

    // 1. Draw Volume Bars
    candles.forEach((c, idx) => {
      const x = 20 + idx * (candleWidth + 3);
      const isUp = c.close >= c.open;
      const vY = getVolY(c.volume);

      ctx.fillStyle = isUp ? 'rgba(45, 212, 191, 0.35)' : 'rgba(244, 63, 94, 0.3)';
      ctx.fillRect(x, vY, candleWidth, height - vY);
    });

    // 2. Draw Candlesticks or Area Line
    if (this.chartType === 'candlestick') {
      candles.forEach((c, idx) => {
        const x = 20 + idx * (candleWidth + 3);
        const isUp = c.close >= c.open;
        const color = isUp ? '#2dd4bf' : '#f43f5e';

        const openY = getY(c.open);
        const closeY = getY(c.close);
        const highY = getY(c.high);
        const lowY = getY(c.low);

        // Draw High/Low Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();

        // Draw Candle Body
        ctx.fillStyle = color;
        const bodyY = Math.min(openY, closeY);
        const bodyH = Math.max(2, Math.abs(closeY - openY));
        ctx.fillRect(x, bodyY, candleWidth, bodyH);
      });
    } else {
      // Area Line Chart
      ctx.beginPath();
      candles.forEach((c, idx) => {
        const x = 20 + idx * (candleWidth + 3) + candleWidth / 2;
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = this.activeAsset.color || '#2dd4bf';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Fill gradient
      const lastX = 20 + (candles.length - 1) * (candleWidth + 3) + candleWidth / 2;
      ctx.lineTo(lastX, chartHeight);
      ctx.lineTo(20 + candleWidth / 2, chartHeight);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, 0, chartHeight);
      grad.addColorStop(0, `${this.activeAsset.color}40`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 3. Draw 20-Day Moving Average Line (Cyan)
    if (candles.length >= 5) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 4; i < candles.length; i++) {
        let sum = 0;
        for (let j = i - 4; j <= i; j++) sum += candles[j].close;
        const ma = sum / 5;
        const x = 20 + i * (candleWidth + 3) + candleWidth / 2;
        const y = getY(ma);
        if (i === 4) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  // --------------------------------------------------------------------------
  // SIMULATION CLOCK ENGINE (Geometric Brownian Motion + Macro Events)
  // --------------------------------------------------------------------------
  startSimulationClock() {
    if (this.simInterval) clearInterval(this.simInterval);

    this.simInterval = setInterval(() => {
      if (this.isSimRunning) {
        this.advanceSimulationDay();
      }
    }, 4000); // Ticks every 4 seconds
  }

  advanceSimulationDay() {
    this.state.simulationDay += 1;

    // Advance each asset price with realistic stochastic drift
    this.data.assets.forEach(asset => {
      const candles = this.assetPrices[asset.symbol] || [];
      const lastCandle = candles[candles.length - 1];
      const prevClose = lastCandle ? lastCandle.close : asset.price;

      const drift = asset.momentum;
      const shock = (Math.random() - 0.49) * asset.volatility;
      const open = prevClose;
      const close = Math.max(0.5, prevClose * (1 + drift + shock));
      const high = Math.max(open, close) * (1 + Math.random() * asset.volatility * 0.4);
      const low = Math.min(open, close) * (1 - Math.random() * asset.volatility * 0.4);
      const volume = Math.floor(15000 + Math.random() * 60000);

      candles.push({
        day: this.state.simulationDay,
        open,
        high,
        low,
        close,
        volume
      });

      // Keep last 100 days
      if (candles.length > 100) candles.shift();
      asset.price = close;
    });

    // Random chance of triggering an automatic market event every 15 days
    if (this.state.simulationDay % 15 === 0 && Math.random() < 0.6) {
      const events = this.data.marketEvents;
      const ev = events[Math.floor(Math.random() * events.length)];
      this.triggerMarketEvent(ev.id);
    }

    this.saveState();

    if (this.activeTab === 'simulator') {
      this.renderChart();
      this.renderSimulatorTab();
    } else if (this.activeTab === 'home') {
      this.renderHomeTickers();
    }
  }

  // --------------------------------------------------------------------------
  // DYNAMIC MARKET EVENT ENGINE & DECISION CONSEQUENCES
  // --------------------------------------------------------------------------
  triggerMarketEvent(eventId) {
    const event = this.data.marketEvents.find(e => e.id === eventId);
    if (!event) return;

    this.playSound('alert');

    // Apply immediate asset price impacts
    Object.entries(event.assetImpacts).forEach(([sym, impact]) => {
      const asset = this.data.assets.find(a => a.symbol === sym);
      if (asset) {
        asset.price = Math.max(1, asset.price * (1 + impact));
        const candles = this.assetPrices[sym];
        if (candles && candles.length > 0) {
          candles[candles.length - 1].close = asset.price;
        }
      }
    });

    this.showMarketEventModal(event);
  }

  showMarketEventModal(event) {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = `
      <div class="modal-overlay active" id="marketEventModal">
        <div class="modal-container">
          <div class="modal-header">
            <div>
              <span class="news-badge badge-sim">${event.tag} • ${event.severity}</span>
              <h2 style="font-size: 1.45rem; margin-top: 0.35rem; color: #ffffff;">${event.title}</h2>
            </div>
            <button class="modal-close-btn" id="closeEventModalBtn">✕</button>
          </div>

          <div style="font-size: 0.95rem; color: #f8fafc; font-weight: 600; margin-bottom: 0.5rem; line-height: 1.4;">
            ${event.headline}
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
            ${event.description}
          </p>

          <!-- Asset Impacts Summary -->
          <div class="event-impact-grid">
            ${Object.entries(event.assetImpacts).map(([sym, imp]) => {
              const isUp = imp >= 0;
              return `
                <div class="event-impact-item">
                  <strong style="color: #fff;">${sym}</strong>: 
                  <span class="${isUp ? 'change-up' : 'change-down'}" style="font-weight: 700;">
                    ${isUp ? '+' : ''}${(imp * 100).toFixed(1)}%
                  </span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Tactical Decision Choice Prompt -->
          <div style="margin-top: 1.25rem;">
            <div style="font-weight: 700; font-size: 0.95rem; color: #fbbf24; margin-bottom: 0.75rem;">
              ⚖️ Decision Consequence Prompt: ${event.decisionPrompt}
            </div>
            <div class="event-options-list">
              ${event.options.map((opt, idx) => `
                <button class="event-choice-btn" data-opt-id="${opt.id}">
                  <div style="font-weight: 600;">${opt.text}</div>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Debrief Box (Revealed upon decision) -->
          <div class="debrief-box" id="eventDebriefBox" style="display: none;"></div>
        </div>
      </div>
    `;

    document.getElementById('closeEventModalBtn').addEventListener('click', () => {
      document.getElementById('marketEventModal').remove();
      this.render();
    });

    // Bind Option Choices
    const debriefBox = document.getElementById('eventDebriefBox');
    modalContainer.querySelectorAll('.event-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const optId = btn.dataset.optId;
        const option = event.options.find(o => o.id === optId);
        if (!option) return;

        // Apply risk score adjustment & awards
        this.state.user.smartScore = Math.max(0, Math.min(1000, this.state.user.smartScore + option.riskAdjustment));
        if (option.isPrudent) {
          this.state.user.xp += 150;
          this.state.user.fincoins += 200;
          this.playSound('success');
        } else {
          this.playSound('alert');
        }

        // Show educational debrief
        debriefBox.style.display = 'block';
        debriefBox.innerHTML = `
          <div class="debrief-badge">Educational Consequence & Macro Debrief</div>
          <div style="font-size: 0.95rem; font-weight: 700; color: ${option.isPrudent ? '#34d399' : '#fb7185'}; margin-bottom: 0.5rem;">
            ${option.isPrudent ? '✅ Prudent Risk Management' : '⚠️ Sub-optimal Emotional Decision'}
          </div>
          <p style="font-size: 0.88rem; color: #e3f0ed; margin-bottom: 0.75rem;">
            ${option.feedback}
          </p>
          <div style="background: rgba(14,38,36,0.8); border: 1px solid rgba(45,212,191,0.25); padding: 0.75rem; border-radius: 6px; font-size: 0.82rem; color: #a7f3d0;">
            <strong>Macro Insight (${event.debrief.macroConcept}):</strong> ${event.debrief.keyTakeaway}
          </div>
          <button class="btn-primary" id="closeDebriefBtn" style="margin-top: 1rem; width: 100%;">
            Continue to Market Floor
          </button>
        `;

        document.getElementById('closeDebriefBtn').addEventListener('click', () => {
          document.getElementById('marketEventModal').remove();
          this.checkAndAwardBadges();
          this.saveState();
          this.render();
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. REAL-WORLD CASE STUDIES TAB
  // --------------------------------------------------------------------------
  renderCasesTab() {
    const container = document.getElementById('tab-cases');
    container.innerHTML = `
      <div class="section-header" style="margin-bottom: 1.5rem;">
        <div>
          <h2 style="font-size: 1.8rem;" class="gradient-text">Interactive Financial Case Studies</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Step into realistic multi-year financial dilemmas. Make choices and observe simulated 1-year and 3-year outcomes.
          </p>
        </div>
      </div>

      <div class="case-studies-grid">
        ${this.data.caseStudies.map(cs => {
          const result = this.state.user.caseStudyProgress[cs.id];
          return `
            <div class="case-card glass-card">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span class="news-badge badge-sim">${cs.difficulty}</span>
                  <span style="font-size: 0.75rem; color: var(--accent-cyan);">${cs.category}</span>
                </div>
                <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">${cs.title}</h3>
                <div class="case-scenario-box">
                  ${this.formatMarkdown(cs.scenario)}
                </div>
              </div>

              <div>
                <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: #fbbf24;">Choose Your Strategy:</h4>
                <div class="case-choices-list">
                  ${cs.choices.map(ch => `
                    <div class="case-choice-card" data-case-id="${cs.id}" data-choice-id="${ch.id}">
                      <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.2rem;">${ch.title}</div>
                      <div style="font-size: 0.75rem; color: #fb7185;">${ch.riskLevel}</div>
                    </div>
                  `).join('')}
                </div>

                <div class="case-timeline-result" id="caseResult_${cs.id}">
                  ${result ? `
                    <div style="font-weight: 700; color: #34d399; margin-bottom: 0.35rem;">Simulated 3-Year Outcome:</div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary);">${result.outcome}</p>
                  ` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind Case Study Choices
    container.querySelectorAll('.case-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const caseId = card.dataset.caseId;
        const choiceId = card.dataset.choiceId;
        const cs = this.data.caseStudies.find(c => c.id === caseId);
        const choice = cs.choices.find(ch => ch.id === choiceId);
        const resultBox = document.getElementById(`caseResult_${caseId}`);

        resultBox.style.display = 'block';
        resultBox.innerHTML = `
          <div style="font-size: 0.8rem; text-transform: uppercase; color: #2dd4bf; font-weight: 700; margin-bottom: 0.5rem;">
            Simulation Timeline: ${choice.title}
          </div>
          <div style="font-size: 0.85rem; color: #e2e8f0; margin-bottom: 0.5rem;">
            📅 <strong>Year 1:</strong> ${choice.simulatedOutcome.year1}
          </div>
          <div style="font-size: 0.85rem; color: #e2e8f0; margin-bottom: 0.75rem;">
            📅 <strong>Year 3:</strong> ${choice.simulatedOutcome.year3}
          </div>
          <div style="background: rgba(45,212,191,0.12); padding: 0.6rem; border-radius: 4px; font-size: 0.8rem; color: #a7f3d0;">
            💡 <strong>Key Wisdom:</strong> ${choice.simulatedOutcome.lessons}
          </div>
        `;

        this.state.user.caseStudyProgress[caseId] = {
          choiceId,
          outcome: choice.simulatedOutcome.year3
        };
        this.state.user.xp += 100;
        this.state.user.fincoins += 150;
        this.state.user.smartScore = Math.min(1000, this.state.user.smartScore + choice.simulatedOutcome.netOutcomeScore / 4);
        this.checkAndAwardBadges();
        this.saveState();
        this.playSound('success');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. SEARCHABLE FINANCIAL GLOSSARY TAB
  // --------------------------------------------------------------------------
  renderGlossaryTab() {
    const container = document.getElementById('tab-glossary');
    let activeCategory = 'ALL';
    let searchQuery = '';

    const renderTerms = () => {
      const filtered = this.data.glossary.filter(item => {
        const matchesCat = activeCategory === 'ALL' || item.category === activeCategory;
        const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.definition.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
      });

      const cardsGrid = document.getElementById('glossaryCardsGrid');
      if (cardsGrid) {
        cardsGrid.innerHTML = filtered.map(item => `
          <div class="glossary-term-card glass-card">
            <div>
              <div class="glossary-term-header">
                <h3 class="glossary-term-title">${item.term}</h3>
                <span class="glossary-term-category">${item.category}</span>
              </div>
              <p class="glossary-term-def">${item.definition}</p>
            </div>

            <div>
              <div class="glossary-example-box">
                <strong style="color: var(--accent-cyan);">Real Example:</strong> ${item.example}
              </div>
              <div class="glossary-risk-box">
                <strong style="color: #fb7185;">Risks / Pitfalls:</strong> ${item.risks}
              </div>
            </div>
          </div>
        `).join('');
      }
    };

    container.innerHTML = `
      <div class="section-header" style="margin-bottom: 1.5rem;">
        <div>
          <h2 style="font-size: 1.8rem;" class="gradient-text">Searchable Financial Glossary</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Over 40+ essential concepts explained simply, with real-world examples and risk disclosures.
          </p>
        </div>
      </div>

      <div class="glossary-controls">
        <input type="text" id="glossarySearchInput" class="glossary-search-input" placeholder="Search terms (e.g. Asset, Beta, P/E Ratio, Inflation, DCA)..." />
        <div class="glossary-filter-chips">
          <button class="filter-chip-btn active" data-cat="ALL">All Categories</button>
          <button class="filter-chip-btn" data-cat="Fundamentals">Fundamentals</button>
          <button class="filter-chip-btn" data-cat="Equities">Equities</button>
          <button class="filter-chip-btn" data-cat="Risk Management">Risk Management</button>
          <button class="filter-chip-btn" data-cat="Asset Classes">Asset Classes</button>
          <button class="filter-chip-btn" data-cat="Behavioral Finance">Behavioral</button>
        </div>
      </div>

      <div class="glossary-cards-grid" id="glossaryCardsGrid"></div>
    `;

    renderTerms();

    // Bind Search Input
    const input = document.getElementById('glossarySearchInput');
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTerms();
    });

    // Bind Filter Chips
    container.querySelectorAll('.filter-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.cat;
        renderTerms();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. LEADERBOARD & PROFILE BADGES TAB
  // --------------------------------------------------------------------------
  renderLeaderboardTab() {
    const container = document.getElementById('tab-leaderboard');
    const { user } = this.state;
    const currentLevelObj = this.getLevelObject(user.xp);

    container.innerHTML = `
      <div class="dashboard-grid">
        <!-- Left: Badges Showcase -->
        <div class="col-8">
          <div class="glass-card" style="padding: 1.75rem;">
            <div class="section-header">
              <div>
                <h3 class="section-title"><span>🏆</span> Achievement Badges</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">Earn badges by mastering risk management and completing learning milestones.</p>
              </div>
              <span style="font-weight: 700; color: #fbbf24;">${user.unlockedBadges.length} / ${this.data.badges.length} Unlocked</span>
            </div>

            <div class="badges-grid">
              ${this.data.badges.map(b => {
                const isUnlocked = user.unlockedBadges.includes(b.id);
                return `
                  <div class="badge-item-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="badge-icon-lg">${b.icon}</div>
                    <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.25rem;">${b.title}</div>
                    <div style="font-size: 0.75rem; color: var(--text-secondary);">${b.description}</div>
                    <div style="margin-top: 0.5rem; font-size: 0.7rem; font-weight: 700; color: ${isUnlocked ? '#34d399' : '#64748b'};">
                      ${isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Smart Learning Leaderboard -->
        <div class="col-4">
          <div class="glass-card" style="padding: 1.75rem;">
            <div class="section-header">
              <div>
                <h3 class="section-title"><span>📊</span> Smart Learning Leaderboard</h3>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">Ranked by risk awareness & consistency</p>
              </div>
            </div>

            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Learner</th>
                  <th>Smart Score</th>
                </tr>
              </thead>
              <tbody>
                ${this.data.leaderboard.map(lb => {
                  const isUser = lb.isUser;
                  const score = isUser ? user.smartScore : lb.smartScore;
                  const name = isUser ? user.name : lb.name;

                  return `
                    <tr class="leaderboard-row ${isUser ? 'user-highlight' : ''}">
                      <td style="font-weight: 700; color: #fbbf24;">#${lb.rank}</td>
                      <td>
                        <div style="font-weight: 600;">${lb.avatar} ${name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${lb.level}</div>
                      </td>
                      <td style="font-weight: 700; color: #34d399; font-size: 1rem;">${score}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // BADGES & REWARDS LOGIC
  // --------------------------------------------------------------------------
  checkAndAwardBadges() {
    const { user, portfolio } = this.state;

    // 1. First trade badge
    if (!user.unlockedBadges.includes('first_trade') && portfolio.history.length > 0) {
      user.unlockedBadges.push('first_trade');
      this.showBadgeUnlockToast('🪙 First Trade', 'Executed your first market order!');
    }

    // 2. Quiz Master badge
    if (!user.unlockedBadges.includes('quiz_master') && user.completedLessons.length >= 3) {
      user.unlockedBadges.push('quiz_master');
      this.showBadgeUnlockToast('🎓 Quiz Master', 'Passed 3 lesson quizzes with 100%!');
    }

    // 3. Portfolio Builder badge
    if (!user.unlockedBadges.includes('portfolio_builder') && Object.keys(portfolio.holdings).length >= 3) {
      user.unlockedBadges.push('portfolio_builder');
      this.showBadgeUnlockToast('💼 Portfolio Builder', 'Constructed a multi-asset portfolio!');
    }

    // Update level
    const lvl = this.getLevelObject(user.xp);
    if (lvl.level > user.level) {
      user.level = lvl.level;
      this.showToast(`🎉 Level Up! You are now a ${lvl.title}!`, 'success');
      this.playSound('success');
    }
  }

  showBadgeUnlockToast(title, desc) {
    this.playSound('success');
    this.showToast(`🏆 Badge Unlocked: ${title} — ${desc}`, 'success');
  }

  // --------------------------------------------------------------------------
  // ONBOARDING KNOWLEDGE ASSESSMENT MODAL
  // --------------------------------------------------------------------------
  showOnboardingAssessmentModal() {
    const modalContainer = document.getElementById('modalContainer');
    let currentQ = 0;
    const questions = this.data.assessmentQuestions;

    const renderQuestion = () => {
      const q = questions[currentQ];
      modalContainer.innerHTML = `
        <div class="modal-overlay active">
          <div class="modal-container">
            <div class="modal-header">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 38px; height: 38px; background: #145e57; border: 1px solid rgba(45,212,191,0.4); border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 4px; flex-shrink: 0;">
                  ${this.getFinacateSymbolSVG('#ffffff', '100%')}
                </div>
                <div>
                  <span class="news-badge badge-real">FINACATE DIAGNOSTIC • STEP ${currentQ + 1} OF ${questions.length}</span>
                  <h2 style="font-size: 1.35rem; margin-top: 0.25rem; color: #ffffff;">Financial Literacy Starter Assessment</h2>
                </div>
              </div>
            </div>

            <p style="font-size: 0.95rem; color: #f8fafc; font-weight: 600; margin-bottom: 1.25rem;">
              ${q.question}
            </p>

            <div class="quiz-options-list">
              ${q.options.map((opt, idx) => `
                <button class="quiz-option-btn" data-idx="${idx}">
                  ${opt.text}
                </button>
              `).join('')}
            </div>

            <div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1rem;">
              This diagnostic assessment customizes your initial learning track and unlocks your starter kit.
            </div>
          </div>
        </div>
      `;

      modalContainer.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentQ++;
          if (currentQ < questions.length) {
            renderQuestion();
          } else {
            // Complete onboarding
            this.state.user.assessmentCompleted = true;
            this.state.user.fincoins = 10000;
            this.state.user.xp = 250;
            this.state.portfolio.cash = 10000;
            this.saveState();
            this.playSound('success');
            modalContainer.innerHTML = '';
            this.showToast('Starter Kit Unlocked: 10,000 FinCoins + 250 XP!', 'success');
            this.render();
          }
        });
      });
    };

    renderQuestion();
  }

  // --------------------------------------------------------------------------
  // FINAI ASSISTANT CHAT LOGIC
  // --------------------------------------------------------------------------
  handleFinAiSubmit() {
    const input = document.getElementById('finAiInput');
    const container = document.getElementById('finAiMessages');
    const query = input.value.trim();
    if (!query) return;

    // Append user message
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = query;
    container.appendChild(userBubble);
    input.value = '';

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;

    // Generate intelligent pedagogical response
    setTimeout(() => {
      const response = this.generateFinAiResponse(query);
      const botBubble = document.createElement('div');
      botBubble.className = 'chat-bubble bot';
      botBubble.innerHTML = response;
      container.appendChild(botBubble);
      container.scrollTop = container.scrollHeight;
      this.playSound('coin');
    }, 450);
  }

  generateFinAiResponse(prompt) {
    const p = prompt.toLowerCase();
    const { portfolio } = this.state;

    if (p.includes('diversif') || p.includes('eggs')) {
      return `🛡️ <strong>Diversification</strong> is spreading your money across different sectors (Tech, Utility, Bonds, Gold) so that if one drops, others stabilize you. In Fincate, holding both <strong>APEX</strong> and <strong>BOND/GOLD</strong> gives you downside protection!`;
    }

    if (p.includes('rate') || p.includes('interest') || p.includes('hike')) {
      return `📉 When central banks <strong>raise interest rates</strong>, borrowing becomes more expensive and future cash flows are discounted more heavily. High-growth tech stocks (like APEX) and speculative crypto drop, while bond yields rise!`;
    }

    if (p.includes('dca') || p.includes('dollar cost')) {
      return `🔄 <strong>Dollar-Cost Averaging (DCA)</strong> means investing a fixed amount on a regular schedule regardless of whether the market is up or down. It removes emotional guesswork and buys more units when prices are cheap!`;
    }

    if (p.includes('risk') || p.includes('analyze') || p.includes('portfolio')) {
      const count = Object.keys(portfolio.holdings).length;
      if (count === 0) {
        return `📊 Your portfolio is currently <strong>100% Cash (10,000 FinCoins)</strong>. You have zero market risk, but cash loses real value to inflation over time. Try investing in <strong>OMNI 500 ETF</strong> or <strong>BOND</strong>!`;
      }
      return `📊 You currently hold <strong>${count} distinct assets</strong> with <strong>🪙 ${Math.round(portfolio.cash).toLocaleString()}</strong> in liquid cash. Keep speculative assets (like BFRG) under 15% of your total balance for maximum resilience!`;
    }

    if (p.includes('crash') || p.includes('panic')) {
      return `🌪️ During a <strong>market crash</strong>, the biggest mistake is panic-selling at the bottom. Disciplined investors maintain an emergency cash buffer and use downturns to accumulate index assets at massive discounts!`;
    }

    return `💡 <strong>FinAI Tip:</strong> In financial markets, higher returns always involve higher uncertainty. Never risk money you cannot afford to leave invested for 3+ years!`;
  }
}

// Instantiate App
document.addEventListener('DOMContentLoaded', () => {
  window.fincate = new FincateEngine();
});
