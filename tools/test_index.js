const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');

// Mock browser DOM environment
const elements = {};
function createMockElement(id) {
  const el = {
    id,
    style: {},
    classList: {
      _classes: new Set(),
      add: function(c) { this._classes.add(c); },
      remove: function(c) { this._classes.delete(c); },
      contains: function(c) { return this._classes.has(c); }
    },
    textContent: '',
    _innerHTML: '',
    dataset: {},
    children: [],
    appendChild: function(child) {
      this.children.push(child);
    },
    querySelectorAll: function() { return []; },
    querySelector: function() { return null; },
    setAttribute: function(k, v) { this[k] = v; },
    getAttribute: function(k) { return this[k]; },
    focus: function() {},
    click: function() {
      if (this.onclick) this.onclick();
    }
  };
  Object.defineProperty(el, 'innerHTML', {
    get: function() { return this._innerHTML; },
    set: function(val) {
      this._innerHTML = val;
      this.textContent = String(val).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (val === '') {
        this.children = [];
      }
    }
  });
  return el;
}

const mockDoc = {
  getElementById: function(id) {
    if (!elements[id]) {
      elements[id] = createMockElement(id);
    }
    return elements[id];
  },
  createElement: function(tag) {
    const el = createMockElement(tag + '-' + Math.random());
    el.tagName = tag.toUpperCase();
    return el;
  },
  querySelectorAll: function(sel) {
    if (sel === '.screen') {
      return [
        mockDoc.getElementById('homeScreen'),
        mockDoc.getElementById('importScreen'),
        mockDoc.getElementById('reviewerScreen'),
        mockDoc.getElementById('setupScreen'),
        mockDoc.getElementById('quizScreen'),
        mockDoc.getElementById('summaryScreen')
      ];
    }
    return [];
  },
  documentElement: {
    setAttribute: () => {},
    removeAttribute: () => {}
  }
};

const mockLocalStorage = {
  data: {},
  getItem: function(k) { return this.data[k] || null; },
  setItem: function(k, v) { this.data[k] = String(v); },
  removeItem: function(k) { delete this.data[k]; }
};

const mockWindow = {
  addEventListener: () => {},
  matchMedia: () => ({ matches: false }),
  AudioContext: class {
    constructor() {
      this.destination = {};
      this.currentTime = 0;
    }
    createOscillator() {
      return {
        connect: () => {},
        start: () => {},
        stop: () => {},
        frequency: { setValueAtTime: () => {} }
      };
    }
    createGain() {
      return {
        connect: () => {},
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }
      };
    }
  }
};

const context = {
  document: mockDoc,
  window: mockWindow,
  localStorage: mockLocalStorage,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Math: Math,
  JSON: JSON,
  Date: Date,
  Set: Set,
  Array: Array,
  String: String,
  Number: Number,
  FileReader: class {
    readAsText(file) {
      this.result = file.content;
      if (this.onload) this.onload({ target: { result: file.content } });
    }
  },
  alert: console.log,
  confirm: () => true,
  navigator: {
    serviceWorker: {
      register: () => Promise.resolve(),
      controller: { postMessage: () => {} },
      addEventListener: () => {}
    }
  }
};

vm.createContext(context);

// Extract all <script src="..."> from index.html and execute in order
const scriptSrcRegex = /<script\s+src="([^"]+)"><\/script>/g;
let match;
const scriptFiles = [];
while ((match = scriptSrcRegex.exec(html)) !== null) {
  scriptFiles.push(match[1]);
}

console.log('Detected script files in index.html:', scriptFiles);
if (scriptFiles.length === 0) {
  throw new Error('No <script src="..."> tags found in index.html');
}

scriptFiles.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  vm.runInContext(code, context);
});

// Instantiate app
const app = new context.window.ActiveRecallApp();
context.window.app = app;
console.log('App instantiated successfully with modular architecture!');

// Test 0: Verify Service Worker and Offline Caching Assets
console.log('\nTest 0: Verify Service Worker and Offline Caching Assets');
if (!fs.existsSync('sw.js')) {
  throw new Error('sw.js must exist in root directory for offline support');
}
const swContent = fs.readFileSync('sw.js', 'utf8');
if (!swContent.includes('REFRESH_CACHE') || !swContent.includes('CACHE_NAME')) {
  throw new Error('sw.js must include cache management and REFRESH_CACHE handler');
}
if (!fs.existsSync('manifest.json')) {
  throw new Error('manifest.json must exist in root directory for PWA support');
}
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
if (!manifest.icons || manifest.icons.length === 0 || manifest.display !== 'standalone') {
  throw new Error('manifest.json must define standalone display and icons');
}
// Verify all assets in sw.js exist on disk
const assetMatch = swContent.match(/const CORE_ASSETS = \[([\s\S]*?)\];/);
if (assetMatch) {
  const assets = assetMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
  assets.forEach(asset => {
    if (asset !== './') {
      const cleanPath = asset.replace(/^\.\//, '');
      if (!fs.existsSync(cleanPath)) {
        throw new Error(`Cached asset missing from disk: ${cleanPath}`);
      }
    }
  });
}
console.log('PWA Manifest, Service Worker, and all cached assets verified on disk!');

// Test 1: Verify Welcome / What\'s New Modal for New Users
console.log('\nTest 1: Verify Welcome / What\'s New Modal for New Users');
const welcomeScreen = mockDoc.getElementById('welcomeScreen');
if (!welcomeScreen.classList.contains('active')) {
  throw new Error('welcomeScreen should be displayed on clean first launch');
}
const chkDontShow = mockDoc.getElementById('chkDontShowWelcomeBox');
if (chkDontShow.classList.contains('checked')) {
  throw new Error('chkDontShowWelcomeBox should start unchecked');
}
// Toggle "dont show this again"
mockDoc.getElementById('btnToggleDontShowWelcome').click();
if (!chkDontShow.classList.contains('checked')) {
  throw new Error('chkDontShowWelcomeBox should be checked after toggle');
}
// Dismiss welcome modal
mockDoc.getElementById('btnDismissWelcome').click();
if (welcomeScreen.classList.contains('active')) {
  throw new Error('welcomeScreen should be dismissed after clicking got it');
}
if (!app.storage.hasSeenWelcome()) {
  throw new Error('Storage should remember that user chose not to see welcome again');
}
console.log('Welcome modal dismissed & preference saved in storage cleanly!');

// Test 1b: Verify Initial Clean Home Screen state (Zero fake folders)
console.log('\nTest 1b: Verify Initial Clean Home Screen (Zero fake folders)');
const homeScreen = mockDoc.getElementById('homeScreen');
if (!homeScreen.classList.contains('active')) {
  throw new Error('homeScreen should be active initially');
}
const recentDecks = app.storage.getRecentDecks();
console.log('Recent decks on clean launch count:', recentDecks.length);
if (recentDecks.length !== 0) {
  throw new Error('Recent decks must be completely empty on clean launch (zero placeholders or fake entries)');
}
console.log('Recent list children count:', mockDoc.getElementById('recentDecksList').children.length);
if (mockDoc.getElementById('recentDecksList').children.length !== 0) {
  throw new Error('Recent list DOM must contain zero placeholder items');
}

// Test 2: Import JavaFX deck and navigate to reviewer screen
console.log('\nTest 2: Import JavaFX deck');
const javafxJson = fs.readFileSync('javafx_deck.json', 'utf8');
app.importJsonFile({ name: 'javafx_deck.json', content: javafxJson });

const reviewerScreen = mockDoc.getElementById('reviewerScreen');
if (!reviewerScreen.classList.contains('active')) {
  throw new Error('reviewerScreen should be active after importing deck');
}
if (homeScreen.classList.contains('active')) {
  throw new Error('homeScreen should be inactive after opening deck');
}
console.log('Reviewer Title:', mockDoc.getElementById('reviewerTitle').textContent);
console.log('Sections count rendered:', mockDoc.getElementById('sectionsList').children.length);
if (mockDoc.getElementById('sectionsList').children.length !== 5) {
  throw new Error('JavaFX deck should have 5 sections rendered');
}

// Test 2b: Modal Layering & Checkbox Behavior
console.log('\nTest 2b: Modal Layering & Checkbox Centering Behavior');
app.showSetup('part', 2);
const setupScreen = mockDoc.getElementById('setupScreen');
if (!setupScreen.classList.contains('active')) {
  throw new Error('setupScreen should be active as an overlay');
}
if (!reviewerScreen.classList.contains('active')) {
  throw new Error('reviewerScreen must stay active in the background for backdrop blur');
}
const subtext = mockDoc.getElementById('chkIncludePastSubtext').textContent;
console.log('Past review cards subtext:', subtext);
if (!subtext.includes('3 extra cards')) {
  throw new Error('Checkbox should state exact extra cards count');
}
const chkBox = mockDoc.getElementById('chkIncludePastBox');
if (!chkBox.classList.contains('checked')) {
  throw new Error('chkIncludePastBox should be checked by default');
}
// Toggle off
mockDoc.getElementById('btnTogglePastReview').click();
if (chkBox.classList.contains('checked')) {
  throw new Error('chkIncludePastBox should be unchecked after toggle');
}
// Toggle back on
mockDoc.getElementById('btnTogglePastReview').click();
if (!chkBox.classList.contains('checked')) {
  throw new Error('chkIncludePastBox should be checked after second toggle');
}
// Cancel setup
mockDoc.getElementById('btnCancelSetup').click();
if (setupScreen.classList.contains('active')) {
  throw new Error('setupScreen should be dismissed after Cancel');
}
if (!reviewerScreen.classList.contains('active')) {
  throw new Error('reviewerScreen should remain active after canceling modal');
}

// Test 3: Start Study Session
console.log('\nTest 3: Start Study Session (Part 1)');
app.startSession({ mode: 'part', partId: 1, isRandomized: false, includeReview: false });
const quizScreen = mockDoc.getElementById('quizScreen');
if (!quizScreen.classList.contains('active')) {
  throw new Error('quizScreen should be active after starting session');
}
console.log('HUD Progress Text:', mockDoc.getElementById('quizProgressText').textContent);
console.log('HUD Streak Text:', mockDoc.getElementById('quizStreakText').textContent);
console.log('Question Prompt:', mockDoc.getElementById('quizQuestionPrompt').textContent);
console.log('Choices rendered:', mockDoc.getElementById('quizAnswersGrid').children.length);

if (mockDoc.getElementById('quizAnswersGrid').children.length !== 4) {
  throw new Error('Should render 4 multiple choice options in answers grid');
}

// Test 4: Answer Question and Verify Feedback & Streak
console.log('\nTest 4: Answer Question and Verify Feedback & Streak');
const currentCard = app.engine.getCurrentCard();
const correctChoice = currentCard.answer;
console.log('Card #1 correct answer is:', correctChoice);

app.gameView.handleAnswer(correctChoice);
console.log('Feedback Card shown:', mockDoc.getElementById('quizFeedbackCard').style.display !== 'none');
console.log('Feedback Title:', mockDoc.getElementById('quizFeedbackTitle').textContent);
console.log('Streak after correct answer:', mockDoc.getElementById('quizStreakText').textContent);

if (mockDoc.getElementById('quizFeedbackCard').style.display === 'none') {
  throw new Error('Feedback card should be displayed after answering');
}

// Test 5: Next Card Transition
console.log('\nTest 5: Next Card Transition');
app.gameView.handleContinue();
console.log('Next Card HUD Progress:', mockDoc.getElementById('quizProgressText').textContent);

// Test 5b: Complete Part 1 with 1st Flawless Streak -> "Great work" & "50% confident"
console.log('\nTest 5b: Flawless Run 1/2 -> "Great work" & "50% confident"');
while (app.engine.currentIndex < app.engine.activeQueue.length) {
  const card = app.engine.getCurrentCard();
  app.gameView.handleAnswer(card.answer);
  app.gameView.handleContinue();
}
const summaryScreen = mockDoc.getElementById('summaryScreen');
if (!summaryScreen.classList.contains('active')) {
  throw new Error('summaryScreen should be active after completing session');
}
const heading = mockDoc.getElementById('summaryHeading').textContent;
const body = mockDoc.getElementById('summaryBody').textContent;
console.log('Summary 1st streak heading:', heading);
console.log('Summary 1st streak body:', body);
if (heading !== 'Great work') {
  throw new Error('Heading for 1st perfect streak must be "Great work"');
}
if (!body.includes('perform one more perfect streak')) {
  throw new Error('Body for 1st perfect streak must prompt for one more perfect streak');
}
// Dismiss summary and return to deck
mockDoc.getElementById('btnReturnSummary').click();
// Check section 1 status in deck
const firstSectionText = mockDoc.getElementById('sectionsList').children[0].textContent;
console.log('Section 1 status after 1 perfect streak:', firstSectionText);
if (!firstSectionText.includes('50% confident')) {
  throw new Error('Section 1 status after 1st perfect streak must be "50% confident"');
}

// Complete 2nd Flawless Streak -> "Mastered!" & "🏆100% confident"
console.log('\nTest 5c: Flawless Run 2/2 -> "Mastered!" & "🏆100% confident"');
app.startSession({ mode: 'part', partId: 1, isRandomized: false, includeReview: false });
while (app.engine.currentIndex < app.engine.activeQueue.length) {
  const card = app.engine.getCurrentCard();
  app.gameView.handleAnswer(card.answer);
  app.gameView.handleContinue();
}
const heading2 = mockDoc.getElementById('summaryHeading').textContent;
console.log('Summary 2nd streak heading:', heading2);
if (heading2 !== 'Mastered!') {
  throw new Error('Heading for 2nd perfect streak must be "Mastered!"');
}
mockDoc.getElementById('btnReturnSummary').click();
const firstSectionText2 = mockDoc.getElementById('sectionsList').children[0].textContent;
console.log('Section 1 status after 2 perfect streaks:', firstSectionText2);
if (!firstSectionText2.includes('🏆100% confident')) {
  throw new Error('Section 1 status after 2nd perfect streak must be "🏆100% confident"');
}

// Test 5d: Verify Non-Flawless Summary Format & Box Removal
console.log('\nTest 5d: Verify Non-Flawless Summary ("Nice" & accuracy description, no boxy score)');
app.modalManager.showSummary({
  isFlawless: false,
  masteryPct: 44,
  sessionScore: 1200
});
const niceHeading = mockDoc.getElementById('summaryHeading').textContent;
const niceBody = mockDoc.getElementById('summaryBody').textContent;
console.log('Non-flawless heading:', niceHeading);
console.log('Non-flawless body:', niceBody);
if (niceHeading !== 'Nice') {
  throw new Error('Heading for non-flawless run must be "Nice"');
}
if (!niceBody.includes('All cards checked in this session, practice again to reach 100% first-pass accuracy. your accuracy score is 44%.')) {
  throw new Error('Body for non-flawless run must match required accuracy text');
}
if (html.includes('id="summaryScoreVal"') || html.includes('id="summaryAccuracyVal"')) {
  throw new Error('Boxy score/accuracy UI elements must be removed from summary modal');
}

// Verify list items are not pre-selected with active class
console.log('Section 0 has active class?', mockDoc.getElementById('sectionsList').children[0].classList.contains('active'));
if (mockDoc.getElementById('sectionsList').children[0].classList.contains('active')) {
  throw new Error('First list item must not be highlighted with active class');
}

// Test 6: Import Custom Deck File (OOP)
console.log('\nTest 6: Import Custom Deck File (OOP)');
const oopRaw = fs.readFileSync('oop_deck.json', 'utf8');
app.importJsonFile({ name: 'oop_deck.json', content: oopRaw });
console.log('Imported Deck Title:', mockDoc.getElementById('reviewerTitle').textContent);
console.log('Imported Deck Sections:', mockDoc.getElementById('sectionsList').children.length);
if (mockDoc.getElementById('sectionsList').children.length !== 15) {
  throw new Error('OOP deck should have 15 sections rendered');
}

console.log('\nALL 6 REFACTORED REFERENCE INTEGRATION TESTS PASSED CLEANLY WITH ZERO DEFECTS!');
