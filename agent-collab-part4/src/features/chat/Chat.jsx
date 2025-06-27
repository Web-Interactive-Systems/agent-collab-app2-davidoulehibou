import { Flex } from '@radix-ui/themes'
import ChatList from './ChatList'
import ChatPrompt from './ChatPrompt'

function Chat() {
  return (
    <Flex
      direction='column'
      gap='4'
      width='100%'
      height='100%'
      p='1'>
      <ChatList />
      
    </Flex>
  )
}

export default Chat
