import { useState } from 'react'
import ChatSidebar from './components/ChatSidebar'
import ChatWindow from './components/ChatWindow'

function App() {
  const [activeChat, setActiveChat] = useState('1')
  const [conversations] = useState([
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      lastMessage: 'Hey, how are you?',
      time: '2m ago'
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      lastMessage: 'The project is looking great!',
      time: '1h ago'
    },
    {
      id: '3',
      name: 'Team Chat',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Team',
      lastMessage: 'Meeting at 3 PM',
      time: '2h ago'
    }
  ])

  const [messages] = useState([
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      text: 'Hey, how are you?',
      time: '2:30 PM',
      isSent: false
    },
    {
      id: 2,
      text: 'I\'m good, thanks! How about you?',
      time: '2:31 PM',
      isSent: true
    },
    {
      id: 3,
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      text: 'Doing great! Working on the new project.',
      time: '2:32 PM',
      isSent: false
    }
  ])

  const handleSendMessage = (message) => {
    console.log('Sending message:', message)
    // Here you would typically add the message to your messages state
    // and handle the API call to your backend
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        conversations={conversations}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
      />
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default App
