import React, { useState } from "react"

const Sidebar = () => {
  const [selected, setSelected] = useState(true)
  return (
    <div className=" p-4 flex flex-col gap-5  rounded-md bg-zinc-100 w-full h-full ">
      {/* Base Layer Section */}
      <div>
        <h1 className=" font-bold">Base Layer</h1>
        <div>
          <input
            checked={true}
            type="radio"
            value="OSM"
            name="baseLayer"
            onChange={() => setSelected(!selected)}
          />{" "}
          OSM <br />
          <input
            checked={false}
            onChange={() => setSelected(!selected)}
            type="radio"
            value="OSM"
            name="baseLayer"
          />{" "}
          OSM <br />
          <input
            checked={false}
            onChange={() => setSelected(!selected)}
            type="radio"
            value="OSM"
            name="baseLayer"
          />{" "}
          OSM <br />
        </div>
      </div>
      {/* Overlay section */}
      <div>
        <h1 className=" font-bold">Overlay</h1>
        <div>
          <input
            checked={false}
            onChange={() => setSelected(!selected)}
            type="checkbox"
            value="OSM"
            name="baseLayer"
          />{" "}
          OSM <br />
          <input
            checked={selected}
            onChange={() => setSelected(!selected)}
            type="checkbox"
            value="OSM"
            name="baseLayer"
          />{" "}
          OSM <br />
          <input
            checked={selected}
            onChange={() => setSelected(!selected)}
            type="checkbox"
            value="OSM"
            name="baseLayer"
          />{" "}
          OSM <br />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
