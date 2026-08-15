'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Bot, 
  Sparkles, 
  QrCode, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  ExternalLink, 
  Copy, 
  Check, 
  Cpu, 
  Clock, 
  Volume2, 
  VolumeX,
  MessageCircle,
  Users,
  Layers,
  User,
  Lock,
  LogOut,
  Sliders,
  Activity,
  Menu,
  X,
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  PhoneCall,
  Server,
  Star,
  Rocket,
  Flame,
  FileCode
} from 'lucide-react';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'akunml@gmail.com';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PW || 'kyuujir';

function HomeContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams ? searchParams.get('tab') : null;

  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Tab persistence (localStorage + URL)
  useEffect(() => {
    let initialTab = 'home';
    if (tabParam === 'dashboard' || tabParam === 'dash' || tabParam === 'login') {
      initialTab = 'dashboard';
    } else if (tabParam === 'commands' || tabParam === 'cmd') {
      initialTab = 'commands';
    } else {
      try {
        const savedTab = localStorage.getItem('cailin_active_tab');
        if (savedTab) initialTab = savedTab;
      } catch (e) {}
    }
    setActiveTab(initialTab);
  }, [tabParam]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    try {
      localStorage.setItem('cailin_active_tab', tabName);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabName);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  const [csrfToken, setCsrfToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('cailin_logged_in');
      if (savedAuth === 'true') {
        setIsLoggedIn(true);
      }
    } catch (e) {}

    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.csrfToken) setCsrfToken(data.csrfToken);
      })
      .catch(() => {});
  }, []);

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setRegisterSuccess('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setLoginError('All registration fields are required!');
      return;
    }

    if (regPassword.length < 6) {
      setLoginError('Password must be at least 6 characters!');
      return;
    }

    setIsLoggedIn(true);
    try { localStorage.setItem('cailin_logged_in', 'true'); } catch (e) {}
    setRegisterSuccess(`Welcome, ${regName}! Your account has been successfully created.`);
    const now = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [
      ...prev,
      { id: Date.now(), time: now, tag: '[REGISTER]', text: `New user ${regName} (${regEmail}) registered & automatically logged in.` }
    ]);
  };

  const [botToggles, setBotToggles] = useState({
    autoRead: true,
    selfMode: false,
    antiLink: true,
    autoClean: true,
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [isPairingLoading, setIsPairingLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [uptime, setUptime] = useState(14820);
  const [consoleLogs, setConsoleLogs] = useState([
    { id: 1, time: '08:45:10', tag: '[SYSTEM]', text: 'Baileys ESM Bot Engine initialized successfully.' },
    { id: 2, time: '08:45:12', tag: '[AUTH]', text: 'Session active. Connected to WhatsApp Gateway.' },
    { id: 3, time: '08:46:00', tag: '[CLEAN]', text: 'Bad-session auto cleaner executed.' }
  ]);

  const [searchLog, setSearchLog] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [liveStatus, setLiveStatus] = useState(null);

  useEffect(() => {
    const fetchStatusAndLogs = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setLiveStatus(data);
          if (data.uptimeSeconds) setUptime(data.uptimeSeconds);
        }
      } catch (e) {}

      try {
        const logsRes = await fetch('/api/logs');
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          if (logsData.logs && Array.isArray(logsData.logs) && logsData.logs.length > 0) {
            setConsoleLogs(logsData.logs);
          }
        }
      } catch (e) {}
    };

    fetchStatusAndLogs();
    const interval = setInterval(fetchStatusAndLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (loginEmail.trim() === ADMIN_EMAIL && loginPassword.trim() === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      try { localStorage.setItem('cailin_logged_in', 'true'); } catch (e) {}
      setLoginEmail('');
      setLoginPassword('');

      const now = new Date().toLocaleTimeString();
      setConsoleLogs(prev => [
        ...prev,
        { id: Date.now(), time: now, tag: '[LOGIN]', text: `Admin ${ADMIN_EMAIL} logged in to Account Dashboard.` }
      ]);
    } else {
      setLoginError('Incorrect email or password!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try { localStorage.removeItem('cailin_logged_in'); } catch (e) {}
    handleTabChange('home');
  };

  const toggleSetting = async (key) => {
    const nextVal = !botToggles[key];
    setBotToggles(prev => ({ ...prev, [key]: nextVal }));

    const now = new Date().toLocaleTimeString();
    setConsoleLogs(cLogs => [
      ...cLogs,
      { id: Date.now(), time: now, tag: '[CONFIG]', text: `Setting ${key} changed to ${nextVal}` }
    ]);

    try {
      await fetch('/api/account', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({ action: 'toggle_setting', key, value: nextVal })
      });
    } catch (e) {}
  };

  const handleGeneratePairing = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('Enter a valid WhatsApp number! (Minimum 9 digits)');
      return;
    }

    setIsPairingLoading(true);
    setPairingCode('');

    try {
      const res = await fetch('/api/account', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({ action: 'pairing', phoneNumber })
      });

      const data = await res.json();
      setIsPairingLoading(false);

      if (res.ok && data.pairingCode) {
        setPairingCode(data.pairingCode);
        const now = new Date().toLocaleTimeString();
        setConsoleLogs(prev => [
          ...prev,
          { id: Date.now(), time: now, tag: '[PAIRING]', text: `Pairing status: ${data.pairingCode} for +${data.phoneNumber || phoneNumber}` }
        ]);
      } else {
        alert(data.error || 'Failed to generate pairing code. Please try again.');
      }
    } catch (err) {
      setIsPairingLoading(false);
      alert('A network error occurred');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  };

  // Commands Directory Filter & Categories
  const [cmdSearch, setCmdSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', name: 'All Categories', icon: '🌐' },
    { id: 'AI', name: 'AI & Assist', icon: '🤖' },
    { id: 'DOWNLOADER', name: 'Downloader', icon: '📥' },
    { id: 'TOOLS', name: 'Tools & Utilities', icon: '🔧' },
    { id: 'RPG', name: 'RPG Game System', icon: '🎮' },
    { id: 'MAKER', name: 'Sticker & Maker', icon: '🛠️' },
    { id: 'SEARCH', name: 'Search & Stalker', icon: '🔍' },
    { id: 'OWNER', name: 'Owner Control', icon: '👑' },
  ];

  const sampleCommandsList = [
    { name: 'menu', category: 'MAIN', desc: 'Display the main interactive bot menu' },
    { name: 'ai', category: 'AI', desc: 'Chat with GPT-4o artificial intelligence' },
    { name: 'turnstile', category: 'TOOLS', desc: 'Bypass Cloudflare Turnstile captcha' },
    { name: 'tiktok', category: 'DOWNLOADER', desc: 'Download TikTok videos without watermark' },
    { name: 'ytmp3', category: 'DOWNLOADER', desc: 'Download MP3 audio from YouTube' },
    { name: 'ytmp4', category: 'DOWNLOADER', desc: 'Download MP4 video from YouTube' },
    { name: 'sticker', category: 'MAKER', desc: 'Create stickers from images / videos' },
    { name: 'ssweb', category: 'TOOLS', desc: 'Take a full screenshot of a website page' },
    { name: 'adventure', category: 'RPG', desc: 'RPG adventure & earn exp/items' },
    { name: 'mine', category: 'RPG', desc: 'Mine precious stones & iron ore' },
    { name: 'profile', category: 'RPG', desc: 'Check profile, level, HP, and inventory' },
    { name: 'pairing', category: 'OWNER', desc: 'Request WA pairing code from terminal' },
    { name: 'restart', category: 'OWNER', desc: 'Restart WhatsApp bot engine' },
    { name: 'addprem', category: 'OWNER', desc: 'Add premium account active period' },
  ];

  const filteredCmds = sampleCommandsList.filter(cmd => {
    const matchesSearch = cmd.name.toLowerCase().includes(cmdSearch.toLowerCase()) || cmd.desc.toLowerCase().includes(cmdSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || cmd.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredLogs = consoleLogs.filter(log => {
    if (!searchLog) return true;
    const str = `${log.time} ${log.tag} ${log.text}`.toLowerCase();
    return str.includes(searchLog.toLowerCase());
  });

  return (
    <div>
      {/* Neobrutalism Sticky Navbar */}
      <header className="navbar-header">
        <div className="container">
          <div className="nav-content">
            <div className="brand-logo" onClick={() => handleTabChange('home')}>
              <div className="brand-icon-box">
                <Bot size={26} color="#000" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: '900', fontSize: '1.4rem' }}>Cailin</span>
                <span className="brand-tag">BOT</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              
              {/* Minimal Status Indicator (No Text) */}
              <div className="neo-badge" style={{ background: liveStatus?.isConnected ? 'var(--bg-lime)' : 'var(--bg-yellow)', padding: '0.45rem 0.6rem' }} title={liveStatus?.isConnected ? 'Gateway Online' : 'Gateway Standby'}>
                <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
              </div>

              <nav className="nav-links">
                <button 
                  onClick={() => handleTabChange('home')} 
                  className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                >
                  <Layers size={16} /> Overview
                </button>

                <button 
                  onClick={() => handleTabChange('commands')} 
                  className={`nav-btn ${activeTab === 'commands' ? 'active' : ''}`}
                >
                  <Terminal size={16} /> Commands
                </button>

                <button 
                  onClick={() => handleTabChange('dashboard')} 
                  className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                >
                  <User size={16} /> Dashboard
                </button>
              </nav>

              {!isLoggedIn && (
                <a 
                  href="https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-neo-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }}
                >
                  <MessageCircle size={15} /> WA Channel
                </a>
              )}

              <button 
                onClick={() => setIsMenuOpen(true)} 
                className="nav-btn mobile-menu-btn"
                style={{ display: 'none', padding: '0.55rem' }}
                aria-label="Open Navigation Drawer"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-over Drawer (Right Side) */}
      {isMenuOpen && (
        <div className="drawer-overlay" onClick={() => setIsMenuOpen(false)} />
      )}
      <aside className={`drawer-side ${isMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '3px dashed #000' }}>
            <span style={{ fontWeight: '900', fontSize: '0.95rem', textTransform: 'uppercase' }}>NAVIGATION MENU</span>
            <button onClick={() => setIsMenuOpen(false)} className="btn-neo-secondary" style={{ padding: '0.4rem 0.6rem', borderRadius: '10px' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={() => { handleTabChange('home'); setIsMenuOpen(false); }} className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Layers size={18} /> Overview
            </button>
            <button onClick={() => { handleTabChange('commands'); setIsMenuOpen(false); }} className={`nav-btn ${activeTab === 'commands' ? 'active' : ''}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Terminal size={18} /> Commands & Features
            </button>
            <button onClick={() => { handleTabChange('dashboard'); setIsMenuOpen(false); }} className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} style={{ width: '100%', justifyContent: 'flex-start' }}>
              <User size={18} /> Dashboard / Account
            </button>
          </div>
        </div>

        <div style={{ paddingTop: '1.5rem', borderTop: '3px dashed #000' }}>
          {isLoggedIn ? (
            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="btn-neo-pink" style={{ width: '100%', justifyContent: 'center' }}>
              <LogOut size={16} /> Logout Account
            </button>
          ) : (
            <a 
              href="https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D" 
              target="_blank" 
              rel="noreferrer"
              className="btn-neo-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setIsMenuOpen(false)}
            >
              <MessageCircle size={16} /> WA Channel
            </a>
          )}
        </div>
      </aside>

      <div className="container" style={{ paddingTop: '2rem' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'home' && (
          <div>
            
            {/* Hero Neobrutalism Banner */}
            <section className="neo-card neo-card-yellow" style={{ padding: '2.5rem 2rem', marginBottom: '2.5rem', position: 'relative' }}>
              <div>
                <div className="neo-badge badge-lime" style={{ marginBottom: '1.25rem' }}>
                  <Sparkles size={14} /> Baileys ESM Engine v2.0
                </div>

                <h1 style={{ fontSize: '2.75rem', fontWeight: '900', lineHeight: '1.15', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Cailin Assistant <br />
                  <span className="neo-badge badge-pink" style={{ fontSize: '1.5rem', padding: '0.3rem 0.8rem', marginTop: '0.3rem' }}>
                    WhatsApp Engine
                  </span>
                </h1>

                <p style={{ fontSize: '1rem', fontWeight: '700', lineHeight: '1.6', marginBottom: '1.75rem', color: '#000', maxWidth: '850px' }}>
                  Next-generation WhatsApp bot platform powered by Baileys ESM & Next.js. Offers a retro Neobrutalism interface, automatic 8-digit pairing without QR, bad-session protection, and an ecosystem of 150+ automation modules.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={() => handleTabChange('dashboard')} className="btn-neo-primary">
                    <Rocket size={18} /> Start Bot Pairing
                  </button>
                  <button onClick={() => handleTabChange('commands')} className="btn-neo-secondary">
                    <Terminal size={18} /> View 150+ Commands
                  </button>
                </div>
              </div>
            </section>

            {/* Stats Cards Grid */}
            <section className="stats-grid">
              <div className="neo-card neo-card-lime stat-card">
                <div className="stat-icon"><Zap size={22} color="#000" /></div>
                <div className="stat-value">0.02s</div>
                <div className="stat-label">Ultra Fast Response</div>
              </div>

              <div className="neo-card neo-card-cyan stat-card">
                <div className="stat-icon"><Terminal size={22} color="#000" /></div>
                <div className="stat-value">{liveStatus?.totalCommands || 150}+</div>
                <div className="stat-label">Command Plugins</div>
              </div>

              <div className="neo-card neo-card-pink stat-card" style={{ color: '#000' }}>
                <div className="stat-icon"><Users size={22} color="#000" /></div>
                <div className="stat-value" style={{ color: '#000' }}>{liveStatus?.totalUsers || 120}</div>
                <div className="stat-label" style={{ color: '#000' }}>Registered Users</div>
              </div>

              <div className="neo-card neo-card-yellow stat-card">
                <div className="stat-icon"><Cpu size={22} color="#000" /></div>
                <div className="stat-value">{liveStatus?.ramUsageMB || 184} MB</div>
                <div className="stat-label">RAM Usage</div>
              </div>
            </section>

          </div>
        )}

        {/* COMMANDS DIRECTORY TAB */}
        {activeTab === 'commands' && (
          <div>
            <div className="neo-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '900', textTransform: 'uppercase' }}>Bot Command Directory</h2>
                  <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#555' }}>Browse the complete list of commands and features available in Cailin Assistant</p>
                </div>

                <div style={{ position: 'relative', minWidth: '280px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#000' }} />
                  <input 
                    type="text" 
                    value={cmdSearch}
                    onChange={(e) => setCmdSearch(e.target.value)}
                    placeholder="Search commands (example: tiktok, ai)..."
                    className="neo-input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              {/* Categories Bar */}
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`nav-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </button>
                ))}
              </div>

              {/* Commands Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {filteredCmds.map((cmd, idx) => (
                  <div key={idx} className="neo-card" style={{ padding: '1rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="code-font" style={{ fontSize: '1.05rem', fontWeight: '800', color: '#000' }}>.{cmd.name}</span>
                      <span className="neo-badge badge-lime" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                        {cmd.category}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#444' }}>{cmd.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD / ACCOUNT TAB */}
        {activeTab === 'dashboard' && (
          <div>
            {!isLoggedIn ? (
              <div className="neo-card neo-card-yellow" style={{ maxWidth: '460px', margin: '2rem auto', padding: '2.5rem 2rem', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '18px', border: '3px solid #000', background: 'var(--bg-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                  {isRegisterMode ? <UserPlus size={28} color="#000" /> : <Lock size={28} color="#000" />}
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  {isRegisterMode ? 'Register New Account' : 'Login to Dashboard'}
                </h2>
                <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '1.5rem' }}>
                  {isRegisterMode 
                    ? 'Complete your information to access the Dashboard & Pairing Code Generator' 
                    : 'Please log in to access the Dashboard & WhatsApp Pairing Code'
                  }
                </p>

                {loginError && (
                  <div className="neo-badge badge-pink" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginBottom: '1.25rem' }}>
                    {loginError}
                  </div>
                )}

                {registerSuccess && (
                  <div className="neo-badge badge-lime" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginBottom: '1.25rem' }}>
                    {registerSuccess}
                  </div>
                )}

                {!isRegisterMode ? (
                  <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Account Email</label>
                      <input 
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="akunml@gmail.com"
                        className="neo-input"
                        required
                      />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Password</label>
                      <input 
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="neo-input"
                        required
                      />
                    </div>

                    <button type="submit" className="btn-neo-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                      <User size={16} /> Login to Account
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ textAlign: 'left' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
                      <input 
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Mommy Kyu"
                        className="neo-input"
                        required
                      />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>New Email</label>
                      <input 
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="email@domain.com"
                        className="neo-input"
                        required
                      />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>New Password</label>
                      <input 
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="neo-input"
                        required
                      />
                    </div>

                    <button type="submit" className="btn-neo-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                      <UserPlus size={16} /> Create New Account
                    </button>
                  </form>
                )}

                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '2px dashed #000', fontSize: '0.85rem', fontWeight: '700' }}>
                  {isRegisterMode ? (
                    <>
                      Already have an account?{' '}
                      <button 
                        type="button" 
                        onClick={() => { setIsRegisterMode(false); setLoginError(''); setRegisterSuccess(''); }}
                        style={{ background: 'none', border: 'none', color: '#000', fontWeight: '900', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Login Now
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account yet?{' '}
                      <button 
                        type="button" 
                        onClick={() => { setIsRegisterMode(true); setLoginError(''); setRegisterSuccess(''); }}
                        style={{ background: 'none', border: 'none', color: '#000', fontWeight: '900', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Register New Account
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                
                {/* 1. Account Header Card (Full-width 100% Clean Left-Right Extension) */}
                <div className="neo-card" style={{ width: '100%', padding: '1.5rem 2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '18px', border: '3.5px solid #000', background: 'var(--bg-lime)', color: '#000', fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                      MK
                    </div>
                    <div>
                      <div style={{ fontSize: '1.35rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem', textTransform: 'uppercase' }}>
                        Mommy Kyu (Admin Owner)
                        <span className="neo-badge badge-pink" style={{ fontSize: '0.68rem', padding: '0.25rem 0.6rem' }}>VIP OWNER</span>
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#555' }}>{ADMIN_EMAIL}</span>
                    </div>
                  </div>

                  {/* Single Logout Button */}
                  <button onClick={handleLogout} className="btn-neo-pink" style={{ padding: '0.65rem 1.4rem' }}>
                    <LogOut size={16} /> Logout Account
                  </button>
                </div>

                {/* 2. Active Bot Gateway Status Card (Active Bot Card Below Account) */}
                <div className="neo-card" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem', background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '16px', border: '3px solid #000', background: 'var(--bg-yellow)', color: '#000', fontSize: '1.3rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                        CL
                      </div>
                      <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: '900', textTransform: 'uppercase' }}>Cailin Assistant Bot Gateway</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#555' }}>@mommykyuu • Baileys ESM Socket Engine</div>
                      </div>
                    </div>

                    <div className={`neo-badge ${liveStatus?.isConnected ? 'badge-lime' : 'badge-yellow'}`} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                      <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
                      <span>{liveStatus?.isConnected ? 'STATUS: GATEWAY ONLINE' : 'STATUS: GATEWAY STANDBY'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-warm)', padding: '1rem', borderRadius: '14px', border: '2.5px solid #000', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666', textTransform: 'uppercase' }}>CONNECTION STATUS</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: liveStatus?.isConnected ? '#10b981' : '#f59e0b', marginTop: '0.2rem' }}>
                        {liveStatus?.isConnected ? '🟢 CONNECTED' : '🟡 STANDBY'}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-warm)', padding: '1rem', borderRadius: '14px', border: '2.5px solid #000', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666', textTransform: 'uppercase' }}>MAIN BOT NUMBER</div>
                      <div className="code-font" style={{ fontSize: '1.1rem', fontWeight: '900', color: '#000', marginTop: '0.2rem' }}>
                        +{liveStatus?.botNumber || '6285216445816'}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-warm)', padding: '1rem', borderRadius: '14px', border: '2.5px solid #000', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#666', textTransform: 'uppercase' }}>SERVER UPTIME</div>
                      <div className="code-font" style={{ fontSize: '1.1rem', fontWeight: '900', color: '#000', marginTop: '0.2rem' }}>
                        {formatUptime(uptime)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Pairing Code Generator Card */}
                <div className="neo-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <QrCode size={22} color="#000" /> WhatsApp Pairing Code Generator
                  </h3>

                  <div className="dash-grid-layout">
                    <div>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                          Bot WhatsApp Number (08 or 62 Format)
                        </label>
                        <input 
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Example: 085216445816 or 6285216445816"
                          className="neo-input code-font"
                          style={{ fontSize: '1rem', fontWeight: '700' }}
                        />
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#666', marginTop: '0.5rem' }}>
                          The system automatically converts the <b>08</b> prefix to the official WhatsApp <b>628</b> format.
                        </div>
                      </div>

                      <button 
                        onClick={handleGeneratePairing} 
                        disabled={isPairingLoading || !phoneNumber} 
                        className="btn-neo-primary" 
                        style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem', opacity: (!phoneNumber || isPairingLoading) ? 0.6 : 1, cursor: (!phoneNumber || isPairingLoading) ? 'not-allowed' : 'pointer' }}
                      >
                        {isPairingLoading ? 'Requesting Code from WhatsApp...' : 'Get Pairing Code (8-Digit)'}
                      </button>

                      <div style={{ background: 'var(--bg-warm)', padding: '0.85rem 1rem', borderRadius: '12px', border: '2px solid #000', fontSize: '0.8rem', fontWeight: '700', boxShadow: 'var(--shadow-sm)' }}>
                        <b>Linking Instructions:</b> Open WA on your phone → Linked Devices → Link with phone number only → Enter the 8-digit code.
                      </div>
                    </div>

                    {/* Result Display Card */}
                    <div className="neo-card neo-card-yellow" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      {pairingCode === 'REGISTERED' || pairingCode === 'TERHUBUNG' ? (
                        <div className="neo-card neo-card-lime" style={{ width: '100%', padding: '1.25rem', textTransform: 'uppercase' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#000', display: 'block', marginBottom: '0.4rem' }}>
                            🟢 BOT STATUS: CONNECTED & ACTIVE
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#000' }}>
                            This WhatsApp number is already actively connected to WhatsApp. You do not need to enter the pairing code again!
                          </span>
                        </div>
                      ) : (
                        <>
                          <span style={{ fontSize: '0.75rem', fontWeight: '900', letterSpacing: '0.1em', color: '#000', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                            WHATSAPP PAIRING CODE
                          </span>

                          <div className="code-font" style={{ fontSize: '2.75rem', fontWeight: '900', letterSpacing: '0.15em', color: '#000', background: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '16px', border: '3.5px solid #000', boxShadow: 'var(--shadow-md)', marginBottom: '1.25rem' }}>
                            {pairingCode ? pairingCode : '---- ----'}
                          </div>

                          {pairingCode && (
                            <button 
                              onClick={() => copyToClipboard(pairingCode)} 
                              className={`btn-neo-secondary ${copiedCode ? 'copied' : ''}`}
                              style={{ width: '100%', justifyContent: 'center' }}
                            >
                              {copiedCode ? <Check size={16} color="#000" /> : <Copy size={16} />}
                              {copiedCode ? 'Copied to Clipboard!' : 'Copy 8-Digit Code'}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Controls & Logs Grid */}
                <div className="dash-grid-layout" style={{ marginBottom: '1.5rem' }}>
                  {/* Controls */}
                  <div className="neo-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sliders size={18} color="#000" /> Bot Utility Controls
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {[
                        { key: 'autoRead', name: 'Auto Read Messages', desc: 'Automatically mark WhatsApp messages as read' },
                        { key: 'selfMode', name: 'Self Mode (Owner Only)', desc: 'Only respond to commands from the owner number' },
                        { key: 'antiLink', name: 'Anti-Link Protection', desc: 'Remove group members who send links' },
                        { key: 'autoClean', name: 'Auto Clean Bad Session', desc: 'Periodically clean corrupted sessions' }
                      ].map(item => (
                        <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-warm)', padding: '0.85rem 1rem', borderRadius: '12px', border: '2px solid #000', boxShadow: 'var(--shadow-sm)' }}>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '900' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#555' }}>{item.desc}</div>
                          </div>
                          <button 
                            onClick={() => toggleSetting(item.key)}
                            style={{ 
                              width: '50px', 
                              height: '28px', 
                              borderRadius: '20px', 
                              background: botToggles[item.key] ? 'var(--bg-lime)' : '#ffffff', 
                              border: '2.5px solid #000', 
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'all 0.15s ease',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            <div style={{ 
                              width: '20px', 
                              height: '20px', 
                              borderRadius: '50%', 
                              background: '#000000', 
                              position: 'absolute', 
                              top: '2px', 
                              left: botToggles[item.key] ? '24px' : '2px',
                              transition: 'all 0.15s ease'
                            }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terminal Console */}
                  <div className="terminal-window">
                    <div className="terminal-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '900' }}>
                        <Terminal size={16} color="#a3e635" /> Live Console Stream Logs
                      </div>
                      <div className="terminal-dots">
                        <div className="dot dot-red" />
                        <div className="dot dot-yellow" />
                        <div className="dot dot-green" />
                      </div>
                    </div>

                    <div className="terminal-body code-font">
                      {filteredLogs.map(log => (
                        <div key={log.id} style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.35rem' }}>
                          <span style={{ color: '#888', whiteSpace: 'nowrap' }}>[{log.time}]</span>
                          <span style={{ color: '#a3e635', fontWeight: '700', whiteSpace: 'nowrap' }}>{log.tag}</span>
                          <span style={{ color: '#ffffff' }}>{log.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: '4rem', paddingBottom: '3rem', textAlign: 'center', borderTop: '4px solid #000000', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', fontWeight: '900' }}>
            <button onClick={() => handleTabChange('home')} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', textTransform: 'uppercase' }}>Overview</button>
            <button onClick={() => handleTabChange('commands')} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', textTransform: 'uppercase' }}>Commands & Features</button>
            <button onClick={() => handleTabChange('dashboard')} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', textTransform: 'uppercase' }}>Account Dashboard</button>
            <a href="https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D" target="_blank" rel="noreferrer" style={{ color: '#000', textDecoration: 'none', textTransform: 'uppercase' }}>WA Channel</a>
          </div>
          <p style={{ fontSize: '0.8rem', fontWeight: '800', color: '#000' }}>
            Copyright © 2026 <b>Mommy Kyu</b>. Neobrutalism Edition Powered by Next.js & Baileys ESM Engine.
          </p>
        </footer>

      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#000', fontWeight: '900' }}>Loading Cailin Assistant Web...</div>}>
      <HomeContent />
    </Suspense>
  );
    }
