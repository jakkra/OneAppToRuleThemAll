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

import { fetchLogs, changeLocation } from '../actions/data';
import { toHourMinutes, toDateMonth } from '../util/DateUtils';
import config from '../util/config';

import Icon from 'react-native-vector-icons/Ionicons';

import Modal from 'react-native-modalbox';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  modal: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'lightgray',
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
});

export default class ReminderNotificationModal extends React.Component {

  static propTypes = {
    loginReducer: React.PropTypes.object.isRequired,
    dataReducer: React.PropTypes.object.isRequired,
    isOpen: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    passProps: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log('new props modal', nextProps);
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
        <View style={styles.container}>
          <Text style={styles.reminderText}>Title do something</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={this.compleateReminder} style={styles.rowElement}>
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
            <TouchableOpacity onPress={this.compleateReminder} style={styles.rowElement}>
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
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginReducer: state.login,
    dataReducer: state.data,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLogs: (...args) => { dispatch(fetchLogs(...args)); },
    changeLocation: (...args) => { dispatch(changeLocation(...args)); },
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ReminderNotificationModal);
