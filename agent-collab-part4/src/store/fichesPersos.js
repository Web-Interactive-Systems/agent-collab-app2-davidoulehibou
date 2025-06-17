import { atom } from 'nanostores'

export const $fichesPersos = atom([{
  "personnage": {
    "nom": "Dimitri le Chevalier",
    "race": "Homme de guerre (Chevalier)",
    "classe": "Guerrier",
    "age": "35",
    "genre": "Masculin",
    "description_physique": "Un chevalier robuste, grand et fort, avec des cheveux noirs et une barbe sombre. Il a un visage fermé, des yeux gris profonds, et des traits durs et calmes.",
    "description_mentale": "Dimitri est un homme de valeur, loyal et dévoué. Il possède un esprit perçant et une âme résolue, guidée par la foi et l'honneur.",
    "histoire": "Dimitri a grandi dans une famille de chevaliers, apprenant à l'art de la guerre et du combat depuis ses jeunes années. Il a combattu dans plusieurs guerres, se répandant comme un symbole de fermeté et de loyauté."
  },
  "caracteristiques": {
    "force": 16,
    "agilite": 12,
    "intelligence": 10,
    "charisme": 14,
    "perception": 13
  },
  "sante": {
    "points_de_vie": {
      "actuels": 80,
      "maximum": 100
    },
    "energie": {
      "actuelle": 70,
      "maximum": 100
    },
    "armure": 25,
    "etat_blessures": ""
  },
  "competences": ["Guerrier", "Combat", "Défense", "Aide aux autres"],
  "pouvoirs_dons": [
    {
      "nom": "Foi de l'Étoile",
      "description": "Permet de voir les étoiles et d'orienter son chemin dans les moments critiques.",
      "limites": "N'utilisable qu'en cas de danger imminent."
    }
  ],
  "equipement": {
    "armes": ["Dague de l'Honneur", "Lance à l'éclat"],
    "armures": ["Armure de fer", "Tunique de cuir"],
    "objets": ["Étoile de la Légende", "Bouteille d'eau"],
    "ressources": "10 pièces d'or, 5 éclats de lune"
  },
  "objectifs": "Protéger sa famille et le peuple, trouver l'étoile qui révèle le chemin de la paix.",
  "notes_mj": "Dimitri est un chevalier fidèle et courageux, mais il a du mal à accepter les désirs de ses frères et sœurs."
}])

export const addFiche = (fiche) => {
    
  const fiches = $fichesPersos.get()
  
  $fichesPersos.set([...fiches, fiche])
}

export const updateFiche = (id, fiche) => {
  const fiches = $fichesPersos.get()

  const updatedFiches = fiches.map(f => f.id === id ? fiche : f)

  $fichesPersos.set(updatedFiches)
}
