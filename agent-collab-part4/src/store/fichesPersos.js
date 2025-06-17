import { atom } from 'nanostores'

export const $fichesPersos = atom([])

export const addFiche = (fiche) => {
    
  const fiches = $fichesPersos.get()
  
  $fichesPersos.set([...fiches, fiche])
}

export const updateFiche = (id, fiche) => {
  const fiches = $fichesPersos.get()

  const updatedFiches = fiches.map(f => f.id === id ? fiche : f)

  $fichesPersos.set(updatedFiches)
}
