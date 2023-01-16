import RandomQuizIdb from '../../data/random-quiz-idb';
import CONFIG from '../../globals/config';

const Result = {
  async render() {
    return `
      <h2>Result</h2>
      <div class="stats-container">
        <p class="stats-item" id="correct"></p>
        <p class="stats-item" id="wrong"></p>
      </div>
      <div class="score-container">
        <strong id="score"></strong>
      </div>
      <div class="quiz-container"></div>
      <a id="continueQuiz" href="#/quiz"><i class="fa-solid fa-arrow-left"></i> Continue</a>
      <a id="backToHome" href="#/home">Back to home <i class="fa-solid fa-arrow-right"></i></a>
    `;
  },

  async afterRender() {
    let correctAnswer = 0;
    let wrongAnswer = 0;
    const quizStatus = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    const correctContainer = document.querySelector('#correct');
    const wrongContainer = document.querySelector('#wrong');
    const scoreContainer = document.querySelector('#score');
    const quizContainer = document.querySelector('.quiz-container');
    if (quizStatus === 'running') {
      quizContainer.innerHTML += '<span>Quiz is in a progress!</span>';
      quizContainer.style = 'text-align: center';
      document.querySelector('#continueQuiz').style = 'display: inline';
    } else if (quizStatus === 'idle') {
      quizContainer.innerHTML += '<span>Quiz hasn\'t started yet!</span>';
      quizContainer.style = 'text-align: center';
    } else {
      const quizzes = await RandomQuizIdb.getAllQuizzes();
      quizzes.forEach((quiz) => {
        const quizItem = document.createElement('quiz-item');
        quizItem.setAttribute('tabindex', '0');
        quizItem.dataSource = quiz;
        quizContainer.appendChild(quizItem);
        if (quiz.selected_answer === quiz.correct_answer) {
          correctAnswer += 1;
        } else {
          wrongAnswer += 1;
        }
      });
      const score = (correctAnswer / (correctAnswer + wrongAnswer)) * 100;
      correctContainer.innerHTML = `Correct Answer <strong>${correctAnswer}</strong>`;
      wrongContainer.innerHTML = `Wrong Answer <strong>${wrongAnswer}</strong>`;
      scoreContainer.innerHTML = `${Math.round(score)}%`;
    }
  },
};

export default Result;
