import React from "react";
import {BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CreatePage from "./pages/CreatePage";
import DetailPage from "./pages/DetailPage";
import ListPage from "./pages/ListPage";

function App() {
  return(
<BrowserRouter>

  <Routes>
    <Route path="/*" element={<CreatePage />} />
    <Route path="/create" element={<CreatePage />} />
    <Route path="/code/:id" element={<DetailPage />} />
    <Route path="/list" element={<ListPage />} />
  </Routes>
</BrowserRouter>
  )
}
export default App;
