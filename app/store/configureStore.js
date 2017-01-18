import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import AppAuthMiddleWare from '../util/AppAuthMiddleWare';

import rootReducer from '../reducers';

export default function configureStore(initialState) {
  const enhancer = compose(
		applyMiddleware(thunk),
    applyMiddleware(AppAuthMiddleWare),
		);

  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  );

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
