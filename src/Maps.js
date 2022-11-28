import Map from "ol/Map.js"
import OSM from "ol/source/OSM.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"
import Group from "ol/layer/Group"
import View from "ol/View.js"
import "ol/ol.css"
import "ol-layerswitcher/dist/ol-layerswitcher.css"
import XYZ from "ol/source/XYZ"
//import LayerSwitcher from "ol-layerswitcher"

import VectorSource from "ol/source/Vector"
import { GeoJSON } from "ol/format"
import { bbox as bboxStrategy } from "ol/loadingstrategy"
import { useEffect, useState } from "react"

const Maps = ({ setArr, setOptions }) => {
  // eslint-disable-next-line
  const [map, setMap] = useState(null)
  const [base, setBase] = useState(true)
  const [feature, setFeature] = useState(false)

  // overlay 1- national parks
  const vectorSource1 = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      return (
        "https://geodata.nationaalgeoregister.nl/nationaleparken/wfs?service=WFS&" +
        "version=2.0.0&request=GetFeature&typeName=nationaleparken&" +
        "outputFormat=application/json&srsname=EPSG:3857&" +
        "bbox=" +
        extent.join(",") +
        ",EPSG:3857"
      )
    },
    strategy: bboxStrategy
  })

  const vector1 = new VectorLayer({
    source: vectorSource1,
    style: {
      "stroke-width": 0.75,
      "stroke-color": "green",
      "fill-color": "rgba(0,255,0,0.5)"
    },
    title: "nationalParks",
    visible: feature
  })
  // overlay 2- max speeds
  const vectorSource2 = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
      return (
        "https://geodata.nationaalgeoregister.nl/weggeg/wfs?service=WFS&" +
        "version=2.0.0&request=GetFeature&typeName=weggegmaximumsnelheden&" +
        "outputFormat=application/json&srsname=EPSG:3857&" +
        "bbox=" +
        extent.join(",") +
        ",EPSG:3857"
      )
    },
    strategy: bboxStrategy
  })

  const vector2 = new VectorLayer({
    source: vectorSource2,
    style: {
      "stroke-width": 0.75,
      "stroke-color": "blue",
      "fill-color": "rgba(0,255,0,0.5)"
    },
    title: "MaxSpeeds",
    visible: feature
  })

  // Overlay Group
  const overlayGroup = new Group({
    title: "overlay",
    layers: [vector1, vector2]
  })

  // Base Layer
  const openStreetMapStandard = new TileLayer({
    type: "base",
    source: new OSM(),
    visible: base,
    title: "OSMStandard"
  })
  // Humanitarian Layer
  const openStreetMapHumanitarian = new TileLayer({
    source: new OSM({
      url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    }),
    visible: !base,
    title: "OSMHumanitarian"
  })
  // Stamen Terrain Layer
  const stamenTerrain = new TileLayer({
    source: new XYZ({
      url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
      attributions:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    visible: !base,
    title: "StamenTerrain"
  })

  // Layer Group
  const baseLayerGroup = new Group({
    title: "Base maps",
    layers: [openStreetMapStandard, openStreetMapHumanitarian, stamenTerrain]
  })

  // layer switcher
  // const layerSwitcher = new LayerSwitcher({
  //   reverse: true,
  //   groupSelectStyle: "none"
  // })

  // useEffect to initialize map
  useEffect(() => {
    // main map object
    const mapObject = new Map({
      target: "map",
      view: new View({
        center: [542907.6265707075, 6780056.159086264],
        zoom: 2,
        maxZoom: 10,
        minZoom: 3,
        rotation: 0
      })
    })

    //Layer switcher
    //mapObject.addControl(layerSwitcher)

    // adding base layers on map
    mapObject.addLayer(baseLayerGroup)

    // adding overlays on map
    mapObject.addLayer(overlayGroup)

    setMap(mapObject)

    // Passing the layer data in app component
    const allLayers = [baseLayerGroup, overlayGroup]
    setArr(allLayers)
    const allOptions = { base, setBase, feature, setFeature }
    setOptions(allOptions)

    return () => {
      mapObject.setTarget(undefined)
      // console.log(mapObject)
    }
    // eslint-disable-next-line
  }, [base, feature])

  return <div id="map" className="  w-[100%] h-[800px]"></div>
}

export default Maps
