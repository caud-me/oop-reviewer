// game.js - Active recall study session screen (REFERENCE_APP_TSX)
class GameView {
  constructor(engine, options = {}) {
    this.engine = engine;
    this.onQuit = options.onQuit || (() => {});
    this.onSessionComplete = options.onSessionComplete || (() => {});

    // DOM Elements
    this.container = document.getElementById('quizScreen');
    this.progressBar = document.getElementById('viewportProgressBar');
    this.progressText = document.getElementById('quizProgressText');
    this.streakText = document.getElementById('quizStreakText');

    this.layout = document.getElementById('quizLayout');
    this.codeCard = document.getElementById('quizCodeCard');
    this.codeText = document.getElementById('quizCodeText');

    this.promptText = document.getElementById('quizQuestionPrompt');
    this.btnReveal = document.getElementById('btnQuizReveal');
    this.answersGrid = document.getElementById('quizAnswersGrid');

    this.feedbackCard = document.getElementById('quizFeedbackCard');
    this.feedbackTitle = document.getElementById('quizFeedbackTitle');
    this.feedbackDesc = document.getElementById('quizFeedbackDesc');
    this.btnContinue = document.getElementById('btnQuizContinue');

    this.btnQuit = document.getElementById('btnQuizQuit');

    this.currentChoices = [];
    this.answered = false;

    this.bindEvents();
  }

  bindEvents() {
    if (this.btnReveal) {
      this.btnReveal.onclick = () => this.handleReveal();
    }
    if (this.btnContinue) {
      this.btnContinue.onclick = () => this.handleContinue();
    }
    if (this.btnQuit) {
      this.btnQuit.onclick = () => {
        if (confirm('Quit active recall session and return to deck overview?')) {
          this.onQuit();
        }
      };
    }
  }

  startSession(deck, options = {}) {
    this.engine.startSession(deck, options);
    this.show();
    this.renderCurrentCard();
  }

  renderCurrentCard() {
    this.answered = false;
    const card = this.engine.getCurrentCard();
    if (!card) return;

    const prog = this.engine.getCurrentProgress();

    // 1. Viewport pinned progress bar (1-2px)
    if (this.progressBar) {
      this.progressBar.style.width = `${prog.overallPct}%`;
      this.progressBar.setAttribute('aria-valuenow', Math.round(prog.overallPct));
    }

    // 2. Eyebrow row: "1 of 15 · Q1" and streak counter
    if (this.progressText) {
      if (card.isReview) {
        this.progressText.textContent = `Review (Part ${card.sourcePartId}) · Card ${prog.currentInPass} of ${prog.totalInPass} · Q${card.id}`;
      } else {
        this.progressText.textContent = `${prog.currentInPass} of ${prog.totalInPass} · Q${card.id}`;
      }
    }

    if (this.streakText) {
      this.streakText.textContent = prog.streak > 0 ? `${prog.streak}x` : '1.0x';
    }

    // 3. Layout check: Split with code vs centered
    const codeInfo = this.engine.getCodeForQuestion(card);
    if (codeInfo && codeInfo.code) {
      if (this.layout) this.layout.classList.add('with-code');
      if (this.codeCard) this.codeCard.style.display = 'flex';
      if (this.codeText) this.codeText.textContent = codeInfo.code;
    } else {
      if (this.layout) this.layout.classList.remove('with-code');
      if (this.codeCard) this.codeCard.style.display = 'none';
    }

    // 4. Prompt text
    if (this.promptText) {
      this.promptText.textContent = card.prompt;
    }

    // 5. Enable reveal button
    if (this.btnReveal) {
      this.btnReveal.disabled = false;
    }

    // 6. Hide feedback banner
    if (this.feedbackCard) {
      this.feedbackCard.style.display = 'none';
    }

    // 7. Render 2-column answer grid (REFERENCE_APP_TSX)
    this.currentChoices = this.engine.shuffle(card.choices);
    if (this.answersGrid) {
      this.answersGrid.innerHTML = '';
      this.answersGrid.setAttribute('role', 'group');
      this.answersGrid.setAttribute('aria-label', 'Answer choices');
      this.currentChoices.forEach((c, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'answer';
        btn.id = `answerBtn_${c.letter}`;
        btn.dataset.letter = c.letter;
        btn.dataset.key = `${idx + 1}`;
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-label', `Choice ${idx + 1}: ${c.text}`);

        const keyNum = idx + 1;
        btn.innerHTML = `
          <span class="answer-number" aria-hidden="true">${keyNum}</span>
          <span>${this.escapeHtml(c.text)}</span>
        `;

        btn.onclick = () => this.handleAnswer(c.letter);
        this.answersGrid.appendChild(btn);
      });
    }
  }

  handleAnswer(selectedLetter) {
    if (this.answered) return;
    this.answered = true;

    const result = this.engine.submitAnswer(selectedLetter);
    if (!result) return;

    this.disableOptions();

    const chosenBtn = document.getElementById(`answerBtn_${selectedLetter}`);

    if (result.isCorrect) {
      if (chosenBtn) {
        chosenBtn.classList.add('correct');
      }
      this.showFeedbackCard(true, result.explanation, result.answerText);
    } else {
      if (chosenBtn) {
        chosenBtn.classList.add('wrong');
      }
      result.correctAnswers.forEach(ans => {
        const rightBtn = document.getElementById(`answerBtn_${ans}`);
        if (rightBtn) rightBtn.classList.add('correct');
      });
      this.showFeedbackCard(false, result.explanation, result.answerText);
    }

    // Mute all other unselected answers matching REFERENCE_APP_TSX
    if (this.answersGrid) {
      const allBtns = this.answersGrid.querySelectorAll('.answer');
      allBtns.forEach(b => {
        if (!b.classList.contains('correct') && !b.classList.contains('wrong')) {
          b.classList.add('muted');
        }
      });
    }

    // Update streak in HUD with micro-bump animation
    if (this.streakText) {
      this.streakText.textContent = result.streak > 0 ? `${result.streak}x` : '1.0x';
      if (result.streak > 0) {
        this.streakText.classList.remove('bump');
        void this.streakText.offsetWidth; // re-flow
        this.streakText.classList.add('bump');
      }
    }

    // Update pinned progress bar
    if (this.progressBar && result.totalUnique > 0) {
      const pct = Math.round((result.perfectedCount / result.totalUnique) * 100);
      this.progressBar.style.width = `${pct}%`;
    }

    if (this.btnContinue) {
      this.btnContinue.focus();
    }
  }

  handleReveal() {
    if (this.answered) return;
    this.answered = true;

    const result = this.engine.revealAnswer();
    if (!result) return;

    this.disableOptions();

    result.correctAnswers.forEach(ans => {
      const rightBtn = document.getElementById(`answerBtn_${ans}`);
      if (rightBtn) rightBtn.classList.add('correct');
    });

    if (this.answersGrid) {
      const allBtns = this.answersGrid.querySelectorAll('.answer');
      allBtns.forEach(b => {
        if (!b.classList.contains('correct')) {
          b.classList.add('muted');
        }
      });
    }

    if (this.streakText) {
      this.streakText.textContent = '1.0x';
      this.streakText.classList.remove('bump');
    }

    this.showFeedbackCard(false, result.explanation, result.answerText, true);

    if (this.btnContinue) {
      this.btnContinue.focus();
    }
  }

  showFeedbackCard(isCorrect, explanation, answerText, isRevealed = false) {
    if (!this.feedbackCard) return;

    if (this.feedbackTitle) {
      if (isCorrect) {
        this.feedbackTitle.textContent = "That’s right";
      } else if (isRevealed) {
        this.feedbackTitle.textContent = 'Answer revealed';
      } else {
        this.feedbackTitle.textContent = "That’s not right";
      }
    }

    if (this.feedbackDesc) {
      let descHtml = '';
      if (!isCorrect && answerText) {
        descHtml += `<strong style="color: #ededed;">Correct:</strong> ${this.escapeHtml(answerText)}<br style="margin-bottom: 6px;">`;
      }
      descHtml += this.escapeHtml(explanation || '');
      this.feedbackDesc.innerHTML = descHtml;
    }

    this.feedbackCard.style.display = 'flex';
  }

  disableOptions() {
    if (this.answersGrid) {
      const btns = this.answersGrid.querySelectorAll('.answer');
      btns.forEach(b => b.disabled = true);
    }
    if (this.btnReveal) {
      this.btnReveal.disabled = true;
    }
  }

  handleContinue() {
    const res = this.engine.nextCard();
    if (res.completed) {
      this.hide();
      this.onSessionComplete(res.summary);
    } else {
      this.renderCurrentCard();
    }
  }

  show() {
    if (this.container) this.container.classList.add('active');
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
  window.GameView = GameView;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameView };
}
