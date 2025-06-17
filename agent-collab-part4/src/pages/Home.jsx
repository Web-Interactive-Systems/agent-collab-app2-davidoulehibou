import { Resizable } from '@/components/Resizable'
import Chat from '@/features/chat/Chat'
import { Flex } from '@radix-ui/themes'

function Home() {
  return (
    <Flex
      gap='8'
      width='100%'
      height='100%'>

      <Resizable
        defaultSize={{ width: 550 }}
        class='resizable'
        style={{
          background: 'var(--focus-a3)',
          borderLeft: '1px solid var(--gray-9)',
          marginLeft: 'auto',
        }}
        enable={{
          top: false,
          right: false,
          bottom: false,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}>
        <Chat />
      </Resizable>
    </Flex>
  )
}

export default Home
