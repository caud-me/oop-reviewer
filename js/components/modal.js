// modal.js - Screen managers for Import, Setup, and Summary (REFERENCE_APP_TSX)
class ModalManager {
  constructor(storageManager, options = {}) {
    this.storage = storageManager;
    this.onDeckImported = options.onDeckImported || (() => {});
    this.onStartSession = options.onStartSession || (() => {});
    this.onCancelImport = options.onCancelImport || (() => {});
    this.onCancelSetup = options.onCancelSetup || (() => {});
    this.onSummaryDismiss = options.onSummaryDismiss || (() => {});

    // Elements - Import Screen
    this.importScreen = document.getElementById('importScreen');
    this.btnCancelImport = document.getElementById('btnCancelImport');
    this.fileDropZone = document.getElementById('fileDropZone');
    this.fileInput = document.getElementById('deckFileInput');

    // Elements - Setup Screen
    this.setupScreen = document.getElementById('setupScreen');
    this.setupPartTitle = document.getElementById('setupPartTitle');
    this.setupPartStatus = document.getElementById('setupPartStatus');
    this.btnSequential = document.getElementById('btnOrderSequential');
    this.btnRandom = document.getElementById('btnOrderRandom');
    this.btnTogglePast = document.getElementById('btnTogglePastReview');
    this.chkIncludePastBox = document.getElementById('chkIncludePastBox');
    this.chkIncludePastSubtext = document.getElementById('chkIncludePastSubtext');
    this.btnCancelSetup = document.getElementById('btnCancelSetup');
    this.btnStartSetup = document.getElementById('btnStartSetup');

    // Elements - Summary Screen
    this.summaryScreen = document.getElementById('summaryScreen');
    this.summaryHeading = document.getElementById('summaryHeading');
    this.summaryBody = document.getElementById('summaryBody');
    this.summaryScore = document.getElementById('summaryScoreVal');
    this.summaryAccuracy = document.getElementById('summaryAccuracyVal');
    this.btnReturnSummary = document.getElementById('btnReturnSummary');

    // Elements - Welcome Screen
    this.welcomeScreen = document.getElementById('welcomeScreen');
    this.btnDismissWelcome = document.getElementById('btnDismissWelcome');
    this.btnToggleDontShowWelcome = document.getElementById('btnToggleDontShowWelcome');
    this.chkDontShowWelcomeBox = document.getElementById('chkDontShowWelcomeBox');
    this.dontShowWelcomeAgain = false;

    this.orderConfig = {
      deck: null,
      mode: 'part',
      partId: 1,
      isRandomized: false,
      includeReview: true
    };

    this.bindEvents();
  }

  bindEvents() {
    // Import events
    if (this.btnCancelImport) {
      this.btnCancelImport.onclick = () => {
        this.hideImport();
        this.onCancelImport();
      };
    }
    if (this.fileDropZone && this.fileInput) {
      this.fileDropZone.onclick = () => this.fileInput.click();
      this.fileInput.onchange = (e) => this.handleFileSelect(e);

      this.fileDropZone.ondragover = (e) => {
        e.preventDefault();
        this.fileDropZone.classList.add('dragover');
      };
      this.fileDropZone.ondragleave = () => {
        this.fileDropZone.classList.remove('dragover');
      };
      this.fileDropZone.ondrop = (e) => {
        e.preventDefault();
        this.fileDropZone.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.processFile(e.dataTransfer.files[0]);
        }
      };
    }

    // Window drag-and-drop
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.name.toLowerCase().endsWith('.json')) {
          this.processFile(file);
        }
      }
    });

    // Setup events
    if (this.btnSequential) {
      this.btnSequential.onclick = () => this.setOrderRandomized(false);
    }
    if (this.btnRandom) {
      this.btnRandom.onclick = () => this.setOrderRandomized(true);
    }
    if (this.btnTogglePast) {
      this.btnTogglePast.onclick = () => {
        this.orderConfig.includeReview = !this.orderConfig.includeReview;
        this.updatePastReviewCheckbox(this.orderConfig.includeReview);
      };
    }
    if (this.btnCancelSetup) {
      this.btnCancelSetup.onclick = () => {
        this.hideSetup();
        this.onCancelSetup();
      };
    }
    if (this.btnStartSetup) {
      this.btnStartSetup.onclick = () => {
        const cfg = { ...this.orderConfig };
        this.hideSetup();
        this.onStartSession(cfg);
      };
    }

    // Summary events
    if (this.btnReturnSummary) {
      this.btnReturnSummary.onclick = () => {
        this.hideSummary();
        this.onSummaryDismiss();
      };
    }

    // Welcome events
    if (this.btnToggleDontShowWelcome) {
      this.btnToggleDontShowWelcome.onclick = () => {
        this.dontShowWelcomeAgain = !this.dontShowWelcomeAgain;
        this.updateWelcomeCheckbox(this.dontShowWelcomeAgain);
      };
    }
    if (this.btnDismissWelcome) {
      this.btnDismissWelcome.onclick = () => {
        if (this.dontShowWelcomeAgain) {
          this.storage.setSeenWelcome(true);
        }
        this.hideWelcome();
      };
    }
  }

  // --- Import Screen ---
  showImport() {
    if (this.importScreen) this.importScreen.classList.add('active');
  }

  hideImport() {
    if (this.importScreen) this.importScreen.classList.remove('active');
  }

  handleFileSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      this.processFile(file);
    }
    e.target.value = '';
  }

  processFile(file) {
    if (!file.name.toLowerCase().endsWith('.json')) {
      alert('Please upload a valid .json deck file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const saved = this.storage.saveCustomDeck(parsed);
        this.hideImport();
        this.onDeckImported(saved);
      } catch (err) {
        alert('Failed to load JSON reviewer: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  // --- Setup Screen ---
  showSetup(deck, mode = 'part', partId = 1) {
    this.orderConfig.deck = deck;
    this.orderConfig.mode = mode;
    this.orderConfig.partId = partId;
    this.orderConfig.isRandomized = (mode === 'full');
    this.orderConfig.includeReview = true;

    const progress = this.storage.loadProgress(deck.id);

    if (mode === 'part') {
      const part = (deck.parts || []).find(p => p.id === partId);
      const title = part ? part.title : `Part ${partId}`;
      const best = progress.partMasteryScores[partId] || 0;
      const consecutive = progress.partConsecutiveMasteries[partId] || 0;

      if (this.setupPartTitle) this.setupPartTitle.textContent = title;
      if (this.setupPartStatus) {
        if (consecutive >= 2) {
          this.setupPartStatus.textContent = '🏆100% confident';
        } else if (consecutive === 1) {
          this.setupPartStatus.textContent = '50% confident';
        } else if (best > 0) {
          const partial = Math.min(49, Math.round((best / 100) * 50));
          this.setupPartStatus.textContent = `${partial}% confident`;
        } else {
          this.setupPartStatus.textContent = 'not attempted';
        }
      }
      if (this.btnTogglePast) {
        const canReview = (partId > 1);
        this.btnTogglePast.style.display = canReview ? 'flex' : 'none';
        if (canReview) {
          let extraCards = 0;
          for (let prevId = 1; prevId < partId; prevId++) {
            const pool = (deck.questions || []).filter(q => q.partId === prevId);
            extraCards += Math.min(3, pool.length);
          }
          if (this.chkIncludePastSubtext) {
            this.chkIncludePastSubtext.textContent = `This will add ${extraCards} extra ${extraCards === 1 ? 'card' : 'cards'} from past sessions.`;
          }
        }
      }
    } else {
      if (this.setupPartTitle) this.setupPartTitle.textContent = 'Full Active Recall';
      if (this.setupPartStatus) {
        this.setupPartStatus.textContent = `${progress.fullMasteryScore || 0}% full exam mastery`;
      }
      if (this.btnTogglePast) {
        this.btnTogglePast.style.display = 'none';
      }
    }

    this.setOrderRandomized(this.orderConfig.isRandomized);

    this.updatePastReviewCheckbox(this.orderConfig.includeReview);

    if (this.setupScreen) this.setupScreen.classList.add('active');
  }

  updatePastReviewCheckbox(isChecked) {
    if (!this.chkIncludePastBox) return;
    if (this.chkIncludePastBox.querySelector && !this.chkIncludePastBox.querySelector('.check-svg')) {
      this.chkIncludePastBox.innerHTML = '<svg class="check-svg" width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1.5 4L3.8 6.3L8.5 1.5" stroke="#151515" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    if (isChecked) {
      this.chkIncludePastBox.classList.add('checked');
    } else {
      this.chkIncludePastBox.classList.remove('checked');
    }
    if (this.btnTogglePast) {
      this.btnTogglePast.setAttribute('aria-checked', isChecked ? 'true' : 'false');
    }
  }

  setOrderRandomized(isRandom) {
    this.orderConfig.isRandomized = isRandom;
    if (this.btnSequential) {
      if (!isRandom) this.btnSequential.classList.add('active');
      else this.btnSequential.classList.remove('active');
      this.btnSequential.setAttribute('aria-checked', !isRandom ? 'true' : 'false');
    }
    if (this.btnRandom) {
      if (isRandom) this.btnRandom.classList.add('active');
      else this.btnRandom.classList.remove('active');
      this.btnRandom.setAttribute('aria-checked', isRandom ? 'true' : 'false');
    }
  }

  hideSetup() {
    if (this.setupScreen) this.setupScreen.classList.remove('active');
  }

  // --- Summary Screen ---
  showSummary(summary) {
    if (!summary) return;

    const acc = summary.masteryPct || 0;

    if (this.summaryHeading) {
      if (summary.isFlawless) {
        this.summaryHeading.textContent = (summary.consecutiveStreak >= 2) ? 'Mastered!' : 'Great work';
      } else {
        this.summaryHeading.textContent = 'Nice';
      }
    }

    if (this.summaryBody) {
      if (summary.isFlawless) {
        this.summaryBody.textContent = (summary.consecutiveStreak >= 2)
          ? 'Mastered! Two flawless runs in a row with zero errors or reveals.'
          : 'Flawless run with zero errors or reveals, perform one more perfect streak to mark this as master.';
      } else {
        this.summaryBody.textContent = `All cards checked in this session, practice again to reach 100% first-pass accuracy. your accuracy score is ${acc}%.`;
      }
    }

    if (this.summaryScore) this.summaryScore.textContent = (summary.sessionScore || 0).toLocaleString();
    if (this.summaryAccuracy) this.summaryAccuracy.textContent = `${acc}%`;

    if (this.summaryScreen) this.summaryScreen.classList.add('active');
  }

  hideSummary() {
    if (this.summaryScreen) this.summaryScreen.classList.remove('active');
  }

  // --- Welcome / What's New Screen ---
  showWelcome() {
    this.dontShowWelcomeAgain = false;
    this.updateWelcomeCheckbox(false);
    if (this.welcomeScreen) this.welcomeScreen.classList.add('active');
  }

  hideWelcome() {
    if (this.welcomeScreen) this.welcomeScreen.classList.remove('active');
  }

  updateWelcomeCheckbox(isChecked) {
    if (!this.chkDontShowWelcomeBox) return;
    if (this.chkDontShowWelcomeBox.querySelector && !this.chkDontShowWelcomeBox.querySelector('.check-svg')) {
      this.chkDontShowWelcomeBox.innerHTML = '<svg class="check-svg" width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1.5 4L3.8 6.3L8.5 1.5" stroke="#151515" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    if (isChecked) {
      this.chkDontShowWelcomeBox.classList.add('checked');
    } else {
      this.chkDontShowWelcomeBox.classList.remove('checked');
    }
    if (this.btnToggleDontShowWelcome) {
      this.btnToggleDontShowWelcome.setAttribute('aria-checked', isChecked ? 'true' : 'false');
    }
  }
}

if (typeof window !== 'undefined') {
  window.ModalManager = ModalManager;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ModalManager };
}
