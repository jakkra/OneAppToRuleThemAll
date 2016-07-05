/* @flow */
'use-strict';

import React from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Navigator from '../lib/Navigator/Navigator';
import * as constants from '../constants';
import Transitions from '../lib/Transitions';
import Dimensions from 'Dimensions';
import CText from '../lib/CText';

import { uiColorChange } from '../actions/uiColor'; //Only used in 'easiest' mode to handle colors of navigator (top and bottom elements)



var {
  StyleSheet,
  View,
  TouchableOpacity,
  AlertIOS,
  Image,
  PushNotificationIOS,
} = React;

function mapStateToProps(state) {
  return {
    ...state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

/**
 * Root component, which holds the navigator and the main view.
 */
class App extends React.Component {

  state = {
    title: '',
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.rootContainer}>
        <Navigator
          ref="root"
          style={styles.container}
          configureScene={(route, routeStack) => Transitions.NONE}
          initialRoute={
            {title: 'Home',
            component: Home}
          }
          renderScene={(route, navigator) => {
            if (route.component) {
              return (
                <View>
                  {React.createElement(route.component, { navigator: navigator, passProps: route.passProps, store: this.props.store })}
                </View>
              );
            }
          }}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: '#a3dbe8',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
