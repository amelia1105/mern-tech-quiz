import Quiz from '../../client/src/components/Quiz';

describe('Quiz Component', () => {

  // Helper function to start quiz
  const startQuiz = () => {
    cy.mount(<Quiz />);
    cy.get('button').contains('Start Quiz').click();
  };

  // Helper function to answer questions
  const answerQuestion = (answerText) => {
    cy.get('button').contains(answerText).click();
  };

  // Helper function to verify quiz completion
  const verifyQuizCompletion = (score) => {
    cy.get('div.alert').should('contain.text', `Your score: ${score}`);
    cy.get('h2').should('contain.text', 'Quiz Completed');
  };

  // Intercept the API call to return fake data
  beforeEach(() => {
    cy.fixture('questions.json').then((questions) => {
      cy.intercept('GET', '/api/questions/random', questions).as('getRandomQuestions');
    });
  });

  // Verify the question is displayed
  it('should start the quiz and display the first question', () => {
    startQuiz();
    cy.get('h2').should('contain.text', 'Which is the correct answer?');
    cy.get('button').contains('1').should('exist');
  });

  // Verify the quiz can be completed
  it('should answer questions and complete the quiz', () => {
    startQuiz();
    answerQuestion('1');
    verifyQuizCompletion('1/1');
  });

  // Verify the quiz can be restarted
  it('should restart the quiz after completion', () => {
    startQuiz();
    answerQuestion('1');
    verifyQuizCompletion('1/1');
    cy.get('button').contains('Take New Quiz').click();
    cy.get('h2').should('contain.text', 'Which is the correct answer?');
    cy.get('button').contains('1').should('exist');
  });
});
