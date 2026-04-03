import { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import api from '../lib/api'

export default function Chat() {
  const [contacts, setContacts] = useState([])
  const [chatPartners, setChatPartners] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [loadingContacts, setLoadingContacts] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [selectedContact])

  const fetchContacts = async () => {
    try {
      const [contactsRes, chatsRes] = await Promise.all([
        api.get('/messages/contacts'),
        api.get('/messages/chats'),
      ])
      setContacts(contactsRes.data)
      setChatPartners(chatsRes.data)
    } catch (err) {
      console.error('Failed to fetch contacts:', err)
    } finally {
      setLoadingContacts(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`${selectedContact ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] lg:w-[360px] shrink-0 flex-col`}>
        <Sidebar
          contacts={contacts}
          chatPartners={chatPartners}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          loading={loadingContacts}
        />
      </div>

      {/* Chat Area */}
      <div className={`${selectedContact ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {selectedContact ? (
          <ChatArea
            contact={selectedContact}
            onBack={() => setSelectedContact(null)}
            onMessageSent={fetchContacts}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[oklch(0.13_0.005_260)] text-[oklch(0.45_0_0)]">
      <div className="w-16 h-16 rounded-2xl bg-[oklch(0.65_0.2_250)]/10 border border-[oklch(0.65_0.2_250)]/20 flex items-center justify-center mb-5">
        <MessageSquare className="w-8 h-8 text-[oklch(0.65_0.2_250)]/60" />
      </div>
      <h2 className="text-lg font-medium text-white mb-2">Welcome to Chatify</h2>
      <p className="text-sm text-center max-w-xs leading-relaxed">
        Select a contact from the sidebar to start a conversation
      </p>
    </div>
  )
}
