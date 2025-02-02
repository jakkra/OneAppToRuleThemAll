import React from 'react';

import ReactNative, {
  StyleSheet,
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
    height: 50,
  },
  dayRowText: {
    color: '#0099CC',
    fontSize: 26,
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
  { key: 'unfinishedIcon', day: 'UNFINISHED' },

];

/**
 * Component that holds all components that has to do with reminders.
 */
class Reminders extends React.Component {
  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    fetchReminders: React.PropTypes.func.isRequired,
    remindersReducer: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    createReminder: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createReminder: false,
      reminderDay: null,
      reminderText: '',
      reminderHour: 0,
      reminderMinute: 0,
      events: [],
    };
    this.renderDayRows = this.renderDayRows.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onPressAdd = this.onPressAdd.bind(this);
    this.createNewReminder = this.createNewReminder.bind(this);
    this.handleBackAction = this.handleBackAction.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.onRefresh();
    });
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackAction);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.remindersReducer.isFetching === false &&
      this.props.remindersReducer.isFetching === true) {
      this.setState({ events: nextProps.remindersReducer.events });
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

  /**
   * Called when the user drags downwards int he list. Refreshes the reminders.
   */
  onRefresh() {
    this.props.fetchReminders(this.props.user.accessToken);
  }

  /**
   * Called when a user want to add a new reminder.
   * @param {String} key The key of the day to add the remidner on.
   * @param {String} day The name of the day in the list of reminders.
   */
  onPressAdd(key, day) {
    this.refs.scrollReminders.fadeOut({ duration: 300 });
    this.setState({ createReminder: true, reminderDay: day });
    // Moves the cursor to a textfield, which later triggers createNewReminder when editing done
    this.refs.headerInput.focus();
  }

  /**
   * Called when a new reminder is created.
   * Will change state and fade away the create reminder view.
   */
  handleEndCreateReminder() {
    this.refs.headerInput.blur();
    this.setState({
      createReminder: false,
      reminderText: '',
    });
    this.refs.scrollReminders.fadeIn({ duration: 300 });
  }

  /**
   * Overrides the back button, lets me handle it or pass it on.
   */
  handleBackAction() {
    if (this.state.createReminder === true) {
      this.handleEndCreateReminder();
      return true;
    }
    return false;
  }

  /**
   * Opens the view to set the time and date of the new reminder.
   * Only shows the date picker if the dayKey is 'UPCOMING'
   * When done it will create the new reminder.
   */
  createNewReminder() {
    const now = new Date();
    const options = {
      hour: now.getHours(),
      minute: now.getMinutes(),
      is24Hour: true,
    };
    let date = null;
    const dayKey = this.state.reminderDay;
    if (dayKey === 'TODAY') {
      date = new Date();
    } else if (dayKey === 'TOMORROW') {
      date = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
    } else if (dayKey === 'SOMEDAY') {
      // No need to choose time
      const event = {
        title: this.state.reminderText,
        reminderActive: true,
      };
      this.props.createReminder(event, this.props.user.accessToken);
      this.handleEndCreateReminder();

      return;
    }
    let selectedYear = date;

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

  /**
   * Opens a TimePicker.
   * @param {String} selectedYear The date the reminder shall be created on.
   * @param {Object} options Options to the TimePickerAndroid component, see React-Native docs.
   * When done it will create the new reminder.
   */
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
        this.props.createReminder(event, this.props.user.accessToken);
        this.handleEndCreateReminder();
      } else if (action === TimePickerAndroid.dismissedAction) {
        this.handleEndCreateReminder();
      }
    })
    .catch(() => this.handleEndCreateReminder());
  }

  /**
   * Renders the different "days" in the list. Eg. "Today/Tomorrow/Upcoming/Someday"
   * and their expanded content.
   */
  renderDayRows() {
    function rh({ key, day }) {
      const addButton = (
        <TouchableOpacity onPress={() => this.onPressAdd(key, day)} style={styles.dayRowIcon}>
          <Icon ref={key} name="circle-with-plus" color="#0099CC" size={30} />
        </TouchableOpacity>
      );
      return (
        <View style={styles.dayRow}>
          <Text style={styles.dayRowText}>{day}</Text>
          {day !== 'UNFINISHED' ? addButton : null}
        </View>
      );
    }
    function rc({ key, day }) {
      const filteredEvents = this.state.events.filter((event) => {
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
        if (day === 'SOMEDAY') {
          return event.time === null;
        }
        if (day === 'UNFINISHED') {
          return today.getTime() > new Date(event.time).getTime()
          && event.completed === false && event.time !== null;
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
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchReminders: (...args) => { dispatch(fetchReminders(...args)); },
    createReminder: (...args) => { dispatch(createReminder(...args)); },
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Reminders);
