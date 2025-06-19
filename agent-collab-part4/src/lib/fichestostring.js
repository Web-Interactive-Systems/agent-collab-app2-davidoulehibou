function personnagesToString(personnages) {
  return personnages.map((p, index) => {
    const {
      personnage,
      caracteristiques,
      sante,
      competences,
      pouvoirs_dons,
      equipement,
      objectifs,
      notes_mj
    } = p;

    const pouvoirs = pouvoirs_dons.map(don =>
      `  - ${don.nom} : ${don.description} (Limite : ${don.limites})`
    ).join('\n');

    const equip = `
  Armes : ${equipement.armes.join(', ')}
  Armures : ${equipement.armures.join(', ')}
  Objets : ${equipement.objets.join(', ')}
  Ressources : ${equipement.ressources}`.trim();

    return `
=== Personnage ${index + 1} : ${personnage.nom} ===
Race : ${personnage.race}
Classe : ${personnage.classe}
Âge : ${personnage.age}
Genre : ${personnage.genre}

Description physique : ${personnage.description_physique}
Description mentale : ${personnage.description_mentale}
Histoire : ${personnage.histoire}

--- Caractéristiques ---
Force : ${caracteristiques.force}
Agilité : ${caracteristiques.agilite}
Intelligence : ${caracteristiques.intelligence}
Charisme : ${caracteristiques.charisme}
Perception : ${caracteristiques.perception}

--- Santé ---
Points de vie : ${sante.points_de_vie.actuels} / ${sante.points_de_vie.maximum}
Énergie : ${sante.energie.actuelle} / ${sante.energie.maximum}
Armure : ${sante.armure}
État des blessures : ${sante.etat_blessures || 'Aucun'}

--- Compétences ---
${competences.join(', ')}

--- Pouvoirs et Dons ---
${pouvoirs}

--- Équipement ---
${equip}

--- Objectifs ---
${objectifs}

--- Notes MJ ---
${notes_mj}
`.trim();
  }).join('\n\n');
}


export default personnagesToString