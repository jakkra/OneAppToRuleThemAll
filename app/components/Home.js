import React from 'react';
import {
  StyleSheet,
  ListView,
  View,
  Text,
  RefreshControl,
  ScrollView,
  TouchableHighlight,
} from 'react-native';

import { connect } from 'react-redux';
import { fetchReminders } from '../actions/reminders';

import EventList from './EventList';
import Accordion from 'react-native-accordion';

import Icon from 'react-native-vector-icons/Entypo';

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
    color: '#0099CC',
    fontSize: 26,
    marginHorizontal: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    flex: 0.95,
    marginLeft: 20,
  },
  dayRowIcon: {
    flex: 0.05,
    alignSelf: 'center',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 40,
    marginRight: 20,
  },
  dayRowIconText: {
    color: '#0099CC',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  dayRowOpen: {

  },


});

/* const route = {
  type: 'push',
  route: {
    key: 'about',
    title: 'About',
  },
};*/

class Home extends React.Component {
  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    fetchReminders: React.PropTypes.func.isRequired,
    remindersReducer: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.events = [];
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
    };
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentDidMount() {
    this.onRefresh();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.remindersReducer.isFetching === false &&
      this.props.remindersReducer.isFetching === true) {
      this.onEventFetchSuccess(nextProps.remindersReducer.events);
    }
  }

  onEventFetchSuccess(events) {
    this.events = events;
    this.setState({
      dataSource: this.ds.cloneWithRows(events),
    });
  }

  onRefresh() {
    this.props.fetchReminders();
  }

  onPressAdd() {
    console.log('onPressAdd');
  }

  renderDayRows() {
    const days = ['TODAY', 'TOMORROW', 'UPCOMING', 'SOMEDAY'];

    const rows = days.map((day) => {
      const filteredEvents = this.events.filter((event) => {
        const today = new Date();
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

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
      const header = (
        <View style={styles.dayRow}>
          <Text style={styles.dayRowText}>{day}</Text>
          <TouchableHighlight style={styles.dayRowIcon}>
            <Text style={styles.dayRowIconText}>
              <Icon name="circle-with-plus" color="#4F8EF7" size={17} />
            </Text>
          </TouchableHighlight>
        </View>
      );


      const content = (
        <EventList events={filteredEvents} />
      );
      return (
        <Accordion
          animationDuration={200}
          underlayColor="white"
          key={day}
          header={header}
          content={content}
          easing="linear"
          // zonPress={this.setState({ hej: 'hej' })}
        />
      );
    });

    return rows;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>ALL</Text>
        </View>
        <ScrollView
          // contentContainerStyle={styles.imageGrid}
          // dataSource={this.state.dataSource}
          // showsVerticalScrollIndicator={false}
          // enableEmptySections={true}
          style={styles.scrollView}
          // renderRow={this.renderRow}
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
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Home);
