import React, { useState } from 'react'
import axios from 'axios'
import '../style/Season.css'

const Season = () => {
  const [data, setData] = useState({
    season: null
  })
  const [driverResults, setDriverResults] = useState([])

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const getDrivers = async () => {
    const drivers = await axios.get(
      `http://localhost:4000/getDriversBySeason/${data.season}`
    )
    setDriverResults(...driverResults, drivers.data)
  }

  return (
    <div className='seasonContainer'>
      <div className='title'>Get winning drivers in a season</div>
      <div className='pickSeason'>Please pick a season</div>

      <input name='season' type='number' onChange={handleChange} />

      <div className='sendBtn' onClick={getDrivers}>
        Search
      </div>

      {driverResults.length
        ? driverResults.map((driver, i) => (
            <div key={i} className='driverResults'>
              {driver[0]} {driver[1]}
            </div>
          ))
        : null}
    </div>
  )
}

export default Season
