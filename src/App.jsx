import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, CheckCircle2, AlertTriangle, XCircle, QrCode, FileText,
  Building2, User, Lock, RefreshCw, Download, Eye, EyeOff, Award,
  ArrowRight, Activity, Database, Scale, Globe, Terminal, UserCheck, Key,
  Clock, Check, Sparkles, AlertOctagon, Share2, Layers, Cpu, Server,
  Search, ChevronRight, ChevronLeft, Pause, Play, ExternalLink,
  GraduationCap, Landmark, BarChart3, Smartphone, HelpCircle, FileCheck,
  Command, LogIn, ArrowLeft, Home, Info, BookOpen, Video, Calendar,
  Users, CheckSquare, Sparkle, PhoneCall, Compass
} from 'lucide-react';
import { translations } from './i18n';

export default function App() {
  // =========================================================================
  // 0. OFFICIAL SOVEREIGN PRELOADER (AUTHENTIC GIGW 3.0)
  // =========================================================================
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Localization & Accessibility States
  const [lang, setLang] = useState('en');
  const [fontSize, setFontSize] = useState('normal'); // 'small', 'normal', 'large', 'xlarge'
  const [theme, setTheme] = useState('light'); // 'light', 'dark', 'high-contrast'
  const [screenReaderAnnounce, setScreenReaderAnnounce] = useState('');
  
  // Page Navigation: 'home' | 'verifier' | 'student' | 'institution' | 'admin' | 'about'
  const [activePage, setActivePage] = useState('home');
  const t = translations[lang];

  // Modals state
  const [showJsonLdModal, setShowJsonLdModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showVcModal, setShowVcModal] = useState(false);
  const [loginRole, setLoginRole] = useState('STUDENT'); // 'STUDENT' | 'INSTITUTION' | 'SSO'
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // ABC Learner Cohort Tab for "Get Started with APAAR ID" ('school' | 'higher' | 'other')
  const [learnerTab, setLearnerTab] = useState('higher');

  // Carousel slide state (for Home Page - matching abc.gov.in)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const heroSlides = [
    {
      title: "Empowering All Learners: Academic and Beyond",
      subtitle: "Seamlessly Manage Your Credits, Whether You're in School, College, or Pursuing Vocational Skills. Official Academic Bank of Credits & APAAR ID Infrastructure.",
      tag: "Academic Bank of Credits • MoE"
    },
    {
      title: "Introducing APAAR ID – One Nation, One Student ID",
      subtitle: "A unique lifelong identifier that centralizes all educational milestones, certifications, and credit points in one tamper-proof national ledger.",
      tag: "National Education Policy 2020"
    },
    {
      title: "Zero-Red-Tape Instant Academic Verification",
      subtitle: "Universities, employers, and visa authorities verify W3C Verifiable Credentials and SHA-256 transcripts in under 200 milliseconds under Rule 9A of IT Rules 2016.",
      tag: "Sub-200ms Verification SLA"
    }
  ];

  useEffect(() => {
    if (carouselPaused || appLoading || activePage !== 'home') return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselPaused, appLoading, activePage, heroSlides.length]);

  // Live IST Clock
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) + ' ' + now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Accessibility theme sync
  useEffect(() => {
    document.body.className = `font-${fontSize} theme-${theme}`;
  }, [fontSize, theme]);

  const announce = (msg) => {
    setScreenReaderAnnounce(msg);
    setTimeout(() => setScreenReaderAnnounce(''), 4000);
  };

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (title, message, type = 'success') => {
    setToastMessage({ title, message, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // State for FAQ accordion on Home page
  const [openFaq, setOpenFaq] = useState(null);

  // Dynamic Page Transition Loading Screen State (Distinct from initial boot)
  const [pageTransitionLoading, setPageTransitionLoading] = useState(false);
  const [targetPage, setTargetPage] = useState('home');

  const pageTransitionMeta = {
    home: {
      title: "National Academic Account Registry",
      subtitle: "Official AICTE • Ministry of Education Sovereign Repository",
      tag: "PORTAL GATEWAY",
      icon: Home,
      color: "#0052cc",
      bg: "#eff6ff",
      step: "Mounting National Academic Repository & ABC Ledger..."
    },
    verifier: {
      title: "Public Instant Credential Verifier",
      subtitle: "Sub-200ms Verification SLA • Rule 9A of IT Rules 2016",
      tag: "VERIFICATION CONSOLE",
      icon: Shield,
      color: "#0284c7",
      bg: "#f0f9ff",
      step: "Handshaking with SHA-256 Canonical Hash Ledger..."
    },
    student: {
      title: "Student Academic Dashboard & APAAR Card",
      subtitle: "Digital Holographic Smart Card & DEPA Consent Manager",
      tag: "DPDP ACT 2023 SECURE",
      icon: User,
      color: "#16a34a",
      bg: "#f0fdf4",
      step: "Establishing DEPA Encrypted Identity Tunnel..."
    },
    institution: {
      title: "Institution Nodal Officer Desk",
      subtitle: "AISHE Verified College & University Registrar Portal",
      tag: "DSC X.509 CLASS-3",
      icon: Building2,
      color: "#d97706",
      bg: "#fffbeb",
      step: "Mounting 4-Stage Bulk Ingestion & Mobility Pipeline..."
    },
    admin: {
      title: "AICTE Directorate Sentinel & CERT-In Logs",
      subtitle: "Real-Time Anomaly Engine & 180-Day Immutable Stream",
      tag: "CERT-IN SECTION 70B",
      icon: Scale,
      color: "#7c3aed",
      bg: "#faf5ff",
      step: "Streaming MeghRaj GI Cloud Tier-IV Infrastructure Logs..."
    },
    about: {
      title: "Statutory Framework & Ecosystem Architecture",
      subtitle: "National Education Policy 2020 & Sovereign Standards",
      tag: "STATUTORY COMPLIANCE",
      icon: Info,
      color: "#0891b2",
      bg: "#ecfeff",
      step: "Loading Rule 9A & UIDAI Aadhaar Vault Specifications..."
    }
  };

  // References for robust, glitch-free transitions and hotkeys
  const isNavigatingRef = useRef(false);
  const activePageRef = useRef('home');
  const searchInputRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const transitionEndTimerRef = useRef(null);
  const [hudActiveKey, setHudActiveKey] = useState(null);

  useEffect(() => {
    activePageRef.current = activePage;
  }, [activePage]);

  // Visual pulse on HUD when key is pressed
  const pulseKey = (keyChar) => {
    setHudActiveKey(keyChar);
    setTimeout(() => {
      setHudActiveKey(null);
    }, 280);
  };

  // Trigger fast, silky-smooth transition between pages
  const triggerPageTransition = (newPage) => {
    if (!newPage || newPage === activePageRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (transitionEndTimerRef.current) clearTimeout(transitionEndTimerRef.current);

    setTargetPage(newPage);
    setPageTransitionLoading(true);
    isNavigatingRef.current = true;

    // Fast, ultra-smooth 180ms transition phase
    transitionTimerRef.current = setTimeout(() => {
      activePageRef.current = newPage;
      setActivePage(newPage);

      if (window.location.hash.replace('#', '').toLowerCase() !== newPage) {
        window.history.replaceState(null, '', `#${newPage}`);
      }
      window.scrollTo({ top: 0, behavior: 'auto' });

      transitionEndTimerRef.current = setTimeout(() => {
        setPageTransitionLoading(false);
        isNavigatingRef.current = false;
      }, 70);
    }, 180);
  };

  // URL Hash Routing with Transition Loading Screen (no duplicate loops)
  useEffect(() => {
    const handleHash = () => {
      if (isNavigatingRef.current) return;
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validPages = ['home', 'verifier', 'student', 'institution', 'admin', 'about'];
      if (validPages.includes(hash) && hash !== activePageRef.current) {
        triggerPageTransition(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Navigation Helper with Auto-Scroll to Top & Hash History
  const navigateTo = (page) => {
    triggerPageTransition(page);
  };

  // =========================================================================
  // KEYBOARD SHORTCUTS ENGINE ("All keys working properly & smoothly")
  // =========================================================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isInput = target && (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.isContentEditable ||
        target.getAttribute('role') === 'textbox'
      );

      // 1. ESCAPE KEY (Universal Dismiss, Blur & Back to Home)
      if (e.key === 'Escape' || e.code === 'Escape') {
        if (showJsonLdModal || showLoginModal || showShortcutsModal || showQrModal) {
          setShowJsonLdModal(false);
          setShowLoginModal(false);
          setShowShortcutsModal(false);
          setShowQrModal(false);
          return;
        }
        if (isInput) {
          target.blur();
          return;
        }
        if (activePageRef.current !== 'home') {
          pulseKey('0');
          navigateTo('home');
          return;
        }
      }

      // 2. QUESTION MARK '?' (Cheatsheet Modal)
      if (e.key === '?' || (e.shiftKey && (e.key === '/' || e.code === 'Slash'))) {
        if (!isInput) {
          e.preventDefault();
          setShowShortcutsModal((prev) => !prev);
        }
        return;
      }

      // 3. SEARCH QUICK FOCUS '/'
      if ((e.key === '/' || e.code === 'Slash') && !isInput && !e.shiftKey) {
        e.preventDefault();
        if (activePageRef.current !== 'home' && activePageRef.current !== 'verifier') {
          navigateTo('home');
        }
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            searchInputRef.current.select();
          }
        }, 220);
        return;
      }

      // 4. THEME TOGGLE KEY 't' / 'T'
      if (!isInput && (e.key === 't' || e.key === 'T')) {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
        return;
      }

      // 5. NAVIGATION SHORTCUTS (Only when NOT typing in an input field)
      if (!isInput) {
        const key = e.key ? e.key.toLowerCase() : '';
        const code = e.code || '';
        const pages = ['home', 'verifier', 'student', 'institution', 'admin', 'about'];

        if (e.key === '0' || code === 'Digit0' || code === 'Numpad0' || key === 'h') {
          e.preventDefault();
          pulseKey('0');
          navigateTo('home');
        } else if (e.key === '1' || code === 'Digit1' || code === 'Numpad1' || key === 'v') {
          e.preventDefault();
          pulseKey('1');
          navigateTo('verifier');
        } else if (e.key === '2' || code === 'Digit2' || code === 'Numpad2' || key === 's') {
          e.preventDefault();
          pulseKey('2');
          navigateTo('student');
        } else if (e.key === '3' || code === 'Digit3' || code === 'Numpad3' || key === 'i') {
          e.preventDefault();
          pulseKey('3');
          navigateTo('institution');
        } else if (e.key === '4' || code === 'Digit4' || code === 'Numpad4' || key === 'd') {
          e.preventDefault();
          pulseKey('4');
          navigateTo('admin');
        } else if (e.key === '5' || code === 'Digit5' || code === 'Numpad5' || key === 'a') {
          e.preventDefault();
          pulseKey('5');
          navigateTo('about');
        } else if (key === 'l' || key === 'm') {
          e.preventDefault();
          setLoginRole('SSO');
          setShowLoginModal(true);
        } else if (e.key === 'ArrowLeft' || code === 'ArrowLeft') {
          if (activePageRef.current === 'home') {
            setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
          } else {
            const curIdx = pages.indexOf(activePageRef.current);
            const prevPage = pages[(curIdx - 1 + pages.length) % pages.length];
            navigateTo(prevPage);
          }
        } else if (e.key === 'ArrowRight' || code === 'ArrowRight') {
          if (activePageRef.current === 'home') {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
          } else {
            const curIdx = pages.indexOf(activePageRef.current);
            const nextPage = pages[(curIdx + 1) % pages.length];
            navigateTo(nextPage);
          }
        } else if (e.key === ' ' || code === 'Space') {
          if (activePageRef.current === 'home') {
            e.preventDefault();
            setCarouselPaused((prev) => !prev);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [heroSlides.length, showJsonLdModal, showLoginModal, showShortcutsModal, showQrModal]);

  // =========================================================================
  // 1. PUBLIC INSTANT VERIFIER ENGINE (< 200ms)
  // =========================================================================
  const [verifyApaarId, setVerifyApaarId] = useState('908123456781');
  const [verifyRecordId, setVerifyRecordId] = useState('f1e2d3c4-b5a6-9788-1234-567890abcdef');
  const [verifyQrInput, setVerifyQrInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [requestFullTranscript, setRequestFullTranscript] = useState(false);

  const executeVerification = (simulatedTamper = false) => {
    setVerifying(true);
    announce('Cryptographic verification in progress');
    
    const startTime = performance.now();
    setTimeout(() => {
      const endTime = performance.now();
      const latency = (endTime - startTime + 38).toFixed(2);

      if (simulatedTamper) {
        setVerificationResult({
          status: 'TAMPERED',
          tamperDetected: true,
          latencyMs: latency,
          cryptographicProof: {
            storedHash: 'a94f6e1f0e2193b2a3165b4528c1f016d9b9c9f056d6d8495a6bfa9e1d8a43f8',
            recomputedHash: 'e71b2a49f8016d9b9c9f056d6d8495a6bfa9e1d8a43f8a94f6e1f0e2193b2a31',
            hashMatched: false,
            platformSignatureValid: false,
            issuerDscValid: true
          },
          message: 'CRITICAL SECURITY ALERT: The computed SHA-256 hash of this transcript does not match the stored cryptographic seal. One or more course grades have been maliciously modified!'
        });
        showToast('Tampering Detected!', 'The academic record hash fails cryptographic validation.', 'error');
        announce('Verification complete: Tampering detected');
      } else {
        const isConsentDenied = requestFullTranscript && !studentConsentGranted;
        setVerificationResult({
          status: isConsentDenied ? 'CONSENT_DENIED' : 'VALID',
          tamperDetected: false,
          latencyMs: latency,
          cryptographicProof: {
            storedHash: 'a94f6e1f0e2193b2a3165b4528c1f016d9b9c9f056d6d8495a6bfa9e1d8a43f8',
            recomputedHash: 'a94f6e1f0e2193b2a3165b4528c1f016d9b9c9f056d6d8495a6bfa9e1d8a43f8',
            hashMatched: true,
            platformSignatureValid: true,
            issuerDscValid: true,
            w3cProofType: 'RsaSignature2018'
          },
          credentialSummary: {
            apaarId: verifyApaarId || '908123456781',
            studentNameMasked: 'A***v R****h S****a',
            institutionName: 'COEP Technological University, Pune',
            aisheCode: 'C-41584',
            programName: 'Bachelor of Technology in Computer Engineering',
            semester: 5,
            academicYear: '2024-2025',
            creditsEarned: 22.0,
            totalCreditsAccumulated: 110.0,
            digilockerUri: 'in.gov.aicte.apaar:RECORD-2024-SEM5-COEP-908123456781',
            verifiedAt: new Date().toISOString()
          },
          confidentialData: studentConsentGranted && requestFullTranscript ? {
            sgpa: '8.92',
            cgpa: '8.84',
            courses: [
              { code: 'CS501', title: 'Distributed Systems', credits: 4, grade: 'AA' },
              { code: 'CS502', title: 'Compiler Design', credits: 4, grade: 'AB' },
              { code: 'CS503', title: 'Cryptography & Network Security', credits: 4, grade: 'AA' },
              { code: 'CS504', title: 'Machine Learning', credits: 4, grade: 'AA' },
              { code: 'CS505', title: 'Cloud Computing Lab', credits: 2, grade: 'AA' },
              { code: 'CS506', title: 'Minor Project', credits: 4, grade: 'AA' }
            ]
          } : null
        });

        if (isConsentDenied) {
          showToast('DEPA Consent Required', 'Grade details are withheld until student approves DEPA consent.', 'warning');
        } else {
          showToast('AICTE APAAR Verified', `Credential cryptographically verified in ${latency}ms.`, 'success');
        }
        announce('Verification complete: Credential is valid');
      }
      setVerifying(false);
    }, 110);
  };

  // =========================================================================
  // 2. STUDENT PORTAL STATE & LOGIC
  // =========================================================================
  const [studentConsentGranted, setStudentConsentGranted] = useState(true);
  const [consentRequests, setConsentRequests] = useState([
    {
      id: 'REQ-TCS-01',
      requester: 'Tata Consultancy Services (TCS National Qualifier)',
      type: 'EMPLOYER',
      purpose: 'Verification of CGPA, SGPA, and graduation eligibility for Campus Placement Onboarding.',
      fields: ['Full Name', 'Enrollment Status', 'CGPA', 'SGPA', 'Total Credits'],
      validity: '28 Days Remaining',
      status: 'GRANTED'
    },
    {
      id: 'REQ-DTU-02',
      requester: 'Delhi Technological University (DTU Postgraduate Cell)',
      type: 'INSTITUTION',
      purpose: 'Evaluation of credit accumulation for inter-university lateral transfer and fellowship.',
      fields: ['Full Name', 'Detailed Marksheet', 'Credits Earned'],
      validity: '14 Days Remaining',
      status: 'REQUESTED'
    }
  ]);

  const toggleConsent = (id) => {
    setConsentRequests(prev => prev.map(req => {
      if (req.id === id) {
        const nextStatus = req.status === 'GRANTED' ? 'REVOKED' : 'GRANTED';
        if (id === 'REQ-TCS-01') setStudentConsentGranted(nextStatus === 'GRANTED');
        showToast(
          nextStatus === 'GRANTED' ? 'Consent Granted' : 'Consent Revoked',
          `Access for ${req.requester} has been ${nextStatus === 'GRANTED' ? 'authorized' : 'instantly terminated'}.`,
          nextStatus === 'GRANTED' ? 'success' : 'warning'
        );
        return { ...req, status: nextStatus };
      }
      return req;
    }));
  };

  // =========================================================================
  // 3. INSTITUTION NODAL PORTAL STATE & LOGIC
  // =========================================================================
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [batchCompleted, setBatchCompleted] = useState(false);
  const [transferApaarId, setTransferApaarId] = useState('908123456783');
  const [transferTargetCollege, setTransferTargetCollege] = useState('C-24953');
  const [transfersList, setTransfersList] = useState([
    {
      transferId: 'TRF-COEP-VJTI-9812',
      apaarId: '908123456783',
      studentName: 'Rohan Amit Deshmukh',
      from: 'COEP Tech University (C-41584)',
      to: 'Veermata Jijabai Tech Institute (C-33827)',
      creditsTransferred: 44.0,
      status: 'APPROVED_BY_SOURCE'
    }
  ]);

  const runBulkPipeline = () => {
    setPipelineRunning(true);
    setBatchCompleted(false);
    setCurrentStage(1);

    setTimeout(() => {
      setCurrentStage(2);
      setTimeout(() => {
        setCurrentStage(3);
        setTimeout(() => {
          setCurrentStage(4);
          setTimeout(() => {
            setPipelineRunning(false);
            setBatchCompleted(true);
            showToast('Batch Ingested & Verified', '120 student credentials sealed and pushed to ABC/DigiLocker NAD.', 'success');
            announce('Institutional batch processing completed successfully');
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  // =========================================================================
  // 4. AICTE SUPERADMIN NATIONAL ANALYTICS STATE
  // =========================================================================
  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-1092',
      severity: 'HIGH',
      type: 'DUPLICATE_ENROLLMENT',
      apaarId: '908123456783',
      description: 'Concurrent active semester enrollment detected across VJTI Mumbai and University of Pune without Migration NOC.',
      status: 'ACTIVE'
    },
    {
      id: 'ALT-1093',
      severity: 'MEDIUM',
      type: 'ABNORMAL_CREDIT_VELOCITY',
      apaarId: '908123456782',
      description: 'Sudden injection of 36 credits in a single 4-month term exceeds AICTE NEP 2020 maximum limit (30 credits).',
      status: 'INVESTIGATING'
    }
  ]);

  // Dedicated Subpage Switcher component inside every subpage header
  const renderSubpageSwitcher = () => (
    <div className="dl-subpage-tabs">
      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginRight: '6px' }}>Switch Portal:</span>
      <button 
        className={`dl-subpage-tab ${activePage === 'home' ? 'active' : ''}`}
        onClick={() => navigateTo('home')}
        title="Press 0 or H"
      >
        <Home size={13} /> Home <span className="dl-tab-kbd">0</span>
      </button>
      <button 
        className={`dl-subpage-tab ${activePage === 'verifier' ? 'active' : ''}`}
        onClick={() => navigateTo('verifier')}
        title="Press 1 or V"
      >
        <Shield size={13} /> Instant Verifier <span className="dl-tab-kbd">1</span>
      </button>
      <button 
        className={`dl-subpage-tab ${activePage === 'student' ? 'active' : ''}`}
        onClick={() => navigateTo('student')}
        title="Press 2 or S"
      >
        <User size={13} /> Student Portal <span className="dl-tab-kbd">2</span>
      </button>
      <button 
        className={`dl-subpage-tab ${activePage === 'institution' ? 'active' : ''}`}
        onClick={() => navigateTo('institution')}
        title="Press 3 or I"
      >
        <Building2 size={13} /> Institution Desk <span className="dl-tab-kbd">3</span>
      </button>
      <button 
        className={`dl-subpage-tab ${activePage === 'admin' ? 'active' : ''}`}
        onClick={() => navigateTo('admin')}
        title="Press 4 or D"
      >
        <Scale size={13} /> AICTE Admin <span className="dl-tab-kbd">4</span>
      </button>
      <button 
        className={`dl-subpage-tab ${activePage === 'about' ? 'active' : ''}`}
        onClick={() => navigateTo('about')}
        title="Press 5 or A"
      >
        <Info size={13} /> About Us <span className="dl-tab-kbd">5</span>
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-app)' }}>
      
      {/* =====================================================================
          SOVEREIGN GOVERNMENT PRELOADER (AUTHENTIC GIGW 3.0 / UX4G)
         ===================================================================== */}
      {appLoading && (
        <div className="dl-splash-overlay" role="status" aria-live="polite">
          <div className="tiranga-stripe" style={{ position: 'absolute', top: 0, left: 0 }} />
          
          <div style={{ paddingTop: '22px', opacity: 0.85, fontSize: '0.8rem', letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: 600 }}>
            Government of India • Ministry of Education
          </div>

          <div className="dl-splash-center">
            {/* Authentic Ashoka Pillar Lion Capital Emblem */}
            <svg className="dl-splash-emblem" viewBox="0 0 100 120" fill="currentColor">
              <path d="M50 8 C44 8 40 12 38 18 C34 16 28 18 26 23 C23 29 25 36 29 40 C28 44 28 48 29 52 C31 58 35 62 40 64 C38 67 36 71 35 75 L65 75 C64 71 62 67 60 64 C65 62 69 58 71 52 C72 48 72 44 71 40 C75 36 77 29 74 23 C72 18 66 16 62 18 C60 12 56 8 50 8 Z" fill="currentColor" opacity="0.9" />
              <circle cx="45" cy="24" r="2" fill="#ffffff" />
              <circle cx="55" cy="24" r="2" fill="#ffffff" />
              <path d="M47 30 Q50 33 53 30" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M43 38 Q50 44 57 38" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <rect x="25" y="78" width="50" height="8" rx="2" fill="currentColor" />
              <circle cx="50" cy="82" r="3.5" fill="#ffffff" />
              <circle cx="50" cy="82" r="2" fill="currentColor" />
              <circle cx="34" cy="82" r="1.5" fill="#ffffff" />
              <circle cx="66" cy="82" r="1.5" fill="#ffffff" />
              <path d="M30 89 C35 94 45 96 50 96 C55 96 65 94 70 89 L30 89 Z" fill="currentColor" opacity="0.85" />
              <rect x="22" y="98" width="56" height="4" rx="1" fill="currentColor" />
              <text x="50" y="113" textAnchor="middle" fontSize="8" fontFamily="Noto Sans Devanagari, serif" fontWeight="700" fill="currentColor" letterSpacing="0.8">
                सत्यमेव जयते
              </text>
            </svg>

            <div className="dl-splash-ministry">
              All India Council for Technical Education (AICTE)
            </div>

            <h1 className="dl-splash-title">
              APAAR National Registry
            </h1>

            <p className="dl-splash-subtitle">
              Automated Permanent Academic Account Registry
            </p>

            <div className="gov-loader-track" aria-hidden="true">
              <div className="gov-loader-bar" />
            </div>

            <div className="dl-splash-footnote">
              <Lock size={12} color="#0052cc" />
              <span>Secured National Academic Gateway • MeghRaj Cloud</span>
            </div>
          </div>

          <div className="dl-splash-footer">
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              Digital India • National e-Governance Division (NeGD) • Ministry of Electronics & IT
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>
              Standard for Academic Verification under NEP 2020 & IT Rules 2016
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          DISTINCT PAGE ROUTE TRANSITION LOADING SCREEN (MINIMAL & AESTHETIC)
         ===================================================================== */}
      {pageTransitionLoading && (
        <div className="dl-page-transition-overlay" role="status" aria-live="assertive">
          <div className="dl-route-top-bar" />
          
          {(() => {
            const meta = pageTransitionMeta[targetPage] || pageTransitionMeta.home;
            const IconComponent = meta.icon;

            return (
              <div className="dl-minimal-route-box">
                <div className="dl-minimal-icon-wrapper">
                  <div className="dl-minimal-ring" style={{ borderTopColor: meta.color }} />
                  <IconComponent size={22} color={meta.color} />
                </div>

                <div className="dl-minimal-meta">
                  <span className="dl-minimal-tag">{meta.tag}</span>
                  <h3 className="dl-minimal-title">{meta.title}</h3>
                  <p className="dl-minimal-subtitle">{meta.subtitle}</p>
                </div>

                <div className="dl-minimal-progress-track">
                  <div className="dl-minimal-progress-fill" style={{ background: meta.color }} />
                </div>

                <div className="dl-minimal-status-row">
                  <span className="dl-minimal-step-text">
                    <span className="dl-minimal-pulse-dot" />
                    {meta.step}
                  </span>
                  <span className="dl-minimal-sla">SLA &lt; 200ms</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Floating Keyboard Navigation HUD Pill (Ultra-Minimal & Aesthetic) */}
      <div 
        className="dl-floating-hotkey-bar"
        title="Active Hotkeys Engine • Press '?' for full modal"
      >
        <span className="dl-hud-icon">⌨️</span>
        <div 
          className={`dl-hud-item ${activePage === 'home' ? 'current' : ''} ${hudActiveKey === '0' ? 'active-pulse' : ''}`} 
          onClick={() => navigateTo('home')} 
          title="Press 0 or H"
        >
          <span>Home</span> <span className="dl-hud-kbd">0</span>
        </div>
        <div 
          className={`dl-hud-item ${activePage === 'verifier' ? 'current' : ''} ${hudActiveKey === '1' ? 'active-pulse' : ''}`} 
          onClick={() => navigateTo('verifier')} 
          title="Press 1 or V"
        >
          <span>Verifier</span> <span className="dl-hud-kbd">1</span>
        </div>
        <div 
          className={`dl-hud-item ${activePage === 'student' ? 'current' : ''} ${hudActiveKey === '2' ? 'active-pulse' : ''}`} 
          onClick={() => navigateTo('student')} 
          title="Press 2 or S"
        >
          <span>Student</span> <span className="dl-hud-kbd">2</span>
        </div>
        <div 
          className={`dl-hud-item ${activePage === 'institution' ? 'current' : ''} ${hudActiveKey === '3' ? 'active-pulse' : ''}`} 
          onClick={() => navigateTo('institution')} 
          title="Press 3 or I"
        >
          <span>Institute</span> <span className="dl-hud-kbd">3</span>
        </div>
        <div 
          className={`dl-hud-item ${activePage === 'admin' ? 'current' : ''} ${hudActiveKey === '4' ? 'active-pulse' : ''}`} 
          onClick={() => navigateTo('admin')} 
          title="Press 4 or D"
        >
          <span>Admin</span> <span className="dl-hud-kbd">4</span>
        </div>
        <div 
          className={`dl-hud-item ${activePage === 'about' ? 'current' : ''} ${hudActiveKey === '5' ? 'active-pulse' : ''}`} 
          onClick={() => navigateTo('about')} 
          title="Press 5 or A"
        >
          <span>About</span> <span className="dl-hud-kbd">5</span>
        </div>
        <div 
          className="dl-hud-item dl-hud-help" 
          onClick={() => setShowShortcutsModal(true)}
          title="Press '?' for full shortcuts cheatsheet"
        >
          <span>Keys</span> <span className="dl-hud-kbd">?</span>
        </div>
      </div>

      {/* Toast Notification Container */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999999,
          background: toastMessage.type === 'error' ? '#dc2626' : toastMessage.type === 'warning' ? '#d97706' : '#059669',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '440px',
          animation: 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {toastMessage.type === 'error' ? <AlertOctagon size={24} /> : toastMessage.type === 'warning' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.94rem' }}>{toastMessage.title}</div>
            <div style={{ fontSize: '0.84rem', opacity: 0.95 }}>{toastMessage.message}</div>
          </div>
        </div>
      )}

      {/* Skip to Main Content Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        {t.skipContent}
      </a>

      {/* Screen Reader Live Region */}
      <div aria-live="polite" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
        {screenReaderAnnounce}
      </div>

      {/* Indian National Tricolor Ribbon */}
      <div className="tiranga-stripe" />

      {/* =====================================================================
          1. HEADER TOP UTILITY BAR
         ===================================================================== */}
      <div className="dl-header-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="dl-goi-link" title="Government of India Portal">
            <img 
              src="https://doc.ux4g.gov.in/assets/img/icon/in-flag.png" 
              alt="Indian Flag" 
              style={{ width: '18px', height: '12px', borderRadius: '1px' }} 
            />
            <span>Government of India</span>
            <ExternalLink size={12} style={{ opacity: 0.8 }} />
          </a>
          <span className="dl-top-partition">|</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
            ACADEMIC BANK OF CREDITS • Ministry of Education
          </span>
          <span className="dl-top-partition">|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem' }}>
            <span onClick={() => navigateTo('about')} style={{ cursor: 'pointer', opacity: 0.85 }}>About Us</span>
            <span onClick={() => navigateTo('about')} style={{ cursor: 'pointer', opacity: 0.85 }}>Resources</span>
            <span 
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('stats-ribbon')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} 
              style={{ cursor: 'pointer', opacity: 0.85 }}
            >
              Dashboard
            </span>
            <span 
              onClick={() => setShowVcModal(true)} 
              style={{ cursor: 'pointer', color: '#facc15', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              title="Academic Institutions Video Conference Desk"
            >
              <Video size={12} /> VC Support
            </span>
          </div>
        </div>

        <div className="dl-top-actions">
          {/* Live NTP / IST Clock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
            <Clock size={12} color="#60a5fa" />
            <span style={{ fontFamily: 'var(--font-mono)' }}>{currentTime}</span>
          </div>

          <a href="#main-content" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.78rem' }}>
            Skip to main content
          </a>
          
          <span className="dl-top-partition">|</span>

          {/* Accessibility Font Size Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button onClick={() => setFontSize('small')} className={`dl-font-btn ${fontSize === 'small' ? 'active' : ''}`} title="Decrease font size">A-</button>
            <button onClick={() => setFontSize('normal')} className={`dl-font-btn ${fontSize === 'normal' ? 'active' : ''}`} title="Default font size">A</button>
            <button onClick={() => setFontSize('large')} className={`dl-font-btn ${fontSize === 'large' ? 'active' : ''}`} title="Increase font size">A+</button>
          </div>

          <span className="dl-top-partition">|</span>

          {/* Theme Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button onClick={() => setTheme('light')} className={`dl-font-btn ${theme === 'light' ? 'active' : ''}`} title="Light mode">Light</button>
            <button onClick={() => setTheme('dark')} className={`dl-font-btn ${theme === 'dark' ? 'active' : ''}`} title="Dark mode">Dark</button>
            <button onClick={() => setTheme('high-contrast')} className={`dl-font-btn ${theme === 'high-contrast' ? 'active' : ''}`} title="High contrast">Contrast</button>
          </div>

          <span className="dl-top-partition">|</span>

          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} />
            <button onClick={() => setLang('en')} className={`dl-font-btn ${lang === 'en' ? 'active' : ''}`}>English</button>
            <button onClick={() => setLang('hi')} className={`dl-font-btn ${lang === 'hi' ? 'active' : ''}`}>हिन्दी</button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. MAIN STICKY ACADEMIC BANK OF CREDITS NAVBAR
         ===================================================================== */}
      <header className="dl-main-navbar">
        <div className="dl-logo-lockup" onClick={() => navigateTo('home')}>
          <div className="dl-brand-emblem" title="Return to Home (Key 0 or H)">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#0052cc" />
              <path d="M20 7L31 13V20C31 27.5 26.3 32.5 20 34C13.7 32.5 9 27.5 9 20V13L20 7Z" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M15 20L18.5 23.5L25 17" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)', margin: '0 4px' }} />

          <div className="dl-brand-text">
            <h1>
              ACADEMIC BANK OF CREDITS
              <span style={{ fontSize: '0.68rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: 700, border: '1px solid #bae6fd' }}>
                ABC • APAAR
              </span>
            </h1>
            <p>Ministry of Education, Govt. of India • AICTE National Repository</p>
          </div>
        </div>

        {/* Navigation Links for Separate Pages */}
        <nav className="dl-nav-links">
          <span 
            className={`dl-nav-item ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('home')}
            title="Press '0' or 'H' on keyboard"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('home'); }}
          >
            <Home size={15} /> Home <span className="dl-nav-kbd">0</span>
          </span>
          <span 
            className={`dl-nav-item ${activePage === 'verifier' ? 'active' : ''}`}
            onClick={() => navigateTo('verifier')}
            title="Press '1' or 'V' on keyboard"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('verifier'); }}
          >
            <CheckCircle2 size={15} /> Instant Verifier <span className="dl-nav-kbd">1</span>
          </span>
          <span 
            className={`dl-nav-item ${activePage === 'student' ? 'active' : ''}`}
            onClick={() => navigateTo('student')}
            title="Press '2' or 'S' on keyboard"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('student'); }}
          >
            <User size={15} /> Student Portal <span className="dl-nav-kbd">2</span>
          </span>
          <span 
            className={`dl-nav-item ${activePage === 'institution' ? 'active' : ''}`}
            onClick={() => navigateTo('institution')}
            title="Press '3' or 'I' on keyboard"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('institution'); }}
          >
            <Building2 size={15} /> Awarding Institutions <span className="dl-nav-kbd">3</span>
          </span>
          <span 
            className={`dl-nav-item ${activePage === 'admin' ? 'active' : ''}`}
            onClick={() => navigateTo('admin')}
            title="Press '4' or 'D' on keyboard"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('admin'); }}
          >
            <Scale size={15} /> AICTE Admin <span className="dl-nav-kbd">4</span>
          </span>
          <span 
            className={`dl-nav-item ${activePage === 'about' ? 'active' : ''}`}
            onClick={() => navigateTo('about')}
            title="Press '5' or 'A' on keyboard"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('about'); }}
          >
            <Info size={15} /> About Us <span className="dl-nav-kbd">5</span>
          </span>
        </nav>

        {/* Header Action Buttons (Matching ABC login pathways) */}
        <div className="dl-header-actions">
          <button 
            className="btn-dl-outline"
            onClick={() => setShowShortcutsModal(true)}
            title="Press '?' on keyboard for hotkey guide"
            style={{ padding: '7px 11px', fontSize: '0.8rem' }}
          >
            <Command size={14} /> Hotkeys <span className="dl-nav-kbd" style={{ marginLeft: '4px' }}>?</span>
          </button>

          <button 
            className="btn-dl-outline"
            style={{ padding: '7px 12px', fontSize: '0.82rem' }}
            onClick={() => {
              setLoginRole('STUDENT');
              setShowLoginModal(true);
            }}
            title="Login as Student (DigiLocker / MeriPehchaan)"
          >
            <User size={14} /> Student
          </button>
          
          <button 
            className="btn-dl-primary"
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
            onClick={() => {
              setLoginRole('INSTITUTION');
              setShowLoginModal(true);
            }}
            title="Login as Awarding Institution (DigiLocker NAD)"
          >
            <Building2 size={14} /> Awarding Institution
          </button>
        </div>
      </header>

      {/* =====================================================================
          PAGE 1: MAIN HOME PAGE (SEPARATE LANDING PAGE)
         ===================================================================== */}
      {/* =====================================================================
          PAGE 1: MAIN HOME PAGE (STRUCTURED ACCORDING TO ABC.GOV.IN)
         ===================================================================== */}
      {activePage === 'home' && (
        <div id="main-content" className="dl-page-enter">
          {/* =================================================================
              1. HERO BANNER: EMPOWERING ALL LEARNERS (ACADEMIC AND BEYOND)
             ================================================================= */}
          <section className="dl-hero-banner">
            <div className="dl-hero-container">
              <div className="dl-hero-badge">
                <span style={{ fontSize: '1rem' }}>🇮🇳</span>
                <span>{heroSlides[currentSlide].tag}</span>
                <span style={{ opacity: 0.5 }}>•</span>
                <span>National Education Policy (NEP 2020)</span>
              </div>

              <h2 className="dl-hero-title">
                {heroSlides[currentSlide].title}
              </h2>
              <p className="dl-hero-subtitle">
                {heroSlides[currentSlide].subtitle}
              </p>

              {/* Quick Instant Search/Verify Input */}
              <div className="dl-hero-search-box">
                <Search size={20} color="#0052cc" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  className="dl-search-input"
                  value={verifyApaarId}
                  onChange={(e) => setVerifyApaarId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigateTo('verifier');
                      executeVerification(false);
                    }
                  }}
                  placeholder="Enter 12-digit APAAR ID (e.g. 908123456781) or press '/' to search..."
                />
                <button 
                  className="btn-dl-primary"
                  style={{ padding: '10px 22px', fontSize: '0.92rem' }}
                  onClick={() => {
                    navigateTo('verifier');
                    executeVerification(false);
                  }}
                >
                  <Shield size={16} /> Verify Credential
                </button>
              </div>

              {/* Quick Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                <button 
                  className="btn-dl-primary"
                  style={{ background: '#ffffff', color: '#0052cc', border: 'none', fontWeight: 800, padding: '10px 22px' }}
                  onClick={() => {
                    setLoginRole('STUDENT');
                    setShowLoginModal(true);
                  }}
                >
                  <UserCheck size={16} /> Get Started with APAAR
                </button>

                <button 
                  className="btn-dl-outline"
                  style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff', background: 'rgba(255,255,255,0.1)' }}
                  onClick={() => navigateTo('verifier')}
                >
                  <CheckCircle2 size={16} /> Instant Verifier (&lt; 200ms)
                </button>

                <button 
                  className="btn-dl-outline"
                  style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff', background: 'rgba(255,255,255,0.1)' }}
                  onClick={() => navigateTo('institution')}
                >
                  <Building2 size={16} /> Institutional Registration
                </button>
              </div>

              {/* Subtext description from abc.gov.in */}
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', margin: '0 0 16px', maxWidth: '780px' }}>
                Effortlessly manage and transfer credits from academic and skill-based programs, all in one place.
              </p>

              {/* The 4 Official ABC Value Pillars (from abc.gov.in) */}
              <div className="abc-pillars-grid">
                <div className="abc-pillar-card">
                  <div className="abc-pillar-icon">
                    <BarChart3 size={20} />
                  </div>
                  <h4 className="abc-pillar-title">Streamlined Credit Management</h4>
                  <p className="abc-pillar-desc">
                    Effortlessly track and transfer credits from academic and skill-based programs.
                  </p>
                </div>

                <div className="abc-pillar-card">
                  <div className="abc-pillar-icon">
                    <QrCode size={20} />
                  </div>
                  <h4 className="abc-pillar-title">APAAR ID Integration</h4>
                  <p className="abc-pillar-desc">
                    A unique ID that centralizes all your learning records, making progress tracking easy.
                  </p>
                </div>

                <div className="abc-pillar-card">
                  <div className="abc-pillar-icon">
                    <GraduationCap size={20} />
                  </div>
                  <h4 className="abc-pillar-title">Flexibility for Learners</h4>
                  <p className="abc-pillar-desc">
                    Supports both formal education and skill development, enhancing your learning journey.
                  </p>
                </div>

                <div className="abc-pillar-card">
                  <div className="abc-pillar-icon">
                    <Award size={20} />
                  </div>
                  <h4 className="abc-pillar-title">Recognition for Non-Academic Learning</h4>
                  <p className="abc-pillar-desc">
                    Integrates skill certifications with formal education, recognizing all learning forms.
                  </p>
                </div>
              </div>

              {/* Compliance & Regulatory Badges */}
              <div className="dl-hero-compliance-strip" style={{ marginTop: '24px' }}>
                <div className="dl-compliance-item">
                  <Check size={14} color="#4ade80" />
                  <span>Rule 9A Information Technology Rules 2016</span>
                </div>
                <div className="dl-compliance-item">
                  <Lock size={14} color="#60a5fa" />
                  <span>UIDAI Aadhaar Data Vault AES-256</span>
                </div>
                <div className="dl-compliance-item">
                  <Shield size={14} color="#facc15" />
                  <span>DPDP Act 2023 DEPA Consent</span>
                </div>
                <div className="dl-compliance-item">
                  <Cpu size={14} color="#a78bfa" />
                  <span>Sub-200ms Verification SLA</span>
                </div>
              </div>

              {/* Carousel Slide Controls */}
              <div className="dl-carousel-controls">
                <button 
                  className="dl-carousel-btn"
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  title="Previous slide (ArrowLeft)"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  className="dl-carousel-btn"
                  onClick={() => setCarouselPaused(!carouselPaused)}
                  title={carouselPaused ? "Play carousel (Space)" : "Pause carousel (Space)"}
                >
                  {carouselPaused ? <Play size={16} /> : <Pause size={16} />}
                </button>
                <button 
                  className="dl-carousel-btn"
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  title="Next slide (ArrowRight)"
                >
                  <ChevronRight size={18} />
                </button>
                <div style={{ marginLeft: '12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                  Slide {currentSlide + 1} of {heroSlides.length}
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              2. OFFICIAL ABC LIVE STATISTICS RIBBON (AUTHENTIC FIGURES)
             ================================================================= */}
          <div id="stats-ribbon" className="dl-stats-strip">
            <div className="dl-stats-grid abc-stats-grid">
              <div className="dl-stat-card">
                <div className="dl-stat-icon-wrap">
                  <User size={24} color="#0052cc" />
                </div>
                <div>
                  <div className="dl-stat-value">33.71 Cr</div>
                  <div className="dl-stat-label">Students with APAAR ID created</div>
                </div>
              </div>

              <div className="dl-stat-card">
                <div className="dl-stat-icon-wrap" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                  <UserCheck size={24} color="#059669" />
                </div>
                <div>
                  <div className="dl-stat-value" style={{ color: '#059669' }}>6.71 Cr</div>
                  <div className="dl-stat-label">Students with verified APAAR ID</div>
                </div>
              </div>

              <div className="dl-stat-card">
                <div className="dl-stat-icon-wrap" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                  <Building2 size={24} color="#d97706" />
                </div>
                <div>
                  <div className="dl-stat-value" style={{ color: '#d97706' }}>1,200+</div>
                  <div className="dl-stat-label">Awarding Institutions on ABC</div>
                </div>
              </div>

              <div className="dl-stat-card">
                <div className="dl-stat-icon-wrap" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                  <Database size={24} color="#2563eb" />
                </div>
                <div>
                  <div className="dl-stat-value" style={{ color: '#2563eb' }}>5.5 Cr</div>
                  <div className="dl-stat-label">Records uploaded (2021-2025)</div>
                </div>
              </div>

              <div className="dl-stat-card">
                <div className="dl-stat-icon-wrap" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
                  <Sparkles size={24} color="#7c3aed" />
                </div>
                <div>
                  <div className="dl-stat-value" style={{ color: '#7c3aed' }}>1.90 Cr</div>
                  <div className="dl-stat-label">Credit awards seeded with APAAR</div>
                </div>
              </div>

              <div className="dl-stat-card">
                <div className="dl-stat-icon-wrap" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <FileCheck size={24} color="#16a34a" />
                </div>
                <div>
                  <div className="dl-stat-value" style={{ color: '#16a34a' }}>5.45 Cr</div>
                  <div className="dl-stat-label">Records mapped with APAAR ID</div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              3. SECTION 1: INTRODUCING APAAR ID – ONE NATION, ONE STUDENT ID
             ================================================================= */}
          <section className="dl-section" style={{ paddingTop: '10px' }}>
            <div className="abc-intro-card">
              <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
                <span className="dl-section-tag" style={{ margin: '0 auto 10px' }}>National Education Policy 2020</span>
                <h3 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '-0.02em' }}>
                  Introducing APAAR ID – One Nation, One Student ID
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '20px' }}>
                  The <strong>AUTOMATED PERMANENT ACADEMIC ACCOUNT REGISTRY (APAAR) ID</strong> is a one-of-a-kind identifier that simplifies the way you track and manage your academic and skill-based achievements. Integrated within the <strong>Academic Bank of Credits (ABC)</strong> system, the APAAR ID consolidates all your educational records in one place, making it easy to accumulate, transfer, and access your credits across different learning pathways.
                </p>
                <div style={{ display: 'inline-flex', gap: '10px' }}>
                  <a 
                    href="https://apaar.education.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-dl-primary" 
                    style={{ padding: '8px 20px', fontSize: '0.86rem' }}
                  >
                    Know More on MoE Portal <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '38px', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
                  The ID That Does It All
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Your gateway to a seamless, digital academic journey. APAAR ID helps in a seamless integration of skills and experience into a credit-based system.
                </p>
              </div>

              <div className="abc-intro-grid">
                <div className="abc-intro-feature">
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052cc', marginBottom: '14px' }}>
                    <Database size={22} />
                  </div>
                  <h5 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Centralized Academic Records
                  </h5>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Exam results, certifications, and skill-based learning achievements are securely linked to the APAAR ID.
                  </p>
                </div>

                <div className="abc-intro-feature">
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '14px' }}>
                    <Shield size={22} />
                  </div>
                  <h5 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Simplified Verification
                  </h5>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Universities and employers can instantly verify a student’s credentials in &lt; 200ms, reducing paperwork and fraud.
                  </p>
                </div>

                <div className="abc-intro-feature">
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '14px' }}>
                    <GraduationCap size={22} />
                  </div>
                  <h5 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Effortless College Admissions
                  </h5>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Entrance exams, admissions, and academic progress are mapped under a single, verifiable identity.
                  </p>
                </div>

                <div className="abc-intro-feature">
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', marginBottom: '14px' }}>
                    <Sparkles size={22} />
                  </div>
                  <h5 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Lifelong Digital Identity
                  </h5>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    APAAR ID remains with students throughout their careers, ensuring access to their learning history.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              4. SECTION 2: GET STARTED WITH APAAR ID – CREATE YOURS TODAY!
             ================================================================= */}
          <section className="dl-section">
            <div className="dl-section-header" style={{ textAlign: 'center' }}>
              <span className="dl-section-tag" style={{ margin: '0 auto 8px' }}>Interactive Pathway</span>
              <h3 className="dl-section-title">Get Started with APAAR ID – Create Yours Today!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '640px', margin: '6px auto 0' }}>
                Select your learner category below to see the verified creation steps tailored to your academic journey:
              </p>
            </div>

            {/* Interactive Learner Cohort Tabs */}
            <div className="abc-tabs-nav">
              <button 
                className={`abc-tab-btn ${learnerTab === 'school' ? 'active' : ''}`}
                onClick={() => setLearnerTab('school')}
              >
                🎒 School Students
              </button>
              <button 
                className={`abc-tab-btn ${learnerTab === 'higher' ? 'active' : ''}`}
                onClick={() => setLearnerTab('higher')}
              >
                🎓 Higher/Skill Education Learners
              </button>
              <button 
                className={`abc-tab-btn ${learnerTab === 'other' ? 'active' : ''}`}
                onClick={() => setLearnerTab('other')}
              >
                🛠️ Other / Vocational Learners
              </button>
            </div>

            {/* Cohort 1: School Students */}
            {learnerTab === 'school' && (
              <div className="abc-cohort-steps dl-page-enter">
                <div className="abc-cohort-card">
                  <div className="abc-step-badge">1</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052cc', marginBottom: '14px' }}>
                    <Building2 size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>Visit School / Digital Notice</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Parents visit school or receive official digital intimation to learn about APAAR ID benefits under NEP 2020.
                  </p>
                </div>

                <div className="abc-cohort-card">
                  <div className="abc-step-badge">2</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '14px' }}>
                    <CheckSquare size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>Fill Consent Form</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Parents fill up and sign the consent form voluntarily for APAAR ID creation compliant with DPDP Act 2023.
                  </p>
                </div>

                <div className="abc-cohort-card">
                  <div className="abc-step-badge">3</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '14px' }}>
                    <Cpu size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>UDISE+ Generation</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    UDISE+ system automatically generates APAAR ID against the Permanent Education Number (PEN) of the student.
                  </p>
                </div>

                <div className="abc-cohort-card">
                  <div className="abc-step-badge">4</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', marginBottom: '14px' }}>
                    <Download size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>DigiLocker Push</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    APAAR ID is pushed directly into student's / parent's authenticated DigiLocker account for digital download.
                  </p>
                </div>
              </div>
            )}

            {/* Cohort 2: Higher/Skill Education Learners */}
            {learnerTab === 'higher' && (
              <div className="abc-cohort-steps dl-page-enter">
                <div className="abc-cohort-card">
                  <div className="abc-step-badge">1</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052cc', marginBottom: '14px' }}>
                    <LogIn size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>DigiLocker Authentication</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Create or log in to your authenticated DigiLocker account using your Aadhaar or registered mobile number.
                  </p>
                </div>

                <div className="abc-cohort-card">
                  <div className="abc-step-badge">2</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '14px' }}>
                    <GraduationCap size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>Select Education Category</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Select the Education category in DigiLocker and proceed to the Academic Bank of Credits / APAAR ID creation service.
                  </p>
                </div>

                <div className="abc-cohort-card">
                  <div className="abc-step-badge">3</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '14px' }}>
                    <FileText size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>Map Institution Details</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Choose your AICTE/UGC institution name, admission year, and student roll / registration number, then click Submit.
                  </p>
                </div>

                <div className="abc-cohort-card">
                  <div className="abc-step-badge">4</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', marginBottom: '14px' }}>
                    <Award size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>Download APAAR Card</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Access and download your verified APAAR holographic card complete with secure cryptographic QR code.
                  </p>
                </div>
              </div>
            )}

            {/* Cohort 3: Other Learners */}
            {learnerTab === 'other' && (
              <div className="abc-cohort-steps dl-page-enter">
                <div className="abc-cohort-card">
                  <div className="abc-step-badge">1</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052cc', marginBottom: '14px' }}>
                    <UserCheck size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>Aadhaar e-KYC Verification</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Create or log in to your authenticated DigiLocker account or National Skill India Digital portal.
                  </p>
                </div>

                <div className="abc-cohort-card">
                  <div className="abc-step-badge">2</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '14px' }}>
                    <Layers size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>Select Vocational Body</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Select your NCVET, ITI, or Sector Skill Council awarding body from the accredited vocational directory.
                  </p>
                </div>

                <div className="abc-cohort-card">
                  <div className="abc-step-badge">3</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '14px' }}>
                    <BarChart3 size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>Link NSQF Skill Credits</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Map National Skills Qualification Framework (NSQF) credits and apprenticeship competencies to APAAR.
                  </p>
                </div>

                <div className="abc-cohort-card">
                  <div className="abc-step-badge">4</div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', marginBottom: '14px' }}>
                    <Database size={22} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>Access Skill Transcripts</h4>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Instantly fetch verified skill credentials and micro-transcripts into your Academic Bank of Credits account.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* =================================================================
              5. SECTION 3: HOW TO UPDATE INFORMATION ON APAAR?
             ================================================================= */}
          <section className="dl-section">
            <div className="dl-section-header" style={{ textAlign: 'center' }}>
              <span className="dl-section-tag" style={{ margin: '0 auto 8px' }}>Demographic Synchronization</span>
              <h3 className="dl-section-title">How to update information on APAAR?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '640px', margin: '6px auto 0' }}>
                Follow this simple 3-step synchronization procedure to ensure accurate academic records across all systems:
              </p>
            </div>

            <div className="abc-update-grid">
              {/* Step 1 */}
              <div className="abc-update-card">
                <div className="abc-update-num">1</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Update Aadhaar Card
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Ensure that your name, date of birth, gender, and address are updated with UIDAI via myAadhaar or an enrollment center.
                </p>
              </div>

              <div className="abc-update-connector">➔</div>

              {/* Step 2 */}
              <div className="abc-update-card">
                <div className="abc-update-num" style={{ background: '#059669' }}>2</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Do KYC in DigiLocker
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Log in to DigiLocker and re-authenticate your profile using Aadhaar OTP to pull the latest updated identity record.
                </p>
              </div>

              <div className="abc-update-connector">➔</div>

              {/* Step 3 */}
              <div className="abc-update-card">
                <div className="abc-update-num" style={{ background: '#7c3aed' }}>3</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Update APAAR ID
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Open your issued APAAR card in DigiLocker and click Refresh Document. Changes automatically reflect in the ABC system.
                </p>
              </div>
            </div>
          </section>

          {/* =================================================================
              6. SECTION 4: REGISTER YOUR ACADEMIC INSTITUTION VIA DIGILOCKER NAD
             ================================================================= */}
          <section className="dl-section">
            <div className="dl-section-header">
              <span className="dl-section-tag">For Universities & Colleges</span>
              <h3 className="dl-section-title">Register Your Academic Institution with ABC via DigiLocker NAD</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '6px' }}>
                Join 1,200+ registered Awarding Institutions (AIs) depositing digital credits and verifying academic awards under UGC and AICTE mandates.
              </p>
            </div>

            <div className="abc-nad-grid">
              <div className="abc-nad-card">
                <div className="abc-nad-step-idx">01</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Sign Up via DigiLocker</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Create your institutional onboarding account easily by logging in with authorized registrar credentials on DigiLocker NAD.
                </p>
              </div>

              <div className="abc-nad-card">
                <div className="abc-nad-step-idx" style={{ color: '#059669' }}>02</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Select Your Institution</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Choose your university, college, polytechnic, or skill training institution from the official AICTE/UGC registered master directory.
                </p>
              </div>

              <div className="abc-nad-card">
                <div className="abc-nad-step-idx" style={{ color: '#d97706' }}>03</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Confirm Account Owner</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Verify your Nodal Officer details, AISHE code, official email, and attach Class-3 Digital Signature Certificate (DSC).
                </p>
              </div>

              <div className="abc-nad-card">
                <div className="abc-nad-step-idx" style={{ color: '#7c3aed' }}>04</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Accept Terms & Conditions</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Agree to the Academic Bank of Credits operational protocols to securely link and deposit student credit records.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
              <button 
                className="btn-dl-primary"
                onClick={() => navigateTo('institution')}
                style={{ padding: '10px 24px' }}
              >
                <Building2 size={16} /> Open Institutional Ingestion Portal (Key 3 / I) <ArrowRight size={14} />
              </button>
            </div>
          </section>

          {/* =================================================================
              7. SECTION 5: LIVE VIDEO CONFERENCE SUPPORT DESK
             ================================================================= */}
          <section className="dl-section" style={{ paddingTop: '10px' }}>
            <div className="abc-vc-banner">
              <div>
                <div className="abc-vc-badge">
                  <span className="abc-vc-pulse" />
                  <span>Interactive Support Desk</span>
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 8px' }}>
                  Academic Institutions can now join us for Video Conference
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: '#facc15', fontWeight: 700, marginBottom: '10px' }}>
                  <Calendar size={16} /> Monday to Friday | 2:30 PM to 5:00 PM IST
                </div>
                <p style={{ fontSize: '0.85rem', opacity: 0.9, maxWidth: '640px', lineHeight: 1.5, margin: 0 }}>
                  Connect live with our technical support team for real-time assistance on DigiLocker NAD onboarding, CSV batch schema formatting, and automated credit deposition.
                </p>
              </div>

              <div style={{ flexShrink: 0 }}>
                <button 
                  className="btn-dl-primary"
                  style={{ background: '#ffffff', color: '#0052cc', border: 'none', fontWeight: 800, padding: '12px 24px', fontSize: '0.92rem' }}
                  onClick={() => setShowVcModal(true)}
                >
                  <Video size={16} /> Join Video Conference Desk
                </button>
              </div>
            </div>
          </section>

          {/* =================================================================
              8. SECTION 6: SOVEREIGN PORTAL DIRECTORY / CORE MODULES
             ================================================================= */}
          <section className="dl-section">
            <div className="dl-section-header">
              <span className="dl-section-tag">AICTE Core Architecture</span>
              <h3 className="dl-section-title">AICTE APAAR Sovereign Portals & Dedicated Modules</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '6px' }}>
                Dedicated standalone portals engineered for students, verifying employers, institutional registrars, and national regulatory watchdogs. Select any portal below or use direct keyboard hotkeys.
              </p>
            </div>

            <div className="dl-portal-directory-grid">
              {/* Portal 1: Instant Verifier */}
              <div 
                className="dl-portal-card" 
                onClick={() => navigateTo('verifier')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('verifier'); }}
              >
                <div>
                  <div className="dl-portal-top">
                    <div className="dl-portal-icon" style={{ background: '#e0f2fe', color: '#0052cc' }}>
                      <Shield size={24} />
                    </div>
                    <span className="dl-portal-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                      Portal 1 • Key 1 / V
                    </span>
                  </div>
                  <h4 className="dl-portal-title">Public Instant Verifier</h4>
                  <p className="dl-portal-desc">
                    Instant sub-200ms cryptographic validation of technical diplomas, degrees, and marksheets against AICTE's SHA-256 canonical hash ledger. Legally at par under Rule 9A of IT Rules 2016.
                  </p>
                </div>
                <div className="dl-portal-footer">
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Latency SLA: &lt; 200ms</span>
                  <span className="dl-portal-link">
                    Open Verifier Console <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* Portal 2: Student Portal */}
              <div 
                className="dl-portal-card" 
                onClick={() => navigateTo('student')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('student'); }}
              >
                <div>
                  <div className="dl-portal-top">
                    <div className="dl-portal-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                      <User size={24} />
                    </div>
                    <span className="dl-portal-badge" style={{ background: '#ecfdf5', color: '#047857' }}>
                      Portal 2 • Key 2 / S
                    </span>
                  </div>
                  <h4 className="dl-portal-title">Student Portal & APAAR Smart Card</h4>
                  <p className="dl-portal-desc">
                    Access your official holographic APAAR Smart ID card, monitor Academic Bank of Credits (ABC) live ledger balance, download DSC-signed PDFs, and manage DPDP Act 2023 DEPA privacy consents.
                  </p>
                </div>
                <div className="dl-portal-footer">
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>DPDP Act 2023 Compliant</span>
                  <span className="dl-portal-link" style={{ color: '#059669' }}>
                    Access Student Desk <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* Portal 3: Institution Nodal Desk */}
              <div 
                className="dl-portal-card" 
                onClick={() => navigateTo('institution')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('institution'); }}
              >
                <div>
                  <div className="dl-portal-top">
                    <div className="dl-portal-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                      <Building2 size={24} />
                    </div>
                    <span className="dl-portal-badge" style={{ background: '#fffbeb', color: '#b45309' }}>
                      Portal 3 • Key 3 / I
                    </span>
                  </div>
                  <h4 className="dl-portal-title">Institution Nodal Officer Desk</h4>
                  <p className="dl-portal-desc">
                    4-Stage automated batch ingestion engine: DSC X.509 signature verification, API Setu demographic matching, SHA-256 sealing, and NEP 2020 student inter-college credit mobility.
                  </p>
                </div>
                <div className="dl-portal-footer">
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>1,200+ Registered Awarding Bodies</span>
                  <span className="dl-portal-link" style={{ color: '#d97706' }}>
                    Open Nodal Portal <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* Portal 4: AICTE Admin Sentinel */}
              <div 
                className="dl-portal-card" 
                onClick={() => navigateTo('admin')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('admin'); }}
              >
                <div>
                  <div className="dl-portal-top">
                    <div className="dl-portal-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                      <Scale size={24} />
                    </div>
                    <span className="dl-portal-badge" style={{ background: '#f5f3ff', color: '#6d28d9' }}>
                      Portal 4 • Key 4 / D
                    </span>
                  </div>
                  <h4 className="dl-portal-title">AICTE Directorate Sentinel</h4>
                  <p className="dl-portal-desc">
                    National oversight dashboard with real-time academic fraud detection algorithms, duplicate enrollment alerts, MeghRaj infrastructure health, and CERT-In 180-day immutable audit logs.
                  </p>
                </div>
                <div className="dl-portal-footer">
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>CERT-In 180-Day Immutable</span>
                  <span className="dl-portal-link" style={{ color: '#7c3aed' }}>
                    Open Admin Sentinel <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* Portal 5: Statutory & Ecosystem Compliance */}
              <div 
                className="dl-portal-card" 
                onClick={() => navigateTo('about')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateTo('about'); }}
              >
                <div>
                  <div className="dl-portal-top">
                    <div className="dl-portal-icon" style={{ background: '#ecfeff', color: '#0891b2' }}>
                      <Info size={24} />
                    </div>
                    <span className="dl-portal-badge" style={{ background: '#ecfeff', color: '#0e7490' }}>
                      Portal 5 • Key 5 / A
                    </span>
                  </div>
                  <h4 className="dl-portal-title">About Us & Statutory Compliance</h4>
                  <p className="dl-portal-desc">
                    Explore the statutory framework: National Education Policy 2020 vision, Rule 9A legal admissibility, isolated UIDAI Aadhaar Data Vault architecture, and DPDP Act 2023 regulations.
                  </p>
                </div>
                <div className="dl-portal-footer">
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Sovereign Framework</span>
                  <span className="dl-portal-link" style={{ color: '#0891b2' }}>
                    Read Documentation <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              9. SECTION 7: EXPLORE DOCUMENTS BY CATEGORIES
             ================================================================= */}
          <section className="dl-section">
            <div className="dl-section-header">
              <span className="dl-section-tag">AICTE Academic Ecosystem</span>
              <h3 className="dl-section-title">Explore Documents by Categories</h3>
            </div>

            <div className="dl-category-grid">
              <div 
                className="dl-category-card"
                onClick={() => navigateTo('student')}
              >
                <div className="dl-category-left">
                  <div className="dl-category-icon">
                    <UserCheck size={22} color="#0052cc" />
                  </div>
                  <div className="dl-category-text">
                    <h3>Identity Documents</h3>
                    <p>APAAR ID, ABC ID & Aadhaar Vault Reference</p>
                  </div>
                </div>
                <ChevronRight size={18} className="dl-category-chevron" />
              </div>

              <div 
                className="dl-category-card"
                onClick={() => navigateTo('verifier')}
              >
                <div className="dl-category-left">
                  <div className="dl-category-icon" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                    <GraduationCap size={22} color="#059669" />
                  </div>
                  <div className="dl-category-text">
                    <h3>Education & Transcripts</h3>
                    <p>AICTE B.Tech, M.Tech & Diploma Marksheets</p>
                  </div>
                </div>
                <ChevronRight size={18} className="dl-category-chevron" />
              </div>

              <div 
                className="dl-category-card"
                onClick={() => navigateTo('institution')}
              >
                <div className="dl-category-left">
                  <div className="dl-category-icon" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                    <BarChart3 size={22} color="#d97706" />
                  </div>
                  <div className="dl-category-text">
                    <h3>Academic Bank of Credits</h3>
                    <p>Accumulation, Transfer & Redemption</p>
                  </div>
                </div>
                <ChevronRight size={18} className="dl-category-chevron" />
              </div>

              <div 
                className="dl-category-card"
                onClick={() => {
                  navigateTo('verifier');
                  executeVerification(false);
                }}
              >
                <div className="dl-category-left">
                  <div className="dl-category-icon" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
                    <Shield size={22} color="#7c3aed" />
                  </div>
                  <div className="dl-category-text">
                    <h3>Instant Verification</h3>
                    <p>Sub-200ms SHA-256 Tamper-Proof Audit</p>
                  </div>
                </div>
                <ChevronRight size={18} className="dl-category-chevron" />
              </div>

              <div 
                className="dl-category-card"
                onClick={() => navigateTo('institution')}
              >
                <div className="dl-category-left">
                  <div className="dl-category-icon" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                    <Landmark size={22} color="#2563eb" />
                  </div>
                  <div className="dl-category-text">
                    <h3>AICTE Institution Approvals</h3>
                    <p>Extension of Approval (EOA) Letters</p>
                  </div>
                </div>
                <ChevronRight size={18} className="dl-category-chevron" />
              </div>

              <div 
                className="dl-category-card"
                onClick={() => navigateTo('student')}
              >
                <div className="dl-category-left">
                  <div className="dl-category-icon" style={{ background: '#fdf2f8', borderColor: '#fbcfe8' }}>
                    <Lock size={22} color="#db2777" />
                  </div>
                  <div className="dl-category-text">
                    <h3>DEPA Consent Artefacts</h3>
                    <p>DPDP Act 2023 Student Data Permissions</p>
                  </div>
                </div>
                <ChevronRight size={18} className="dl-category-chevron" />
              </div>
            </div>
          </section>

          {/* =================================================================
              10. SECTION 8: APP DOWNLOAD & PARTNER BANNER
             ================================================================= */}
          <section className="dl-section">
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              <div className="dl-partner-banner">
                <div>
                  <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                    For Awarding Institutions
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '12px 0 8px' }}>
                    Become an Academic Bank of Credits Partner Institution
                  </h3>
                  <p style={{ fontSize: '0.88rem', opacity: 0.9, lineHeight: 1.5, marginBottom: '18px' }}>
                    Join 1,200+ universities and polytechnics. Automate student credential issuance, credit ledger syncing, and instant graduate verifications on DigiLocker NAD.
                  </p>
                  <button 
                    className="btn-dl-primary" 
                    style={{ background: '#ffffff', color: '#0052cc', borderColor: '#ffffff', fontWeight: 800 }}
                    onClick={() => navigateTo('institution')}
                  >
                    Register as Nodal Issuer
                  </button>
                </div>
              </div>

              <div className="dl-app-section">
                <div style={{ textAlign: 'center' }}>
                  <div 
                    style={{ width: '96px', height: '96px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '6px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    onClick={() => setShowQrModal(true)}
                  >
                    <QrCode size={78} color="#0f172a" />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Scan to Download</span>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>Download APAAR • DigiLocker App</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Access your APAAR ID, academic credits, degrees, and marksheets anytime on your smartphone.
                  </p>

                  <div className="dl-store-badges">
                    <a href="https://play.google.com/store/apps/details?id=com.digilocker.android" target="_blank" rel="noopener noreferrer" className="dl-badge-btn">
                      <span>Google Play</span>
                    </a>
                    <a href="https://apps.apple.com/in/app/digilocker/id1320618078" target="_blank" rel="noopener noreferrer" className="dl-badge-btn">
                      <span>App Store</span>
                    </a>
                    <a href="https://apps.gov.in" target="_blank" rel="noopener noreferrer" className="dl-badge-btn">
                      <span>Gov.in Store</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              11. SECTION 9: CITIZEN SUPPORT & FREQUENTLY ASKED QUESTIONS
             ================================================================= */}
          <section className="dl-section" style={{ paddingTop: '10px' }}>
            <div className="dl-section-header">
              <span className="dl-section-tag">Citizen Support & FAQs</span>
              <h3 className="dl-section-title">Frequently Asked Questions</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Essential guidance regarding Academic Bank of Credits, APAAR ID, instant verification, and data protection under NEP 2020.
              </p>
            </div>

            <div className="dl-faq-container">
              {[
                {
                  id: 1,
                  q: "What is an Academic Credit?",
                  a: "An Academic Credit is a standard unit of measurement of learning outcomes. In accordance with National Education Policy (NEP 2020) and UGC guidelines, one academic credit corresponds to approximately 30 hours of total learning effort (including lectures, tutorials, laboratory work, self-study, or internships). Credits are deposited in the student's ABC account by authorized Awarding Institutions."
                },
                {
                  id: 2,
                  q: "What is APAAR ID and how does it integrate with the Academic Bank of Credits (ABC)?",
                  a: "APAAR (Automated Permanent Academic Account Registry) is a unique 12-digit lifelong student identifier created by the Ministry of Education. It serves as the primary key that links a learner's primary, secondary, higher education, and vocational skill records with their Academic Bank of Credits account, enabling seamless accumulation and transfer of credits across institutions."
                },
                {
                  id: 3,
                  q: "How does the sub-200ms cryptographic verification work without exposing sensitive PII?",
                  a: "The verifier computes a SHA-256 hash of the presented academic credentials and matches it against the immutable canonical ledger anchored on MeghRaj GI Cloud. No sensitive personal demographic data is exposed during basic public verification unless authorized via DPDP Act 2023 DEPA consent."
                },
                {
                  id: 4,
                  q: "Are credentials verified on ABC and APAAR legally valid for employment and university admissions?",
                  a: "Yes. Under Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules 2016, electronic certificates and credit awards issued on DigiLocker/ABC/APAAR are legally deemed to be at par with original physical certificates across all Union and State Government recruiting bodies, universities, and visa embassies."
                },
                {
                  id: 5,
                  q: "How can Awarding Institutions upload credit data and join the Video Conference desk?",
                  a: "Awarding Institutions can onboard via DigiLocker NAD using authorized registrar credentials. A live Video Conference support desk operates Monday to Friday from 2:30 PM to 5:00 PM IST to assist nodal officers with schema formatting, API Setu integration, and bulk uploads."
                },
                {
                  id: 6,
                  q: "How is Aadhaar data protected under UIDAI and DPDP Act 2023 regulations?",
                  a: "Strict UIDAI circular compliance is enforced. 12-digit Aadhaar numbers are never stored in application tables. All demographic mappings reside in a dedicated, isolated Aadhaar Data Vault schema encrypted with AES-256-GCM. Internal queries only reference blinded SHA-256 HMAC tokens, with complete 180-day immutable audit trails."
                }
              ].map(faq => (
                <div key={faq.id} className={`dl-faq-item ${openFaq === faq.id ? 'active' : ''}`}>
                  <div 
                    className="dl-faq-question"
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  >
                    <span>{faq.q}</span>
                    <ChevronRight 
                      size={18} 
                      style={{ 
                        transform: openFaq === faq.id ? 'rotate(90deg)' : 'none', 
                        transition: 'transform 0.2s ease',
                        color: 'var(--dl-blue)'
                      }} 
                    />
                  </div>
                  {openFaq === faq.id && (
                    <div className="dl-faq-answer">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          PAGE 2: PUBLIC INSTANT VERIFIER (SEPARATE PAGE)
         ===================================================================== */}
      {activePage === 'verifier' && (
        <div id="main-content" className="dl-page-enter">
          {/* Subpage Header Banner & Breadcrumbs */}
          <div className="dl-page-header-bar">
            <div className="dl-page-header-inner">
              <div className="dl-breadcrumbs">
                <span className="dl-breadcrumb-link" onClick={() => navigateTo('home')}>
                  <Home size={14} /> Home
                </span>
                <span>/</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>Public Instant Verifier</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="dl-page-header-title">
                    <Shield size={28} /> Instant Zero-Red-Tape Academic Verifier
                  </h1>
                  <p className="dl-page-header-desc">
                    Cryptographic verification of AICTE academic transcripts, diplomas, and degrees in &lt; 200ms SLA. Certified under Rule 9A of IT Rules 2016.
                  </p>
                </div>
                <button className="dl-back-btn" onClick={() => navigateTo('home')}>
                  <ArrowLeft size={16} /> Back to Home (0)
                </button>
              </div>
              {renderSubpageSwitcher()}
            </div>
          </div>

          <div className="dl-section">
            <div className="dl-card" style={{ borderTop: '4px solid var(--dl-blue)' }}>
              <div className="dl-card-header">
                <div>
                  <h3 className="dl-card-title">
                    <Search size={22} color="var(--dl-blue)" /> Credential Verification Console
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
                    Enter candidate's 12-digit APAAR ID or transcript UUID to verify instantly against AICTE's canonical SHA-256 hash ledger.
                  </p>
                </div>
                <span className="dl-status-badge valid" style={{ fontSize: '0.82rem' }}>
                  <Activity size={14} /> Latency SLA: &lt; 200ms
                </span>
              </div>

              {/* Interactive Test Scenario Toolbar */}
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="#d97706" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>Interactive Test Scenarios:</span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-dl-outline"
                    style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                    onClick={() => {
                      setVerifyApaarId('908123456781');
                      setVerifyRecordId('f1e2d3c4-b5a6-9788-1234-567890abcdef');
                      setRequestFullTranscript(false);
                      setVerificationResult(null);
                    }}
                  >
                    1. Load Valid COEP Record
                  </button>
                  <button
                    type="button"
                    className="btn-dl-outline"
                    style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                    onClick={() => {
                      setVerifyApaarId('908123456781');
                      setVerifyRecordId('f1e2d3c4-b5a6-9788-1234-567890abcdef');
                      setRequestFullTranscript(true);
                      setVerificationResult(null);
                    }}
                  >
                    2. Request Full Marksheet (DEPA)
                  </button>
                  <button
                    type="button"
                    style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', padding: '5px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => executeVerification(true)}
                  >
                    ⚡ 3. Simulate Tampered Attack
                  </button>
                </div>
              </div>

              {/* Verification Form */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="dl-form-group">
                  <label>12-Digit Student APAAR ID</label>
                  <input
                    type="text"
                    className="dl-form-control"
                    value={verifyApaarId}
                    onChange={(e) => setVerifyApaarId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') executeVerification(false);
                    }}
                    placeholder="e.g. 908123456781"
                  />
                </div>
                <div className="dl-form-group">
                  <label>Academic Record UUID (or Transcript Serial)</label>
                  <input
                    type="text"
                    className="dl-form-control"
                    value={verifyRecordId}
                    onChange={(e) => setVerifyRecordId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') executeVerification(false);
                    }}
                    placeholder="e.g. f1e2d3c4-b5a6-9788-1234-567890abcdef"
                  />
                </div>
              </div>

              <div className="dl-form-group">
                <label>Or Paste QR Data / W3C Verifiable Credential JSON-LD</label>
                <textarea
                  className="dl-form-control"
                  rows={2}
                  value={verifyQrInput}
                  onChange={(e) => setVerifyQrInput(e.target.value)}
                  placeholder='{"@context":["https://www.w3.org/2018/credentials/v1"],"id":"urn:uuid:f1e2d3c4...","issuer":"did:gov:in:aicte:..."}'
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={requestFullTranscript}
                    onChange={(e) => setRequestFullTranscript(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--dl-blue)' }}
                  />
                  <span><strong>Request Confidential Marksheet Breakdown</strong> (Evaluates DPDP Act DEPA consent)</span>
                </label>

                <button
                  className="btn-dl-primary"
                  onClick={() => executeVerification(false)}
                  disabled={verifying}
                  style={{ minWidth: '200px' }}
                >
                  {verifying ? <RefreshCw size={16} className="spin-loader" /> : <Shield size={16} />}
                  Verify Now (<Clock size={12} style={{ display: 'inline', margin: '0 2px' }} /> &lt;200ms)
                </button>
              </div>
            </div>

            {/* VERIFICATION RESULT SHOWCASE */}
            {verificationResult && (
              <div className="dl-card" style={{
                borderLeft: `6px solid ${
                  verificationResult.status === 'VALID'
                    ? '#16a34a'
                    : verificationResult.status === 'TAMPERED'
                    ? '#dc2626'
                    : '#ea580c'
                }`,
                background: verificationResult.status === 'TAMPERED' ? '#fff5f5' : '#ffffff'
              }}>
                <div className="dl-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {verificationResult.status === 'VALID' ? (
                      <div className="dl-verified-stamp">
                        <CheckCircle2 size={18} color="#1b5e20" />
                        <span>✓ AICTE APAAR Verified Credential</span>
                      </div>
                    ) : verificationResult.status === 'TAMPERED' ? (
                      <span className="dl-status-badge tampered" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                        <XCircle size={18} /> TAMPERING DETECTED • FORGERY ALERT
                      </span>
                    ) : (
                      <span className="dl-status-badge warning" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                        <Lock size={18} /> DEPA CONSENT REQUIRED (DPDP ACT 2023)
                      </span>
                    )}

                    <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      Latency: <strong>{verificationResult.latencyMs}ms</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-dl-outline"
                      style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                      onClick={() => setShowJsonLdModal(true)}
                    >
                      <FileText size={13} /> View W3C JSON-LD Proof
                    </button>
                  </div>
                </div>

                {verificationResult.status === 'TAMPERED' ? (
                  <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px' }}>
                    <h4 style={{ color: '#991b1b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertOctagon size={18} /> Cryptographic Proof Failure
                    </h4>
                    <p style={{ color: '#7f1d1d', fontSize: '0.88rem', marginBottom: '12px' }}>
                      {verificationResult.message}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                        <span style={{ color: '#991b1b', fontWeight: 700 }}>AICTE Sealed Hash:</span>
                        <div style={{ wordBreak: 'break-all', marginTop: '4px' }}>{verificationResult.cryptographicProof.storedHash}</div>
                      </div>
                      <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                        <span style={{ color: '#991b1b', fontWeight: 700 }}>Recomputed Hash (Tampered Payload):</span>
                        <div style={{ wordBreak: 'break-all', marginTop: '4px' }}>{verificationResult.cryptographicProof.recomputedHash}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0f6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px 20px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="dl-verified-seal">
                          <CheckCircle2 size={24} color="#0052cc" />
                          <span>AICTE<br />VERIFIED</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.76rem', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase' }}>
                            Legally At Par with Original Physical Document as per Rule 9A of IT Rules 2016
                          </div>
                          <h4 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                            {verificationResult.credentialSummary.programName}
                          </h4>
                          <div style={{ fontSize: '0.86rem', color: '#475569' }}>
                            {verificationResult.credentialSummary.institutionName} • AISHE: {verificationResult.credentialSummary.aisheCode}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>National Registry URI:</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: '#0052cc', fontWeight: 700 }}>
                          {verificationResult.credentialSummary.digilockerUri}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
                      <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Student Name (Masked):</div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{verificationResult.credentialSummary.studentNameMasked}</div>
                      </div>
                      <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>APAAR ID:</div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', fontFamily: 'var(--font-mono)', color: 'var(--dl-blue)' }}>
                          {verificationResult.credentialSummary.apaarId}
                        </div>
                      </div>
                      <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Semester / Academic Year:</div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                          Sem {verificationResult.credentialSummary.semester} ({verificationResult.credentialSummary.academicYear})
                        </div>
                      </div>
                      <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Credits Accumulated:</div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#16a34a' }}>
                          {verificationResult.credentialSummary.totalCreditsAccumulated} Credits
                        </div>
                      </div>
                    </div>

                    {verificationResult.confidentialData ? (
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                            Confidential Grade Breakdown (DEPA Consent Active):
                          </span>
                          <span style={{ fontSize: '0.84rem' }}>
                            SGPA: <strong>{verificationResult.confidentialData.sgpa}</strong> | CGPA: <strong>{verificationResult.confidentialData.cgpa}</strong>
                          </span>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                          <thead>
                            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                              <th style={{ padding: '8px 10px', borderBottom: '1px solid #cbd5e1' }}>Course Code</th>
                              <th style={{ padding: '8px 10px', borderBottom: '1px solid #cbd5e1' }}>Course Title</th>
                              <th style={{ padding: '8px 10px', borderBottom: '1px solid #cbd5e1' }}>Credits</th>
                              <th style={{ padding: '8px 10px', borderBottom: '1px solid #cbd5e1' }}>Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {verificationResult.confidentialData.courses.map((c, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>{c.code}</td>
                                <td style={{ padding: '8px 10px' }}>{c.title}</td>
                                <td style={{ padding: '8px 10px' }}>{c.credits}</td>
                                <td style={{ padding: '8px 10px', fontWeight: 800, color: 'var(--dl-blue)' }}>{c.grade}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : requestFullTranscript ? (
                      <div style={{ padding: '14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', color: '#b45309', fontSize: '0.86rem' }}>
                        <Lock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                        Detailed marksheet and grades are withheld under Section 6 of DPDP Act 2023. The student must grant active DEPA consent before grade-level disclosures are unlocked.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          PAGE 3: STUDENT PORTAL (SEPARATE PAGE)
         ===================================================================== */}
      {activePage === 'student' && (
        <div id="main-content" className="dl-page-enter">
          <div className="dl-page-header-bar">
            <div className="dl-page-header-inner">
              <div className="dl-breadcrumbs">
                <span className="dl-breadcrumb-link" onClick={() => navigateTo('home')}>
                  <Home size={14} /> Home
                </span>
                <span>/</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>Student Portal & APAAR Smart Card</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="dl-page-header-title">
                    <User size={28} /> Student Academic Dashboard & APAAR Card
                  </h1>
                  <p className="dl-page-header-desc">
                    Access your official digital identity, manage credit bank accumulations, download digitally signed credentials, and control third-party access under DPDP Act 2023.
                  </p>
                </div>
                <button className="dl-back-btn" onClick={() => navigateTo('home')}>
                  <ArrowLeft size={16} /> Back to Home (0)
                </button>
              </div>
              {renderSubpageSwitcher()}
            </div>
          </div>

          <div className="dl-section">
            {/* APAAR Digital Smart Card */}
            <div className="dl-card" style={{ borderTop: '4px solid var(--dl-blue)' }}>
              <div className="dl-card-header">
                <div>
                  <h3 className="dl-card-title">
                    <Award size={22} color="var(--dl-blue)" /> Official APAAR Digital Identity Smart Card
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
                    Authentic sovereign student identity issued by Ministry of Education & AICTE, Government of India.
                  </p>
                </div>
                <div className="dl-verified-stamp">
                  <CheckCircle2 size={16} color="#1b5e20" />
                  <span>AICTE Verified</span>
                </div>
              </div>

              {/* Physical/Digital Smart Card Mockup */}
              <div className="dl-apaar-card">
                <div className="dl-holo-band" />
                <div className="dl-apaar-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🇮🇳</span>
                    <div>
                      <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Government of India • Ministry of Education</div>
                      <div style={{ fontSize: '0.98rem', fontWeight: 800 }}>Automated Permanent Academic Account Registry (APAAR)</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px' }}>
                    AICTE • ABC
                  </div>
                </div>

                <div className="dl-apaar-body">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '115px', height: '135px', background: '#dbeafe', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--dl-blue)', margin: '0 auto' }}>
                      <User size={52} color="#0052cc" />
                      <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#1e40af', marginTop: '4px' }}>STUDENT PHOTO</span>
                    </div>
                  </div>

                  <div className="dl-apaar-details">
                    <div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Student Name:</span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Aarav Rajesh Sharma</h3>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>12-Digit APAAR ID:</span>
                      <div>
                        <span className="dl-apaar-id-number">9081 2345 6781</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Institution:</span>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>COEP Tech University, Pune</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Program & Year:</span>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>B.Tech CSE (3rd Year)</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>ABC Account ID:</span>
                        <div style={{ fontSize: '0.84rem', fontFamily: 'var(--font-mono)' }}>ABC-8849-0192</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Credits Balance:</span>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#16a34a' }}>110.0 Credits</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{ width: '115px', height: '115px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      onClick={() => setShowQrModal(true)}
                      title="Click to expand QR Code"
                    >
                      <QrCode size={88} color="#0f172a" />
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                      Click to Expand QR
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button
                  className="btn-dl-primary"
                  onClick={() => {
                    showToast('PDF Download Initiated', 'Official APAAR Smart Card PDF with DSC signature generated.', 'success');
                  }}
                >
                  <Download size={16} /> Download Digitally Signed PDF
                </button>
                <button
                  className="btn-dl-outline"
                  onClick={() => setShowJsonLdModal(true)}
                >
                  <FileText size={16} /> View W3C Verifiable Credential
                </button>
                <button
                  className="btn-dl-outline"
                  onClick={() => {
                    navigator.clipboard.writeText('https://aicte.gov.in/verify/apaar/908123456781');
                    showToast('Share Link Copied', 'DEPA verification link copied to clipboard.', 'info');
                  }}
                >
                  <Share2 size={16} /> Share via DEPA Protocol
                </button>
              </div>
            </div>

            {/* DEPA Consent Manager (DPDP Act 2023) */}
            <div className="dl-card">
              <div className="dl-card-header">
                <div>
                  <h3 className="dl-card-title">
                    <Lock size={20} color="var(--dl-blue)" /> DPDP Act 2023: DEPA Consent & Privacy Manager
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
                    Control which third-party verifiers (recruiters, foreign universities) can access your confidential marksheets.
                  </p>
                </div>
                <span className="dl-status-badge info">
                  DPDP Act Section 6 Active
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {consentRequests.map(req => (
                  <div key={req.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', background: 'var(--bg-subtle)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.94rem' }}>{req.requester}</span>
                        <span className={`dl-status-badge ${req.status === 'GRANTED' ? 'valid' : 'warning'}`}>
                          {req.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        Purpose: {req.purpose}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {req.fields.map((f, i) => (
                          <span key={i} style={{ fontSize: '0.74rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: '6px' }}>{req.validity}</div>
                      <button
                        onClick={() => toggleConsent(req.id)}
                        className={req.status === 'GRANTED' ? 'btn-dl-outline' : 'btn-dl-primary'}
                        style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                      >
                        {req.status === 'GRANTED' ? 'Revoke Consent' : 'Authorize DEPA Access'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PAGE 4: INSTITUTION NODAL PORTAL (SEPARATE PAGE)
         ===================================================================== */}
      {activePage === 'institution' && (
        <div id="main-content" className="dl-page-enter">
          <div className="dl-page-header-bar">
            <div className="dl-page-header-inner">
              <div className="dl-breadcrumbs">
                <span className="dl-breadcrumb-link" onClick={() => navigateTo('home')}>
                  <Home size={14} /> Home
                </span>
                <span>/</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>Institution Nodal Portal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="dl-page-header-title">
                    <Building2 size={28} /> AICTE Institution Nodal Officer Desk
                  </h1>
                  <p className="dl-page-header-desc">
                    Execute automated bulk cohort transcript ingestion with DSC X.509 signatures, API Setu demographic checks, and NEP 2020 inter-college mobility.
                  </p>
                </div>
                <button className="dl-back-btn" onClick={() => navigateTo('home')}>
                  <ArrowLeft size={16} /> Back to Home (0)
                </button>
              </div>
              {renderSubpageSwitcher()}
            </div>
          </div>

          <div className="dl-section">
            <div className="dl-card" style={{ borderTop: '4px solid var(--dl-blue)' }}>
              <div className="dl-card-header">
                <div>
                  <h3 className="dl-card-title">
                    <Layers size={22} color="var(--dl-blue)" /> 4-Stage Automated Bulk Transcript Verification Pipeline
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
                    Bulk ingest student cohorts with DSC X.509 verification, API Setu demographic checks, SHA-256 transcript hashing, and ABC ledger sync.
                  </p>
                </div>
                <span className="dl-status-badge info">
                  Nodal Officer: Dr. V. K. Sharma (COEP)
                </span>
              </div>

              {/* 4-Stage Pipeline Progress Graphic */}
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[
                    { stage: 1, title: 'DSC Ingestion', desc: 'X.509 Class-3 signature check' },
                    { stage: 2, title: 'API Setu Match', desc: 'UIDAI/Demographic verification' },
                    { stage: 3, title: 'SHA-256 Hashing', desc: 'Tamper-proof transcript seal' },
                    { stage: 4, title: 'ABC / NAD Push', desc: 'National credit ledger push' }
                  ].map((s) => (
                    <div 
                      key={s.stage}
                      style={{
                        background: currentStage >= s.stage ? '#e0f2fe' : '#ffffff',
                        border: `1.5px solid ${currentStage >= s.stage ? '#0052cc' : '#cbd5e1'}`,
                        borderRadius: '10px',
                        padding: '14px',
                        textAlign: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: currentStage >= s.stage ? '#0052cc' : '#94a3b8',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        margin: '0 auto 8px'
                      }}>
                        {currentStage > s.stage ? <Check size={16} /> : s.stage}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: currentStage >= s.stage ? '#0052cc' : '#1e293b' }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                        {s.desc}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    className="btn-dl-primary"
                    onClick={runBulkPipeline}
                    disabled={pipelineRunning}
                    style={{ minWidth: '240px' }}
                  >
                    {pipelineRunning ? <RefreshCw size={18} className="spin-loader" /> : <Layers size={18} />}
                    {pipelineRunning ? 'Executing 4-Stage Pipeline...' : 'Process Cohort Batch (120 Students)'}
                  </button>
                </div>
              </div>

              {batchCompleted && (
                <div style={{ padding: '16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', marginBottom: '20px' }}>
                  <h4 style={{ color: '#065f46', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> Ingestion Batch Sealed & Published
                  </h4>
                  <p style={{ color: '#047857', fontSize: '0.86rem' }}>
                    120 academic credentials cryptographically sealed with SHA-256 digests. Reference tokens created in isolated Aadhaar Vault and ABC credit ledgers credited.
                  </p>
                </div>
              )}

              {/* Student Inter-University Transfer Protocol */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '10px' }}>
                  NEP 2020 Student Mobility & Lateral Transfer Protocol
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
                  <div className="dl-form-group" style={{ marginBottom: 0 }}>
                    <label>Student APAAR ID for Transfer</label>
                    <input 
                      type="text" 
                      className="dl-form-control" 
                      value={transferApaarId} 
                      onChange={(e) => setTransferApaarId(e.target.value)} 
                    />
                  </div>
                  <div className="dl-form-group" style={{ marginBottom: 0 }}>
                    <label>Target Destination Institution (AISHE Code)</label>
                    <input 
                      type="text" 
                      className="dl-form-control" 
                      value={transferTargetCollege} 
                      onChange={(e) => setTransferTargetCollege(e.target.value)} 
                    />
                  </div>
                  <button 
                    className="btn-dl-outline"
                    onClick={() => {
                      showToast('Transfer Initiated', 'NOC emitted to destination institution with sealed transcript.', 'success');
                    }}
                  >
                    Initiate Credit Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PAGE 5: AICTE ADMIN SENTINEL (SEPARATE PAGE)
         ===================================================================== */}
      {activePage === 'admin' && (
        <div id="main-content" className="dl-page-enter">
          <div className="dl-page-header-bar">
            <div className="dl-page-header-inner">
              <div className="dl-breadcrumbs">
                <span className="dl-breadcrumb-link" onClick={() => navigateTo('home')}>
                  <Home size={14} /> Home
                </span>
                <span>/</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>AICTE Directorate Sentinel</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="dl-page-header-title">
                    <Scale size={28} /> AICTE Directorate Sentinel & CERT-In Audit Logs
                  </h1>
                  <p className="dl-page-header-desc">
                    National real-time oversight, automated anomaly and fraud detection engine, and CERT-In Directive 2022 compliant 180-day immutable audit log trail.
                  </p>
                </div>
                <button className="dl-back-btn" onClick={() => navigateTo('home')}>
                  <ArrowLeft size={16} /> Back to Home (0)
                </button>
              </div>
              {renderSubpageSwitcher()}
            </div>
          </div>

          <div className="dl-section">
            <div className="dl-card" style={{ borderTop: '4px solid var(--dl-blue)' }}>
              <div className="dl-card-header">
                <div>
                  <h3 className="dl-card-title">
                    <Activity size={22} color="var(--dl-blue)" /> National Infrastructure Health & Compliance Monitor
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
                    MeghRaj GI Cloud Tier-IV Infrastructure running with zero detected downtime.
                  </p>
                </div>
                <span className="dl-status-badge valid">
                  <Shield size={14} /> CERT-In 180-Day Immutable Stream
                </span>
              </div>

              {/* Anomaly Alerts */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="#dc2626" /> National Academic Anomaly Alerts ({alerts.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {alerts.map(item => (
                    <div key={item.id} style={{ padding: '14px', border: '1px solid #fecaca', background: '#fff5f5', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, color: '#991b1b', fontSize: '0.88rem' }}>
                            [{item.severity}] {item.type}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#7f1d1d' }}>
                            APAAR: {item.apaarId}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: '#7f1d1d' }}>{item.description}</p>
                      </div>
                      <button
                        className="btn-dl-outline"
                        style={{ fontSize: '0.78rem', padding: '4px 10px', borderColor: '#f87171', color: '#b91c1c' }}
                        onClick={() => showToast('Investigation Triggered', `Notice issued to institution regarding ${item.apaarId}.`, 'warning')}
                      >
                        Issue Compliance Notice
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CERT-In Audit Logs Table */}
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={18} color="var(--dl-blue)" /> CERT-In Section 70B Immutable Audit Trail
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Log ID</th>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Actor Role</th>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Action</th>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Entity Reference</th>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Client IP</th>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>NTP Timestamp</th>
                        <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Chained HMAC-SHA256</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 1048, role: 'INSTITUTION_NODAL', action: 'BULK_INGEST', entity: 'BATCH-2026-COEP-01', ip: '10.10.12.4', time: '2026-10-24 23:55:12 IST', sig: 'a89c...4f21' },
                        { id: 1047, role: 'STUDENT', action: 'CONSENT_GRANT', entity: '0a1b2c3d-4e5f', ip: '49.36.182.9', time: '2026-10-24 23:52:45 IST', sig: 'b71a...928c' },
                        { id: 1046, role: 'VERIFIER_API', action: 'VERIFY', entity: 'f1e2d3c4-b5a6', ip: '157.240.22.35', time: '2026-10-24 23:50:01 IST', sig: 'c20d...184e' }
                      ].map((row) => (
                        <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>#{row.id}</td>
                          <td style={{ padding: '10px', fontWeight: 700 }}>{row.role}</td>
                          <td style={{ padding: '10px' }}>
                            <span className="dl-status-badge valid" style={{ fontSize: '0.74rem' }}>{row.action}</span>
                          </td>
                          <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>{row.entity}</td>
                          <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>{row.ip}</td>
                          <td style={{ padding: '10px' }}>{row.time}</td>
                          <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{row.sig}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PAGE 6: ABOUT US & ECOSYSTEM (SEPARATE PAGE)
         ===================================================================== */}
      {activePage === 'about' && (
        <div id="main-content" className="dl-page-enter">
          <div className="dl-page-header-bar">
            <div className="dl-page-header-inner">
              <div className="dl-breadcrumbs">
                <span className="dl-breadcrumb-link" onClick={() => navigateTo('home')}>
                  <Home size={14} /> Home
                </span>
                <span>/</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>About & Ecosystem Compliance</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="dl-page-header-title">
                    <Info size={28} /> About AICTE APAAR Sovereign Platform
                  </h1>
                  <p className="dl-page-header-desc">
                    Comprehensive overview of India's Automated Permanent Academic Account Registry under National Education Policy (NEP 2020) and statutory regulations.
                  </p>
                </div>
                <button className="dl-back-btn" onClick={() => navigateTo('home')}>
                  <ArrowLeft size={16} /> Back to Home (0)
                </button>
              </div>
              {renderSubpageSwitcher()}
            </div>
          </div>

          <div className="dl-section">
            <div className="dl-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '14px', color: 'var(--dl-blue)' }}>
                National Mission & Vision
              </h3>
              <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Under the National Education Policy 2020 (NEP 2020), the Automated Permanent Academic Account Registry (APAAR) is envisioned as a lifelong digital identity for every student in India. In close alignment with the Academic Bank of Credits (ABC), APAAR digitally records all academic credits earned by a student throughout their educational journey across 11,420+ AICTE-approved institutions and universities nationwide.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px 0' }}>
                <div style={{ background: '#f0f6ff', padding: '18px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <h4 style={{ fontWeight: 800, color: '#0369a1', marginBottom: '6px' }}>Rule 9A Legal Standing</h4>
                  <p style={{ fontSize: '0.84rem', color: '#334155' }}>
                    Documents issued on DigiLocker APAAR are legally at par with original physical certificates under Rule 9A of the Information Technology Rules, 2016.
                  </p>
                </div>
                <div style={{ background: '#ecfdf5', padding: '18px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                  <h4 style={{ fontWeight: 800, color: '#065f46', marginBottom: '6px' }}>UIDAI Aadhaar Data Vault</h4>
                  <p style={{ fontSize: '0.84rem', color: '#334155' }}>
                    Strict isolation of Aadhaar data in dedicated database schemas with AES-256-GCM encryption and blind HMAC indexing.
                  </p>
                </div>
                <div style={{ background: '#fffbeb', padding: '18px', borderRadius: '10px', border: '1px solid #fde68a' }}>
                  <h4 style={{ fontWeight: 800, color: '#92400e', marginBottom: '6px' }}>DPDP Act 2023 Compliance</h4>
                  <p style={{ fontSize: '0.84rem', color: '#334155' }}>
                    DEPA (Data Empowerment and Protection Architecture) consent controls give students total sovereignty over their marksheet disclosures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: LOGIN / REGISTER (MERIPEHCHAAN SSO)
         ===================================================================== */}
      {showLoginModal && (
        <div className="dl-modal-overlay">
          <div className="dl-modal-box">
            <div className="dl-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={20} color="var(--dl-blue)" />
                <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>National Citizen Authentication Gateway</h4>
              </div>
              <button 
                onClick={() => setShowLoginModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}
              >
                ✕
              </button>
            </div>

            <div className="dl-modal-body">
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '20px' }}>
                <button
                  className={`dl-portal-tab ${loginRole === 'SSO' ? 'active' : ''}`}
                  onClick={() => setLoginRole('SSO')}
                >
                  MeriPehchaan (Jan Parichay)
                </button>
                <button
                  className={`dl-portal-tab ${loginRole === 'STUDENT' ? 'active' : ''}`}
                  onClick={() => setLoginRole('STUDENT')}
                >
                  Student Aadhaar / APAAR
                </button>
                <button
                  className={`dl-portal-tab ${loginRole === 'INSTITUTION' ? 'active' : ''}`}
                  onClick={() => setLoginRole('INSTITUTION')}
                >
                  Institution Nodal DSC
                </button>
              </div>

              {loginRole === 'SSO' && (
                <div>
                  <div style={{ textAlign: 'center', padding: '16px', background: '#f0f6ff', border: '1px solid #bfdbfe', borderRadius: '10px', marginBottom: '20px' }}>
                    <h4 style={{ color: '#0369a1', marginBottom: '4px' }}>National Single Sign-On (MeriPehchaan)</h4>
                    <p style={{ fontSize: '0.84rem', color: '#475569' }}>
                      One login for all Government services. Authenticate via Aadhaar KYC, DigiLocker, or Jan Parichay credentials.
                    </p>
                  </div>
                  <button
                    className="btn-dl-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    onClick={() => {
                      setAuthenticatedUser({ name: 'Aarav Sharma', role: 'STUDENT', id: '908123456781' });
                      setShowLoginModal(false);
                      navigateTo('student');
                      showToast('Login Successful', 'Authenticated via MeriPehchaan SSO (Jan Parichay).', 'success');
                    }}
                  >
                    Authenticate with MeriPehchaan SSO
                  </button>
                </div>
              )}

              {loginRole === 'STUDENT' && (
                <div>
                  <div className="dl-form-group">
                    <label>12-Digit Student APAAR ID / Aadhaar Number</label>
                    <input 
                      type="text" 
                      className="dl-form-control" 
                      defaultValue="908123456781" 
                      placeholder="e.g. 908123456781" 
                    />
                  </div>
                  <div className="dl-form-group">
                    <label>One Time Password (Aadhaar Linked Mobile OTP)</label>
                    <input 
                      type="password" 
                      className="dl-form-control" 
                      defaultValue="894120" 
                      placeholder="Enter 6-digit OTP" 
                    />
                  </div>
                  <button
                    className="btn-dl-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    onClick={() => {
                      setAuthenticatedUser({ name: 'Aarav Sharma', role: 'STUDENT', id: '908123456781' });
                      setShowLoginModal(false);
                      navigateTo('student');
                      showToast('Login Successful', 'Welcome Aarav Sharma! Your APAAR documents are loaded.', 'success');
                    }}
                  >
                    Verify OTP & Enter Student Portal
                  </button>
                </div>
              )}

              {loginRole === 'INSTITUTION' && (
                <div>
                  <div className="dl-form-group">
                    <label>Institution AISHE Code</label>
                    <input 
                      type="text" 
                      className="dl-form-control" 
                      defaultValue="C-41584" 
                      placeholder="e.g. C-41584 (COEP Technological University)" 
                    />
                  </div>
                  <div className="dl-form-group">
                    <label>Digital Signature Certificate (DSC) e-Pass Token</label>
                    <select className="dl-form-control">
                      <option>COEP_OFFICER_CLASS3_SIGNING.cer (e-Pass 2003 Token)</option>
                      <option>ANNA_UNIV_REGISTRAR_X509.cer</option>
                      <option>VJTI_NODAL_OFFICER_SIGNING.cer</option>
                    </select>
                  </div>
                  <button
                    className="btn-dl-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    onClick={() => {
                      setAuthenticatedUser({ name: 'Dr. V. K. Sharma', role: 'NODAL', id: 'C-41584' });
                      setShowLoginModal(false);
                      navigateTo('institution');
                      showToast('DSC Authenticated', 'COEP Institution Nodal Officer workspace unlocked.', 'success');
                    }}
                  >
                    Login with Cryptographic DSC Token
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: KEYBOARD SHORTCUTS HELP MODAL
         ===================================================================== */}
      {showShortcutsModal && (
        <div className="dl-modal-overlay">
          <div className="dl-modal-box">
            <div className="dl-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Command size={18} color="var(--dl-blue)" />
                <h4 style={{ fontWeight: 800 }}>Keyboard Navigation & Hotkeys</h4>
              </div>
              <button 
                onClick={() => setShowShortcutsModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}
              >
                ✕
              </button>
            </div>

            <div className="dl-modal-body">
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Navigate between separate pages and actions instantly using your keyboard:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--dl-blue)', marginTop: '4px' }}>
                  Portal Navigation (Digits & Numpad)
                </div>
                {[
                  { key: '0 / H', desc: 'Main Landing Home Page' },
                  { key: '1 / V', desc: 'Public Instant Verifier Console (< 200ms)' },
                  { key: '2 / S', desc: 'Student Portal & APAAR Smart Card' },
                  { key: '3 / I', desc: 'Institution Nodal Officer Desk' },
                  { key: '4 / D', desc: 'AICTE Directorate Sentinel & Logs' },
                  { key: '5 / A', desc: 'About Us & Statutory Compliance' },
                ].map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>{s.desc}</span>
                    <span className="dl-kbd-tag" style={{ padding: '2px 7px', fontWeight: 800 }}>{s.key}</span>
                  </div>
                ))}

                <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--dl-blue)', marginTop: '8px' }}>
                  Quick Actions & Controls
                </div>
                {[
                  { key: '/', desc: 'Quick-Focus Search Bar on Home / Verifier' },
                  { key: 'T', desc: 'Toggle Dark / Light Theme' },
                  { key: 'L / M', desc: 'Open MeriPehchaan SSO Login' },
                  { key: 'Enter', desc: 'Execute Verification / Submit Form' },
                  { key: '← / →', desc: 'Cycle through Portals or Carousel' },
                  { key: 'Space', desc: 'Pause / Resume Carousel Autoplay' },
                  { key: 'Esc', desc: 'Dismiss Active Modal / Blur / Return Home' },
                  { key: '?', desc: 'Toggle this Shortcuts Guide' }
                ].map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>{s.desc}</span>
                    <span className="dl-kbd-tag" style={{ padding: '2px 7px', fontWeight: 800 }}>{s.key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: QR CODE ZOOM MODAL
         ===================================================================== */}
      {showQrModal && (
        <div className="dl-modal-overlay">
          <div className="dl-modal-box" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div className="dl-modal-header">
              <h4 style={{ fontWeight: 800 }}>Scannable Verification QR Code</h4>
              <button 
                onClick={() => setShowQrModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}
              >
                ✕
              </button>
            </div>
            <div className="dl-modal-body" style={{ padding: '24px' }}>
              <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'inline-block', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <QrCode size={220} color="#0f172a" />
              </div>
              <div style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--dl-blue)', fontWeight: 700 }}>
                APAAR: 9081 2345 6781
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Compatible with DigiLocker Scanner & AICTE Sovereign Verification App
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: W3C VERIFIABLE CREDENTIAL JSON-LD MODAL
         ===================================================================== */}
      {showJsonLdModal && (
        <div className="dl-modal-overlay">
          <div className="dl-modal-box">
            <div className="dl-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--dl-blue)" />
                <h4 style={{ fontWeight: 800 }}>W3C Verifiable Credential (JSON-LD) Proof</h4>
              </div>
              <button 
                onClick={() => setShowJsonLdModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}
              >
                ✕
              </button>
            </div>

            <div className="dl-modal-body">
              <pre style={{
                background: '#0a172e',
                color: '#67e8f9',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                overflowX: 'auto',
                lineHeight: 1.5
              }}>
{`{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schema.org",
    "https://aicte.gov.in/credentials/v1"
  ],
  "id": "urn:uuid:f1e2d3c4-b5a6-9788-1234-567890abcdef",
  "type": ["VerifiableCredential", "AICTEAcademicCredential"],
  "issuer": "did:gov:in:aicte:repository",
  "issuanceDate": "${new Date().toISOString()}",
  "credentialSubject": {
    "id": "did:gov:in:apaar:908123456781",
    "studentAadhaarToken": "urn:adv:e89a3f21-7b04-4c19-8d12-99f5e13b4c90",
    "institutionAishe": "C-41584",
    "institutionName": "COEP Technological University, Pune",
    "program": "Bachelor of Technology in Computer Engineering",
    "academicYear": "2024-2025",
    "semester": 5,
    "creditsEarned": 22.0,
    "transcriptHash": "a94f6e1f0e2193b2a3165b4528c1f016d9b9c9f056d6d8495a6bfa9e1d8a43f8"
  },
  "evidence": [{
    "type": "DemographicMatchEvidence",
    "verifier": "API_SETU_SANDBOX",
    "status": "VERIFIED_UIDAI"
  }],
  "proof": {
    "type": "RsaSignature2018",
    "created": "${new Date().toISOString()}",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:gov:in:aicte:repository#key-1",
    "jws": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsicmR1biJdfQ...a8f192b03c"
  }
}`}
              </pre>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn-dl-primary"
                onClick={() => {
                  navigator.clipboard.writeText('W3C JSON-LD Credential Copied');
                  showToast('JSON-LD Copied', 'W3C credential payload copied to clipboard.', 'success');
                  setShowJsonLdModal(false);
                }}
              >
                Copy JSON-LD Payload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: VIDEO CONFERENCE SUPPORT DESK (FOR ACADEMIC INSTITUTIONS)
         ===================================================================== */}
      {showVcModal && (
        <div className="dl-modal-overlay">
          <div className="dl-modal-box" style={{ maxWidth: '520px' }}>
            <div className="dl-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={20} color="var(--dl-blue)" />
                <h4 style={{ fontWeight: 800 }}>ABC & NAD Video Conference Desk</h4>
              </div>
              <button 
                onClick={() => setShowVcModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-tertiary)' }}
              >
                ✕
              </button>
            </div>

            <div className="dl-modal-body" style={{ padding: '24px' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', marginTop: '5px', boxShadow: '0 0 8px #22c55e' }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#166534', fontSize: '0.94rem' }}>Live Session Active (Mon - Fri)</div>
                  <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '2px' }}>2:30 PM to 5:00 PM IST • National e-Governance Division Desk</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <div>
                  <strong>Who can attend:</strong> Nodal Officers, Registrars, and IT Administrators of recognized Universities, Colleges, and Skill Councils.
                </div>
                <div>
                  <strong>Agenda covered:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
                    <li>Institutional DigiLocker NAD account registration</li>
                    <li>CSV bulk schema validation and credit mapping</li>
                    <li>Digital Signature Certificate (DSC) X.509 token setup</li>
                    <li>Demographic student matching via API Setu</li>
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '20px', background: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Meeting URL</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--dl-blue)', fontWeight: 600 }}>nad.digilocker.gov.in/customer_support</div>
                </div>
                <a 
                  href="https://nad.digilocker.gov.in/customer_support" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-dl-primary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem', textDecoration: 'none' }}
                >
                  Join Room Now
                </a>
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn-dl-outline"
                onClick={() => setShowVcModal(false)}
                style={{ padding: '7px 16px', fontSize: '0.84rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          OFFICIAL SOVEREIGN FOOTER (ON ALL PAGES)
         ===================================================================== */}
      <footer className="dl-footer">
        <div className="dl-footer-grid">
          {/* Column 1: Academic Bank of Credits Identity */}
          <div className="dl-footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigateTo('home')}>
              <Shield size={24} color="#60a5fa" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Academic Bank of Credits</h3>
            </div>
            <p>
              ACADEMIC BANK OF CREDITS is India's sovereign credit mobility and digital academic infrastructure under National Education Policy 2020. Unified with APAAR ID, DigiLocker NAD, and National e-Governance Division (NeGD).
            </p>

            <div className="dl-iso-badges">
              <div className="dl-iso-badge">
                <Award size={14} color="#facc15" />
                <span>ISO 27001:2022</span>
              </div>
              <div className="dl-iso-badge">
                <Lock size={14} color="#60a5fa" />
                <span>ISO 27034</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="dl-footer-col">
            <h4>PAGES</h4>
            <ul className="dl-footer-links">
              <li><span onClick={() => navigateTo('home')} className="dl-footer-link" style={{ cursor: 'pointer' }}>Home (Key 0)</span></li>
              <li><span onClick={() => navigateTo('verifier')} className="dl-footer-link" style={{ cursor: 'pointer' }}>Instant Verifier (Key 1)</span></li>
              <li><span onClick={() => navigateTo('student')} className="dl-footer-link" style={{ cursor: 'pointer' }}>Student Portal (Key 2)</span></li>
              <li><span onClick={() => navigateTo('institution')} className="dl-footer-link" style={{ cursor: 'pointer' }}>Awarding Institutions (Key 3)</span></li>
              <li><span onClick={() => navigateTo('admin')} className="dl-footer-link" style={{ cursor: 'pointer' }}>AICTE Admin Sentinel (Key 4)</span></li>
              <li><span onClick={() => navigateTo('about')} className="dl-footer-link" style={{ cursor: 'pointer' }}>About Us (Key 5)</span></li>
            </ul>
          </div>

          {/* Column 3: Resources & Legal (matching abc.gov.in) */}
          <div className="dl-footer-col">
            <h4>RESOURCES & LEGAL</h4>
            <ul className="dl-footer-links">
              <li><span onClick={() => navigateTo('about')} className="dl-footer-link" style={{ cursor: 'pointer' }}>About Us</span></li>
              <li><a href="https://www.abc.gov.in/resources" target="_blank" rel="noopener noreferrer" className="dl-footer-link">NEP 2020 Credit Framework</a></li>
              <li><a href="https://directory.apisetu.gov.in/api-collection/abc" target="_blank" rel="noopener noreferrer" className="dl-footer-link">API Setu ABC Collection</a></li>
              <li><a href="https://www.digilocker.gov.in/web/about/tos" target="_blank" rel="noopener noreferrer" className="dl-footer-link">Rule 9A IT Rules 2016</a></li>
              <li><a href="https://www.digilocker.gov.in/web/about/digilocker-policy" target="_blank" rel="noopener noreferrer" className="dl-footer-link">DPDP Act 2023 Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Governance */}
          <div className="dl-footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Powered by:</span>
              <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>Digital India Corporation</strong>
            </div>

            <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6 }}>
              <div><strong>Ministry of Electronics & Information Technology</strong></div>
              <div>Government of India, New Delhi - 110003</div>
              <div>Ministry of Education (MoE)</div>
              <div>All India Council for Technical Education (AICTE)</div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Last Updated: Oct 25, 2026</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="dl-footer-bottom">
          <div>
            © 2026 Academic Bank of Credits • Ministry of Education, Government of India. In technical partnership with DigiLocker NAD & AICTE.
          </div>
          <div>
            Website maintained by National e-Governance Division (NeGD) • Hosted on MeghRaj GI Cloud Tier-IV
          </div>
        </div>
      </footer>
    </div>
  );
}
