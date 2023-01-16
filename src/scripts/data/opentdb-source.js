import API_ENDPOINT from '../globals/api-endpoint';

class OpenTdbSource {
  static async quiz({
    number,
    category,
    difficulty,
    type,
  }) {
    try {
      const response = await fetch(API_ENDPOINT.QUIZ({
        number,
        category,
        difficulty,
        type,
      }));
      const responseJson = response.json();
      return responseJson;
    } catch (error) {
      if (error instanceof TypeError) {
        return 'Make sure you\'re connected to the internet!';
      }
      return error;
    }
  }

  static async category() {
    const response = await fetch(API_ENDPOINT.CATEGORY);
    const responseJson = response.json();
    return responseJson;
  }
}

export default OpenTdbSource;
