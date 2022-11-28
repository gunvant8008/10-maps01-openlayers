import { useState } from "react"
import Maps from "./Maps"
import Sidebar from "./Sidebar"

function App() {
  const [arr, setArr] = useState([])
  const [options, setOptions] = useState({})
  return (
    <div className="grid grid-cols-12">
      <div className=" col-span-10 ">
        <Maps setArr={setArr} setOptions={setOptions} />
      </div>
      <div className=" col-span-2 ">
        <Sidebar layersArray={arr} options={options} />
      </div>
    </div>
  )
}

export default App
