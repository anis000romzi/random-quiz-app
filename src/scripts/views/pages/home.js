const Home = {
  async render() {
    return `
    <h2>Welcome~</h2>
    <option-form></option-form>
    `;
  },

  async afterRender() {
    // no context
  },
};

export default Home;
