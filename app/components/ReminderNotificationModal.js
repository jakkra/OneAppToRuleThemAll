'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  ToastAndroid,
  Text,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';

import { editReminder } from '../actions/reminders';
import SpinningIcon from './SpinningIcon';


import Icon from 'react-native-vector-icons/Ionicons';

import Modal from 'react-native-modalbox';
import Swiper from 'react-native-swiper';

import ToggleButton from './ToggleButton';

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
  },
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'lightgray',
  },
  snoozeRow: {
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },
  rowElement: {
    flexDirection: 'column',
    borderColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  reminderText: {
    fontSize: 20,
    color: 'black',
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  unitButton: {
    backgroundColor: '#0099CC',
    borderRadius: 10,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const numUnits1 = ['1', '5', '10'];
const numUnits2 = ['20', '30', '40'];
const numUnits3 = ['60', '120'];

const units = ['minutes', 'hours', 'days', 'weeks'];

export default class ReminderNotificationModal extends React.Component {

  static propTypes = {
    loginReducer: React.PropTypes.object.isRequired,
    remindersReducer: React.PropTypes.object.isRequired,
    isOpen: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    editReminder: React.PropTypes.func.isRequired,
    passProps: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      numUnits: 1,
    };
    this.numberUnits = null;
    this.unit = null;
    this.completeReminder = this.completeReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
    this.delayReminder = this.delayReminder.bind(this);
    this.onToggleButton = this.onToggleButton.bind(this);
    this.handleReminder = this.handleReminder.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.remindersReducer.editedEvent === null
      && nextProps.remindersReducer.editedEvent !== null) {
      this.numberUnits = null;
      this.unit = null;
      this.refs.modal.close();
    } else if (this.props.remindersReducer.error === false
      && nextProps.remindersReducer.editedEvent === true) {
      ToastAndroid.show('Error editing reminder', ToastAndroid.LONG);
      this.refs.swiper.scrollBy(- 2);
      this.numberUnits = null;
      this.unit = null;
    }
  }

  onToggleButton(key) {
    if (this.isNumber(key)) {
      this.numberUnits = key;
    } else {
      this.unit = key;
    }
    if (this.numberUnits !== null && this.unit !== null) {
      this.refs.swiper.scrollBy(1);
      const reminderId = this.props.passProps.reminder.id;
      const num = parseInt(this.numberUnits, 10);
      const snoozeTime = new Date();
      switch (this.unit) {
        case 'weeks':
          snoozeTime.setDate(snoozeTime.getDate() + num * 7);
          break;
        case 'days':
          snoozeTime.setDate(snoozeTime.getDate() + num);
          break;
        case 'hours':
          snoozeTime.setHours(snoozeTime.getHours() + num);
          break;
        case 'minutes':
          snoozeTime.setMinutes(snoozeTime.getMinutes() + num);
          break;
        default:
          break;
      }
      this.props.editReminder({
        id: reminderId,
        time: snoozeTime,
      },
        this.props.loginReducer.accessToken
      );
    }
  }

  isNumber(obj) {
    return !isNaN(parseInt(obj, 10));
  }

  handleReminder() {
    this.refs.swiper.scrollBy(1);
  }

  completeReminder() {
    const reminderId = this.props.passProps.reminder.id;
    this.props.editReminder({
      id: reminderId,
      completed: true,
    },
      this.props.loginReducer.accessToken
    );
    this.refs.swiper.scrollBy(2);
  }

  deleteReminder() {
    const reminderId = this.props.passProps.reminder.id;
    this.props.editReminder({
      id: reminderId,
      deleted: true,
    },
      this.props.loginReducer.accessToken
    );
    this.refs.swiper.scrollBy(2);
  }

  delayReminder() {
    this.refs.swiper.scrollBy(1);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClosed={this.props.onClose}
        style={styles.modal}
        position={'bottom'}
        ref="modal"
      >
        <Swiper
          ref="swiper"
          style={styles.wrapper}
          scrollEnabled={false}
          showsPagination={false}
          horizontal={false}
          loop={false}
        >
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <View style={styles.row}>
              <TouchableOpacity onPress={this.handleReminder} style={styles.rowElement}>
                <Icon
                  name="md-alarm"
                  color="#0099CC"
                  size={90}
                />
              </TouchableOpacity>
              <Text style={styles.reminderText}>{this.props.passProps.reminder.title}</Text>
            </View>
          </View>
          <View style={[styles.container, { flexDirection: 'column' }]}>
            <View style={styles.row}>
              <TouchableOpacity onPress={this.completeReminder} style={styles.rowElement}>
                <Icon
                  ref="tempGraphButton"
                  name="md-checkmark-circle-outline"
                  color="lime"
                  size={70}
                />
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.delayReminder} style={styles.rowElement}>
                <Icon
                  ref="tempGraphButton"
                  name="ios-timer-outline"
                  color="#0099CC"
                  size={70}
                />
                <Text style={styles.buttonText}>Snooze</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.deleteReminder} style={styles.rowElement}>
                <Icon
                  ref="tempGraphButton"
                  name="ios-trash-outline"
                  color="red"
                  size={70}
                />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>

          </View>
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <View style={styles.snoozeRow}>
              {numUnits1.map((num) => (
                <ToggleButton
                  key={num}
                  text={num}
                  onToggle={this.onToggleButton}
                  style={styles.unitButton}
                />
              ))}
            </View>
            <View style={styles.snoozeRow}>
              {numUnits2.map((num) => (
                <ToggleButton
                  key={num}
                  text={num}
                  onToggle={this.onToggleButton}
                  style={styles.unitButton}
                />
              ))}
            </View>
            <View style={styles.snoozeRow}>
              {numUnits3.map((num) => (
                <ToggleButton
                  key={num}
                  text={num}
                  onToggle={this.onToggleButton}
                  style={styles.unitButton}
                />
              ))}
            </View>
            <View style={styles.snoozeRow}>
              {units.map((name) => (
                <ToggleButton
                  key={name}
                  text={name}
                  onToggle={this.onToggleButton}
                  style={styles.unitButton}
                />
              ))}
            </View>
          </View>
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <SpinningIcon
              icon={"spinner"}
              loading={[true]}
            />
          </View>
        </Swiper>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginReducer: state.login,
    remindersReducer: state.reminders,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    editReminder: (...args) => { dispatch(editReminder(...args)); },
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ReminderNotificationModal);
