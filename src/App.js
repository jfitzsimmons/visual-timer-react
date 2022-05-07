import "./App.scss";
import { Weather } from "./components/Weather";
import Timer from "./components/Timer";

function App() {
  return (
    <div className="app dark">
      <Timer />
      <Weather />
    </div>
  );
}

export default App;
