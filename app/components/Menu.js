'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';

import { createAnimatableComponent } from 'react-native-animatable';
import IcFA from 'react-native-vector-icons/FontAwesome';
import IcIO from 'react-native-vector-icons/Ionicons';

const IconFA = createAnimatableComponent(IcFA);
const IconIO = createAnimatableComponent(IcIO);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'column',
    height: 50,
    borderBottomWidth: 0.3,
    borderBottomColor: 'lightgray',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    alignSelf: 'stretch',
    width: Dimensions.get('window').width,
    color: '#0099CC',
  },
  grid: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'lightgray',
  },
  rowElement: {
    flex: 0.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class Menu extends React.Component {

  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.openReminders = this.openReminders.bind(this);
    this.openGraph = this.openGraph.bind(this);
    this.logOut = this.logOut.bind(this);
    this.openLights = this.openLights.bind(this);
  }

  openReminders() {
    const route = {
      type: 'push',
      route: {
        key: 'home',
        title: 'Home',
      },
    };
    this.props.handleNavigate(route);
  }

  openGraph() {
    const route = {
      type: 'push',
      route: {
        key: 'graph',
        title: 'Graph',
      },
    };
    this.props.handleNavigate(route);
  }
  openLights() {
    const route = {
      type: 'push',
      route: {
        key: 'lights',
        title: 'Lights',
      },
    };
    this.props.handleNavigate(route);
  }

  logOut() {
    const route = {
      type: 'reset',
      route: {
        key: 'login',
        title: 'Login',
      },
    };
    this.props.handleNavigate(route);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hi Jakob!</Text>
        </View>
        <View style={styles.grid}>
          <View style={[styles.row, { borderBottomWidth: 0.2 }]}>
            <TouchableOpacity
              onPress={this.openReminders}
              style={[styles.rowElement, { borderRightWidth: 0.2 }]}
            >
              <IconFA ref="reminderButton" name="bell-o" color="#0099CC" size={60} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.openGraph} style={styles.rowElement}>
              <IconIO ref="tempGraphButton" name="ios-thermometer" color="#0099CC" size={60} />
            </TouchableOpacity>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0.2 }]}>
            <TouchableOpacity
              onPress={this.openLights}
              style={[styles.rowElement, { borderRightWidth: 0.2 }]}
            >
              <IconFA ref="reminderButton" name="lightbulb-o" color="#0099CC" size={60} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.openGraph} style={styles.rowElement}>
              <IconFA ref="tempGraphButton" name="user-secret" color="#0099CC" size={60} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={[styles.rowElement, { borderRightWidth: 0.2 }]} />
            <TouchableOpacity onPress={this.logOut} style={styles.rowElement}>
              <IconFA ref="signOutButton" name="sign-out" color="#0099CC" size={60} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
