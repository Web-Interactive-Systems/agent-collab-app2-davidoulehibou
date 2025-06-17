import { SYMBOLS } from '@/utils/emojis'
import { atom } from 'nanostores'

export const $selectedAgentId = atom('')

export const $agents = atom([
  {
  id: "1",
  emoji: '🥸',
  title: 'Créateur de fiche de perso',
  role: `You are a character creator AI.
Your task is to generate characters for tabletop role-playing games (TTRPG) in JSON format.

Always follow this exact JSON structure, and fill it with the user language:

{
  "personnage": {
    "nom": "",
    "race": "",
    "classe": "",
    "age": "",
    "genre": "",
    "description_physique": "",
    "description_mentale": "",
    "histoire": ""
  },
  "caracteristiques": {
  //sur 20, la note étant le nombre minimum à tirer au dé pour avoir un echec (entre 7 et 15)
    "force": 0,
    "agilite": 0,
    "intelligence": 0,
    "charisme": 0,
    "perception": 0
  },
  "sante": {
    "points_de_vie": {
      "actuels": 0,
      "maximum": 0
    },
    "energie": {
      "actuelle": 0,
      "maximum": 0
    },
    "armure": 0,
    "etat_blessures": ""
  },
  "competences": [
    "", "", ""
  ],
  "pouvoirs_dons": [
    {
      "nom": "",
      "description": "",
      "limites": ""
    }
  ],
  "equipement": {
    "armes": [""],
    "armures": [""],
    "objets": [""],
    "ressources": ""
  },
  "objectifs": "",
  "notes_mj": ""
}

Only return the character as a valid JSON object in a code block: \`\`\`json ... \`\`\`. Do not include any explanation or extra text.`,
  response_format: 'text',
  temperature: 0.7,
  desired_response: 'A filled-out character in valid JSON format using the provided template.'
  },
  {
    id: Math.random().toString(),
    emoji: '🌐',
    title: "Créateur d'univers",
    role: 'You can create a fictional world with given properties',
    response_format: 'text',
    temperature: 0.7,
    desired_response: 'name, political state, ',
  },
  {
    id: Math.random().toString(),
    emoji: '📕',
    title: "Créateur d'histoire",
    role: 'You create a fictionnal story with the given character and world',
    response_format: 'text',
    temperature: 0.7,
    desired_response: 'a short fictionnal story with challenges and an end (happy or sad) ',
  },
])

export const addAgent = (agent = {}) => {
  const agents = $agents.get()
  // if has id, then update existing,
  // else create new agent
  if (agent?.id) {
    const index = agents.findIndex((e) => e.id === agent.id)
    agents[index] = { ...agents[index], ...agent }
    $agents.set([...agents])
  } else {
    agent.id = Math.random().toString()
    agent.emoji = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    agent.temperature = 0.7
    $agents.set([agent, ...agents])
  }

  // set current as selected
  $selectedAgentId.set(agent.id)
}

export const removeAgent = (id) => {
  const agents = $agents.get()
  $agents.set(agents.filter((e) => e.id !== id))
}
