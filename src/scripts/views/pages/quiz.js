import RandomQuizIdb from '../../data/random-quiz-idb';
import CONFIG from '../../globals/config';

const Quiz = {
  async render() {
    return `
      <h2 id="quizPageTitle">Good Luck :)</h2>
      <div class="quiz-container">
        <div class="loader-container">
          <div class="lds-dual-ring"></div>
        </div>
      </div>
      <finish-button></finish-button>
      <surrender-button></surrender-button>
    `;
  },

  async afterRender() {
    const loader = document.querySelector('.loader-container');
    const quizContainer = document.querySelector('.quiz-container');
    const quizStatus = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    const quizzes = await RandomQuizIdb.getAllQuizzes();
    loader.style = 'display: none';
    quizzes.forEach((quiz) => {
      const quizItem = document.createElement('quiz-item');
      quizItem.setAttribute('tabindex', '0');
      quizItem.dataSource = quiz;
      quizContainer.appendChild(quizItem);
    });
    if (quizStatus === 'finished') {
      document.querySelector('#quizPageTitle').innerHTML = 'Quiz Finished!';
    } else if (quizStatus === 'idle') {
      document.querySelector('#quizPageTitle').innerHTML = 'Quiz hasn\'t started yet!';
    }
  },
};

export default Quiz;
