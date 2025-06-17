import { $fichesPersos } from "@/store/fichesPersos"
import { useStore } from "@nanostores/react"
import Fiche from "./Fiche"

function FichesPersos() {
  const fichesPersos = useStore($fichesPersos) // <-- Ceci permet de réagir aux changements

  return (
    <>
    <h1>Fiches persos</h1>
      {fichesPersos.map(fiche => (
        <Fiche key={fiche.id} infos={fiche} />
      ))}
    </>
  )
}

export default FichesPersos
