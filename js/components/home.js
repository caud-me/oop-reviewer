// home.js - Home screen component (REFERENCE_APP_TSX)
class HomeView {
  constructor(storageManager, options = {}) {
    this.storage = storageManager;
    this.onSelectDeck = options.onSelectDeck || (() => {});
    this.onAddDeck = options.onAddDeck || (() => {});
    this.onOpenSettings = options.onOpenSettings || (() => {});

    this.container = document.getElementById('homeScreen');
    this.listElem = document.getElementById('recentDecksList');
    this.addBtn = document.getElementById('btnAddDeck');
    this.settingsBtn = document.getElementById('btnHomeSettings');

    this.bindEvents();
  }

  bindEvents() {
    if (this.addBtn) {
      this.addBtn.onclick = () => this.onAddDeck();
    }
    if (this.settingsBtn) {
      this.settingsBtn.onclick = () => this.onOpenSettings();
    }
  }

  render() {
    if (!this.listElem) return;
    this.listElem.innerHTML = '';

    const decks = this.storage.getRecentDecks();
    if (decks.length === 0) {
      // Zero fake placeholders: display nothing if no user imports exist
      return;
    }

    decks.forEach((deck, idx) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'list-row';
      item.onclick = () => this.onSelectDeck(deck.id);

      const relTime = this.storage.formatRelativeTime(deck.lastOpened);
      const rawTitle = deck.fullName || deck.title || '';
      const displayTitle = rawTitle.length > 48 ? rawTitle.slice(0, 48) + '...' : rawTitle;

      item.setAttribute('aria-label', `${displayTitle}, ${relTime}`);
      item.innerHTML = `
        <span class="icon" aria-hidden="true">&#xE8B7;</span>
        <span class="row-copy">
          <span class="body-copy">${this.escapeHtml(displayTitle)}</span>
          <span class="eyebrow">${relTime}</span>
        </span>
      `;

      this.listElem.appendChild(item);
    });
  }

  show() {
    if (this.container) this.container.classList.add('active');
    this.render();
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
  window.HomeView = HomeView;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HomeView };
}
