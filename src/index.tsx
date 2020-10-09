import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from 'hooks/useStore';
import Client from 'components/Client/Client';

ReactDOM.render(
  <BrowserRouter>
    <StoreProvider>
      <Client />
    </StoreProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
