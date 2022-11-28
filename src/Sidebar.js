import React, { useState } from "react"

const Sidebar = ({ layersArray, options }) => {
  console.log(layersArray)
  console.log(options)
  const [selected, setSelected] = useState(false)

  return (
    <div className=" p-4 flex flex-col gap-5  rounded-md bg-zinc-100 w-full h-full ">
      {/* Base Layer Section */}
      <div>
        <h1 className=" font-bold">Base Layer</h1>
        <div>
          {layersArray.length &&
            layersArray[0].values_.layers.array_.map(item => {
              const handleChange = e => {
                if (e.target.value === item.values_.title) {
                  console.log(e.target.value)
                  console.log(item.values_.title)
                  options.setBase(prev => !prev)
                  setSelected(prev => !prev)
                } else {
                  options.setBase(false)
                  setSelected(false)
                }
              }
              return (
                <>
                  <input
                    key={item.ol_uid}
                    checked={selected}
                    type="radio"
                    value={item.values_.title}
                    name="baseLayer"
                    onChange={handleChange}
                  />{" "}
                  {item.values_.title} <br />
                </>
              )
            })}
        </div>
      </div>
      {/* Overlay section */}
      <div>
        <h1 className=" font-bold">Overlay</h1>
        <div>
          {layersArray.length &&
            layersArray[1].values_.layers.array_.map(item => {
              const handleChange = e => {
                if (e.target.value === item.values_.title) {
                  console.log(e.target.value)
                  console.log(item.values_.title)
                  options.setFeature(prev => !prev)
                  setSelected(prev => !prev)
                }
              }
              return (
                <>
                  <input
                    checked={selected}
                    onChange={handleChange}
                    type="checkbox"
                    value={item.values_.title}
                    name="baseLayer"
                  />{" "}
                  {item.values_.title} <br />
                </>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
