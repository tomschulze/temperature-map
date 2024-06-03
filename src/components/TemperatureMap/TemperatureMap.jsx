import { Map, Popup, NavigationControl } from 'maplibre-gl'
import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import 'maplibre-gl/dist/maplibre-gl.css'
import './TemperatureMap.css'

TemperatureMap.propTypes = {
  data: PropTypes.object,
  filters: PropTypes.array,
  setIsMapLoaded: PropTypes.func,
}

const buildPopupHtml = (properties) => {
  let html = ''
  for (const property in properties) {
    html = html + `${property}: ${properties[property]}<br/>`
  }

  return html
}

function TemperatureMap({ data, filters, setIsMapLoaded }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const lng = 13.737262
  const lat = 51.050407
  const zoom = 10
  const styleUrl =
    'https://tile-1.kartenforum.slub-dresden.de/styles/maptiler-basic-v2/style.json'

  useEffect(() => {
    if (map.current) return

    map.current = new Map(
      {
        container: mapContainer.current,
        style: styleUrl,
        center: [lng, lat],
        zoom: zoom,
      },
      []
    )

    // TODO does addLayer and addSource code belong into the useEffect hook?
    // TODO this could be refactored; seems long & unreadable
    map.current.on('load', () => {
      map.current.addSource('temperature', { type: 'geojson', data })
      map.current.addLayer({
        id: 'temperature-circle',
        type: 'circle',
        source: 'temperature',
        // TODO set color scale dynamically; maybe using a step and a scale function
        paint: {
          'circle-color': [
            'interpolate-hcl',
            ['linear'],
            ['get', 'v'],
            0,
            '#0000FF',
            30,
            '#FF0000',
          ],
          'circle-opacity': 0.75,
          'circle-radius': 15,
        },
      })

      map.current.addLayer({
        id: 'temperature-labels',
        type: 'symbol',
        source: 'temperature',
        layout: {
          'text-field': ['concat', ['to-string', ['get', 'v']]],
          'text-size': 10,
        },
        paint: {
          // TODO set color data-drivenly to make the label easier to read
          'text-color': '#000',
        },
      })

      map.current.addControl(new NavigationControl(), 'top-left')

      map.current.on('click', 'temperature-circle', (e) => {
        const sensor = e.features[0]
        const coordinates = sensor.geometry.coordinates
        const html = buildPopupHtml(sensor.properties)

        new Popup().setLngLat(coordinates).setHTML(html).addTo(map.current)
      })

      const earliestTime = data.features[0].properties.time
      const initialFilter = ['==', ['get', 'time'], earliestTime]
      map.current.setFilter('temperature-circle', initialFilter)
      map.current.setFilter('temperature-labels', initialFilter)
      setIsMapLoaded(true)

      return () => map.remove()
    })
  }, [data, setIsMapLoaded])

  useEffect(() => {
    if (map.current && map.current.loaded()) {
      map.current.setFilter('temperature-circle', filters)
      map.current.setFilter('temperature-labels', filters)
    }
  }, [filters])

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map" />
    </div>
  )
}

export default TemperatureMap
