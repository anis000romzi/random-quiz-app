/* eslint-disable no-param-reassign */
import OpenTdbSource from '../../data/opentdb-source';
import RandomQuizIdb from '../../data/random-quiz-idb';
import CONFIG from '../../globals/config';
import decodeHtml from '../../helpers/decode-html-text';

class OptionForm extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._startQuizOnClick();
  }

  _startQuizOnClick() {
    this._shadowRoot
      .querySelector('#startButton')
      .addEventListener('click', async () => {
        await this._startQuiz();
      });
  }

  async _startQuiz() {
    const quizStatus = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    const numberOfQuestions = this._shadowRoot.querySelector('#numberOfQuestions');
    const category = this._shadowRoot.querySelector('#category');
    const difficulty = this._shadowRoot.querySelector('#difficulty');
    const quizType = this._shadowRoot.querySelector('#quizType');
    const messageContainer = this._shadowRoot.querySelector('#messageContainer');
    const quizzes = await OpenTdbSource.quiz({
      number: numberOfQuestions.value,
      category: category.value,
      difficulty: difficulty.value,
      type: quizType.value,
    });
    if (quizStatus === 'running') {
      window.location.href = '#/home';
      return;
    }
    if (!quizzes.results) {
      messageContainer.innerHTML = quizzes;
      return;
    }
    await RandomQuizIdb.deleteAllQuizzes();
    let number = 0;
    quizzes.results.forEach(async (quiz) => {
      number += 1;
      quiz.number = number;
      quiz.selected_answer = '';
      quiz.correct_answer = decodeHtml(quiz.correct_answer);
      await RandomQuizIdb.putQuiz(quiz);
    });
    window.location.href = '#/quiz';
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, 'running');
  }

  async render() {
    this._shadowRoot.innerHTML = `
      <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }

      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 80%
      }

      .option__form-group {
        display: flex;
        flex-direction: column;
        margin: 7px;
      }
      
      .option__form-group > label {
        font-size: 0.9em;
        font-weight: 900;
        margin-bottom: 2px;
      }
      
      .option__form-control {
        border: black 1px solid;
        border-radius: 5px;
        padding: 5px;
        min-height: 44px;
        font-family: 'Comfortaa';
      }
      
      #formButton {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .option__form-button {
        border: black 1px solid;
        border-radius: 10px;
        background-color: var(--maximum-yellow);
        font-family: "Comfortaa";
        font-weight: 800;
        margin: 5px;
        min-height: 44px;
        padding: 10px;
        width: 50%;
        cursor: pointer;
      }

      .option__form-button:hover {
        background-color: #f3b93b;
      }

      #continueButton {
        display: none;
      }

      #messageContainer > a {
        color: var(--han-purple);
        display: inline-block;
        min-height: 44px;
      }

      #messageContainer > a:hover {
        color: var(--middle-blue);
      }
      </style>  

      <div class="option__form-group">
        <label for="numberOfQuestions">Number Of Questions</label>
        <input
          id="numberOfQuestions"
          type="number"
          class="option__form-control"
          min="5"
          max="50"
          value="10"
        />
      </div>
      <div class="option__form-group">
        <label for="category">Category</label>
        <select id="category" class="option__form-control">
          <option value="">Any category</option>
        </select>
      </div>
      <div class="option__form-group">
        <label for="difficulty">Difficulty</label>
        <select id="difficulty" class="option__form-control">
          <option value="">Any difficulty</option>
          <option value="&difficulty=easy">Easy</option>
          <option value="&difficulty=medium">Medium</option>
          <option value="&difficulty=hard">Hard</option>
        </select>
      </div>
      <div class="option__form-group">
        <label for="quizType">Quiz Type</label>
        <select id="quizType" class="option__form-control">
          <option value="">Any type</option>
          <option value="&type=multiple">Multiple Choice</option>
          <option value="&type=boolean">True / False</option>
        </select>
      </div>
      <div class="option__form-group" id="formButton">
        <button id="startButton" class="option__form-button">Start!</button>
        <button id="continueButton" class="option__form-button" onclick="window.location.href = '#/quiz';">Continue</button>
        <span id="messageContainer" style="text-align: center"></span>
      </div>
    `;

    const categories = await OpenTdbSource.category();
    const quizStatus = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    const categoryForm = this._shadowRoot.querySelector('#category');
    const messageContainer = this._shadowRoot.querySelector('#messageContainer');
    categories.trivia_categories.forEach((category) => {
      categoryForm.innerHTML += `<option value="&category=${category.id}">${category.name}</option>`;
    });

    if (quizStatus === 'running') {
      messageContainer.innerHTML = 'Quiz is in a progress!';
      this._shadowRoot.querySelector('#continueButton').style = 'display: inline';
      this._shadowRoot.querySelector('#startButton').style = 'display: none';
    }
    if (quizStatus === 'finished') {
      messageContainer.innerHTML = '<a href="#/result">Check your previous quiz result here!</a>';
    }
  }
}

customElements.define('option-form', OptionForm);
