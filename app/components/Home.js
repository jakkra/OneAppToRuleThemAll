import React from 'react';

import ReactNative, {
  StyleSheet,
  ListView,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Dimensions,
  BackAndroid,
  TimePickerAndroid,
  DatePickerAndroid,
  ToastAndroid,
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';
import { fetchReminders, createReminder } from '../actions/reminders';

import EventList from './EventList';
import Accordion from 'react-native-collapsible/Accordion';
import { createAnimatableComponent } from 'react-native-animatable';
const ScrollView = createAnimatableComponent(ReactNative.ScrollView);
import PushNotification from 'react-native-push-notification';


import config from '../util/config';

import Ic from 'react-native-vector-icons/Entypo';

const Icon = createAnimatableComponent(Ic);


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
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'column',
  },
  dayRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  dayRowText: {
    color: '#0099CC',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    flex: 0.9,
    marginLeft: 20,
  },
  dayRowIcon: {
    flex: 0.1,
    alignSelf: 'center',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 40,
    marginRight: 30,
  },
  dayRowIconText: {
    color: '#0099CC',
    fontWeight: 'bold',
    alignSelf: 'center',
    width: 20,
  },
  dayRowOpen: {

  },


});

const days = [
  { key: 'todayIcon', day: 'TODAY' },
  { key: 'tomorrowIcon', day: 'TOMORROW' },
  { key: 'upcomingIcon', day: 'UPCOMING' },
  { key: 'somedayIcon', day: 'SOMEDAY' },
];

class Home extends React.Component {
  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    fetchReminders: React.PropTypes.func.isRequired,
    remindersReducer: React.PropTypes.object.isRequired,
    loginReducer: React.PropTypes.object.isRequired,
    createReminder: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.events = [];
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      createReminder: false,
      reminderDay: null,
      reminderText: '',
      reminderHour: 0,
      reminderMinute: 0,
    };
    this.renderDayRows = this.renderDayRows.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onPressAdd = this.onPressAdd.bind(this);
    this.createNewReminder = this.createNewReminder.bind(this);
    this.handleBackAction = this.handleBackAction.bind(this);
    this.sendDeviceTokenToServer = this.sendDeviceTokenToServer.bind(this);
    this.registerToPushNotifications = this.registerToPushNotifications.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.onRefresh();
    });
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackAction);
    this.registerToPushNotifications();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.remindersReducer.isFetching === false &&
      this.props.remindersReducer.isFetching === true) {
      this.onEventFetchSuccess(nextProps.remindersReducer.events);
    } else if (nextProps.remindersReducer.isCreatingEvent === false &&
      this.props.remindersReducer.isCreatingEvent === true) {
      ToastAndroid.show('Reminder created', ToastAndroid.SHORT);
      this.onRefresh();
    } else if (nextProps.remindersReducer.error === true &&
      this.props.remindersReducer.error === false) {
      ToastAndroid.show('An error occured, try again', ToastAndroid.LONG);
    }
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackAction);
  }

  onEventFetchSuccess(events) {
    this.events = events;
    this.setState({
      dataSource: this.ds.cloneWithRows(events),
    });
  }

  onRefresh() {
    this.props.fetchReminders(this.props.loginReducer.accessToken);
  }

  onPressAdd(key, day) {
    // this.refs[key].jello();
    this.refs.scrollReminders.fadeOut({ duration: 300 });
    let date = null;
    if (day === 'TODAY') {
      date = new Date();
    } else if (day === 'TOMORROW') {
      date = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
    }
    this.setState({ createReminder: true, reminderDay: date });
    this.refs.headerInput.focus();
  }

  sendDeviceTokenToServer(deviceToken) {
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
      if (json.success === true) {
        ToastAndroid.show('Successfully send deviceToken', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Failed to send deviceToken', ToastAndroid.SHORT);
      }
    });
  }

  registerToPushNotifications() {
    PushNotification.configure({
      onRegister: (response) => this.sendDeviceTokenToServer(response.token),
      onNotification: (notification) => this.handleNotification(notification),
      senderID: '497309261287',
      popInitialNotification: true,
    });
  }

  handleNotification(notification) {
    let reminder;
    if (notification.reminder !== undefined) {
      reminder = JSON.parse(notification.reminder);
    }
    PushNotification.localNotification({
      /* Android Only Properties */
      title: 'Reminder',
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      // bigText: 'Don't forget', // (optional) default: "message" prop
      subText: "Don't forget!",
      color: 'blue', // (optional) default: system default
      message: reminder.title,
    });
  }

  handleEndCreateReminder() {
    this.refs.headerInput.blur();
    this.setState({
      createReminder: false,
      reminderText: '',
    });
    this.refs.scrollReminders.fadeIn({ duration: 300 });
  }

  handleBackAction() {
    if (this.state.createReminder === true) {
      this.handleEndCreateReminder();
      return true;
    }
    return false;
  }

  createNewReminder() {
    const now = new Date();
    const options = {
      hour: now.getHours(),
      minute: now.getMinutes(),
      is24Hour: true,
    };
    let selectedYear = this.state.reminderDay;

    if (selectedYear === null) {
      DatePickerAndroid.open()
      .then(({ action, year, month, day }) => {
        if (action === DatePickerAndroid.dateSetAction) {
          const d = new Date();
          d.setFullYear(year, month, day);
          selectedYear = d;
          this.showTime(selectedYear, options);
        } else if (action === DatePickerAndroid.dismissedAction) {
          return;
        }
      });
    } else {
      this.showTime(selectedYear, options);
    }
  }

  showTime(selectedYear, options) {
    TimePickerAndroid.open(options)
    .then(({ action, minute, hour }) => {
      if (action === TimePickerAndroid.timeSetAction) {
        selectedYear.setHours(hour);
        selectedYear.setMinutes(minute);
        this.setState({ reminderDay: selectedYear });
        const event = {
          title: this.state.reminderText,
          time: selectedYear,
          reminderActive: true,
        };
        this.props.createReminder(event, this.props.loginReducer.accessToken);
        this.handleEndCreateReminder();
      } else if (action === TimePickerAndroid.dismissedAction) {
        this.handleEndCreateReminder();
      }
    })
    .catch(() => this.handleEndCreateReminder());
  }


  renderDayRows() {
    function rh({ key, day }) {
      return (
        <View style={styles.dayRow}>
          <Text style={styles.dayRowText}>{day}</Text>
          <TouchableOpacity onPress={() => this.onPressAdd(key, day)} style={styles.dayRowIcon}>
            <Icon ref={key} name="circle-with-plus" color="#0099CC" size={25} />
          </TouchableOpacity>
        </View>
      );
    }
    function rc({ key, day }) {
      const filteredEvents = this.events.filter((event) => {
        const today = new Date();
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        if (event.deleted === true) {
          return false;
        }
        if (day === 'TODAY') {
          return today.toDateString() === new Date(event.time).toDateString();
        }
        if (day === 'TOMORROW') {
          return tomorrow.toDateString() === new Date(event.time).toDateString();
        }
        if (day === 'UPCOMING') {
          tomorrow.setHours(24, 0, 0, 0);
          return tomorrow.getTime() < new Date(event.time).getTime();
        }
        return false;
      });
      return (
        <EventList key={key} events={filteredEvents} />
      );
    }
    const renderHeader = rh.bind(this);
    const renderContent = rc.bind(this);


    return (
      <Accordion
        // duration={500}
        underlayColor="white"
        sections={days}
        renderHeader={renderHeader}
        renderContent={renderContent}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.headerText}
            ref="headerInput"
            placeholder={this.state.createReminder ? 'I need to...' : 'REMINDERS'}
            placeholderTextColor="#0099CC"
            editable={this.state.createReminder}
            value={this.state.reminderText}
            onChangeText={text => this.setState({ ...{ reminderText: text } })}
            onSubmitEditing={this.createNewReminder}
          />
        </View>
        <ScrollView
          ref="scrollReminders"
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.props.remindersReducer.isFetching}
              onRefresh={this.onRefresh}
              title="Loading..."
              titleColor="#00ff00"
              colors={['#00ff00', '#ffff00', '#0000ff']}
              progressBackgroundColor="#0099CC"
            />}
        >
          {this.renderDayRows()}

        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    remindersReducer: state.reminders,
    loginReducer: state.login,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchReminders: (...args) => { dispatch(fetchReminders(...args)); },
    createReminder: (...args) => { dispatch(createReminder(...args)); },
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Home);
