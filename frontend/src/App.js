// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom";

import SpotsIndex from "./components/Spots/SpotsIndex"
import SpotShow from "./components/Spots/SpotShow"
import CreateSpotForm from "./components/Spots/CreateSpotForm";
import EditSpotForm from "./components/Spots/EditSpotForm";
import CurrentSpots from "./components/Spots/CurrentSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>

      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/" component={SpotsIndex} />
          <Route exact path="/spots/new" component={CreateSpotForm} />
          <Route exact path="/spots/current" component={CurrentSpots} />
          <Route exact path="/spots/:spotId/edit" component={EditSpotForm}/>
          <Route exact path="/spots/:spotId" component={SpotShow} />
        </Switch>
      )}
    </>
  );
}

export default App;
