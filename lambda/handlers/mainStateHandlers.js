var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Helpers
var convertArrayToReadableString = require('../helpers/convertArrayToReadableString');
var jokeAPI = require('../helpers/jokeAPI');
var alexaDateUtil = require('../helpers/alexaDateUtil');

// Main Handlers
var mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function () {
    // Check for User Data in Session Attributes
    var userName = this.attributes['userName'];
    if (userName) {
      // Welcome User Back by Name
      this.emit(':ask', `Welcome back ${userName}! If you would like to hear a thoughtful quote, say tell me a quote.`, 'What would you like to do?');
    }
    else {
      this.handler.state = constants.states.ONBOARDING;
      this.emitWithState('NewSession');
    }
  },

  'MuseAnotherJoke': function () {
    // Get Quote from API
    jokeAPI.GetRandomJoke()
      .then((muse) => {
        // Get Organiser Name
        var author = muse.author;
        var quote = muse.quote ;

        var cardTitle = `${author}`;
        var cardContent = `${author} once said ${quote}!`;
        // Respond to User
        this.emit(':askWithCard', `${author} once said ${quote}!would you like to hear another? (Just say stop if you're done)`, 'How can i help?', cardTitle, cardContent);
      })
      .catch((error) => {
        console.log("MEETUP API ERROR: ", error);
        this.emit(':tell', 'Sorry, there was a problem accessing your skill API.');
      });
  },
  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', 'OK Go kill bugs!');
  },

  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', 'OK Good bug hunting!');
  },

  'SessionEndedRequest': function () {
    // Force State to Save when the user times out
    this.emit(':saveState', true);
  },

  'Unhandled': function () {
    this.emitWithState('AMAZON.HelpIntent');
  },

  'AMAZON.HelpIntent': function () {
    this.emit(':ask', `You can ask me for a quote by saying tell me a quote.`, 'You can ask me for a quote by saying tell me a quote would you like to do that?');
  }
})
module.exports = mainStateHandlers;
