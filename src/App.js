import Maps from "./Maps"
import Sidebar from "./Sidebar"

function App() {
  return (
    <div className="grid grid-cols-12">
      <div className=" col-span-2 ">
        <Sidebar />
      </div>

      <div className=" col-span-10 ">
        <Maps />
      </div>
    </div>
  )
}

export default App
