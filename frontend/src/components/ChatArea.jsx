import { useEffect, useRef, useState } from 'react'
import { Send, ImageIcon, Phone, Video, ArrowLeft, Loader2 } from 'lucide-react'
import { Avatar } from './Sidebar'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function ChatArea({ contact, onBack }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    if (contact) fetchMessages()
  }, [contact])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    setLoading(true)
    setMessages([])
    try {
      const res = await api.get(`/messages/${contact._id}`)
      setMessages(Array.isArray(res.data) ? res.data : res.data ? [res.data] : [])
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result)
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() && !image) return
    setSending(true)
    try {
      const res = await api.post(`/messages/send/${contact._id}`, {
        text: text.trim(),
        image,
      })
      setMessages(prev => [...prev, res.data])
      setText('')
      setImage(null)
      setImagePreview(null)
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div className="flex flex-col h-full bg-[oklch(0.13_0.005_260)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[oklch(0.28_0.005_260)] bg-[oklch(0.17_0.005_260)]">
        <button
          onClick={onBack}
          className="md:hidden p-1.5 rounded-lg text-[oklch(0.55_0_0)] hover:text-white hover:bg-[oklch(0.25_0.005_260)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Avatar src={contact.profilePic} name={contact.fullName} size="sm" online={false} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{contact.fullName}</p>
          <p className="text-xs text-[oklch(0.50_0_0)]">{contact.email}</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-[oklch(0.55_0_0)] hover:text-white hover:bg-[oklch(0.25_0.005_260)] transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-[oklch(0.55_0_0)] hover:text-white hover:bg-[oklch(0.25_0.005_260)] transition-colors">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 messages-container space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-[oklch(0.65_0.2_250)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[oklch(0.40_0_0)]">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Say hello to {contact.fullName}!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderId === user?._id
            return (
              <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="attachment"
                      className={`rounded-xl max-w-xs object-cover ${isMine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                    />
                  )}
                  {msg.text && (
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? 'bg-[oklch(0.55_0.18_250)] text-white rounded-br-sm'
                        : 'bg-[oklch(0.22_0.005_260)] text-white rounded-bl-sm border border-[oklch(0.28_0.005_260)]'
                    }`}>
                      {msg.text}
                    </div>
                  )}
                  <p className="text-[10px] text-[oklch(0.45_0_0)] px-1">
                    {msg.createdAt ? formatTime(msg.createdAt) : ''}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 py-2 border-t border-[oklch(0.28_0.005_260)]">
          <div className="relative inline-block">
            <img src={imagePreview} alt="preview" className="h-20 rounded-lg object-cover" />
            <button
              onClick={() => { setImage(null); setImagePreview(null) }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
            >✕</button>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-4 border-t border-[oklch(0.28_0.005_260)] bg-[oklch(0.17_0.005_260)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl text-[oklch(0.55_0_0)] hover:text-white hover:bg-[oklch(0.25_0.005_260)] transition-colors shrink-0"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[oklch(0.22_0.005_260)] border border-[oklch(0.28_0.005_260)] text-white placeholder-[oklch(0.40_0_0)] text-sm focus:outline-none focus:border-[oklch(0.65_0.2_250)] transition-colors"
          />
          <button
            type="submit"
            disabled={sending || (!text.trim() && !image)}
            className="p-2.5 rounded-xl bg-[oklch(0.65_0.2_250)] text-white hover:bg-[oklch(0.60_0.2_250)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  )
}
