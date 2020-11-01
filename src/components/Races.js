import React from 'react'
import Race from './Race'
import '../style/Races.css'

const Races = ({ races }) => {
    
  return (
        <div className="racesContainer">
            {races.map((race, i) => <Race key={i} race={race}/>)}
        </div>
    )
}

export default Races