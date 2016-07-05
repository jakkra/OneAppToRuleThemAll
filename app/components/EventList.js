import React from 'react';

import {
  Text,
  StyleSheet,
} from 'react-native';

import Accordion from 'react-native-accordion';
import { getMonthName } from '../util/DateUtils';
import { View } from 'react-native-animatable';
import ReminderActions from './ReminderActions';

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
    marginLeft: 20,
  },
  eventTitleText: {
    fontSize: 17,
    color: 'dimgray',
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

export default class EventList extends React.Component {

  static propTypes = {
    events: React.PropTypes.array.isRequired,
  };

  complete() {
    console.log('doStuff');
  }

  render() {
    const rows = this.props.events.map((event) => {
      const header = (
        <View animation="slideInDown" style={styles.listElement}>
          <Text style={styles.eventTitleText}>{event.title}</Text>
        </View>
      );
      const startTime = new Date(event.time);
      let day;
      if (startTime.toDateString() === new Date().toDateString()) {
        day = 'TODAY';
      } else {
        day = getMonthName(startTime.getUTCMonth()) + ' ' + startTime.getUTCDay();
      }

      const content = (
        <View style={styles.openContainer}>
          <View style={styles.row}>
            <Text
              style={{ fontSize: 15, fontWeight: 'bold', color: 'lightgray' }}
            >{day + ' | '}</Text>
            <Text style={{ fontSize: 15, color: 'lightgray' }} >
            {startTime.getHours() + ':' + startTime.getMinutes()}
            </Text>
          </View>
          <View style={styles.row}>
            <ReminderActions onComplete={this.complete} />
          </View>
        </View>
      );
      return (
        <Accordion
          ref="accordion"
          animationDuration={10}
          underlayColor="white"
          key={event.title}
          header={header}
          content={content}
          easing="linear"
        />
      );
    });
    if (rows && rows.length > 0) {
      return (
        <View style={styles.list}>
          {rows}
        </View>
      );
    }
    return null;
  }
}
