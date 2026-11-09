const fs = require('fs');
const vm = require('vm');

let html = fs.readFileSync('original_index.html', 'utf8');

// 1. Title
html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>Active Recall Reviewer</title>');

// 2. Header Brand
html = html.replace(
  /<div class="brand" onclick="app\.showDashboard\(\)">[\s\S]*?<\/div>/,
  `<div class="brand" onclick="app.showDashboard()">
          <span id="headerBrandTitle">Active Recall</span>
          <span class="brand-tag" id="headerBrandTag">No Deck</span>
        </div>`
);

// 3. Header Actions (add Import Deck button)
const oldActions = '<button class="btn-icon" id="soundBtn"';
const newActions = `<button class="btn-notion-outline" id="importDeckBtn" onclick="app.triggerImportDeck()" title="Import JSON Deck" style="margin-right: 6px;">
            <span class="icon">&#xE898;</span>
            <span style="margin-left: 5px;">Import Deck</span>
          </button>
          <input type="file" id="deckFileInput" accept=".json,application/json" style="display: none;" onchange="app.handleFileSelect(event)">
          <button class="btn-icon" id="soundBtn"`;

html = html.replace(oldActions, newActions);

// 4. In dashboardScreen, wrap active content and add noDeckState
const dashStart = html.indexOf('<div id="dashboardScreen" class="screen active">');
const pageHeader = html.indexOf('<div class="page-header">', dashStart);

const noDeckBlock = `
      <!-- NO DECK LOADED EMPTY STATE -->
      <div id="noDeckState" class="notion-callout" style="display: none; text-align: center; padding: 48px 24px; margin-top: 16px;">
        <div style="font-size: 2.2rem; margin-bottom: 12px;">📚</div>
        <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; color: var(--text);">No Deck Loaded</h2>
        <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 20px auto; font-size: 0.9rem;">
          Import a JSON active recall deck to start reviewing. Click the button below or drag and drop a .json file anywhere onto this page.
        </p>
        <button class="btn-notion-next" onclick="app.triggerImportDeck()" style="margin: 0 auto; display: inline-flex;">
          <span class="icon">&#xE898;</span>
          <span style="margin-left: 6px;">Import JSON Deck</span>
        </button>
      </div>

      <div id="deckActiveContent">
`;

html = html.slice(0, pageHeader) + noDeckBlock + html.slice(pageHeader);

// Close deckActiveContent before the reset progress button
const resetProgressIndex = html.indexOf('<div style="text-align: center; margin-top: 36px;">');
html = html.slice(0, resetProgressIndex) + '      </div>\n' + html.slice(resetProgressIndex);

// Add dynamic IDs to elements in dashboardScreen
html = html.replace('<h1 class="page-title">Java OOP Active Recall</h1>', '<h1 class="page-title" id="pageTitle">Active Recall</h1>');
html = html.replace(/<p class="page-description">[\s\S]*?<\/p>/, '<p class="page-description" id="pageDesc">Progressive active recall question bank.</p>');
html = html.replace('<h2 class="full-mode-title">Full Active Recall (All 150 Questions)</h2>', '<h2 class="full-mode-title" id="fullModeTitle">Full Active Recall</h2>');
html = html.replace(/<p class="full-mode-desc">[\s\S]*?<\/p>/, '<p class="full-mode-desc" id="fullModeDesc">Test your full mastery across the entire question bank.</p>');
html = html.replace(/<button class="full-mode-btn" onclick="app\.openStartModal\('full'\)">[\s\S]*?<\/button>/, '<button class="full-mode-btn" id="fullModeBtn" onclick="app.openStartModal(\'full\')">Start Full Exam</button>');
html = html.replace('<span class="part-count">15 Modules</span>', '<span class="part-count" id="sectionModulesCount">0 Modules</span>');

// 5. Replace DATASET and REFERENCE_CODE_MAP
const dsStart = html.indexOf('const DATASET = {');
const fyIndex = html.indexOf('function shuffleArray(array) {');
const soundStart = html.indexOf('class SoundEngine {');

const dynamicDatasetCode = `let DATASET = null;
    let REFERENCE_CODE_MAP = {};

    `;

const shuffleArrayEnd = html.indexOf('// CONNECTED REFERENCE CODE SNIPPETS');

html = html.slice(0, dsStart) + dynamicDatasetCode + html.slice(fyIndex, shuffleArrayEnd) + '\n    ' + html.slice(soundStart);

// 6. Update NotionMasteryApp class
const oldConstructorCall = 'this.sound = new SoundEngine();\n        this.theme = \'light\';\n        this.loadTheme();\n        this.loadState();';

const newConstructorCall = `this.sound = new SoundEngine();
        this.theme = 'light';
        this.loadTheme();
        this.loadActiveDeck();
        this.loadState();
        this.setupDragDrop();`;

html = html.replace(oldConstructorCall, newConstructorCall);

// Replace completeSession hardcoded 8 parts check
html = html.replace(
  'if (nextPart <= 8) {',
  'if (nextPart <= (DATASET ? DATASET.parts.length : 8)) {'
);

// Add helper methods to NotionMasteryApp right before loadState()
const newAppMethods = `
      getStorageKey() {
        const id = DATASET && DATASET.id ? DATASET.id : 'default';
        return 'oop_notion_mastery_' + id;
      }

      loadActiveDeck() {
        try {
          const raw = localStorage.getItem('oop_active_deck_json');
          if (raw) {
            DATASET = JSON.parse(raw);
            REFERENCE_CODE_MAP = (DATASET && DATASET.referenceCodeMap) ? DATASET.referenceCodeMap : {};
          }
        } catch (e) {
          console.error('Error loading active deck from localStorage:', e);
          DATASET = null;
          REFERENCE_CODE_MAP = {};
        }
      }

      triggerImportDeck() {
        const input = document.getElementById('deckFileInput');
        if (input) input.click();
      }

      handleFileSelect(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        this.importJsonFile(file);
        event.target.value = '';
      }

      setupDragDrop() {
        window.addEventListener('dragover', (e) => {
          e.preventDefault();
        });
        window.addEventListener('drop', (e) => {
          e.preventDefault();
          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.name.toLowerCase().endsWith('.json')) {
              this.importJsonFile(file);
            } else {
              alert('Please drop a valid .json deck file.');
            }
          }
        });
      }

      importJsonFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const raw = e.target.result;
            const data = JSON.parse(raw);
            const validated = this.validateAndNormalizeDeck(data);
            localStorage.setItem('oop_active_deck_json', JSON.stringify(validated));
            DATASET = validated;
            REFERENCE_CODE_MAP = validated.referenceCodeMap || {};
            this.loadState();
            this.renderDashboard();
            this.updateStatsUI();
          } catch (err) {
            alert('Failed to import deck: ' + err.message);
          }
        };
        reader.readAsText(file);
      }

      validateAndNormalizeDeck(data) {
        if (!data || typeof data !== 'object') {
          throw new Error('Deck file must be a JSON object.');
        }
        if (!Array.isArray(data.questions) || data.questions.length === 0) {
          throw new Error('Deck JSON must have a non-empty "questions" array.');
        }

        const title = data.title || 'Active Recall Deck';
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
`;

html = html.replace('loadState() {', newAppMethods + '\n      loadState() {');

// Update loadState() and saveState() to use getStorageKey()
html = html.replace(
  "localStorage.getItem('oop_notion_mastery_v4')",
  'localStorage.getItem(this.getStorageKey())'
);
html = html.replace(
  "localStorage.setItem('oop_notion_mastery_v4', JSON.stringify(this.state))",
  'localStorage.setItem(this.getStorageKey(), JSON.stringify(this.state))'
);

// Only replace body of updateStatsUI()
const oldUpdateStatsUIStart = html.indexOf('updateStatsUI() {');
const oldUpdateStatsUIEnd = html.indexOf('triggerHaptic(type) {', oldUpdateStatsUIStart);

const newUpdateStatsUI = `updateStatsUI() {
        const xpElem = document.getElementById('xpCount');
        if (xpElem) xpElem.textContent = (this.state.xp || 0).toLocaleString();
        const streakElem = document.getElementById('bestStreakCount');
        if (streakElem) streakElem.textContent = this.state.bestStreak || 0;
        const multElem = document.getElementById('bestMultiplierCount');
        if (multElem) multElem.textContent = ((this.state.bestMultiplier || 1.0).toFixed(1)) + 'x';

        if (!DATASET || !DATASET.parts) {
          return;
        }

        let masteredPartsCount = 0;
        for (let i = 1; i <= DATASET.parts.length; i++) {
          if ((this.state.partConsecutiveMasteries[i] || 0) >= 2) masteredPartsCount++;
        }

        const masteredPartsElem = document.getElementById('masteredPartsCount');
        if (masteredPartsElem) masteredPartsElem.textContent = masteredPartsCount + ' / ' + DATASET.parts.length;

        const fullScore = this.state.fullMasteryScore || 0;
        const fullStatus = fullScore > 0 ? (fullScore + '% Mastered') : 'Not Attempted';
        const fullExamStatusElem = document.getElementById('fullExamStatus');
        if (fullExamStatusElem) fullExamStatusElem.textContent = fullStatus;

        const overallPct = DATASET.parts.length > 0 ? Math.round((masteredPartsCount / DATASET.parts.length) * 100) : 0;
        const overallPctElem = document.getElementById('overallPct');
        if (overallPctElem) overallPctElem.textContent = overallPct + '% Mastered';
        this.updateSoundUI();
        this.applyTheme();
      }

      `;

html = html.slice(0, oldUpdateStatsUIStart) + newUpdateStatsUI + html.slice(oldUpdateStatsUIEnd);

// Only replace body of renderDashboard()
const oldRenderDashStart = html.indexOf('renderDashboard() {');
const oldRenderDashEnd = html.indexOf('openStartModal(mode, partId = null) {', oldRenderDashStart);

const newRenderDash = `renderDashboard() {
        const noDeckElem = document.getElementById('noDeckState');
        const activeContentElem = document.getElementById('deckActiveContent');
        const brandTitle = document.getElementById('headerBrandTitle');
        const brandTag = document.getElementById('headerBrandTag');

        if (!DATASET || !DATASET.questions || DATASET.questions.length === 0) {
          if (noDeckElem) noDeckElem.style.display = 'block';
          if (activeContentElem) activeContentElem.style.display = 'none';
          if (brandTitle) brandTitle.textContent = 'Active Recall';
          if (brandTag) brandTag.textContent = 'No Deck';
          const xpCount = document.getElementById('xpCount');
          if (xpCount) xpCount.textContent = '0';
          return;
        }

        if (noDeckElem) noDeckElem.style.display = 'none';
        if (activeContentElem) activeContentElem.style.display = 'block';
        if (brandTitle) brandTitle.textContent = DATASET.title;
        if (brandTag) brandTag.textContent = DATASET.questions.length + ' Cards';

        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) pageTitle.textContent = DATASET.title;
        const pageDesc = document.getElementById('pageDesc');
        if (pageDesc) pageDesc.textContent = DATASET.desc || 'Progressive active recall question bank.';

        const fullTitle = document.getElementById('fullModeTitle');
        if (fullTitle) fullTitle.textContent = 'Full Active Recall (All ' + DATASET.questions.length + ' Questions)';
        const fullDesc = document.getElementById('fullModeDesc');
        if (fullDesc) fullDesc.textContent = 'Test your full mastery across the entire question bank. All ' + DATASET.questions.length + ' questions are randomized. The session runs seamlessly and endlessly, cycling through missed cards until 100% of the cards are mastered.';
        const fullBtn = document.getElementById('fullModeBtn');
        if (fullBtn) fullBtn.textContent = 'Start Full Exam (' + DATASET.questions.length + ' Cards)';
        const modCount = document.getElementById('sectionModulesCount');
        if (modCount) modCount.textContent = DATASET.parts.length + ' Modules';

        // CALCULATE METRICS OVERVIEW
        let masteredPartsCount = 0;
        for (let i = 1; i <= DATASET.parts.length; i++) {
          if ((this.state.partConsecutiveMasteries[i] || 0) >= 2) masteredPartsCount++;
        }

        const masteredPartsElem = document.getElementById('masteredPartsCount');
        if (masteredPartsElem) masteredPartsElem.textContent = masteredPartsCount + ' / ' + DATASET.parts.length;

        const fullScore = this.state.fullMasteryScore || 0;
        const fullStatus = fullScore > 0 ? (fullScore + '% Mastered') : 'Not Attempted';
        const fullExamStatusElem = document.getElementById('fullExamStatus');
        if (fullExamStatusElem) fullExamStatusElem.textContent = fullStatus;

        const overallPct = DATASET.parts.length > 0 ? Math.round((masteredPartsCount / DATASET.parts.length) * 100) : 0;
        const overallPctElem = document.getElementById('overallPct');
        if (overallPctElem) overallPctElem.textContent = overallPct + '% Mastered';

        // RENDER PARTS GRID
        const grid = document.getElementById('partsGrid');
        grid.innerHTML = '';

        DATASET.parts.forEach((p, idx) => {
          const consecutive = this.state.partConsecutiveMasteries[p.id] || 0;
          const bestScore = this.state.partMasteryScores[p.id] || 0;
          const isMastered = consecutive >= 2;

          let badgeHtml = '';
          if (isMastered) {
            badgeHtml = '<span class="notion-tag tag-mastered">Mastered (' + consecutive + 'x)</span>';
          } else if (consecutive === 1) {
            badgeHtml = '<span class="notion-tag tag-learning">1/2 Streak</span>';
          } else if (bestScore > 0) {
            badgeHtml = '<span class="notion-tag tag-new">Best: ' + bestScore + '%</span>';
          } else {
            badgeHtml = '<span class="notion-tag tag-new">Ready</span>';
          }

          const qCount = (p.range && p.range[1] && p.range[0]) ? (p.range[1] - p.range[0] + 1) : 0;
          const qCountStr = qCount > 0 ? (qCount + ' Cards') : '';

          const card = document.createElement('div');
          card.className = 'part-card' + (isMastered ? ' mastered' : '');
          card.onclick = () => this.openStartModal('part', p.id);

          card.innerHTML = 
            '<div class="part-top">' +
              '<span class="part-num">Part ' + p.id + '</span>' +
              badgeHtml +
            '</div>' +
            '<div class="part-title">' + this.escapeHtml(p.title) + '</div>' +
            '<div class="part-desc">' + this.escapeHtml(p.desc || '') + '</div>' +
            '<div class="part-footer">' +
              '<span class="part-range">' + qCountStr + '</span>' +
              '<span class="part-start-btn">Practice &#x2192;</span>' +
            '</div>';
          grid.appendChild(card);
        });
      }

      `;

html = html.slice(0, oldRenderDashStart) + newRenderDash + html.slice(oldRenderDashEnd);

// Guard openStartModal, startPart, startFullMode
html = html.replace('openStartModal(mode, partId = null) {', 'openStartModal(mode, partId = null) {\n        if (!DATASET) return;');
html = html.replace('startPart(partId, isRandomized = true) {', 'startPart(partId, isRandomized = true) {\n        if (!DATASET) return;');
html = html.replace('startFullMode(isRandomized = true) {', 'startFullMode(isRandomized = true) {\n        if (!DATASET) return;');

// Also guard resetProgress
html = html.replace(
  'resetProgress() {',
  'resetProgress() {\n        if (!DATASET) return;'
);

// Window app export
html = html.replace('const app = new NotionMasteryApp();', 'window.app = new NotionMasteryApp();\n    const app = window.app;');

// Verify JS syntax inside <script>
const scriptStart = html.indexOf('<script>') + '<script>'.length;
const scriptEnd = html.lastIndexOf('</script>');
const jsCode = html.slice(scriptStart, scriptEnd);

new vm.Script(jsCode, { filename: 'index.html.js' });

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully written index.html! File size:', html.length);
