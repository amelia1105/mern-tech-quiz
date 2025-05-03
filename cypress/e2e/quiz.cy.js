describe('Quiz E2E', () => {
  
  // Helper function to start the quiz
  const startQuiz = () => {
    cy.visit('/');
    cy.contains('button', 'Start Quiz', { timeout: 5000 }).click();
  };

  // Helper function to answer all questions
  const answerAllQuestions = (totalQuestions = 10) => {
    for (let i = 1; i <= totalQuestions; i++) {
      const randomAnswer = Math.floor(Math.random() * 4) + 1; // Generate a random number between 1 and 4
      cy.contains('button', randomAnswer.toString(), { timeout: 5000 }).click();
    }
  };

  // Helper to display a random question
  const randomQuestion = () => {
    cy.get('h2', { timeout: 5000 }).should('not.be.empty');
    ['1', '2', '3', '4'].forEach(num => {
      cy.contains('button', num).should('exist');
    });
    cy.get('div.alert', { timeout: 5000 }).should('not.be.empty');
  };

  // Verify the first question is displayed
  it('should start the quiz and display the first question', () => {
    startQuiz();
    randomQuestion();
  });

  // Verify the quiz completion message
  it('should answer questions and complete the quiz', () => {
    startQuiz();
    answerAllQuestions();
    cy.get('h2', { timeout: 5000 }).should('contain.text', 'Quiz Completed');
    cy.get('div.alert').should('contain.text', 'Your score:').invoke('text').then((text) => {
      const match = text.match(/Your score: (\d+)\/10/);
      expect(match, 'score format').to.not.be.null;

      if (!match) {
        throw new Error('Score format is invalid');
      }
      
      const [_, scoreStr] = match;
      const score = parseInt(scoreStr);
      expect(score).to.be.within(0, 10);
    });
    cy.contains('button', 'Take New Quiz').should('exist');
  });

  // Verify the quiz is restarted after completion
  it('should restart the quiz after completion', () => {
    startQuiz();
    answerAllQuestions();
    cy.contains('button', 'Take New Quiz').click();
    randomQuestion();
  });

  // Verify the quiz can be taken multiple times
  it('should allow multiple quiz attempts without crashing', () => {
    startQuiz();
    answerAllQuestions();
    cy.contains('button', 'Take New Quiz').click();
    answerAllQuestions();
    cy.get('h2').should('contain.text', 'Quiz Completed');
    cy.get('div.alert').should('contain.text', 'Your score:');
  });
});
