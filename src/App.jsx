import { Route, Routes } from "react-router";
import "./App.css";
import Header from "./pages/Header";

function App() {
  return (
    <Routes>
      <Route index element={<Header />} />
    </Routes>
  );
}

export default App;
