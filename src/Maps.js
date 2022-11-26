import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import Group from "ol/layer/Group";
import View from "ol/View.js";
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import XYZ from "ol/source/XYZ";
import LayerSwitcher from "ol-layerswitcher";

import VectorSource from "ol/source/Vector";
import { GeoJSON, WFS } from "ol/format";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { useEffect, useState } from "react";

// TODO:  Working on wfs layer

const vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: function (extent) {
    return (
      "https://geodata.nationaalgeoregister.nl/nationaleparken/wfs?service=WFS&" +
      "version=2.0.0&request=GetFeature&typeName=nationaleparken&" +
      "outputFormat=application/json&srsname=EPSG:4326&" +
      "bbox=" +
      extent.join(",") +
      ",EPSG:4326"
    );
  },
  strategy: bboxStrategy,
});

const vector = new VectorLayer({
  source: vectorSource,
  style: {
    "stroke-width": 0.75,
    "stroke-color": "green",
    "fill-color": "rgba(0,255,0,0.5)",
  },
  title: "nationalParks",
  visible: false,
});

// Base Layer
const openStreetMapStandard = new TileLayer({
  type: "base",
  source: new OSM(),
  visible: true,
  title: "OSMStandard",
});
// Humanitarian Layer
const openStreetMapHumanitarian = new TileLayer({
  source: new OSM({
    url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  }),
  visible: false,
  title: "OSMHumanitarian",
});
// Stamen Terrain Layer
const stamenTerrain = new TileLayer({
  source: new XYZ({
    url: "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
    attributions:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
  }),
  visible: false,
  title: "StamenTerrain",
});

// Layer Group
const baseLayerGroup = new Group({
  title: "Base maps",
  layers: [
    openStreetMapStandard,
    openStreetMapHumanitarian,
    stamenTerrain,
    vector,
  ],
});

// layer switcher
const layerSwitcher = new LayerSwitcher({
  reverse: true,
  groupSelectStyle: "none",
});

const Maps = () => {
  const [map, setMap] = useState(null);
  useEffect(() => {
    // main map object
    const mapObject = new Map({
      target: "map",
      view: new View({
        center: [542907.6265707075, 6780056.159086264],
        zoom: 2,
        maxZoom: 10,
        minZoom: 3,
        rotation: 0,
      }),
    });

    mapObject.addControl(layerSwitcher);
    mapObject.addLayer(baseLayerGroup);
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, []);
  return <div id="map" className="  w-[100%] h-[400px]"></div>;
};

export default Maps;
