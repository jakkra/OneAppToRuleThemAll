'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ToastAndroid,
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';


import { createAnimatableComponent } from 'react-native-animatable';

import PushNotification from 'react-native-push-notification';
import config from '../util/config';

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
    loginReducer: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.openReminders = this.openReminders.bind(this);
    this.openGraph = this.openGraph.bind(this);
    this.logOut = this.logOut.bind(this);
    this.openLights = this.openLights.bind(this);
    this.openLogs = this.openLogs.bind(this);
    this.sendDeviceTokenToServer = this.sendDeviceTokenToServer.bind(this);
    this.registerToPushNotifications = this.registerToPushNotifications.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.registerToPushNotifications();
      /* const route = {
        type: 'modal',
        route: {
          key: 'ReminderNotificationModal',
          title: 'modal',
        },
        passProps: { reminder: 'lolReminder' },
      };
      this.props.handleNavigate(route);
      */
    });
  }

  sendDeviceTokenToServer(deviceToken) {
    PushNotification.popInitialNotification((notification) => {
      if (notification) { this.handleNotification(notification); }
    });
    fetch(config.serverURL + '/api/user/device', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': this.props.loginReducer.accessToken,
      },
      body: JSON.stringify({
        deviceToken,
      }),
    })
    .then(response => response.json())
    .then(json => {
      if (json.success === false) {
        ToastAndroid.show('Failed to send deviceToken', ToastAndroid.SHORT);
      }
    })
    .catch(() => ToastAndroid.show('Failed to send deviceToken', ToastAndroid.SHORT));
  

  registerToPushNotifications() {
    PushNotification.configure({
      onRegister: (response) => this.sendDeviceTokenToServer(response.token),
      onNotification: (notification) => this.handleNotification(notification),
      senderID: '497309261287',
      popInitialNotification: false,
    });
  }

  handleNotification(notification) {
    if (notification.foreground === true) {
      if (notification.type === 'reminder') {
        const route = {
          type: 'modal',
          route: {
            key: 'ReminderNotificationModal',
            title: 'modal',
          },
          passProps: { reminder: JSON.parse(notification.reminder) },
        };
        this.props.handleNavigate(route);
        return;
      } else if (notification.type === 'surveillance') {
        // TODO handle alert notification press in foreground
      }
    }
    if (notification.userInteraction === false) { // Received in background
      // remove, let server handle notification building?
      if (notification.type === 'surveillance') {
        PushNotification.localNotification({
          title: 'Warning',
          tag: 'warning',
          autoCancel: true,
          largeIcon: 'ic_launcher',
          message: 'Movement detected at home!',
        });
      }
    } else { // Opened notification from background
      if (notification.type === 'reminder') {
        const route = {
          type: 'modal',
          route: {
            key: 'ReminderNotificationModal',
            title: 'modal',
          },
          passProps: { reminder: JSON.parse(notification.reminder) },
        };
        this.props.handleNavigate(route);
      } else if (notification.tag === 'warning') {
        this.openLogs();
      }
    }
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

  openLogs() {
    const route = {
      type: 'push',
      route: {
        key: 'surveillance',
        title: 'Surveillance',
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
            <TouchableOpacity onPress={this.openLogs} style={styles.rowElement}>
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

function mapStateToProps(state) {
  return {
    loginReducer: state.login,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Menu);
