import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import './MapFilter.css'

MapFilter.propTypes = {
  networks: PropTypes.array,
  times: PropTypes.array,
  setFilters: PropTypes.func,
}

const handleSliderNavigation = (type, max) => {
  // https://stackoverflow.com/questions/23892547/
  const setInputValue = (input, value) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set
    nativeInputValueSetter.call(input, value)
  }

  let input = document.getElementById('times')
  let val = +input.value
  var event = new Event('change', { bubbles: true })

  if (type == 'prev') {
    if (val > 0) {
      setInputValue(input, `${val - 1}`)
      input.dispatchEvent(event)
    }

    return
  }

  if (type == 'next') {
    if (val < max) {
      setInputValue(input, `${val + 1}`)
      input.dispatchEvent(event)
    }

    return
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

function MapFilter({ networks, times, setFilters }) {
  const [networkFilter, setNetworkFilter] = useState('alle')
  const [timesFilter, setTimesFilter] = useState(times[0])
  const lastTimesIndex = times.length - 1

  useEffect(() => {
    const applyFilters = setTimeout(() => {
      if (networkFilter === 'alle' || networkFilter === undefined) {
        setFilters(['==', ['get', 'time'], timesFilter])
      } else {
        setFilters([
          'all',
          ['==', 'network', networkFilter],
          ['==', 'time', timesFilter],
        ])
      }
    }, 100)

    return () => clearTimeout(applyFilters)
  }, [networkFilter, timesFilter, setFilters])

  return (
    <div className="mapfilter">
      <div className="field">
        <label htmlFor="networks">Sensor-Netzwerk</label>
        <select
          id="networks"
          onChange={(e) => setNetworkFilter(e.target.value)}
        >
          <option value="alle">alle</option>
          {networks.map((network, idx) => (
            <option key={idx} value={network}>
              {network}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="times">Messzeitpunkt</label>
        <button onClick={() => handleSliderNavigation('prev')}>zurück</button>
        <input
          id="times"
          type="range"
          defaultValue={'0'}
          min={0}
          max={lastTimesIndex}
          onChange={(e) => setTimesFilter(times[+e.target.value])}
        />
        <button onClick={() => handleSliderNavigation('next', lastTimesIndex)}>
          vor
        </button>
      </div>
      <div className="field">
        Ausgewählter Messzeitpunkt: {formatDate(timesFilter)}
      </div>
    </div>
  )
}

export default MapFilter
