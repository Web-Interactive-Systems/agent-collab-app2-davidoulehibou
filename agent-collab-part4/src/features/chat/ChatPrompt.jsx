import { onAgent } from '@/actions/agent'
import { styled } from '@/lib/stitches'
import { $chatAgents, $fichesPersos, $messages, addFiche, addMessage, updateMessages } from '@/store/store'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { Button, Flex, TextArea } from '@radix-ui/themes'
import { useRef, useState } from 'react'
import { AgentMenu } from './AgentMenu'
import { AgentSelect } from './AgentSelect'
import { useStore } from '@nanostores/react'
import { isEmpty } from 'lodash'
import { extractJSONString } from '@/lib/json'

const PromptContainer = styled(Flex, {
  width: '100%',
  padding: '12px 18px',
  borderRadius: '18px',
  background: 'var(--accent-2)',
})

const PromptArea = styled(TextArea, {
  width: '100%',
  boxShadow: 'none',
  outline: 'none',
  background: 'none',
  '& textarea': {
    fontSize: '1.1rem',
    fontWeight: 450,
  },
})

function constructCtxArray(originalArray) {
  const result = []
  if (originalArray.length > 3) result.push(originalArray.at(-3), originalArray.at(-2))
  if (originalArray.length > 1) result.push(originalArray[1])
  if (originalArray.length > 0) result.push(originalArray[0])
  return result
}

function ChatPrompt() {
  const promptRef = useRef(null)
  const [isPromptEmpty, setIsPromptEmpty] = useState(true)

  const chatAgents = useStore($chatAgents)
  //  const messages = useStore($messages)

  const onTextChange = () => {
    const val = promptRef.current.value || ''
    setIsPromptEmpty(val.trim().length === 0)
  }

  const onSendPrompt = async () => {
    const prompt = promptRef.current.value
    console.log('onSendPrompt', prompt)

    addMessage({
      role: 'user',
      content: prompt,
      id: Math.random().toString(),
    })

    const messages = $messages.get()
    const contextInputs = constructCtxArray(messages)

    // AI response
    const response = {
      role: 'assistant',
      content: '',
      id: Math.random().toString(),
      completed: false, // not complete yet
    }

    // add AI response to chat messages
    addMessage(response)

/*
    console.log(contextInputs)
    const stream = await onAgent({ prompt: prompt, contextInputs })

    for await (const part of stream) {
      const token = part.choices[0]?.delta?.content || ''

      response.content = response.content + token

      updateMessages([...messages, response])
    } */

    const steps = isEmpty(chatAgents) ? [null] : chatAgents

    console.log("steps", steps)

    for (let i = 0, len = steps.length; i < len; i++) {
      const agent = steps[i]

      let cloned = $messages.get()

      // call agent
      const stream = await onAgent({ prompt: prompt, agent, contextInputs })
      for await (const part of stream) {
        const token = part.choices[0]?.delta?.content || ''

        const last = cloned.at(-1)
        cloned[cloned.length - 1] = {
          ...last,
          content: last.content + token,
        }

        updateMessages([...cloned])
      }

      const last = cloned.at(-1)

      cloned[cloned.length - 1] = {
        ...last,
        completed: true,
      }

      if(agent.id === "1"){
        console.log("last agent 1", last.content)

        const json = extractJSONString(last.content)
         console.log("json ",json)
         addFiche(json)
         console.log("json envoyé", $fichesPersos.get())
      }

      // add next prompt to chat
      if (steps.length > 0 && i !== steps.length - 1) {
        cloned = [
          ...cloned,
          {
            role: 'assistant',
            content: '',
            id: Math.random().toString(),
            completed: false,
          },
        ]
      }

      updateMessages([...cloned])
    }

    promptRef.current.value = ''
    setIsPromptEmpty(true)
  }

  return (
    <Flex
      justify='center'
      mt='auto'
      width='100%'>
      <PromptContainer
        align='center'
        direction='column'>
        <PromptArea
          ref={promptRef}
          id='Todo'
          placeholder='Comment puis-je aider...'
          onChange={onTextChange}
          onKeyDown={(e) => {
            const canSend = !isPromptEmpty && e.key === 'Enter'
            const mod = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey
            if (canSend && !mod) {
              // Prevent default behavior of Enter key
              e.preventDefault()
              onSendPrompt()
            }
          }}
        />
        <Flex
          justify='start'
          align='center'
          width='100%'>
          <Flex
            justify='start'
            align='center'
            width='100%'>
            <AgentMenu />
            <AgentSelect />
          </Flex>
        </Flex>
        <Flex
          justify='end'
          width='100%'>
          <Button
            disabled={isPromptEmpty}
            onClick={onSendPrompt}>
            <PaperPlaneIcon />
          </Button>
        </Flex>
      </PromptContainer>
    </Flex>
  )
}

export default ChatPrompt
