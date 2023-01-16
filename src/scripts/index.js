import 'regenerator-runtime';
import '../styles/style.css';
import './views/components/option-form';
import './views/components/quiz-item';
import './views/components/finish-button';
import './views/components/surrender-button';
import App from './app';
import swRegister from './helpers/sw-register';

const app = new App(document.querySelector('#mainContent'));

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  app.renderPage();
  swRegister();
});
