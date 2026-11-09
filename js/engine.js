// engine.js - Active recall session engine, queue cycling, streak & scoring
class StudyEngine {
  constructor(storageManager, soundEngine) {
    this.storage = storageManager;
    this.sound = soundEngine;

    this.activeDeck = null;
    this.deckProgress = null;
    this.currentMode = null; // 'part' | 'full'
    this.currentPartId = null;
    this.isRandomized = true;
    this.includeReview = true;

    // Session State
    this.activeQueue = [];
    this.missedQueue = [];
    this.currentIndex = 0;
    this.passNumber = 1;
    this.answeredCurrentCard = false;

    // Mastery & Score Tracking
    this.totalUniqueCards = 0;
    this.firstTryCorrectIds = new Set();
    this.failedOrRevealedIds = new Set();
    this.perfectedIds = new Set();
    this.totalAttempts = 0;

    this.sessionScore = 0;
    this.comboStreak = 0;
    this.multiplier = 1.0;
  }

  static getReviewCardCount(deck, partId) {
    if (!deck || !deck.questions || partId <= 1) return 0;
    let total = 0;
    for (let prevId = 1; prevId < partId; prevId++) {
      const pool = deck.questions.filter(q => q.partId === prevId);
      total += Math.min(3, pool.length);
    }
    return total;
  }

  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  startSession(deck, options = {}) {
    this.activeDeck = deck;
    this.deckProgress = this.storage.loadProgress(deck.id);

    this.currentMode = options.mode || 'part';
    this.currentPartId = options.partId || 1;
    this.isRandomized = options.isRandomized !== false;
    this.includeReview = options.includeReview !== false;

    this.passNumber = 1;
    this.sessionScore = 0;
    this.comboStreak = 0;
    this.multiplier = 1.0;

    let queue = [];
    if (this.currentMode === 'part') {
      const baseQuestions = deck.questions.filter(q => q.partId === this.currentPartId);
      const reviewQuestions = [];

      if (this.includeReview && this.currentPartId > 1) {
        for (let prevId = 1; prevId < this.currentPartId; prevId++) {
          const pool = deck.questions.filter(q => q.partId === prevId);
          if (pool.length > 0) {
            const count = Math.min(3, pool.length);
            const sample = this.shuffle(pool).slice(0, count);
            sample.forEach(q => {
              reviewQuestions.push({
                ...q,
                isReview: true,
                sourcePartId: prevId
              });
            });
          }
        }
      }

      if (this.isRandomized) {
        queue = this.shuffle([...baseQuestions, ...reviewQuestions]);
      } else {
        baseQuestions.sort((a, b) => a.id - b.id);
        queue = [...baseQuestions, ...reviewQuestions];
      }
    } else {
      // Full Exam mode
      const all = deck.questions.map(q => ({ ...q, isReview: false, sourcePartId: q.partId }));
      if (this.isRandomized) {
        queue = this.shuffle(all);
      } else {
        queue = [...all].sort((a, b) => a.id - b.id);
      }
    }

    this.activeQueue = queue;
    this.missedQueue = [];
    this.currentIndex = 0;
    this.answeredCurrentCard = false;

    this.totalUniqueCards = queue.length;
    this.firstTryCorrectIds = new Set();
    this.failedOrRevealedIds = new Set();
    this.perfectedIds = new Set();
    this.totalAttempts = 0;

    return {
      totalCards: this.totalUniqueCards,
      firstCard: this.getCurrentCard()
    };
  }

  getCurrentCard() {
    if (this.currentIndex >= 0 && this.currentIndex < this.activeQueue.length) {
      return this.activeQueue[this.currentIndex];
    }
    return null;
  }

  getCurrentProgress() {
    const totalInPass = this.activeQueue.length;
    const currentInPass = Math.min(totalInPass, this.currentIndex + 1);
    const overallPct = this.totalUniqueCards > 0
      ? Math.round((this.perfectedIds.size / this.totalUniqueCards) * 100)
      : 0;

    return {
      currentInPass,
      totalInPass,
      overallPct,
      passNumber: this.passNumber,
      streak: this.comboStreak,
      multiplier: this.multiplier,
      score: this.sessionScore
    };
  }

  computeMultiplier() {
    if (this.comboStreak >= 14) return 5.0;
    if (this.comboStreak >= 9) return 4.0;
    if (this.comboStreak >= 5) return 3.0;
    if (this.comboStreak >= 2) return 2.0;
    if (this.comboStreak >= 1) return 1.5;
    return 1.0;
  }

  getCodeForQuestion(q) {
    if (!q) return null;
    if (q.code && q.code.trim()) {
      return {
        code: q.code.trim(),
        title: `Original Q#${q.id} Code`,
        source: 'Question Snippet'
      };
    }
    const map = this.activeDeck && this.activeDeck.referenceCodeMap;
    if (map && map[q.id]) {
      return {
        code: map[q.id].code,
        title: map[q.id].title || 'Reference Code',
        source: map[q.id].source || 'Java Reference'
      };
    }
    return null;
  }

  submitAnswer(selectedLetter) {
    if (this.answeredCurrentCard) return null;
    this.answeredCurrentCard = true;
    this.totalAttempts += 1;

    const q = this.getCurrentCard();
    if (!q) return null;

    const correctAnswers = q.answer.split(' or ').map(a => a.trim().toUpperCase());
    const isCorrect = correctAnswers.includes((selectedLetter || '').toUpperCase());

    let points = 0;
    if (isCorrect) {
      if (!this.failedOrRevealedIds.has(q.id) && this.passNumber === 1) {
        this.firstTryCorrectIds.add(q.id);
      }
      this.perfectedIds.add(q.id);

      this.comboStreak += 1;
      this.multiplier = this.computeMultiplier();

      if (this.comboStreak > (this.deckProgress.bestStreak || 0)) {
        this.deckProgress.bestStreak = this.comboStreak;
      }
      if (this.multiplier > (this.deckProgress.bestMultiplier || 1.0)) {
        this.deckProgress.bestMultiplier = this.multiplier;
      }

      points = Math.round(100 * this.multiplier);
      this.sessionScore += points;
      this.deckProgress.xp = (this.deckProgress.xp || 0) + points;
      this.storage.saveProgress(this.activeDeck.id, this.deckProgress);

      if (this.sound) this.sound.playCorrect(this.multiplier);
    } else {
      this.failedOrRevealedIds.add(q.id);
      this.missedQueue.push(q);

      this.comboStreak = 0;
      this.multiplier = 1.0;
      this.storage.saveProgress(this.activeDeck.id, this.deckProgress);

      if (this.sound) this.sound.playWrong();
    }

    return {
      isCorrect,
      selectedLetter,
      correctAnswers,
      answerText: q.answerText || '',
      explanation: q.explanation || '',
      points,
      multiplier: this.multiplier,
      streak: this.comboStreak,
      perfectedCount: this.perfectedIds.size,
      totalUnique: this.totalUniqueCards
    };
  }

  revealAnswer() {
    if (this.answeredCurrentCard) return null;
    this.answeredCurrentCard = true;
    this.totalAttempts += 1;

    const q = this.getCurrentCard();
    if (!q) return null;

    const correctAnswers = q.answer.split(' or ').map(a => a.trim().toUpperCase());
    this.failedOrRevealedIds.add(q.id);
    this.missedQueue.push(q);

    this.comboStreak = 0;
    this.multiplier = 1.0;
    this.storage.saveProgress(this.activeDeck.id, this.deckProgress);

    if (this.sound) this.sound.playReveal();

    return {
      isCorrect: false,
      isRevealed: true,
      correctAnswers,
      answerText: q.answerText || '',
      explanation: q.explanation || '',
      multiplier: 1.0,
      streak: 0,
      perfectedCount: this.perfectedIds.size,
      totalUnique: this.totalUniqueCards
    };
  }

  nextCard() {
    this.answeredCurrentCard = false;
    this.currentIndex += 1;

    if (this.currentIndex >= this.activeQueue.length) {
      if (this.missedQueue.length > 0) {
        // Start next pass with missed cards
        this.passNumber += 1;
        this.activeQueue = this.shuffle(this.missedQueue);
        this.missedQueue = [];
        this.currentIndex = 0;
        return {
          completed: false,
          isNewPass: true,
          passNumber: this.passNumber,
          retryCount: this.activeQueue.length,
          card: this.getCurrentCard()
        };
      } else {
        // All cards in session perfected!
        return {
          completed: true,
          summary: this.finalizeSession()
        };
      }
    }

    return {
      completed: false,
      isNewPass: false,
      card: this.getCurrentCard()
    };
  }

  finalizeSession() {
    const masteryPct = this.totalUniqueCards > 0
      ? Math.round((this.firstTryCorrectIds.size / this.totalUniqueCards) * 100)
      : 100;

    const isFlawless = (masteryPct === 100);
    let unlockedNotice = '';

    if (this.currentMode === 'part') {
      const pId = this.currentPartId;
      const currentBest = this.deckProgress.partMasteryScores[pId] || 0;
      this.deckProgress.partMasteryScores[pId] = Math.max(currentBest, masteryPct);
      this.deckProgress.xp = (this.deckProgress.xp || 0) + 300;

      if (isFlawless) {
        const streak = (this.deckProgress.partConsecutiveMasteries[pId] || 0) + 1;
        this.deckProgress.partConsecutiveMasteries[pId] = streak;

        if (streak >= 2) {
          const nextPart = pId + 1;
          const maxParts = this.activeDeck.parts ? this.activeDeck.parts.length : 8;
          if (nextPart <= maxParts) {
            if ((this.deckProgress.unlockedPart || 1) <= pId) {
              this.deckProgress.unlockedPart = nextPart;
            }
            unlockedNotice = `Section ${nextPart} is now unlocked!`;
          } else {
            unlockedNotice = `All sections are now fully mastered!`;
          }
        }
      } else {
        this.deckProgress.partConsecutiveMasteries[pId] = 0;
      }
    } else {
      // Full exam mode
      this.deckProgress.fullMasteryScore = Math.max(this.deckProgress.fullMasteryScore || 0, masteryPct);
      this.deckProgress.xp = (this.deckProgress.xp || 0) + 1000;
      if (isFlawless) {
        unlockedNotice = `Legendary! 100% full exam mastery achieved!`;
      }
    }

    this.storage.saveProgress(this.activeDeck.id, this.deckProgress);

    return {
      masteryPct,
      isFlawless,
      sessionScore: this.sessionScore,
      bestStreak: this.comboStreak,
      totalAttempts: this.totalAttempts,
      totalCards: this.totalUniqueCards,
      unlockedNotice,
      partId: this.currentPartId,
      consecutiveStreak: (this.currentMode === 'part')
        ? (this.deckProgress.partConsecutiveMasteries[this.currentPartId] || 0)
        : null
    };
  }
}

if (typeof window !== 'undefined') {
  window.StudyEngine = StudyEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StudyEngine };
}
