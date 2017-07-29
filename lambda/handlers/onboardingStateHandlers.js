var Alexa = require('alexa-sdk');

// Constants
var constants = require('../constants/constants');

// Helpers
var meetupAPI = require('../helpers/jokeAPI');

// Onboarding Handlers
var onboardingStateHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'NewSession': function () {
    // Check for User Data in Session Attributes
    //this.emit(':tell', `OK we are live`)
    var userName = this.attributes['userName'];
    var programmingLanguage = this.attributes['programmingLanguage'];
    if (userName) {
      if (programmingLanguage) {
        // Welcome User Back by Name
        this.emit(':ask', `Welcome back ${userName} you ${programmingLanguage} geek! Let me tell you a programming quote.`,  `What would you like hear?`);
      } else {
        // Get their programming Language
        this.emit(':ask', `Welcome back ${userName}! You can ask for a quote. But first, I\'d like to get to know you  a little better. Can you please tell me your favorite programming language by saying: My programming language is , and then the language.`, 'Tell me your favorite programming language by saying: My programming language is , and then the language.');
      }
    } else {
      // Welcome User for the First Time
      this.emit(':ask', `Welcome to Programmers muse! The skill that gives you a daily thoughtful quote. You can ask me for a quote. But first, I\'d like to get to know you better. Tell me your name by saying: My name is, and then your name.`, 'Tell me your name by saying: My name is, and then your name.');
    }
  },
  'NameCapture': function () {
    // Get Slot Values
    var USFirstNameSlot = this.event.request.intent.slots.USFirstName.value;
    var UKFirstNameSlot = this.event.request.intent.slots.UKFirstName.value;

    // Get Name
    var name;
    if (USFirstNameSlot) {
      name = USFirstNameSlot;
    } else if (UKFirstNameSlot) {
      name = UKFirstNameSlot;
    }

    // Save Name in Session Attributes and Ask for Country
    if (name) {
      this.attributes['userName'] = name;
      this.emit(':ask', `Ok ${name}! Tell me your favorite programming language by saying: my favorite language is, and then the programming language.`, `Tell me your favorite programming language by saying: my favorite language is, and then the programming language`);
    } else {
      this.emit(':ask', `Sorry, I didn\'t recognise your name!`, `Try again by saying: my name is, and then your name.`);
    }
  },

  'LanguageCapture': function () {
    // Get Slot Values
    var PLanguage = this.event.request.intent.slots.PLanguage.value;

    // Get User Name from Session Attributes
    var userName = this.attributes['userName'];

    // Save Name in Session Attributes and Ask for Country
    if (PLanguage) {
      this.attributes['PLanguage'] = PLanguage;

      // Change State to Main
      this.handler.state = constants.states.MAIN;

      this.emit(':ask', `Ok ${userName}! you ${PLanguage} geek, Lets find you a motivational quote.  Ask me for a quote?`, `What would you like to do?`);
    } else {
      this.emit(':ask', `Sorry, I didn\'t recognise that language!`, `Try again by saying: my favorite language is, and then the programming language.`);
    }
  },


  'AMAZON.StopIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Happy bug writing.`);
  },
  'AMAZON.CancelIntent': function () {
    // State Automatically Saved with :tell
    this.emit(':tell', `Go slay them bug killer.`);
  },
  'SessionEndedRequest': function () {
    // Force State Save When User Times Out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent' : function () {
    // Account Not Linked
    this.emit(':say', `Please say tell me a quote`, `Please say tell me a quote`);
  },
  'Unhandled' : function () {
    // Account Not Linked
    this.emit(':tell', `Sorry let's start again.`);
  }

});

module.exports = onboardingStateHandlers;
