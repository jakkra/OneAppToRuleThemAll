 /**
  * Sample React Native App
  * https://github.com/facebook/react-native
  * @flow
  */

  import React from 'react';
  import { AppRegistry } from 'react-native';

  import configureStore from './app/store/configureStore';
  const store = configureStore();

  import App from './app/containers/app';
  import { Provider } from 'react-redux';

  const Reminders = () => (
    <Provider store={store}>
      <App />
    </Provider>
  );
  AppRegistry.registerComponent('Reminders', () => Reminders);
