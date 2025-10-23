import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Quiz.css';

const Quiz = () => {
  const { topicId, quizId } = useParams();
  const navigate = useNavigate();
  const { topics } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const topic = topics.find(t => t.id === parseInt(topicId));
  const quiz = topic?.quizzes.find(q => q.id === parseInt(quizId));

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = [...answers, { questionId: currentQuestion.id, selectedAnswer, isCorrect }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  if (showResult) {
    const percentage = (score / quiz.questions.length) * 100;
    return (
      <div className="quiz-page">
        <header className="quiz-header">
          <button onClick={() => navigate(`/topic/${topicId}`)} className="btn-back">
            ← Back to Topic
          </button>
          <h1>{quiz.title}</h1>
        </header>

        <div className="quiz-container">
          <div className="quiz-result">
            <h2>Quiz Complete!</h2>
            <div className="score-circle">
              <span className="score-text">{percentage.toFixed(0)}%</span>
            </div>
            <p className="score-detail">
              You got {score} out of {quiz.questions.length} questions correct
            </p>
            
            <div className="result-actions">
              <button onClick={handleRetry} className="btn-retry">Try Again</button>
              <button onClick={() => navigate(`/topic/${topicId}`)} className="btn-finish">
                Back to Topic
              </button>
            </div>

            <div className="answers-review">
              <h3>Review Your Answers</h3>
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[index];
                return (
                  <div key={question.id} className={`review-item ${userAnswer.isCorrect ? 'correct' : 'incorrect'}`}>
                    <p className="review-question">{index + 1}. {question.question}</p>
                    <p className="review-answer">
                      Your answer: {question.options[userAnswer.selectedAnswer]}
                      {!userAnswer.isCorrect && (
                        <span className="correct-answer">
                          {' '}(Correct: {question.options[question.correctAnswer]})
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <button onClick={() => navigate(`/topic/${topicId}`)} className="btn-back">
          ← Back to Topic
        </button>
        <h1>{quiz.title}</h1>
      </header>

      <div className="quiz-container">
        <div className="quiz-progress">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>

        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          <div className="options-list">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="btn-next"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
