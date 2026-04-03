import { useState } from 'react'
import { Search, LogOut, MessageSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Avatar({ src, name, size = 'md', online }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-12 h-12 text-sm' }
  const dotSizes = { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3' }

  return (
    <div className="relative shrink-0">
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-[oklch(0.65_0.2_250)]/20 border border-[oklch(0.65_0.2_250)]/30 flex items-center justify-center font-semibold text-[oklch(0.65_0.2_250)] uppercase`}>
          {name?.[0]}
        </div>
      )}
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full border-2 border-[oklch(0.17_0.005_260)] ${online ? 'bg-[oklch(0.72_0.19_145)]' : 'bg-[oklch(0.40_0_0)]'}`} />
      )}
    </div>
  )
}

export default function Sidebar({ contacts, chatPartners, selectedContact, onSelectContact, loading }) {
  const [search, setSearch] = useState('')
  const { user, logout } = useAuth()

  const filterList = (list) => list.filter(c =>
    c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const chatPartnerIds = new Set(chatPartners.map(c => c._id))
  const filteredChatPartners = filterList(chatPartners)
  const filteredContacts = filterList(contacts).filter(c => !chatPartnerIds.has(c._id))

  const ContactItem = ({ contact }) => (
    <button
      key={contact._id}
      onClick={() => onSelectContact(contact)}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[oklch(0.22_0.005_260)] ${
        selectedContact?._id === contact._id ? 'bg-[oklch(0.25_0.008_260)] border-r-2 border-[oklch(0.65_0.2_250)]' : ''
      }`}
    >
      <Avatar src={contact.profilePic} name={contact.fullName} online={false} />
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-medium text-white truncate">{contact.fullName}</p>
        <p className="text-xs text-[oklch(0.50_0_0)] truncate">{contact.email}</p>
      </div>
    </button>
  )

  return (
    <div className="flex flex-col h-full bg-[oklch(0.17_0.005_260)] border-r border-[oklch(0.28_0.005_260)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[oklch(0.28_0.005_260)]">
        <div className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.2_250)] flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
          <p className="text-xs text-[oklch(0.72_0.19_145)]">● Online</p>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-lg text-[oklch(0.55_0_0)] hover:text-white hover:bg-[oklch(0.25_0.005_260)] transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[oklch(0.50_0_0)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-[oklch(0.22_0.005_260)] border border-[oklch(0.28_0.005_260)] text-white placeholder-[oklch(0.45_0_0)] text-xs focus:outline-none focus:border-[oklch(0.65_0.2_250)] transition-colors"
          />
        </div>
      </div>

      {/* Contact Lists */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-[oklch(0.65_0.2_250)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Recent Chats */}
            {filteredChatPartners.length > 0 && (
              <>
                <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[oklch(0.45_0_0)]">
                  Recent Chats
                </p>
                {filteredChatPartners.map(contact => (
                  <ContactItem key={contact._id} contact={contact} />
                ))}
                <div className="mx-4 my-1 border-t border-[oklch(0.28_0.005_260)]" />
              </>
            )}

            {/* All Contacts */}
            <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[oklch(0.45_0_0)]">
              All Contacts
            </p>
            {filteredContacts.length === 0 ? (
              <p className="px-4 py-2 text-xs text-[oklch(0.40_0_0)]">No contacts found</p>
            ) : (
              filteredContacts.map(contact => (
                <ContactItem key={contact._id} contact={contact} />
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}

export { Avatar }
