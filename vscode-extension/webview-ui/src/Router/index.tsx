import React from "react";
import { HashRouter,Routes,Route } from "react-router-dom";
import IndexPage from "../pages/IndexPage";
import ExercisePage from "../pages/ExercisePage";

function Router () {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<IndexPage/>}
        />
        <Route
          path="/exercise/:id"
          element={<ExercisePage/>}
        />
      </Routes>
    </HashRouter>
  );
}

export default Router;