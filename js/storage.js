// storage.js - Local storage, deck management, and progress persistence
class StorageManager {
  constructor() {
    this.RECENT_DECKS_KEY = 'cram_recent_decks_v1';
    this.ACTIVE_DECK_KEY = 'cram_active_deck_id';
    this.CUSTOM_DECK_PREFIX = 'cram_custom_deck_';
    this.PROGRESS_PREFIX = 'cram_mastery_';
    this.LEGACY_PROGRESS_PREFIX = 'oop_notion_mastery_';
  }

  initBundledDecks() {
    // Zero fake placeholders: recent list starts completely empty until user imports a deck
    return;
  }

  getRecentDecks() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(this.RECENT_DECKS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Filter out any legacy fake placeholder like discrete-structures-preview
        return Array.isArray(parsed) ? parsed.filter(d => d && d.id !== 'discrete-structures-preview') : [];
      }
    } catch (e) {
      console.warn('Failed to parse recent decks:', e);
    }
    return [];
  }

  saveRecentDecks(decks) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(this.RECENT_DECKS_KEY, JSON.stringify(decks));
    } catch (e) {
      console.warn('Failed to save recent decks:', e);
    }
  }

  touchDeck(deckId) {
    const list = this.getRecentDecks();
    const idx = list.findIndex(d => d.id === deckId);
    if (idx !== -1) {
      const deckMeta = list.splice(idx, 1)[0];
      deckMeta.lastOpened = Date.now();
      list.unshift(deckMeta);
      this.saveRecentDecks(list);
    }
  }

  formatRelativeTime(timestamp) {
    if (!timestamp) return '';
    const diff = Math.max(0, Date.now() - timestamp);
    const mins = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));

    if (mins < 60) {
      return `${Math.max(1, mins)}m`;
    }
    if (hours < 24) {
      return `${hours}h`;
    }
    if (days < 14) {
      return `${days}d`;
    }
    if (days < 60) {
      const weeks = Math.floor(days / 7);
      return `${weeks}w`;
    }
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }

  loadDeck(deckId) {
    if (!deckId) return null;

    // 1. Check bundled decks
    if (typeof window !== 'undefined' && window.BUNDLED_DECKS && window.BUNDLED_DECKS[deckId]) {
      this.touchDeck(deckId);
      return window.BUNDLED_DECKS[deckId];
    }

    // 2. Check custom decks stored in localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const customRaw = localStorage.getItem(this.CUSTOM_DECK_PREFIX + deckId);
        if (customRaw) {
          this.touchDeck(deckId);
          return JSON.parse(customRaw);
        }
      }
    } catch (e) {
      console.warn('Failed to load custom deck:', e);
    }

    // 3. Check legacy active deck key
    try {
      if (typeof localStorage !== 'undefined') {
        const legacyRaw = localStorage.getItem('oop_active_deck_json');
        if (legacyRaw) {
          const legacy = JSON.parse(legacyRaw);
          if (legacy && (legacy.id === deckId || !deckId)) {
            return legacy;
          }
        }
      }
    } catch (e) {
      // ignore
    }

    return null;
  }

  saveCustomDeck(deckData) {
    const validated = this.validateAndNormalizeDeck(deckData);
    const deckId = validated.id;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.CUSTOM_DECK_PREFIX + deckId, JSON.stringify(validated));
        localStorage.setItem(this.ACTIVE_DECK_KEY, deckId);
        // Legacy backup
        localStorage.setItem('oop_active_deck_json', JSON.stringify(validated));
      }
    } catch (e) {
      console.warn('Storage quota error saving custom deck:', e);
    }

    // Update recent decks list
    const list = this.getRecentDecks();
    const existingIdx = list.findIndex(d => d.id === deckId);
    const meta = {
      id: deckId,
      title: validated.title.length > 48 ? validated.title.slice(0, 48) + '...' : validated.title,
      fullName: validated.title,
      desc: validated.desc || '',
      cardCount: validated.questions.length,
      partsCount: validated.parts.length,
      lastOpened: Date.now(),
      isBundled: false
    };

    if (existingIdx !== -1) {
      list.splice(existingIdx, 1);
    }
    list.unshift(meta);
    this.saveRecentDecks(list);

    return validated;
  }

  getActiveDeckId() {
    try {
      if (typeof localStorage !== 'undefined') {
        const id = localStorage.getItem(this.ACTIVE_DECK_KEY);
        if (id) return id;
      }
    } catch (e) {}

    const recent = this.getRecentDecks();
    if (recent.length > 0) return recent[0].id;
    return 'javafx-gui-architecture-60';
  }

  setActiveDeckId(deckId) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.ACTIVE_DECK_KEY, deckId);
      }
    } catch (e) {}
    this.touchDeck(deckId);
  }

  validateAndNormalizeDeck(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Deck file must be a JSON object.');
    }
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error('Deck JSON must have a non-empty "questions" array.');
    }

    const title = data.title || 'Dynamix Deck';
    const desc = data.desc || '';
    const questions = data.questions.map((q, idx) => {
      let choices = [];
      if (Array.isArray(q.choices)) {
        choices = q.choices.map((c, cIdx) => {
          if (typeof c === 'string') {
            return { letter: String.fromCharCode(65 + cIdx), text: c };
          }
          return {
            letter: (c.letter || String.fromCharCode(65 + cIdx)).toUpperCase(),
            text: c.text || ''
          };
        });
      }
      return {
        id: q.id !== undefined ? q.id : idx + 1,
        partId: q.partId !== undefined ? q.partId : 1,
        partTitle: q.partTitle || ('Part ' + (q.partId || 1)),
        prompt: q.prompt || '',
        code: q.code || null,
        choices,
        answer: (q.answer || 'A').toUpperCase().trim(),
        answerText: q.answerText || '',
        explanation: q.explanation || ''
      };
    });

    let parts = Array.isArray(data.parts) && data.parts.length > 0 ? data.parts : [];
    if (parts.length === 0) {
      const partMap = {};
      questions.forEach(q => {
        if (!partMap[q.partId]) {
          partMap[q.partId] = {
            id: q.partId,
            title: q.partTitle || ('Part ' + q.partId),
            desc: '',
            range: [q.id, q.id]
          };
        } else {
          partMap[q.partId].range[1] = q.id;
        }
      });
      parts = Object.values(partMap).sort((a, b) => a.id - b.id);
    }

    return {
      id: data.id || ('deck-' + Date.now()),
      title,
      desc,
      parts,
      questions,
      referenceCodeMap: data.referenceCodeMap || {}
    };
  }

  defaultProgressState() {
    return {
      unlockedPart: 1,
      partConsecutiveMasteries: {},
      partMasteryScores: {},
      fullMasteryScore: 0,
      xp: 0,
      bestMultiplier: 1.0,
      bestStreak: 0,
      sound: true
    };
  }

  loadProgress(deckId) {
    if (!deckId) return this.defaultProgressState();
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(this.PROGRESS_PREFIX + deckId) ||
                      localStorage.getItem(this.LEGACY_PROGRESS_PREFIX + deckId);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!parsed.unlockedPart) parsed.unlockedPart = 1;
          if (!parsed.partConsecutiveMasteries) parsed.partConsecutiveMasteries = {};
          if (!parsed.partMasteryScores) parsed.partMasteryScores = {};
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load deck progress:', e);
    }
    return this.defaultProgressState();
  }

  saveProgress(deckId, state) {
    if (!deckId) return;
    try {
      if (typeof localStorage !== 'undefined') {
        const json = JSON.stringify(state);
        localStorage.setItem(this.PROGRESS_PREFIX + deckId, json);
        // Legacy compatibility
        localStorage.setItem(this.LEGACY_PROGRESS_PREFIX + deckId, json);
      }
    } catch (e) {
      console.warn('Failed to save deck progress:', e);
    }
  }

  hasSeenWelcome() {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('ar_dont_show_welcome_v2') === 'true';
      }
    } catch (e) {}
    return false;
  }

  setSeenWelcome(seen = true) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ar_dont_show_welcome_v2', seen ? 'true' : 'false');
      }
    } catch (e) {}
  }

  getFontPreference() {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('dynamix_font_preference') || 'system';
      }
    } catch (e) {}
    return 'system';
  }

  setFontPreference(font) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('dynamix_font_preference', font);
      }
    } catch (e) {}
  }

  clearAllData() {
    try {
      if (typeof localStorage !== 'undefined') {
        // Remove recent decks and active deck
        localStorage.removeItem(this.RECENT_DECKS_KEY);
        localStorage.removeItem(this.ACTIVE_DECK_KEY);
        localStorage.removeItem('oop_active_deck_json');

        // Remove custom decks and mastery scores
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith(this.CUSTOM_DECK_PREFIX) || k.startsWith(this.PROGRESS_PREFIX) || k.startsWith(this.LEGACY_PROGRESS_PREFIX))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      }
    } catch (e) {
      console.warn('Error clearing storage data:', e);
    }
  }
}

if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageManager };
}
