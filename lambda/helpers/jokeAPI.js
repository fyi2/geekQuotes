var request = require('request-promise');

module.exports = {

  GetRandomJoke: () => {
    return new Promise((resolve, reject) => {
      request({
        url: "http://quotes.stormconsultancy.co.uk/random.json",
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        // Return User Details
        resolve(JSON.parse(response));
      })
      .catch((error) => {
        // API Error
        reject('Joke API Error: ', error);
      });
    });
  }
};
