import geoJson from '../assets/data.json'

const mockApi = {
  get: () => new Promise((resolve) => setTimeout(() => resolve(geoJson), 800)),
}

export default mockApi
