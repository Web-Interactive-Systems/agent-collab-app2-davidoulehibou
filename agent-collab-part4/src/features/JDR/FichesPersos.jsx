import { $fichesPersos } from '@/store/fichesPersos'
import { useStore } from '@nanostores/react'
import Fiche from './Fiche'

function FichesPersos() {
  const fichesPersos = useStore($fichesPersos) // <-- Ceci permet de réagir aux changements

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight:'90vh', overflowY:"auto", overflowX:'hidden', backgroundColor:'grey' }}>
        <h2>Fiches persos</h2>
        {fichesPersos.map((fiche) => (
          <Fiche
            key={fiche.id}
            infos={fiche}
          />
        ))}
      </div>
    </>
  )
}

export default FichesPersos
