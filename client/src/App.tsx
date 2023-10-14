import React from "react";
import styled from "styled-components";
import LoginPage from "./AuthPages/loginPage";
import SignupPage from "./AuthPages/SignupPage";
import Container1 from "./components/Containers/Container1";
import { Routes, Route } from "react-router-dom";
import Container2 from "./components/Containers/Container2";

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" index element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="room" element={<Container2 />} />
        <Route path="home" element={<Container1 />} />
      </Routes>
    </div>
  );
};

export default App;
