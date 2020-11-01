import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../style/Race.css'

const Race = ({ race }) => {
  const [pitStopsData, setPitStopsData] = useState({})

  const isPitStopYearValid = () => race.season >= '2012' ? true : false

  useEffect(() => {
    const getPitStops = async () => {
      const pitStopsResponse = await axios.get(
        `http://localhost:4000/getPitStops/${race.season}/${race.round}/${race.Results[0].Driver.driverId}`
      )
      setPitStopsData(pitStopsResponse.data)
    }
    if (isPitStopYearValid()) {
      getPitStops()
    } else return
  }, [])

  const isFastestLapObj = () => {
    if (race.Results[0].FastestLap) return true
    return false
  }

  return (
    <div className='raceContainer'>
      <div className='circuitName'>
        <div className='resultTitle'>Circuit name</div>
        <div className='value'>{race.Circuit.circuitName}</div>
      </div>

      <div className='points'>
        <div className='resultTitle'>Points</div>
        <div className='value'>{race.Results[0].points}</div>
      </div>

      <div className='position'>
        <div className='resultTitle'>Position</div>
        <div className='value'>{race.Results[0].position}</div>
      </div>

      <div className='fastestLap'>
        <div className='lapsTtle'>Laps</div>

        {isFastestLapObj() ? (
          <div> Fastest lap is {race.Results[0].FastestLap.Time.time}</div>
        ) : (
          'No lap data from API'
        )}
      </div>
      <div className='pistops'>
        <div className='pitStopTitle'>Pistops</div>
        {isPitStopYearValid() ? (
          <div className='pitStopData'>
            <div className='fastestPitStops'>
              Fastest pitstop is &nbsp;{pitStopsData.fastestPitStop}
            </div>
            <div className='slowestPitStops'>
              Slowest pitstop is &nbsp;{pitStopsData.fastestPitStop}
            </div>
            <div className='numOfPitStops'>
              Number of pitstops is &nbsp;{pitStopsData.numOfPitStops}
            </div>
          </div>
        ) : (
          <div className='noData'>
            Pitstops data available from 2012 onwards
          </div>
        )}
      </div>
    </div>
  )
}

export default Race
