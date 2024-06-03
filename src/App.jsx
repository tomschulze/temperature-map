import { useState, useEffect, useRef } from 'react'
import { TemperatureMap } from './components/TemperatureMap'
import { MapFilter } from './components/MapFilter'
import mockApi from './util/mockApi'

const getDistinct = (features, key) => {
  return [...new Set(features.map((feature) => feature.properties[key]))]
}

function App() {
  const [data, setData] = useState()
  const [filters, setFilters] = useState(null)
  const networks = useRef([])
  const times = useRef([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const json = await mockApi.get()
      setData(json)
      networks.current = getDistinct(json.features, 'network')
      times.current = getDistinct(json.features, 'time')
    }

    if (data === undefined) {
      fetchData()
    }
  }, [data])

  return (
    <>
      <h3>Temperaturmessungen in C°</h3>
      {data && isMapLoaded && (
        <MapFilter
          setFilters={setFilters}
          networks={networks.current}
          times={times.current}
        />
      )}

      {data && !isMapLoaded && <>Initialisiere Karte...</>}

      {data && (
        <TemperatureMap
          data={data}
          filters={filters}
          setIsMapLoaded={setIsMapLoaded}
        />
      )}
      {!data && <>Lade Daten per mock request...</>}
    </>
  )
}

export default App
