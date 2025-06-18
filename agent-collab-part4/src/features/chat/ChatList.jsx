import { useEffect, useRef } from 'react'
import { Markdown } from '@/components/Markdown'
import { $messages } from '@/store/store'
import { useStore } from '@nanostores/react'
import { styled, keyframes } from '@/lib/stitches'

// === Animations ===
const fadeInUp = keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

// === Styled Components ===
const ChatContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  height: 'calc(100vh - 200px)',
  overflowY: 'auto',
  padding: '1rem',
  backgroundColor: 'var(--gray-2)',
  borderRadius: '12px',
  border: '1px solid var(--gray-6)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
})

const MessageWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
})

const MessageBubble = styled('div', {
  maxWidth: '80%',
  padding: '12px 16px',
  borderRadius: '18px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.5rem',
  lineHeight: 1.4,
  fontSize: '0.95rem',
  animation: `${fadeInUp} 0.2s ease-out`,
  variants: {
    role: {
      assistant: {
        backgroundColor: 'var(--accent-5)',
        color: 'var(--gray-12)',
      },
      user: {
        backgroundColor: 'var(--accent-a3)',
        color: 'var(--gray-12)',
        marginLeft: 'auto',
      },
    },
  },
})

const Avatar = styled('div', {
  fontSize: '1.25rem',
  userSelect: 'none',
})

// === Component ===
function ChatList() {
  const messages = useStore($messages)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <ChatContainer>
      {messages.map((msg) => (
        <MessageWrapper key={`message-${msg.id}`}>
          <MessageBubble role={msg.role}>
            <Markdown content={msg.content || ''} />
          </MessageBubble>
        </MessageWrapper>
      ))}
      <div ref={bottomRef} />
    </ChatContainer>
  )
}

export default ChatList
