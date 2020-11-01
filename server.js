const express = require('express')
const app = express()
const request = require('request')
const port = 4000
const mysql2 = require('mysql2')
const cors = require('cors')

const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yossi11',
  database: 'opora'
})

db.connect(err => {
  if (err) {
    throw err
  }
  console.log('MySql Connected...')
})

app.use(cors())

app.get('/', (req, res) => res.send('Server OK'))

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE opora';
  db.query(sql, (err, result) => {
      if(err) throw err;
      res.send('Database created...');
  });
});

app.get('/createRacesTable', (req, res) => {
  let sql =
    'CREATE TABLE races(id int AUTO_INCREMENT, season int, race json, PRIMARY KEY(id))'
  db.query(sql, (err, result) => {
    if (err) throw err
    res.send('Races table created...')
  })
})

app.get('/createDriversTable', (req, res) => {
  let sql =
    'CREATE TABLE drivers(id int AUTO_INCREMENT, name VARCHAR(30), races json, PRIMARY KEY(id))'
  db.query(sql, (err, result) => {
    if (err) throw err
    res.send('Drivers table created...')
  })
})

app.get('/getDriversBySeason/:season', async (req, res) => {
  const season = req.params.season

  request(
    `http://ergast.com/api/f1/${season}/results.json?limit=1000`,
    async (err, result) => {
      if (err) res.send(err)

      let racesInSeason = []
      let racesResults = []
      let body = JSON.parse(result.body)
      racesInSeason.push(body)

      let driversObj = {}
      let races = racesInSeason[0].MRData.RaceTable.Races

      await races.forEach(race => {
        let raceToSave = { season: race.season, race: JSON.stringify(race) }
        let sql = 'INSERT INTO races SET ?'
        db.query(sql, raceToSave, (err, result) => {
          if (err) throw err
          console.log('Saved To DB!')
        })
      })

      for (let race of races) {
        racesResults.push(race.Results)
      }

      const countWins = driversObj => {
        for (let race of racesResults) {
          let raceWinner = race[0].Driver.driverId
          driversObj[raceWinner] = driversObj[raceWinner] + 1 || 1
        }

        const sortedDriversObj = Object.fromEntries(
          Object.entries(driversObj).sort(([, a], [, b]) => b - a)
        )

        const sortedDriversArr = Object.entries(sortedDriversObj)
        
        return sortedDriversArr
      }

      res.send(countWins(driversObj))
    }
  )
})

app.get('/getRaces/:driver', async (req, res) => {
  const driver = req.params.driver

  request(
    `https://ergast.com/api/f1/drivers/${driver}/results.json?limit=500`,
    async (err, result) => {
      if (err) res.send(err)

      let driverRaces = []
      let racesResults = []
      let body = JSON.parse(result.body)
      driverRaces.push(body)

      let races = driverRaces[0].MRData.RaceTable.Races

      for (let race of races) {
        racesResults.push(race.Results)
      }

      let racesToSave = {
        name: 'placeholder',
        races: JSON.stringify(racesResults)
      }
      let sql = 'INSERT INTO drivers SET ?'
      db.query(sql, racesToSave, (err, result) => {
        if (err) throw err
        console.log('Saved To DB!')
      })

      res.send(driverRaces)
    }
  )
})

app.get('/getPitStops/:season/:round/:driver', async (req, res) => {
  const { season, round, driver } = req.params

  const getPistopsData = (pitStopsArr, fastestOrSlowest) => {
    const pitStopsDuration = []

    pitStopsArr.forEach(pitStop =>
      pitStopsDuration.push(parseFloat(pitStop.duration))
    )

    if (fastestOrSlowest === 'fastest') return Math.max(...pitStopsDuration)
    if (fastestOrSlowest === 'slowest') return Math.min(...pitStopsDuration)
    throw 'Please choose fastest or slowest lap...'
  }

  request(
    `http://ergast.com/api/f1/${season}/${round}/drivers/${driver}/pitstops.json`,
    async (err, result) => {
      if (err) res.send(err)

      let body = JSON.parse(result.body)
      if (body.MRData.RaceTable.Races[0]) {
        let driverPitStops = body.MRData.RaceTable.Races[0].PitStops

        const fastestPitStop = getPistopsData(driverPitStops, 'fastest')
        const slowestPitStop = getPistopsData(driverPitStops, 'slowest')
        res.send({
          fastestPitStop,
          slowestPitStop,
          numOfPitStops: driverPitStops.length
        })
      } else return
    }
  )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
