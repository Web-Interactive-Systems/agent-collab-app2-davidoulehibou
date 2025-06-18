import * as Tabs from '@radix-ui/react-tabs'
import { styled } from '@/lib/stitches'

// === Styled Components ===
const Container = styled('div', {
  width: '30rem',
  padding: '2rem',
  borderRadius: '2rem',
  margin:'1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.36)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  color: '#1a1a1a',
})

const Title = styled('h1', {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '0.25rem',
})

const SubText = styled('p', {
  color: '#555',
  marginBottom: '1rem',
})

const TabList = styled(Tabs.List, {
  display: 'flex',
  borderBottom: '1px solid #e5e7eb',
  marginBottom: '1.5rem',
})

const TabTrigger = styled(Tabs.Trigger, {
  all: 'unset',
  padding: '0.75rem 1rem',
  cursor: 'pointer',
  fontWeight: 500,
  color: '#444',
  '&[data-state="active"]': {
    borderBottom: '2px solid #000',
    color: '#000',
  },
  '&:hover': {
    backgroundColor: '#f9f9f9',
  },
})

const TabContent = styled(Tabs.Content, {
  display: 'block',
  animation: 'fadeIn 200ms ease-in',
  variants: {
    padded: {
      true: {
        paddingBottom: '1.5rem',
      },
    },
  },
})

const SectionTitle = styled('h2', {
  fontSize: '1.125rem',
  fontWeight: '600',
  marginTop: '1rem',
  marginBottom: '0.5rem',
})

const List = styled('ul', {
  listStyleType: 'disc',
  paddingLeft: '1.25rem',
  marginBottom: '1rem',
})

const Item = styled('li', {})

const Box = styled('div', {
  marginBottom: '1rem',
})

// === Component ===
const Fiche = ({ infos }) => {
  const {
    personnage,
    caracteristiques,
    sante,
    competences,
    pouvoirs_dons,
    equipement,
    objectifs,
    notes_mj,
  } = infos

  return (
    <Container>
      <Title>{personnage.nom}</Title>
      <SubText>
        {personnage.classe} - {personnage.race}, {personnage.age} ans
      </SubText>

      <Tabs.Root defaultValue='general'>
        <TabList>
          <TabTrigger value='general'>Général</TabTrigger>
          <TabTrigger value='stats'>Stats</TabTrigger>
          <TabTrigger value='skills'>Compétences</TabTrigger>
          <TabTrigger value='equipment'>Équipement</TabTrigger>
          <TabTrigger value='notes'>Notes</TabTrigger>
        </TabList>

        <TabContent value='general'>
          <Box>
            <strong>Genre :</strong> {personnage.genre}
          </Box>
          <Box>
            <strong>Description physique :</strong> {personnage.description_physique}
          </Box>
          <Box>
            <strong>Personnalité :</strong> {personnage.description_mentale}
          </Box>
          <Box>
            <strong>Histoire :</strong> {personnage.histoire}
          </Box>
        </TabContent>

        <TabContent value='stats'>
          
            <List>
              <SectionTitle>Caractéristiques</SectionTitle>
              <Item>
                <strong>Force :</strong> {caracteristiques.force}
              </Item>
              <Item>
                <strong>Agilité :</strong> {caracteristiques.agilite}
              </Item>
              <Item>
                <strong>Intelligence :</strong> {caracteristiques.intelligence}
              </Item>
              <Item>
                <strong>Charisme :</strong> {caracteristiques.charisme}
              </Item>
              <Item>
                <strong>Perception :</strong> {caracteristiques.perception}
              </Item>
            </List>

            <List>
              <SectionTitle>Santé</SectionTitle>
              <Item>
                <strong>PV :</strong> {sante.points_de_vie.actuels} /{' '}
                {sante.points_de_vie.maximum}
              </Item>
              <Item>
                <strong>Énergie :</strong> {sante.energie.actuelle} /{' '}
                {sante.energie.maximum}
              </Item>
              <Item>
                <strong>Armure :</strong> {sante.armure}
              </Item>
              <Item>
                <strong>État / Blessures :</strong> {sante.etat_blessures}
              </Item>
            </List>
        </TabContent>

        <TabContent value='skills'>
          <SectionTitle>Compétences</SectionTitle>
          <List>
            {competences.map((c, i) => (
              <Item key={i}>{c}</Item>
            ))}
          </List>
          <SectionTitle>Pouvoirs / Dons</SectionTitle>
          {pouvoirs_dons.map((p, i) => (
            <Box key={i}>
              <p>
                <strong>{p.nom}</strong>
              </p>
              <p>{p.description}</p>
              <p style={{ fontStyle: 'italic', color: '#666' }}>Limites : {p.limites}</p>
            </Box>
          ))}
        </TabContent>

        <TabContent value='equipment'>
          <Box>
            <strong>Armes :</strong> {equipement.armes.join(', ')}
          </Box>
          <Box>
            <strong>Armures :</strong> {equipement.armures.join(', ')}
          </Box>
          <Box>
            <strong>Objets :</strong> {equipement.objets.join(', ')}
          </Box>
          <Box>
            <strong>Ressources :</strong> {equipement.ressources}
          </Box>
        </TabContent>

        <TabContent value='notes'>
          <Box>
            <strong>Objectifs :</strong> {objectifs}
          </Box>
          <Box>
            <strong>Notes MJ :</strong> {notes_mj}
          </Box>
        </TabContent>
      </Tabs.Root>
    </Container>
  )
}

export default Fiche
