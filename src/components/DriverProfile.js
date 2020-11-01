import React, { useState } from 'react'
import axios from 'axios'
import Races from './Races'
import '../style/DriverProfile.css'

const DriverProfile = () => {
  const [data, setData] = useState({driver: null})
  const [racesResults, setRacesResults] = useState([])

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value })

  const getRaces = async () => {
    let races = await axios.get(`http://localhost:4000/getRaces/${data.driver}`)
    setRacesResults(...racesResults, races.data[0].MRData.RaceTable.Races.reverse())
  }

  return (
    <div className='driverProfileContainer'>
      <div className='title'>Get driver all time races</div>
      <div className='pickDriver'>Pick Driver</div>
      <input name='driver' type='text' onChange={handleChange} />
      <div className='getRacesBtn' onClick={getRaces}>
        Get Races
      </div>
      {racesResults.length ? <Races races={racesResults} /> : null}
    </div>
  )
}

export default DriverProfile
