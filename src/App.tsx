import "./App.css";
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
