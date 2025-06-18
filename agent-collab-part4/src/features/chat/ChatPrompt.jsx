import { onAgent } from '@/actions/agent'
import { styled } from '@/lib/stitches'
import {
  $chatAgents,
  $fichesPersos,
  $messages,
  $selectedChatAgents,
  addFiche,
  addMessage,
  selectChatAgent,
  updateMessages,
} from '@/store/store'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { Button, DropdownMenu, Flex, TextArea } from '@radix-ui/themes'
import { useEffect, useRef, useState } from 'react'
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

function ChatPrompt() {
  const promptRef = useRef(null)
  const [isPromptEmpty, setIsPromptEmpty] = useState(true)

  const [contexte, setContexte] = useState('')

  const chatAgents = useStore($chatAgents)

  const fichesPersos = useStore($fichesPersos)
  const [persoId, setPersoId] = useState(0)
  const [utils, setUtils] = useState('Rien')
  const [caracterisique, setCaracterisique] = useState('force')

  const onTextChange = () => {
    const val = promptRef.current.value || ''
    setIsPromptEmpty(val.trim().length === 0)
  }

  function startStory() {
    selectChatAgent('2')
  }

  useEffect(() => {
    if ($selectedChatAgents.get()[0] === '2') {
      promptRef.current.value = 'Bonjour, commence une histoire'
      onSendPrompt()
    }
  }, [chatAgents])

  const onSendPrompt = async () => {
    const prompt = promptRef.current.value
    console.log('onSendPrompt', prompt)

    addMessage({
      role: 'user',
      content: prompt,
      id: Math.random().toString(),
    })

    const contextInputs = [{ role: "assistant", content: contexte }]

    // AI response
    const response = {
      role: 'assistant',
      content: '',
      id: Math.random().toString(),
      completed: false, // not complete yet
    }

    // add AI response to chat messages
    addMessage(response)

    const steps = isEmpty(chatAgents) ? [null] : chatAgents

    for (let i = 0, len = steps.length; i < len; i++) {
      const agent = steps[i]

      let cloned = $messages.get()

      console.log('contexte', contexte)
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

      if (agent.id === '1') {
        console.log('last agent 1', last.content)

        const json = extractJSONString(last.content)
        addFiche(json)
      } else if (agent.id === '2') {
        setContexte(contexte + last.content)
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
        direction='column'
        width='90%'>
        {chatAgents[0].id == 2 && (
          <>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant='soft'>
                  {fichesPersos[persoId].personnage.nom}
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content>
                {fichesPersos.map((fiche, index) => (
                  <DropdownMenu.Item
                    key={index}
                    onSelect={() => setPersoId(index)}>
                    {fiche.personnage.nom}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </>
        )}
        <PromptArea
          ref={promptRef}
          id='Todo'
          placeholder={
            chatAgents[0].id == 1
              ? 'Décrivez votre personnage'
              : 'Décrivez une action à effectuer'
          }
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
            width='100%'></Flex>
        </Flex>
        <Flex width='100%'>
          {chatAgents[0].id == 2 && (
            <>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant='soft'>
                    Avec {utils}
                    <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>Equipement</DropdownMenu.SubTrigger>

                    <DropdownMenu.SubContent>
                      <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger>Armes</DropdownMenu.SubTrigger>

                        <DropdownMenu.SubContent>
                          {fichesPersos[persoId].equipement.armes.map((arme) => (
                            <DropdownMenu.Item onSelect={() => setUtils(arme)}>
                              {arme}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.SubContent>
                      </DropdownMenu.Sub>

                      <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger>Armures</DropdownMenu.SubTrigger>

                        <DropdownMenu.SubContent>
                          {fichesPersos[persoId].equipement.armures.map((armure) => (
                            <DropdownMenu.Item onSelect={() => setUtils(armure)}>
                              {armure}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.SubContent>
                      </DropdownMenu.Sub>

                      <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger>Objets</DropdownMenu.SubTrigger>

                        <DropdownMenu.SubContent>
                          {fichesPersos[persoId].equipement.objets.map((objet) => (
                            <DropdownMenu.Item onSelect={() => setUtils(objet)}>
                              {objet}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.SubContent>
                      </DropdownMenu.Sub>

                      <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger>Resources</DropdownMenu.SubTrigger>

                        <DropdownMenu.SubContent>
                          {fichesPersos[persoId].equipement.objets.map((resources) => (
                            <DropdownMenu.Item onSelect={() => setUtils(resources)}>
                              {resources}
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.SubContent>
                      </DropdownMenu.Sub>
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>

                  <DropdownMenu.Separator />
                  <DropdownMenu.Sub>
                    <DropdownMenu.SubTrigger>Pouvoirs / Dons</DropdownMenu.SubTrigger>
                    <DropdownMenu.SubContent>
                      {fichesPersos[persoId].pouvoirs_dons.map((pouvoir) => (
                        <DropdownMenu.Item onSelect={() => setUtils(pouvoir.nom)}>
                          {pouvoir.nom}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Sub>
                  <DropdownMenu.Item onSelect={() => setUtils('Rien')}>
                    Rien
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant='soft'>
                    Jet De {caracterisique}
                    <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item onSelect={() => setCaracterisique('Force')}>
                    Force
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => setCaracterisique('Agilité')}>
                    Agilité
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => setCaracterisique('Intelligence')}>
                    Intelligence
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => setCaracterisique('Charisme')}>
                    Charisme
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => setCaracterisique('Perception')}>
                    Perception
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </>
          )}

          <Button
            disabled={isPromptEmpty}
            onClick={onSendPrompt}>
            <PaperPlaneIcon />
          </Button>
          {chatAgents[0].id == 1 && (
            <Button
              disabled={fichesPersos.length < 2}
              onClick={() => startStory()}>
              Commencer l'histoire
            </Button>
          )}
        </Flex>
      </PromptContainer>
    </Flex>
  )
}

export default ChatPrompt
