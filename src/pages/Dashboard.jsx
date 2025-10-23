import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import './Dashboard.css';

const Dashboard = () => {
  const { user, topics, addTopic, logout, fetchTopics } = useApp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [topicName, setTopicName] = useState('');

  // Refresh topics when returning to dashboard
  useEffect(() => {
    if (user) {
      fetchTopics();
    }
  }, [user]);

  const handleCreateTopic = () => {
    if (topicName.trim()) {
      addTopic(topicName);
      setTopicName('');
      setShowModal(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <button onClick={() => setShowModal(true)} className="btn-create">
            Create new topic
          </button>
        </div>

        {topics.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No topics yet. Create your first topic to get started!</p>
          </div>
        ) : (
          <div className="topics-grid">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="topic-card"
                onClick={() => navigate(`/topic/${topic.id}`)}
              >
                <h3>{topic.name}</h3>
                <div className="topic-stats">
                  <span>{topic.lesson_count || 0} lessons</span>
                  <span>{topic.quiz_count || 0} quizzes</span>
                </div>
                <div className="topic-progress">
                  {topic.completed_lessons || 0} / {topic.lesson_count || 0} completed
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>Create New Topic</h2>
          <div className="form-group">
            <label htmlFor="topicName">Topic Name</label>
            <input
              type="text"
              id="topicName"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Enter topic name"
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateTopic} className="btn-primary">
              Create
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
