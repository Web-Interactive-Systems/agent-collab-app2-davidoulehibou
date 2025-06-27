import { atom } from 'nanostores'

export const $fichesPersos = atom([
  {
    personnage: {
      nom: 'Davidou le Hibou',
      race: ' Hibou ',
      classe: ' Gardien de la Forêt ',
      age: 120,
      genre: ' masculin',
      description_physique:
        'Davidou est un hibou bleu aux yeux dorés, avec une plumage luisant. Il a des ailes longues et un museau pointu. Sa voix est calme et rassurante.',
      description_mentale:
        'Davidou est intelligent, sage et protecteur. Il comprend les animaux de la forêt et peut communiquer avec eux. Il est très vigilant et a une forte connexion avec la nature.',
      histoire:
        "Davidou naquit dans les cimes de la forêt magique. Il a vu beaucoup d'êtres et a appris à protéger la forêt de ceux qui veulent détruire son équilibre. Il est l'ami des animaux et le gardien de la forêt.",
    },
    caracteristiques: {
      force: 10,
      agilite: 15,
      intelligence: 18,
      charisme: 12,
      perception: 14,
    },
    sante: {
      points_de_vie: {
        actuels: 60,
        maximum: 80,
      },
      energie: {
        actuelle: 45,
        maximum: 60,
      },
      armure: 12,
      etat_blessures: 'Aucune blessure grave',
    },
    competences: ['Compréhension animale', 'Chasse nocturne', 'Mystère de la forêt'],
    pouvoirs_dons: [
      {
        nom: 'Vue nocturne',
        description: "Peut voir dans l'obscurité et détecter les mouvements des animaux.",
        limites: 'Ne fonctionne pas sous la pluie ou dans les zones très éclairées.',
      },
      {
        nom: 'Communication animale',
        description: 'Peut comprendre et parler avec les animaux de la forêt.',
        limites: 'Ne fonctionne pas avec les créatures magiques non-animales.',
      },
      {
        nom: 'Rapport avec la nature',
        description:
          'A une connexion forte avec les éléments de la forêt et peut influencer légèrement le climat.',
        limites: 'Ne peut pas contrôler les tempêtes ou les débats de la nature.',
      },
    ],
    equipement: {
      armes: ["Cran d'hirondelle", 'Aile de protection'],
      armures: ['Plumage de gardien', 'Coeur de forêt'],
      objets: ['Boule de lumière', 'Pierre de sagesse'],
      ressources: ['Feuilles de myrhe', 'Écorces de sagesse'],
    },
    objectifs:
      'Protéger la forêt contre les intrus et équilibrer les forces de la nature.',
    notes_mj:
      'Un hibou protecteur, sage et communiant avec la forêt. Idéal pour des parties de quête ou de survie.',
  },
])

export const addFiche = (fiche) => {
  const fiches = $fichesPersos.get()

  $fichesPersos.set([...fiches, fiche])
}

export const updatePV = (json) => {
  console.log(json.updatepv)

  const fiches = $fichesPersos.get()

  // Trouver l’index de la fiche
  const index = fiches.findIndex((fiche) => fiche.personnage?.nom === json.updatepv.char)

  if (index === -1) {
    console.warn(`Personnage ${json.updatepv.char} introuvable`)
    return
  }

  const fiche = fiches[index]

  // Mise à jour des PV avec clamping
  let nouveauxPV = fiche.sante.points_de_vie.actuels + json.updatepv.pv
  nouveauxPV = Math.min(nouveauxPV, fiche.sante.points_de_vie.maximum)
  nouveauxPV = Math.max(nouveauxPV, 0)

  // Reconstruction de la fiche
  const ficheModifiee = {
    ...fiche,
    sante: {
      ...fiche.sante,
      points_de_vie: {
        ...fiche.sante.points_de_vie,
        actuels: nouveauxPV,
      },
    },
  }

  // Remplacement dans le tableau
  const nouvellesFiches = [...fiches]
  nouvellesFiches[index] = ficheModifiee

  // Mise à jour du store
  $fichesPersos.set(nouvellesFiches)
}

export const updateFiche = (id, fiche) => {
  const fiches = $fichesPersos.get()

  const updatedFiches = fiches.map((f) => (f.id === id ? fiche : f))

  $fichesPersos.set(updatedFiches)
}
