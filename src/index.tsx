import React from 'react';
import ReactDOM from 'react-dom';
import Client from 'components/Client/Client';

import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from 'hooks/useStore';

ReactDOM.render(
  <BrowserRouter>
    <StoreProvider>
      <Client />
    </StoreProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
