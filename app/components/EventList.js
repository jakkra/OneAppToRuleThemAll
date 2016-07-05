import React from 'react';

import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import Accordion from 'react-native-accordion';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  listElement: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    justifyContent: 'flex-start',
    marginLeft: 20,
  },
  eventTitleText: {
    fontSize: 14,
    color: 'dimgray',
  },
  openContainer: {
    marginBottom: 10,
    paddingLeft: 30,
    borderBottomWidth: 0.2,
    borderBottomColor: 'lightgray',
    flexDirection: 'row',
  },
});

export default class EventList extends React.Component {

  static propTypes = {
    events: React.PropTypes.array.isRequired,
  };

  render() {
    const rows = this.props.events.map((event) => {
      // if (this.refs.accordion.)
      const header = (
        <View style={styles.listElement}>
          <Text style={styles.eventTitleText}>{event.title}</Text>
        </View>
      );
      const startTime = new Date(event.time);


      const content = (
        <View style={styles.openContainer}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{'TODAY | '}</Text>
          <Text>{startTime.getHours() + ':' + startTime.getMinutes()}</Text>
        </View>
      );
      return (
        <Accordion
          ref="accordion"
          animationDuration={200}
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
