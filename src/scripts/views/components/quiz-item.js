/* eslint-disable no-param-reassign */
import RandomQuizIdb from '../../data/random-quiz-idb';
import CONFIG from '../../globals/config';

class QuizItem extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  set dataSource(source) {
    this._datasource = source;
  }

  _setAnswerOnClick() {
    this._shadowRoot
      .querySelectorAll(`input[name="${this._datasource.number}"]`).forEach((element) => {
        element.addEventListener('click', async () => {
          await this._setAnswer();
        });
      });
  }

  async _setAnswer() {
    const selectedAnswer = this._shadowRoot
      .querySelector(`input[name="${this._datasource.number}"]:checked`).value;
    this._datasource.selected_answer = selectedAnswer;
    await RandomQuizIdb.putQuiz(this._datasource);
  }

  connectedCallback() {
    this.render();
    this._setAnswerOnClick();
  }

  render() {
    this._shadowRoot.innerHTML = `
    <style>
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }

    h3 {
      font-size: 0.8em;
      font-weight: 900;
      margin: 5px 0;
      color: grey;
    }
    
    .choice {
      margin: 10px;
    }
    
    .choice__form-group {
      display: flex;
      align-items: center;
      margin: 5px;
    }
    
    .choice__form-group > label {
      margin-left: 5px;
      font-weight: bold;
    }
    
    .choice__form-control {
      min-width: 44px;
      min-height: 44px;
    }
    
    input[type="radio"] {
      -webkit-appearance: none;
      appearance: none;
      background-color: #fff;
      margin: 0;
      font: inherit;
      color: currentColor;
      width: 1.15em;
      height: 1.15em;
      border: 0.15em solid currentColor;
      border-radius: 50%;
      transform: translateY(-0.075em);
      display: grid;
      place-content: center;
    }
    
    input[type="radio"]:hover {
      border: 0.2em solid currentColor;
    }

    input[type="radio"]::before {
      content: "";
      width: 1.8em;
      height: 1.8em;
      border-radius: 50%;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
      box-shadow: inset 2em 2em var(--ruby);
    }
    
    input[type="radio"]:checked::before {
      transform: scale(1);
    }
    </style>

    <h3>${this._datasource.category} • ${this._datasource.difficulty}</h3>
    <p><strong>${this._datasource.number}. </strong>${this._datasource.question}</p>
    <div class="choice"></div>
    `;

    const choiceContainer = this._shadowRoot.querySelector('.choice');
    const quizStatus = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    // shuffle the choice's array first
    const choices = [...this._datasource.incorrect_answers];
    choices.push(this._datasource.correct_answer);
    const shuffledChoices = (array) => {
      let randomIndex;
      let currentIndex = array.length;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    };

    shuffledChoices(choices).forEach((choice) => {
      choiceContainer.innerHTML += `
      <div class="choice__form-group">
      <input type="radio" id="${choice}" class="choice__form-control" name="${this._datasource.number}" value="${choice}">
      <label for="${choice}">${choice}</label>
      </div>
      `;
    });

    const selectedAnswerElement = this._shadowRoot.getElementById(this._datasource.selected_answer);
    const correctAnswerElement = this._shadowRoot
      .getElementById(this._datasource.correct_answer);
    const selectedAnswerLabel = this._shadowRoot
      .querySelector(`label[for="${this._datasource.selected_answer}"]`);
    const correctAnswerLabel = this._shadowRoot
      .querySelector(`label[for="${this._datasource.correct_answer}"]`);
    // Save selected asnwer state
    if (selectedAnswerElement) {
      selectedAnswerElement.checked = true;
    }

    if (quizStatus === 'finished') {
      this._shadowRoot.querySelectorAll('input[type="radio"]').forEach((element) => {
        element.disabled = true;
      });
      if (selectedAnswerElement) {
        selectedAnswerElement.style = 'color: red';
        selectedAnswerLabel.style = 'color: red';
      }
      correctAnswerElement.style = 'color: green';
      correctAnswerLabel.style = 'color: green';
    }
  }
}

customElements.define('quiz-item', QuizItem);
