'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';


import { createAnimatableComponent } from 'react-native-animatable';

import PushNotification from 'react-native-push-notification';
import config from '../util/config';

import { logout } from '../actions/user';

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
    flexDirection: 'row',
    height: 50,
    borderBottomWidth: 0.3,
    borderBottomColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'stretch',
    color: '#0099CC',
  },
  headerColumn: {
    flexDirection: 'column',
    flex: 0.5,
    marginHorizontal: 20,
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

/**
 * The home component, lets the user go the the different parts of the app.
 */
export default class Menu extends React.Component {

  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    logout: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.openReminders = this.openReminders.bind(this);
    this.openGraph = this.openGraph.bind(this);
    this.logOut = this.logOut.bind(this);
    this.openLights = this.openLights.bind(this);
    this.openLogs = this.openLogs.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.sendDeviceTokenToServer = this.sendDeviceTokenToServer.bind(this);
    this.registerToPushNotifications = this.registerToPushNotifications.bind(this);
    this.openMirrorConfig = this.openMirrorConfig.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.registerToPushNotifications();
    });
  }

  /**
   * After successful register, it sends the deviceToken to the backend.
   * @param {String} deviceToken The token retreived from register.
   */
  sendDeviceTokenToServer(deviceToken) {
    PushNotification.popInitialNotification((notification) => {
      if (notification) { this.handleNotification(notification); }
    });
    fetch(config.serverURL + '/api/user/device', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': this.props.user.accessToken,
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
  }

  /**
  * Registrates the device to for push notifications,
  */
  registerToPushNotifications() {
    PushNotification.configure({
      onRegister: (response) => this.sendDeviceTokenToServer(response.token),
      onNotification: (notification) => this.handleNotification(notification),
      senderID: '497309261287',
      popInitialNotification: false,
    });
  }

  /**
  * Will be called when an notification is received.
  * @param {Object} notification The notification send to this device/app.
  */
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

  /**
  * Opens the reminders screen.
  */
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

  /**
  * Opens the temperature graph screen.
  */
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

  /**
  * Opens the light controller screen.
  */
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

  /**
  * Opens the surveillance logs screen.
  */
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

  /**
  * Opens settings screen.
  */
  openSettings() {
    const route = {
      type: 'push',
      route: {
        key: 'settings',
        title: 'Settings',
      },
    };
    this.props.handleNavigate(route);
  }

  /**
  * Logs out of the app.
  */
  logOut() {
    this.props.logout();
    const route = {
      type: 'reset',
      route: {
        key: 'login',
        title: 'Login',
      },
    };
    this.props.handleNavigate(route);
  }

  openMirrorConfig() {
    const route = {
      type: 'push',
      route: {
        key: 'mirror',
        title: 'Mirror',
      },
    };
    this.props.handleNavigate(route);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerColumn}>
            <Text style={styles.headerText}>{'Hi ' + this.props.user.user.name + '!'}</Text>
          </View>
          <View style={[styles.headerColumn, { alignItems: 'flex-end' }]}>
            <TouchableOpacity onPress={this.logOut} style={styles.rowElement}>
              <IconFA ref="signOutButton" name="sign-out" color="#0099CC" size={35} />
            </TouchableOpacity>
          </View>
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
            <TouchableOpacity
              onPress={this.openSettings}
              style={[styles.rowElement, { borderRightWidth: 0.2 }]}
            >
              <IconFA ref="reminderButton" name="cogs" color="#0099CC" size={60} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.openMirrorConfig} style={styles.rowElement}>
              <IconFA ref="signOutButton" name="magic" color="#0099CC" size={60} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: (...args) => { dispatch(logout(...args)); },
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Menu);
