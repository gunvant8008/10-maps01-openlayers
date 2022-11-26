import Map from "ol/Map.js"
import OSM from "ol/source/OSM.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"
import Group from "ol/layer/Group"
import View from "ol/View.js"
import "ol/ol.css"
import "ol-layerswitcher/dist/ol-layerswitcher.css"
import XYZ from "ol/source/XYZ"
import LayerSwitcher from "ol-layerswitcher"

import VectorSource from "ol/source/Vector"
import { GeoJSON, WFS } from "ol/format"
import { bbox as bboxStrategy } from "ol/loadingstrategy"

// TODO:  Working on wfs layer

const vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: function (extent) {
    return (
      "https://geodata.nationaalgeoregister.nl/nationaleparken/wfs?&" +
      "request=GetCapabilities&service=wfs&" +
      "outputFormat=application/json&srsname=EPSG:4326&" +
      "bbox=" +
      extent.join(",") +
      ",EPSG:4326"
    )
  },
  strategy: bboxStrategy
})

const vector = new VectorLayer({
  source: vectorSource,
  style: {
    "stroke-width": 0.75,
    "stroke-color": "white",
    "fill-color": "rgba(100,100,100,0.25)"
  },
  title: "nationalParks",
  visible: false
})

// main map object
const map = new Map({
  target: "map",
  view: new View({
    center: [542907.6265707075, 6780056.159086264],
    zoom: 2,
    maxZoom: 10,
    minZoom: 3,
    rotation: 0
  })
})
// Base Layer
const openStreetMapStandard = new TileLayer({
  type: "base",
  source: new OSM(),
  visible: true,
  title: "OSMStandard"
})
// Humanitarian Layer
const openStreetMapHumanitarian = new TileLayer({
  source: new OSM({
    url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
  }),
  visible: false,
  title: "OSMHumanitarian"
})
// Stamen Terrain Layer
const stamenTerrain = new TileLayer({
  source: new XYZ({
    url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
    attributions:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }),
  visible: false,
  title: "StamenTerrain"
})

// Layer Group
const baseLayerGroup = new Group({
  title: "Base maps",
  layers: [
    openStreetMapStandard,
    openStreetMapHumanitarian,
    stamenTerrain,
    vector
  ]
})

// adding layers on map
map.addLayer(baseLayerGroup)

// layer switcher
const layerSwitcher = new LayerSwitcher({
  reverse: true,
  groupSelectStyle: "none"
})
map.addControl(layerSwitcher)

// click event on map
map.on("click", function (e) {
  console.log(e.coordinate[0], e.coordinate[1])
})

const Maps = () => {
  return <div id="map" className="  w-[100%] h-[400px]"></div>
}

export default Maps
