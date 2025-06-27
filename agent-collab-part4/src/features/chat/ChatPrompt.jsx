import { onAgent } from '@/actions/agent'
import { styled } from '@/lib/stitches'
import {
  $agents,
  $fichesPersos,
  $messages,
  addFiche,
  addMessage,
  updateMessages,
  updatePV,
} from '@/store/store'
import { FaceIcon, PaperPlaneIcon, Pencil2Icon } from '@radix-ui/react-icons'
import {
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  TextArea,
  Tabs,
  Card,
  Text,
  Separator,
  Box,
} from '@radix-ui/themes'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '@nanostores/react'
import { extractJSONString } from '@/lib/json'
import personnagesToString from '@/lib/fichestostring'
import Dice from '@/components/Dice'
import { Title } from '@radix-ui/themes/dist/cjs/components/alert-dialog'

const StyledContainer = styled(Flex, {
  width: '100%',
  padding: '12px 18px',
  borderRadius: '18px',
  backgroundColor: '#e3e9ff',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  maxHeight: '90vh',
})

const StyledPromptArea = styled(TextArea, {
  width: '100%',
  boxShadow: 'none',
  outline: 'none',
  backgroundColor: 'white',
  borderRadius: '1rem',

  '& textarea': {
    fontSize: '1.1rem',
    fontWeight: 450,
    padding: '0.5rem',
  },
})

const EquipWrapper = styled(Box, {
  width: '40rem',
  display: 'flex',
  gap: '1rem',
})

const EquipGroup = styled(ToggleGroup.Root, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginRight: '1rem',
  gap: '0.5rem',
})

const EquipItem = styled(ToggleGroup.Item, {
  width: '8rem',
  textAlign: 'left',
})

const UtilsGroup = styled(ToggleGroup.Root, {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  overflowY: 'auto',
  flexWrap: 'wrap',
})

const UtilsItem = styled(ToggleGroup.Item, {
  height: '5rem',
  width: '9rem',
})

const SkillGroup = styled(ToggleGroup.Root, {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
})

const SkillItem = styled(ToggleGroup.Item, {
  width: '7rem',
  textAlign: 'center',
  height: '5rem',
  padding: '0.5rem',
})

const DiceButton = styled(Button, {
  width: '5rem',
  height: '5rem',
  '& :hover': {
    cursor: 'pointer',
  },
})

function ChatPrompt() {
  const promptRef = useRef(null)
  const [promptcontexte, setPromptContexte] = useState("")
  const [isPromptEmpty, setIsPromptEmpty] = useState(true)

  const [contexte, setContexte] = useState('')

  const fichesPersos = useStore($fichesPersos)
  const [chatAgent, setChatAgent] = useState('1')
  const [startMessage, setStartMessage] = useState(false)
  const [number, setNumber] = useState(1)
  const [etatdice, setEtatdice] = useState(1)
  const [persoId, setPersoId] = useState('0')
  const [selectedEquip, setSelectedEquip] = useState('armes')
  const [utils, setUtils] = useState('rien')
  const [caracterisique, setCaracterisique] = useState('force')

  const onTextChange = () => {
    const val = promptRef.current.value || ''
    setIsPromptEmpty(val.trim().length === 0)
  }

  function startStory() {
    setChatAgent('2')
  }

  useEffect(() => {
    if (chatAgent == '2' && !startMessage) {
      promptRef.current.value = `Bonjour, commence une histoire, ${promptcontexte}`
      onSendPrompt()
      setStartMessage(true)
      promptRef.current.value = ''
    }
  }, [chatAgent])

  useEffect(() => {
    setUtils('rien')
  }, [persoId])

  const rollDice = () => {
    let num = Math.floor(Math.random() * 20) + 1

    setNumber(num)
    let etat

    const etats = {
      1: 'une réussite critique',
      2: 'une réussite',
      3: 'un échec',
      4: 'un échec critique',
    }

    const score = $fichesPersos.get()[persoId].caracteristiques[caracterisique]
    console.log(score)
    if (num <= score) {
      if (num < score / 3) {
        etat = etats[1]
        setEtatdice(1)
      } else {
        etat = etats[2]
        setEtatdice(2)
      }
    } else {
      if (num > score + (20 - score) / 2) {
        etat = etats[4]
        setEtatdice(4)
      } else {
        etat = etats[3]
        setEtatdice(3)
      }
    }

    let prev = promptRef.current.value
    promptRef.current.value = `${
      $fichesPersos.get()[persoId].personnage.nom
    } tente l'action : ${prev} ${utils !== 'rien' ? ` avec ${utils}` : ''}, c'est ${etat}`
    onSendPrompt()
    promptRef.current.value = ''
  }

  const onSendPrompt = async () => {
    const prompt = promptRef.current.value

    addMessage({
      role: 'user',
      content: prompt,
      id: Math.random().toString(),
    })

    const contextInputs = [
      {
        role: 'user',
        content: chatAgent == '2' ? personnagesToString(fichesPersos) : '',
      },
      {
        role: 'assistant',
        content: contexte,
      },
    ]

    // AI response
    const response = {
      role: 'assistant',
      content: '',
      id: Math.random().toString(),
      completed: false,
    }

    addMessage(response)

    const agent = $agents.get().find((agent) => agent.id == chatAgent)

    let cloned = $messages.get()

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
      const json = extractJSONString(last.content)
      addFiche(json)
    } else if (agent.id === '2') {
      const jsonStatus = extractJSONString(last.content)
      console.log(extractJSONString(last.content))
      updatePV(jsonStatus)
      setContexte(contexte + last.content)
    }

    updateMessages([...cloned])

    promptRef.current.value = ''
    setIsPromptEmpty(true)
  }

  return (
    <Flex
      height='100%'
      justify='center'
      alignitems='center'
      mt='auto'
      width='100%'>
      <StyledContainer>
        {chatAgent == '2' && (
          <ToggleGroup.Root
          
            type='single'
            value={persoId.toString()}
            onValueChange={(val) => val !== null && setPersoId(Number(val))}>
            {fichesPersos.map((fiche, index) => (
              <ToggleGroup.Item
              style={{margin:'1rem'}}
                key={index}
                value={index.toString()}
                className={`${persoId == index ? 'chipSelected' : ''}`}>
                {fiche.personnage.nom}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        )}

        <StyledPromptArea
          ref={promptRef}
          id='Todo'
          placeholder={
            chatAgent == '1'
              ? 'Décrivez votre personnage'
              : 'Décrivez une action à effectuer'
          }
          onChange={onTextChange}
          onKeyDown={(e) => {
            const canSend = !isPromptEmpty && e.key === 'Enter'
            const mod = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey
            if (canSend && !mod) {
              e.preventDefault()
              chatAgent == '1' ? onSendPrompt() : rollDice()
            }
          }}
        />

        {chatAgent == '2' && (
          <>
            <h3>Equipement</h3>
            <EquipWrapper>
              <EquipGroup
                type='single'
                value={selectedEquip}
                onValueChange={(val) => val && setSelectedEquip(val)}>
                {['armes', 'armures', 'objets', 'ressources', 'pouvoirs'].map((cat) => (
                  <EquipItem
                    className={`${selectedEquip === cat ? 'chipSelected' : ''}`}
                    key={cat}
                    value={cat}
                    selected={selectedEquip === cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </EquipItem>
                ))}
              </EquipGroup>

              <UtilsGroup
                type='single'
                value={utils}
                onValueChange={(val) => val !== null && setUtils(val)}>
                {selectedEquip !== 'pouvoirs' ? (
                  <>
                    {fichesPersos[persoId].equipement[selectedEquip].map((item) => (
                      <UtilsItem
                        className={`${utils == item ? 'chipSelected' : ''}`}
                        key={item}
                        value={item}
                        selected={utils === item}>
                        {item}
                      </UtilsItem>
                    ))}
                    <UtilsItem
                      className={`${utils == 'rien' ? 'chipSelected' : ''}`}
                      value='rien'
                      selected={utils == 'rien'}>
                      Rien
                    </UtilsItem>
                  </>
                ) : (
                  <>
                    {fichesPersos[persoId].pouvoirs_dons.map((p) => (
                      <UtilsItem
                        className={`${utils == p.nom ? 'chipSelected' : ''}`}
                        key={p.nom}
                        value={p.nom}
                        selected={utils === p.nom}>
                        {p.nom}
                      </UtilsItem>
                    ))}
                    <UtilsItem
                      className={`${utils == 'rien' ? 'chipSelected' : ''}`}
                      value='rien'
                      selected={utils == 'rien'}>
                      Rien
                    </UtilsItem>
                  </>
                )}
              </UtilsGroup>
            </EquipWrapper>

            <h3>Compétence à utiliser</h3>
            <SkillGroup
              type='single'
              onValueChange={(val) => val && setCaracterisique(val)}>
              {Object.entries(fichesPersos[persoId].caracteristiques).map(
                ([key, val]) => (
                  <SkillItem
                    key={key}
                    value={key}
                    selected={caracterisique === key}
                    className={`${caracterisique == key ? 'chipSelected' : ''}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <h3>{val}</h3>
                  </SkillItem>
                ),
              )}
            </SkillGroup>

            <DiceButton
              disabled={isPromptEmpty}
              onClick={rollDice}>
              <Dice
                number={number}
                etatdice={etatdice}
              />
            </DiceButton>
          </>
        )}

        {chatAgent == '1' && (
          <>
            <Button
              disabled={isPromptEmpty}
              onClick={onSendPrompt}
              size='4'
              style={{ margin: '2rem' }}>
              Créer un personnage
              <FaceIcon />
            </Button>
            <StyledPromptArea placeholder="Décrivez le contexte et l'histoire" 
            value={promptcontexte}
            onChange={()=>setPromptContexte(event.target.value)}/>
            <Button
              disabled={fichesPersos.length < 1}
              onClick={() => startStory()}
              size='4'
              style={{ margin: '2rem' }}>
              Commencer l'histoire
              <Pencil2Icon />
            </Button>
          </>
        )}
      </StyledContainer>
    </Flex>
  )
}

export default ChatPrompt
