import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import MainPage from 'pages/Main.page';

const Routes = () => {
  return (
    <Switch>
      <Route path={['/', '/main']} exact={true} component={MainPage} />
      <Redirect path="*" to="/" />
    </Switch>
  );
};

export default Routes;
