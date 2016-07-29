'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';

import { editReminder } from '../actions/reminders';
import { toHourMinutes, toDateMonth } from '../util/DateUtils';
import config from '../util/config';

import Icon from 'react-native-vector-icons/Ionicons';

import Modal from 'react-native-modalbox';
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 30,
  },
  modal: {
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'lightgray',
    marginBottom: 20,
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
    color: '#0099CC',
  },
  unitButton: {
    backgroundColor: '#0099CC',
    borderRadius: 10,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numUnitsButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    padding: 2,
    paddingHorizontal: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

const numUnits1 = [1, 5, 10];
const numUnits2 = [20, 30, 40];
const numUnits3 = [60, 120];

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
    console.log(this.props);
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      numUnits: 1,
    };
    this.completeReminder = this.completeReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
    this.delayReminder = this.delayReminder.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('new props modal', nextProps);
  }

  completeReminder() {
    const reminderId = this.props.passProps.reminder.id;
    this.props.editReminder({
      id: reminderId,
      completed: true,
    },
      this.props.loginReducer.accessToken
    );
    this.refs.modal.close();
  }

  deleteReminder() {
    const reminderId = this.props.passProps.reminder.id;
    this.props.editReminder({
      id: reminderId,
      deleted: true,
    },
      this.props.loginReducer.accessToken
    );
    this.refs.modal.close();
  }

  delayReminder() {
    const reminderId = this.props.passProps.reminder.id;
    this.refs.swiper.scrollBy(1);
    /* this.props.editReminder({
      id: reminderId,
      deleted: true,
    },
      this.props.loginReducer.accessToken
    );
    this.refs.modal.close();*/
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
        <Swiper ref="swiper" style={styles.wrapper} scrollEnabled={false} showsPagination={false} horizontal={false} loop={false}>
          <View style={[styles.container, { flexDirection: 'column' }]}>
            <Text style={styles.reminderText}>Reminder title here</Text>
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
                <TouchableOpacity key={num} style={styles.unitButton}>
                  <Text style={styles.numUnitsButtonText}> {num}</Text>
                </TouchableOpacity>
              ))}
              
            </View>
            <View style={styles.snoozeRow}>
              {numUnits2.map((num) => (
                <TouchableOpacity key={num} style={styles.unitButton}>
                  <Text style={styles.numUnitsButtonText}> {num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.snoozeRow}>
              {numUnits3.map((num) => (
                <TouchableOpacity key={num} style={styles.unitButton}>
                  <Text style={styles.numUnitsButtonText}> {num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.snoozeRow}>
              {units.map((name) => (
                <TouchableOpacity key={name} style={styles.unitButton}>
                  <Text style={styles.numUnitsButtonText}> {name}</Text>
                </TouchableOpacity>
              ))}
            </View>
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
