import { atom, computed } from 'nanostores'
import { $agents } from './agents'

export const $selectedChatAgents = atom(['1'])

export const $chatAgents = computed([$selectedChatAgents, $agents], (ids, agents) => {
  console.log($selectedChatAgents.get())
  return ids.map((id) => agents.find((agent) => agent.id === id)).filter(Boolean)
})

export const selectChatAgent = (id) => {
  $selectedChatAgents.set([id])
}

export const setSelectChatAgents = (ids) => {
  $selectedChatAgents.set(ids)
}
