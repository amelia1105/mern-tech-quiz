describe('Quiz Component', () => {
  
  // Helper function to start the quiz
  const startQuiz = () => {
    cy.visit('/');
    cy.get('button').contains('Start Quiz').click();
  };

  // Helper function to answer all questions
  const answerAllQuestions = (answer = '1', totalQuestions = 10) => {
    for (let i = 1; i <= totalQuestions; i++) {
      cy.get('button').contains(answer).click();
    }
  };

  // Verify the first question is displayed
  it('should start the quiz and display the first question', () => {
    startQuiz();
    cy.get('h2').should('not.be.empty'); 
  });

  // Verify the quiz completion message
  it('should answer questions and complete the quiz', () => {
    startQuiz();
    answerAllQuestions();
    cy.get('h2').contains('Quiz Completed'); 
  });

  it('should restart the quiz after completion', () => {
    startQuiz();
    answerAllQuestions();
    cy.get('h2').contains('Quiz Completed'); // Verify the quiz completion message
    cy.get('button').contains('Take New Quiz').click(); // Restart the quiz
    cy.get('h2').should('not.be.empty'); // Verify the first question is displayed again
    cy.get('button').contains('1'); // Verify at least one answer option is displayed again
  });
});
