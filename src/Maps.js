import Map from "ol/Map.js";
import Group from "ol/layer/Group";
import View from "ol/View.js";
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import LayerSwitcher from "ol-layerswitcher";
import MousePosition from "ol/control/MousePosition";
import { format } from "ol/coordinate";
import ScaleLine from "ol/control/ScaleLine";
import { useEffect, useRef, useState } from "react";
import home from "./assets/home.png";
import fs from "./assets/fullScreen.png";
import zoomIn from "./assets/zoomIn.png";
//import zoomOut from "./assets/zoomOut.png"
import DragBox from "ol/interaction/DragBox";
import Control from "ol/control/Control";

const Maps = ({ baselayers, overlays }) => {
  const popupRef = useRef(null);
  const homeRef = useRef(null);
  const fsRef = useRef(null);
  const zoomInRef = useRef(null);
  // eslint-disable-next-line
  const [map, setMap] = useState(null);

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
        rotation: 0,
      }),
      controls: [],
    });

    setMap(mapObject);

    return () => {
      mapObject.setTarget(undefined);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!map) return;

    // Overlay Group
    const overlayGroup = new Group({
      title: "overlays",
      layers: overlays,
      fold: true,
    });

    // // Layer Group
    const baseLayerGroup = new Group({
      title: "Base maps",
      layers: baselayers,
      fold: true,
    });

    map.addLayer(baseLayerGroup);
    map.addLayer(overlayGroup);

    const layerSwitcher = new LayerSwitcher({
      activationMode: "click",
      startActive: false,
      reverse: true,
      groupSelectStyle: "group",
    });
    map.addControl(layerSwitcher);

    // coordinate mouse Position
    const mousePosition = new MousePosition({
      className:
        " fixed w-[220px] bottom-2 left-[35%] border-2 border-zinc-500 text-center bg-gray-100 rounded-lg hover:pointer-events-none",
      projection: "EPSG:4326",
      coordinateFormat: function (coordinate) {
        return format(coordinate, `{y}, {x}`, 6);
      },
    });
    map.addControl(mousePosition);

    // scale line on map
    const scaleControl = new ScaleLine({
      bar: true,
      text: true,
    });
    map.addControl(scaleControl);
  }, [map, baselayers, overlays]);

  //console.log(overlays)
  //console.log(popupRef.current)

  // working on feature info section, we can add it as overlay and can set its position so that it will show on the clicked feature
  const info = popupRef.current;
  if (map) {
    map.on("singleclick", showInfo);
    function showInfo(event) {
      const features = map.getFeaturesAtPixel(event.pixel);
      if (features.length === 0) {
        info.innerText = "";
        info.style.opacity = 0;
        return;
      }
      //console.log(features[0])
      const properties = features[0].getProperties();
      //console.log(properties)
      const name = properties.naam;
      const no = properties.nr;
      const size = properties.hectares;

      //console.log(name, no, size)

      info.innerHTML = `NATIONAL PARK <br> Name: ${name} <br> No: ${no} <br> Size: ${size} h `;
      info.style.opacity = 1;
    }
  }

  // adding Home Control
  const homeElement = homeRef.current;
  const homeControl = new Control({
    element: homeElement,
  });
  if (map) {
    map.addControl(homeControl);
  }

  // adding full screen control
  const fsElement = fsRef.current;
  const fsControl = new Control({
    element: fsElement,
  });
  const mapRef = useRef(null);
  const mapElement = mapRef.current;
  const fsFunction = () => {
    if (mapElement.requestFullScreen) {
      mapElement.requestFullScreen();
    } else if (mapElement.msRequestFullScreen) {
      mapElement.msrequestFullScreen();
    } else if (mapElement.mozRequestFullScreen) {
      mapElement.mozrequestFullScreen();
    } else if (mapElement.webkitRequestFullScreen) {
      mapElement.webkitRequestFullScreen();
    }
  };
  if (map) {
    map.addControl(fsControl);
  }

  // adding zoom In control button
  const [zoomInFlag, setZoomInFlag] = useState(false);
  const zoomInElement = zoomInRef.current;

  const zoomInControl = new Control({
    element: zoomInElement,
  });

  const zoomInInteraction = new DragBox();
  zoomInInteraction.on("boxend", function () {
    var zoomInExtent = zoomInInteraction.getGeometry().getExtent();
    map.getView().fit(zoomInExtent);
  });
  const zoomInFn = (e) => {
     e.preventDefault();
    setZoomInFlag((prev) => !prev);
    if (zoomInFlag) {
      mapElement.style.cursor = "zoom-in";
      map.addInteraction(zoomInInteraction);
    } else {
      map.removeInteraction(zoomInInteraction);
      mapElement.style.cursor = "default";
    }
  };
  //console.log(zoomInFlag);
  if (map) {
    map.addControl(zoomInControl);
  }

  return (
    <div ref={mapRef} id="map" className="relative  w-[100%] h-[100vh]">
      <div
        ref={popupRef}
        className="opacity-0 z-10 p-4 rounded-lg absolute bottom-1 left-1 m-0 bg-gray-200 font-bold border-1 transition-all ease-in"
      ></div>
      {/* home or refresh button */}
      <div
        ref={homeRef}
        className=" absolute top-4 left-4 z-20 border-2 border-blue-300 rounded-md bg-blue-100 hover:bg-white p-1"
      >
        <button
          onClick={() => {
            window.location.href = "";
          }}
        >
          <img className="w-[25px] h-[25px]" src={home} alt="home" />
        </button>
      </div>
      {/* full screen button */}
      <div
        ref={fsRef}
        className=" absolute top-[65px] left-4 z-20 border-2 border-blue-300 rounded-md bg-blue-100 hover:bg-white p-1"
      >
        <button onClick={() => fsFunction()}>
          <img className="w-[25px] h-[25px]" src={fs} alt="home" />
        </button>
      </div>
      {/* Zoom In button */}
      <div
        ref={zoomInRef}
        className={
          zoomInFlag
            ? " absolute top-[115px] left-4 z-20 border-2 border-blue-300 rounded-md bg-green-100 hover:bg-white p-1 "
            : "absolute top-[115px] left-4 z-20 border-2 border-blue-300 rounded-md bg-blue-100 hover:bg-white p-1 "
        }
      >
        <button onClick={(e) => zoomInFn(e)}>
          <img className="w-[25px] h-[25px]" src={zoomIn} alt="home" />
        </button>
      </div>
    </div>
  );
};

export default Maps;
