import { useState, useEffect } from "react"
//import set from "lodash.set"
import VectorSource from "ol/source/Vector"
import XYZ from "ol/source/XYZ"
import { GeoJSON } from "ol/format"
import { bbox as bboxStrategy } from "ol/loadingstrategy"
import OSM from "ol/source/OSM.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer"
import Maps from "./Maps"
//import Sidebar from "./Sidebar"

// Overlay Group
// const overlayGroup = new Group({
//   title: "overlay",
//   layers: [vector2, vector1]
// })

// // Layer Group
// const baseLayerGroup = new Group({
//   title: "Base maps",
//   layers: [openStreetMapStandard, openStreetMapHumanitarian, stamenTerrain]
// })

function App() {
  const [baselayers, setBaseLayers] = useState([])
  const [overlays, setOverlays] = useState([])
  const [layerVisibility, setLayerVisibility] = useState({})
  // sidebar only needs title, visibility and means to update visibility stat

  useEffect(() => {
    // Base Layer
    const openStreetMapStandard = new TileLayer({
      type: "base",
      source: new OSM(),
      visible: true,
      properties: {
        name: "OMSStandard"
      },
      title: "Standard"
    })
    // Humanitarian Layer
    const openStreetMapHumanitarian = new TileLayer({
      source: new OSM({
        url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      }),
      visible: false,
      properties: {
        name: "OSMHumanitarian"
      },
      title: "Humanitarian",
      type: "base"
    })

    // Stamen Terrain Layer
    const stamenTerrain = new TileLayer({
      source: new XYZ({
        url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
        attributions:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
      }),
      visible: false,
      properties: {
        name: "StamenTerrain"
      },
      title: "Stamen",
      type: "base"
    })

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
      properties: {
        name: "nationalParks"
      },
      visible: true,
      title: "National Parks"
    })
    console.log(vector1)
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
      properties: {
        name: "MaxSpeeds"
      },
      visible: false,
      title: "Max Speeds"
    })

    setBaseLayers([
      openStreetMapStandard,
      openStreetMapHumanitarian,
      stamenTerrain
    ])
    setOverlays([vector1, vector2])

    const visibilityObject = {
      baselayers: {
        ...[
          openStreetMapStandard,
          openStreetMapHumanitarian,
          stamenTerrain
        ].reduce((acc, current) => {
          acc[current.getProperties().name] = current.getVisible()
          return acc
        }, {})
      },
      overlays: {
        ...[vector1, vector2].reduce((acc, current) => {
          acc[current.getProperties().name] = current.getVisible()
          return acc
        }, {})
      }
    }

    setLayerVisibility(visibilityObject)
  }, [])

  useEffect(() => {
    // const {baselayers, overlays} =layerVisibility
    baselayers.forEach(layer => {
      layer.setVisible(layerVisibility.baselayers[layer.getProperties().name])
    })
    overlays.forEach(overlay => {
      overlay.setVisible(layerVisibility.overlays[overlay.getProperties().name])
    })
    // eslint-disable-next-line
  }, [layerVisibility])

  /*
  const toggleLayerByName = (name, visible) => {
    const newLayerVisibility = {
      ...layerVisibility
    }
    set(newLayerVisibility, name, visible)
    setLayerVisibility(newLayerVisibility)
  }
*/
  return (
    <div>
      <div>
        <Maps baselayers={baselayers} overlays={overlays} />
      </div>
      <div>
        {/* <Sidebar
          layerVisibility={layerVisibility}
          toggleLayerByName={toggleLayerByName}
        /> */}
      </div>
    </div>
  )
}

export default App
