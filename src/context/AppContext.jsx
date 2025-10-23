import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([
    {
      id: 1,
      name: 'Introduction to React',
      lessons: [
        { id: 1, title: 'What is React?', completed: false },
        { id: 2, title: 'JSX Basics', completed: false },
        { id: 3, title: 'Components', completed: false }
      ],
      quizzes: [
        {
          id: 1,
          title: 'React Fundamentals Quiz',
          questions: [
            {
              id: 1,
              question: 'What is React?',
              options: ['A library', 'A framework', 'A language', 'A database'],
              correctAnswer: 0
            },
            {
              id: 2,
              question: 'What does JSX stand for?',
              options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'Java XML'],
              correctAnswer: 0
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'JavaScript Basics',
      lessons: [
        { id: 1, title: 'Variables and Data Types', completed: false },
        { id: 2, title: 'Functions', completed: false }
      ],
      quizzes: [
        {
          id: 1,
          title: 'JavaScript Quiz',
          questions: [
            {
              id: 1,
              question: 'Which keyword is used to declare a constant?',
              options: ['var', 'let', 'const', 'static'],
              correctAnswer: 2
            }
          ]
        }
      ]
    }
  ]);

  const [currentLesson, setCurrentLesson] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const login = (username, password) => {
    // Simple mock login - no encryption
    setUser({ username });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addTopic = (topicName) => {
    const newTopic = {
      id: topics.length + 1,
      name: topicName,
      lessons: [],
      quizzes: []
    };
    setTopics([...topics, newTopic]);
  };

  const completeLesson = (topicId, lessonId) => {
    setTopics(topics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          lessons: topic.lessons.map(lesson => 
            lesson.id === lessonId ? { ...lesson, completed: true } : lesson
          )
        };
      }
      return topic;
    }));
  };

  const addChatMessage = (message, isUser = false) => {
    setChatMessages(prevMessages => [...prevMessages, { message, isUser, timestamp: new Date() }]);
  };

  const resetChat = () => {
    setChatMessages([]);
  };

  // Mock AI responses
  const getMockResponse = (userMessage) => {
    const responses = [
      "That's a **great question**! Let me explain...\n\n- First, we need to understand the basics\n- Then, we can move to more advanced concepts\n- Finally, we'll practice with examples",
      "I see what you're asking. Here's how it works:\n\n1. Start with the fundamentals\n2. Build on that knowledge\n3. Apply it in real scenarios",
      "**Excellent observation!** The key concept here is understanding how everything connects together.\n\n`Remember`: Practice makes perfect!",
      "Let me break that down for you:\n\n- **Core concept**: This is the foundation\n- **Implementation**: How we use it in practice\n- **Best practices**: Tips for success",
      "That's correct! You're getting the hang of it. 🎉\n\n*Keep up the great work!*",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const value = {
    user,
    topics,
    currentLesson,
    chatMessages,
    login,
    logout,
    addTopic,
    setCurrentLesson,
    completeLesson,
    addChatMessage,
    resetChat,
    getMockResponse
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
