// deck.js - Deck overview screen (REFERENCE_APP_TSX)
class DeckView {
  constructor(storageManager, options = {}) {
    this.storage = storageManager;
    this.onBack = options.onBack || (() => {});
    this.onSelectSection = options.onSelectSection || (() => {});
    this.onStartFullExam = options.onStartFullExam || (() => {});

    this.container = document.getElementById('reviewerScreen');
    this.titleElem = document.getElementById('reviewerTitle');
    this.descElem = document.getElementById('reviewerDesc');
    this.sectionsElem = document.getElementById('sectionsList');
    this.btnQuit = document.getElementById('btnQuitReviewer');
    this.btnFullExam = document.getElementById('btnStartFullExam');

    this.currentDeck = null;
    this.bindEvents();
  }

  bindEvents() {
    if (this.btnQuit) {
      this.btnQuit.onclick = () => this.onBack();
    }
    if (this.btnFullExam) {
      this.btnFullExam.onclick = () => this.onStartFullExam(this.currentDeck);
    }
  }

  render(deck) {
    if (!deck) return;
    this.currentDeck = deck;

    const progress = this.storage.loadProgress(deck.id);

    let displayTitle = deck.title;
    if (displayTitle.toLowerCase().includes('javafx')) displayTitle = 'JavaFX';
    else if (displayTitle.toLowerCase().includes('oop') || displayTitle.toLowerCase().includes('object-oriented')) displayTitle = 'OOP';

    if (this.titleElem) this.titleElem.textContent = displayTitle;
    if (this.descElem) {
      const desc = deck.desc || 'Short description here, maximum of 128 characters.';
      this.descElem.textContent = desc.length > 128 ? desc.slice(0, 125) + '...' : desc;
    }

    if (!this.sectionsElem) return;
    this.sectionsElem.innerHTML = '';

    const parts = deck.parts || [];
    parts.forEach((part, idx) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'list-row';

      const consecutiveMastery = progress.partConsecutiveMasteries[part.id] || 0;
      const isMastered = consecutiveMastery >= 2;
      const bestScore = progress.partMasteryScores[part.id] || 0;

      let iconGlyph = '&#xE8B7;';
      let subText = 'not attempted';

      if (isMastered) {
        iconGlyph = '&#xE73E;';
        subText = '🏆100% confident';
      } else if (consecutiveMastery === 1) {
        subText = '50% confident';
      } else if (bestScore > 0) {
        const partial = Math.min(49, Math.round((bestScore / 100) * 50));
        subText = `${partial}% confident`;
      }

      item.setAttribute('aria-label', `${part.title}, ${subText}`);
      item.innerHTML = `
        <span class="icon" aria-hidden="true">${iconGlyph}</span>
        <span class="row-copy">
          <span class="body-copy">${this.escapeHtml(part.title)}</span>
          <span class="eyebrow">${subText}</span>
        </span>
      `;

      item.onclick = () => this.onSelectSection(part.id);
      this.sectionsElem.appendChild(item);
    });
  }

  show(deck) {
    if (this.container) this.container.classList.add('active');
    this.render(deck);
  }

  hide() {
    if (this.container) this.container.classList.remove('active');
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

if (typeof window !== 'undefined') {
  window.DeckView = DeckView;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DeckView };
}
