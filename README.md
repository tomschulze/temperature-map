Run `npm i` to install dependencies and `npm run dev` for local development. Tested w/ Node 18.6.0.


## Todos
* initialization logic seems a bit coarse (gets coarser with more complex conditions)
  * should the data availability check happen in `TemperatureMap` component?
  * same w/ `MapFilter` component?
* clean data without `v` property?
* clean data; `43949-u31f91wxs7w`, `43802-u31f91wxs7w` share the same lat/lon, also for the former, `v` is not defined
* clean data; sensor id 1050 has 3 data points per timestamp with differing values
* slider
  * allow using arrow keys to scroll through measurement points
  * show measurement points as labels
* add clustering; maybe with some form of aggregation as label (avg, median)
* make layout more appealing (styles, spinner, etc.)
* refactoring
* add NavigationControl Button "zoom to bounds"
* chrome handles `new Date().toLocaleString('de-DE')` differently than firefox

## Description
Task: Visualization of temporal and spatial sensor network data on a map

Background: A town has multiple networks of sensors distributed across various locations, measuring air temperature at regular intervals. We aim to visualize this data on an interactive map, allowing users to select different times and see the corresponding temperature measurements.

### Requirements

#### Framework
- The project should be based on React.
- Any metaframework or project initialization script can be used.
- Use your preferred styling solution or component library.
#### Data Visualization
- Display a map of the town with a representation for a sensor at each sensor location.
- Each sensor representation should allow for the air temperature measured by the sensor at the selected time to be read.
#### User Interface
- Include a UI element for selecting the time.
- The map should update in real-time to reflect the temperature data for the selected time.
- It should be possible to display data for different ‘sensor networks’ independently.
- Available station metadata should be displayed for a ‘selected’ sensor.
#### Functionality
- Allow users to easily navigate through different time points to see how temperatures vary.
- Ensure the visualization is clear and intuitive, providing an informative overview of temperature distribution across the town.
#### Technical Considerations
- Use maplibregl for the map display.
- Use https://tile-1.kartenforum.slub-dresden.de/styles/maptiler-basic-v2/style.json as basemap service.
- Ensure the solution is performant - it should be possible to switch between different times and datasets without considerable delay.
- Make use of existing libraries wherever necessary and possible.

