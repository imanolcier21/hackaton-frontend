import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './TopicPage.css';

const TopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { topics } = useApp();
  
  const topic = topics.find(t => t.id === parseInt(topicId));

  if (!topic) {
    return <div>Topic not found</div>;
  }

  // Create timeline items (lessons and quizzes interleaved)
  const timelineItems = [];
  const lessonsPerQuiz = Math.ceil(topic.lessons.length / (topic.quizzes.length + 1));
  
  let lessonIndex = 0;
  let quizIndex = 0;

  while (lessonIndex < topic.lessons.length || quizIndex < topic.quizzes.length) {
    // Add a group of lessons
    for (let i = 0; i < lessonsPerQuiz && lessonIndex < topic.lessons.length; i++) {
      timelineItems.push({
        type: 'lesson',
        data: topic.lessons[lessonIndex],
        index: lessonIndex
      });
      lessonIndex++;
    }

    // Add a quiz after the lesson group
    if (quizIndex < topic.quizzes.length) {
      timelineItems.push({
        type: 'quiz',
        data: topic.quizzes[quizIndex],
        index: quizIndex
      });
      quizIndex++;
    }
  }

  // Check if an item should be locked (not yet accessible)
  const isItemLocked = (item, itemIndex) => {
    if (itemIndex === 0) return false;
    
    // Check all previous items
    for (let i = 0; i < itemIndex; i++) {
      const prevItem = timelineItems[i];
      if (prevItem.type === 'lesson' && !prevItem.data.completed) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="topic-page">
      <header className="topic-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>{topic.name}</h1>
      </header>

      <div className="topic-content">
        <div className="timeline-header">
          <h2>Learning Path</h2>
          <p className="timeline-description">Follow the path below to complete this topic</p>
        </div>

        <div className="timeline">
          {timelineItems.map((item, index) => {
            const locked = isItemLocked(item, index);
            
            if (item.type === 'lesson') {
              return (
                <div key={`lesson-${item.index}`} className="timeline-item">
                  <div className="timeline-marker">
                    <div className={`timeline-dot ${item.data.completed ? 'completed' : ''} ${locked ? 'locked' : ''}`}>
                      {item.data.completed ? '✓' : locked ? '🔒' : index + 1}
                    </div>
                    {index < timelineItems.length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div 
                    className={`timeline-content lesson-content ${item.data.completed ? 'completed' : ''} ${locked ? 'locked' : ''}`}
                    onClick={() => !locked && navigate(`/topic/${topicId}/lesson/${item.data.id}`)}
                  >
                    <div className="timeline-badge lesson-badge">📚 Lesson</div>
                    <h3>{item.data.title}</h3>
                    {item.data.completed && <span className="status-text">Completed</span>}
                    {locked && <span className="status-text locked-text">Complete previous items first</span>}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={`quiz-${item.index}`} className="timeline-item">
                  <div className="timeline-marker">
                    <div className={`timeline-dot quiz-dot ${locked ? 'locked' : ''}`}>
                      {locked ? '🔒' : '?'}
                    </div>
                    {index < timelineItems.length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div 
                    className={`timeline-content quiz-content ${locked ? 'locked' : ''}`}
                    onClick={() => !locked && navigate(`/topic/${topicId}/quiz/${item.data.id}`)}
                  >
                    <div className="timeline-badge quiz-badge">🎯 Quiz</div>
                    <h3>{item.data.title}</h3>
                    <p className="quiz-info">{item.data.questions.length} questions</p>
                    {locked && <span className="status-text locked-text">Complete previous lessons first</span>}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
