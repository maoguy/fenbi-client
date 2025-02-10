import React from "react";
import { HashRouter,Routes,Route } from "react-router-dom";
import IndexPage from "../pages/IndexPage";

function Router () {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<IndexPage/>}
        />
      </Routes>
    </HashRouter>
  );
}

export default Router;