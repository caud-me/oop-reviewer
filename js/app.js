// app.js - Master application coordinator (REFERENCE_APP_TSX)
class ActiveRecallApp {
  constructor() {
    this.sound = new SoundEngine();
    this.storage = new StorageManager();
    this.storage.initBundledDecks();
    this.engine = new StudyEngine(this.storage, this.sound);

    this.currentDeck = null;

    // Initialize UI Components
    this.homeView = new HomeView(this.storage, {
      onSelectDeck: (deckId) => this.openDeck(deckId),
      onAddDeck: () => this.showImport()
    });

    this.deckView = new DeckView(this.storage, {
      onBack: () => this.showHome(),
      onSelectSection: (partId) => this.showSetup('part', partId),
      onStartFullExam: () => this.showSetup('full', null)
    });

    this.gameView = new GameView(this.engine, {
      onQuit: () => this.quitToDeck(),
      onSessionComplete: (summary) => this.showSummary(summary)
    });

    this.modalManager = new ModalManager(this.storage, {
      onDeckImported: (deck) => this.onDeckImported(deck),
      onStartSession: (options) => this.startSession(options),
      onCancelImport: () => this.showHome(),
      onCancelSetup: () => this.onCancelSetup(),
      onSummaryDismiss: () => this.onSummaryDismiss()
    });

    this.setupKeyboard();
    this.initServiceWorker();
    this.showHome();

    // Show what's new modal on first launch
    if (this.storage && !this.storage.hasSeenWelcome()) {
      if (this.modalManager) this.modalManager.showWelcome();
    }
  }

  initServiceWorker() {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = () => {
        navigator.serviceWorker.register('./sw.js').then((reg) => {
          const lastRefresh = localStorage.getItem('ar_last_cache_refresh');
          if (reg.installing || reg.waiting) {
            localStorage.setItem('ar_last_cache_refresh', String(Date.now()));
            console.log('[Cache] cache was recently refreshed');
          } else if (reg.active) {
            if (lastRefresh) {
              const diffSec = Math.round((Date.now() - Number(lastRefresh)) / 1000);
              if (diffSec < 120) {
                console.log(`[Cache] cache was recently refreshed (${diffSec}s ago)`);
              } else {
                console.log(`[Cache] current cache is old (${Math.round(diffSec / 60)}m ago) - will refresh when online`);
              }
            } else {
              localStorage.setItem('ar_last_cache_refresh', String(Date.now()));
              console.log('[Cache] cache was recently refreshed');
            }
          }
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'CHECK_CACHE' });
          }
        }).catch((err) => {
          console.warn('sw registration failed:', err);
        });
      };

      if (document.readyState === 'complete') {
        registerSW();
      } else {
        window.addEventListener('load', registerSW);
      }

      // Auto-refresh cache when device returns online
      window.addEventListener('online', () => {
        console.log('[Cache] device online: refreshing offline cache...');
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'REFRESH_CACHE' });
        }
      });

      // Listen for message from service worker confirming refresh
      if (navigator.serviceWorker.addEventListener) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_STATUS') {
            if (event.data.refreshed) {
              localStorage.setItem('ar_last_cache_refresh', String(Date.now()));
              console.log('[Cache] cache was recently refreshed');
            } else {
              console.log('[Cache] current cache is old; awaiting network refresh');
            }
          }
        });
      }
    }
  }

  hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    if (this.modalManager) {
      this.modalManager.hideImport();
      this.modalManager.hideSetup();
      this.modalManager.hideSummary();
      this.modalManager.hideWelcome();
    }
  }

  showHome() {
    this.hideAllScreens();
    if (this.homeView) this.homeView.show();

    const progBar = document.getElementById('viewportProgressBar');
    if (progBar) progBar.style.width = '0%';
  }

  showImport() {
    if (this.modalManager) this.modalManager.showImport();
  }

  openDeck(deckId) {
    const deck = this.storage.loadDeck(deckId);
    if (!deck) {
      alert('Deck not found.');
      return;
    }
    this.currentDeck = deck;
    this.storage.setActiveDeckId(deckId);

    this.hideAllScreens();
    if (this.deckView) this.deckView.show(deck);

    const progBar = document.getElementById('viewportProgressBar');
    if (progBar) progBar.style.width = '0%';
  }

  showSetup(mode = 'part', partId = 1) {
    if (!this.currentDeck) return;
    if (this.modalManager) this.modalManager.showSetup(this.currentDeck, mode, partId);
  }

  onCancelSetup() {
    if (this.modalManager) this.modalManager.hideSetup();
  }

  onDeckImported(deck) {
    if (this.modalManager) this.modalManager.hideImport();
    this.currentDeck = deck;
    this.openDeck(deck.id);
  }

  startSession(options) {
    if (!this.currentDeck) return;
    this.hideAllScreens();
    this.gameView.startSession(this.currentDeck, options);
  }

  quitToDeck() {
    if (this.currentDeck && this.deckView) {
      this.openDeck(this.currentDeck.id);
    } else {
      this.showHome();
    }
  }

  showSummary(summary) {
    if (this.modalManager) this.modalManager.showSummary(summary);
  }

  onSummaryDismiss() {
    if (this.modalManager) this.modalManager.hideSummary();
    if (this.currentDeck) {
      this.openDeck(this.currentDeck.id);
    } else {
      this.showHome();
    }
  }

  // Compatibility helpers
  importJsonFile(file) {
    if (!file) return;
    try {
      const data = typeof file.content === 'string' ? JSON.parse(file.content) : file;
      const saved = this.storage.saveCustomDeck(data);
      this.onDeckImported(saved);
    } catch (e) {
      console.warn('Import failed:', e);
    }
  }

  triggerImportDeck() {
    this.showImport();
  }

  showDashboard() {
    this.showHome();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      const importActive = this.modalManager.importScreen && this.modalManager.importScreen.classList.contains('active');
      const setupActive = this.modalManager.setupScreen && this.modalManager.setupScreen.classList.contains('active');
      const summaryActive = this.modalManager.summaryScreen && this.modalManager.summaryScreen.classList.contains('active');
      const welcomeActive = this.modalManager.welcomeScreen && this.modalManager.welcomeScreen.classList.contains('active');
      const reviewerActive = this.deckView.container && this.deckView.container.classList.contains('active');
      const quizActive = this.gameView.container && this.gameView.container.classList.contains('active');

      if (e.key === 'Escape') {
        if (welcomeActive) {
          this.modalManager.hideWelcome();
          return;
        }
        if (importActive) {
          this.showHome();
          return;
        }
        if (setupActive) {
          this.onCancelSetup();
          return;
        }
        if (summaryActive) {
          this.onSummaryDismiss();
          return;
        }
        if (quizActive) {
          this.gameView.btnQuit.click();
          return;
        }
        if (reviewerActive) {
          this.showHome();
          return;
        }
      }

      // Mute toggle (M)
      if (e.key === 'm' || e.key === 'M') {
        this.sound.toggleMute();
        return;
      }

      // Summary screen dismissal with Space / Enter
      if (summaryActive && (e.code === 'Space' || e.key === 'Enter')) {
        e.preventDefault();
        this.onSummaryDismiss();
        return;
      }

      // Quiz keyboard navigation
      if (quizActive) {
        const feedbackShowing = this.gameView.feedbackCard && this.gameView.feedbackCard.style.display !== 'none';

        if (feedbackShowing && (e.code === 'Space' || e.key === 'Enter')) {
          e.preventDefault();
          this.gameView.handleContinue();
          return;
        }

        if (!feedbackShowing && !this.gameView.answered) {
          if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            this.gameView.handleReveal();
            return;
          }

          if (['1', '2', '3', '4', '5'].includes(e.key)) {
            const idx = parseInt(e.key, 10) - 1;
            if (this.gameView.currentChoices && idx < this.gameView.currentChoices.length) {
              e.preventDefault();
              const choice = this.gameView.currentChoices[idx];
              this.gameView.handleAnswer(choice.letter);
            }
          }
        }
      }
    });
  }
}

// Auto-boot in browser
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.app = new ActiveRecallApp();
  });
  window.ActiveRecallApp = ActiveRecallApp;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ActiveRecallApp };
}
