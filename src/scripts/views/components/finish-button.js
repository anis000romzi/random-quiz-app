import CONFIG from '../../globals/config';

class FinishButton extends HTMLElement {
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
        background-color: var(--maximum-yellow);
        font-family: "Comfortaa";
        font-weight: 500;
        font-size: 1.5em;
        min-height: 44px;
        padding: 10px 20px;
        cursor: pointer;
      }

      button:hover {
        background-color: #f3b93b;
      }
    </style>

    <button>Finish Quiz!</button>
    `;

    const quizStatus = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    const buttonElement = this._shadowRoot.querySelector('button');

    buttonElement.addEventListener('click', () => {
      localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, 'finished');
      window.location.href = '#/result';
    });

    if (quizStatus === 'finished') {
      buttonElement.innerHTML = 'Restart Quiz!';
      buttonElement.addEventListener('click', () => {
        window.location.href = '#/home';
      });
    } else if (quizStatus === 'idle') {
      buttonElement.style = 'display: none';
    }
  }
}

customElements.define('finish-button', FinishButton);
