import React from "react";
import { Route, Switch } from "react-router-dom";
import MainPage from "pages/Main.page";
import NoMatch from "pages/NotFound";

const Routes = () => {
  return (
    <Switch>
      <Route path={"/"} exact={true} component={MainPage} />
      <Route exect component={NoMatch} />
    </Switch>
  );
};

export default Routes;
