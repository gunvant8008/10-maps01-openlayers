import React from "react"

const Sidebar = ({ layerVisibility, toggleLayerByName }) => {
  const handleLayerToggle = (e, layerId) => {
    const layerType = e.target.getAttribute("name")
    toggleLayerByName(`${layerType}.${layerId}`, e.target.checked)
  }

  return (
    <div className=" p-1 flex flex-col gap-5  rounded-md bg-zinc-100 w-full h-full overflow-auto">
      {/* Base Layer Section */}
      <div>
        <h1 className=" font-bold">Base Layer</h1>
        <div>
          {layerVisibility.baselayers &&
            Object.entries(layerVisibility.baselayers).map(
              ([name, visible]) => {
                return (
                  <>
                    <input
                      key={name}
                      checked={visible}
                      type="radio"
                      value={name}
                      name="baselayers"
                      onChange={e => handleLayerToggle(e, name)}
                    />{" "}
                    {name} <br />
                  </>
                )
              }
            )}
        </div>
      </div>
      {/* Overlay section */}
      <div>
        <h1 className=" font-bold">Overlay</h1>
        <div>
          {layerVisibility.overlays &&
            Object.entries(layerVisibility.overlays).map(([name, visible]) => {
              return (
                <>
                  <input
                    key={name}
                    checked={visible}
                    onChange={e => handleLayerToggle(e, name)}
                    type="checkbox"
                    value={name}
                    name="overlays"
                  />{" "}
                  {name} <br />
                </>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
