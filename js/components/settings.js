// settings.js - Settings screen component (Figma Spec)
class SettingsView {
  constructor(storageManager, options = {}) {
    this.storage = storageManager;
    this.onDone = options.onDone || (() => {});
    this.onUpdateCache = options.onUpdateCache || (() => {});
    this.onRemoveFiles = options.onRemoveFiles || (() => {});
    this.onSelectFont = options.onSelectFont || (() => {});

    this.container = document.getElementById('settingsScreen');
    this.btnDone = document.getElementById('btnSettingsDone');
    this.btnUpdateCache = document.getElementById('btnSettingUpdateCache');
    this.cacheSubtext = document.getElementById('settingCacheSubtext');
    this.btnRemoveFiles = document.getElementById('btnSettingRemoveFiles');
    this.btnFont = document.getElementById('btnSettingFont');
    this.fontSubtext = document.getElementById('settingFontSubtext');

    this.bindEvents();
  }

  bindEvents() {
    if (this.btnDone) {
      this.btnDone.onclick = () => this.onDone();
    }
    if (this.btnUpdateCache) {
      this.btnUpdateCache.onclick = () => this.onUpdateCache();
    }
    if (this.btnRemoveFiles) {
      this.btnRemoveFiles.onclick = () => this.onRemoveFiles();
    }
    if (this.btnFont) {
      this.btnFont.onclick = () => this.onSelectFont();
    }
  }

  render() {
    if (this.cacheSubtext) {
      const lastRefresh = localStorage.getItem('ar_last_cache_refresh');
      if (lastRefresh) {
        const diffSec = Math.round((Date.now() - Number(lastRefresh)) / 1000);
        if (diffSec < 60) {
          this.cacheSubtext.textContent = 'Recently refreshed';
        } else {
          const mins = Math.max(1, Math.round(diffSec / 60));
          this.cacheSubtext.textContent = `Last updated ${mins}m`;
        }
      } else {
        this.cacheSubtext.textContent = 'Ready to refresh';
      }
    }

    if (this.fontSubtext) {
      const pref = this.storage.getFontPreference();
      this.fontSubtext.textContent = pref === 'segoe' ? 'Segoe UI' : 'System (Default)';
    }
  }

  updateCacheStatus(isRefreshed) {
    if (this.cacheSubtext) {
      this.cacheSubtext.textContent = isRefreshed ? 'Recently refreshed' : 'Last updated 2m';
    }
  }

  show() {
    if (this.container) this.container.classList.add('active');
    this.render();
  }

  hide() {
    if (this.container) this.container.classList.remove('active');
  }
}

if (typeof window !== 'undefined') {
  window.SettingsView = SettingsView;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SettingsView };
}
