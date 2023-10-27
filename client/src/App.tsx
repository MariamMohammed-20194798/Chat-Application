import React, { useEffect } from "react";
import LoginPage from "./AuthPages/loginPage";
import SignupPage from "./AuthPages/SignupPage";
import Container1 from "./components/Containers/Container1";
import { Routes, Route } from "react-router-dom";
import Container2 from "./components/Containers/Container2";
import { useAuthorDataStore } from "./Storage/authorStorage";
import instance from "./axios";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx/ProtectedRoutes";
import { LeftNav } from "./components/LeftNav/LeftNav";
import styled from "styled-components";
const App: React.FC = () => {
  const author = useAuthorDataStore((state) => state.authorData);
  const setAuthor = useAuthorDataStore((state) => state.setAuthorData);

  const Div = styled.div`
    @media (min-width: 1281px) {
      margin-left: 15rem;
      margin-right: 15rem;
      margin-top: 1rem;
    }
  `;
  useEffect(() => {
    const fetchUserHandler = async () => {
      try {
        const res = await instance.get("users/getMe");
        const data = res.data.data.data;
        setAuthor(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserHandler();
  }, []);

  return (
    <>
      {" "}
      <Div>
        <Routes>
          {!author._id ? (
            <>
              <Route path="/login" index element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </>
          ) : null}
          <Route
            element={
              <ProtectedRoute>
                <LeftNav />
              </ProtectedRoute>
            }
          >
            <Route
              path="/"
              index={true}
              element={
                <ProtectedRoute>
                  <Container1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:receiverId"
              element={
                <ProtectedRoute>
                  <Container2 />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>{" "}
        </Routes>
      </Div>
    </>
  );
};

export default App;
