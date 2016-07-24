import React from 'react';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Accordion from 'react-native-collapsible/Accordion';
import { getMonthName, toHourMinutes } from '../util/DateUtils';
import { createAnimatableComponent, View } from 'react-native-animatable';
import ReminderActions from './ReminderActions';

import { connect } from 'react-redux';
import { editReminder } from '../actions/reminders';

import Ic from 'react-native-vector-icons/FontAwesome';

const Icon = createAnimatableComponent(Ic);


const styles = StyleSheet.create({
  list: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  listElement: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 23,
    //paddingTop: 10,
  },
  eventTitleText: {
    fontSize: 21,
    color: 'dimgray',
    marginLeft: 15,
    marginBottom: 2,
  },
  openContainer: {
    marginBottom: 10,
    paddingLeft: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: 'lightgray',
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
});

class EventList extends React.Component {

  static propTypes = {
    events: React.PropTypes.array.isRequired,
    editReminder: React.PropTypes.func.isRequired,
    loginReducer: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.updateReminder = this.updateReminder.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  getCompleatedIcon(event) {
    if (event.completed === true) {
      return { name: 'check-circle', color: 'lime' };
    }
    return { name: 'circle-thin', color: '#0099CC' };
  }

  updateReminder(eventId, field) {
    const event = this.props.events.find((e) => e.id === eventId);
    switch (field) {
      case 'edit':
        break;
      case 'complete':
        // this.refs['checkIcon' + eventId].flash();
        this.props.editReminder({
          id: eventId,
          completed: !event.completed,
        },
          this.props.loginReducer.accessToken
        );
        return;
      case 'alarm':
        this.props.editReminder({
          id: eventId,
          reminderActive: !event.reminderActive,
        },
          this.props.loginReducer.accessToken
        );
        return;
      case 'delete':
        this.props.editReminder({
          id: eventId,
          deleted: true,
        },
          this.props.loginReducer.accessToken
        );
        return;
      default:
        return;
    }
  }

  renderHeader(event, index, isActive) {
    const icon = this.getCompleatedIcon(event);
    return (
      <View animation="slideInDown" style={styles.listElement}>
        <TouchableOpacity
          onPress={() => this.updateReminder(event.id, 'complete')}
        >
          <Icon
            key={event.id}
            ref={'checkIcon' + event.id}
            name={icon.name}
            color={icon.color}
            size={21}
          />
        </TouchableOpacity>
        <Text style={styles.eventTitleText}>{event.title}</Text>
      </View>
    );
  }

  renderContent(event, index, isActive) {
    const startTime = new Date(event.time);
    let day;
    if (startTime.toDateString() === new Date().toDateString()) {
      day = 'TODAY';
    } else {
      day = getMonthName(startTime.getUTCMonth()) + ' ' + startTime.getDate();
    }

    return (
      <View style={styles.openContainer}>
        <View style={styles.row}>
          <Text
            style={{ fontSize: 15, fontWeight: 'bold', color: 'lightgray' }}
          >{day + ' | '}</Text>
          <Text style={{ fontSize: 15, color: 'lightgray' }} >
          {toHourMinutes(startTime)}
          </Text>
        </View>
        <View style={styles.row}>
          <ReminderActions
            event={event}
            onComplete={(field) => this.updateReminder(event.id, field)}
          />
        </View>
      </View>
    );
  }
  render() {
    return (
      <Accordion
        sections={this.props.events}
        underlayColor="white"
        renderHeader={this.renderHeader}
        renderContent={this.renderContent}
      />
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
    editReminder: (...args) => { dispatch(editReminder(...args)); },
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(EventList);
