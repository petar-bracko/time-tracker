import "./App.css";
import "./style/Layout.css";
import "./style/Login.css";
import "./style/Trackers.css";
import "./style/History.css";
import { Router } from "./router/Router";
import { PrimeReactProvider } from "primereact/api";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

function App() {
  return (
    <PrimeReactProvider>
      <Router />
    </PrimeReactProvider>
  );
}

export default App;
