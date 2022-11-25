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
import { Stroke, Style } from "ol/style"
import {
  and as andFilter,
  equalTo as equalToFilter,
  like as likeFilter
} from "ol/format/filter"

// working in wfs data layer
const vectorSource = new VectorSource()
const vector = new VectorLayer({
  source: vectorSource,
  style: new Style({
    stroke: new Stroke({
      color: "rgba(0, 0, 255, 1.0)",
      width: 2
    })
  }),
  title: "vector"
})
const raster = new TileLayer({
  source: new XYZ({
    url: "https://geodata.nationaalgeoregister.nl/nationaleparken/wfs?request=GetCapabilities&service=wfs",
    maxZoom: 20
  }),
  title: "raster"
})

// generate a GetFeature request
const featureRequest = new WFS().writeGetFeature({
  srsName: "EPSG:3857",
  featureNS: "http://openstreemap.org",
  featurePrefix: "osm",
  featureTypes: ["water_areas"],
  outputFormat: "application/json"
})

// then post the request and add the received features to a layer
fetch(
  "https://geodata.nationaalgeoregister.nl/nationaleparken/wfs?request=GetCapabilities&service=wfs",
  {
    method: "POST",
    body: new XMLSerializer().serializeToString(featureRequest)
  }
)
  .then(function (response) {
    return response.json()
  })
  .then(function (json) {
    const features = new GeoJSON().readFeatures(json)
    vectorSource.addFeatures(features)
    map.getView().fit(vectorSource.getExtent())
  })

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
    raster,
    vector
  ]
})

// adding layer on map
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
  return <div id="map" className="  w-[100%] h-[500px]"></div>
}

export default Maps
