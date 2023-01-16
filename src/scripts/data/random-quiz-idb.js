import { openDB } from 'idb';
import CONFIG from '../globals/config';

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = CONFIG;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'number' });
  },
});

const RandomQuizIdb = {
  async getQuiz(number) {
    return (await dbPromise).get(OBJECT_STORE_NAME, number);
  },
  async getAllQuizzes() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async putQuiz(quiz) {
    return (await dbPromise).put(OBJECT_STORE_NAME, quiz);
  },
  async deleteQuiz(number) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, number);
  },
  async deleteAllQuizzes() {
    return (await dbPromise).clear(OBJECT_STORE_NAME);
  },
};

export default RandomQuizIdb;
