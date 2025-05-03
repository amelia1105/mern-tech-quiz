import Quiz from '../../client/src/components/Quiz';

describe('Quiz Component', () => {

  // Intercept the API call to return fake data
  beforeEach(() => {
    cy.fixture('questions.json').then((questions) => {
      cy.intercept('GET', '/api/questions/random', questions).as('getRandomQuestions');
    });
  });

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
    cy.get('h2').should('contain.text', 'Quiz Completed');
    cy.get('div.alert').should('contain.text', `Your score: ${score}`);
    cy.get('button').contains('Take New Quiz').should('exist');
  };

  // Helper function to verify quiz has restarted
  const verifyQuestionUI = () => {
    cy.get('h2').should('contain.text', 'Which is the correct answer?');
    ['1', '2', '3', '4'].forEach(num => {
      cy.get('button').contains(num).should('exist');
    });
    ['Correct', 'Almost', 'Not Quite', 'Not Close'].forEach(text => {
      cy.get('div.alert').should('contain.text', text);
    });
  };

  // Verify the question is displayed
  it('should start the quiz and display the first question', () => {
    startQuiz();
    cy.get('button').contains('Start Quiz').should('not.exist');
    verifyQuestionUI();
  });

  // Verify clicking the correct answer shows a 1/1 score
  it('should answer a question correctly and complete the quiz with 1/1', () => {
    startQuiz();
    answerQuestion('1');
    verifyQuizCompletion('1/1');
  });

  // Verify clicking the wrong answer shows a 0/1 score
  it('should answer a question incorrectly and complete the quiz with a 0/1', () => {
    startQuiz();
    answerQuestion(Cypress._.sample(['2', '3', '4']));
    verifyQuizCompletion('0/1');
  });

  // Verify the quiz can be restarted after receiving a 1/1
  it('should restart the quiz after receiving a 1/1 score', () => {
    startQuiz();
    answerQuestion('1');
    verifyQuizCompletion('1/1');
    cy.get('button').contains('Take New Quiz').click();
    verifyQuestionUI();
  });

  // Verify the quiz can be restarted after receiving a 0/1 score
  it('should restart the quiz after receiving a 0/1 score', () => {
    startQuiz();
    answerQuestion(Cypress._.sample(['2', '3', '4']));
    verifyQuizCompletion('0/1');
    cy.get('button').contains('Take New Quiz').click();
    verifyQuestionUI();
    });
  });
