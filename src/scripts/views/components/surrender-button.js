import CONFIG from '../../globals/config';
import RandomQuizIdb from '../../data/random-quiz-idb';

class SurrenderButton extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._shadowRoot.innerHTML = `
    <style>
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }

      button {
        border: black 1px solid;
        border-radius: 10px;
        background-color: red;
        color: white;
        font-family: "Comfortaa";
        font-weight: 500;
        font-size: 1.5em;
        min-height: 44px;
        padding: 10px 20px;
        cursor: pointer;
      }

      button:hover {
        background-color: var(--ruby);
      }
    </style>

    <button>Surrender!</button>
    `;

    const quizStatus = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    const buttonElement = this._shadowRoot.querySelector('button');

    buttonElement.addEventListener('click', async () => {
      localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, 'idle');
      window.location.href = '#/home';
      await RandomQuizIdb.deleteAllQuizzes();
    });

    if (quizStatus === 'finished') {
      buttonElement.style = 'display: none';
    } else if (quizStatus === 'idle') {
      buttonElement.innerHTML = 'Back to Home!';
    }
  }
}

customElements.define('surrender-button', SurrenderButton);
