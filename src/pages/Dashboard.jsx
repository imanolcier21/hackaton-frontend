import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import './Dashboard.css';

const Dashboard = () => {
  const { user, topics, addTopic, logout } = useApp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [topicName, setTopicName] = useState('');

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

        <div className="topics-grid">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="topic-card"
              onClick={() => navigate(`/topic/${topic.id}`)}
            >
              <h3>{topic.name}</h3>
              <div className="topic-stats">
                <span>{topic.lessons.length} lessons</span>
                <span>{topic.quizzes.length} quizzes</span>
              </div>
              <div className="topic-progress">
                {topic.lessons.filter(l => l.completed).length} / {topic.lessons.length} completed
              </div>
            </div>
          ))}
        </div>
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
