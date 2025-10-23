import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import './LessonChat.css';

const LessonChat = () => {
  const { topicId, lessonId } = useParams();
  const navigate = useNavigate();
  const { topics, chatMessages, addChatMessage, resetChat, getMockResponse, completeLesson } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const initializedRef = useRef(false);

  const topic = topics.find(t => t.id === parseInt(topicId));
  const lesson = topic?.lessons.find(l => l.id === parseInt(lessonId));

  useEffect(() => {
    if (!initializedRef.current && lesson) {
      resetChat();
      // Initial greeting from the character
      addChatMessage(`Hello! Welcome to **"${lesson.title}"**. I'm here to help you learn. Feel free to ask me anything!`, false);
      initializedRef.current = true;
    }
    
    return () => {
      initializedRef.current = false;
    };
  }, [lessonId, lesson?.title]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      addChatMessage(inputMessage, true);
      setInputMessage('');
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const response = getMockResponse(inputMessage);
        addChatMessage(response, false);
      }, 1000);
    }
  };

  const handleFinishLesson = () => {
    completeLesson(parseInt(topicId), parseInt(lessonId));
    navigate(`/topic/${topicId}`);
  };

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="lesson-chat">
      <header className="lesson-header">
        <button onClick={() => navigate(`/topic/${topicId}`)} className="btn-back">
          ← Back to Topic
        </button>
        <h1>{lesson.title}</h1>
      </header>

      <div className="chat-container">
        <div className="character-avatar">
          <div className="avatar">🎓</div>
          <span className="character-name">AI Tutor</span>
        </div>

        <div className="messages-container">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}>
              <div className="message-bubble">
                <ReactMarkdown>{msg.message}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit" className="btn-send">Send</button>
        </form>

        <div className="lesson-actions">
          <button onClick={handleFinishLesson} className="btn-finish">
            I have understood everything
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonChat;
