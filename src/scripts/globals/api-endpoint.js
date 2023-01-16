import CONFIG from './config';

const API_ENDPOINT = {
  QUIZ: ({
    number,
    category,
    difficulty,
    type,
  }) => `${CONFIG.BASE_URL}${number}${category}${difficulty}${type}`,
  CATEGORY: `${CONFIG.BASE_CATEGORY_URL}`,
};

export default API_ENDPOINT;
