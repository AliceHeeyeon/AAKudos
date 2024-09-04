import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
     {/* <StrictMode> */}
     <React.Fragment>
      <App />
     </React.Fragment>
    {/* </StrictMode> */}
  </Provider>
)
