import { Header } from "./components/header";
import { Selectors } from "./containers/selections";
import { CurrencyProvider, useCurrencyData } from "./context/currency";

function App() {
  return (
    <CurrencyProvider>
      <Header />
      <Selectors />
    </CurrencyProvider>
  );
}

export default App;
