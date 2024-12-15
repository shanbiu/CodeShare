import React from "react";
import {BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CreatePage from "./pages/CreatePage";
import DetailPage from "./pages/DetailPage";

function App() {
  return(
<BrowserRouter>

  <Routes>
    <Route path="/*" element={<CreatePage />} />
    <Route path="/create" element={<CreatePage />} />
    <Route path="/code:key" element={<DetailPage />} />
    <Route path="/list" element={<h1>List</h1>} />
  </Routes>
</BrowserRouter>
  )
}
export default App;
