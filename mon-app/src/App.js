import * as React from "react";
import { Routes, Route, } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Register />} />
        <Route path="/Homepage" element={<Homepage />} />
      </Routes>
    </div>
  );
}

export default App;
