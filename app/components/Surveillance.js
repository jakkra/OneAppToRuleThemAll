'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  InteractionManager,
  ListView,
  ToastAndroid,
} from 'react-native';

import { connect } from 'react-redux';

import { fetchLogs, changeLocation } from '../actions/data';
import { toHourMinutes, toDateMonth } from '../util/DateUtils';
import config from '../util/config';

import Icon from 'react-native-vector-icons/FontAwesome';

import {
  MKProgress,
} from 'react-native-material-kit';

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
    color: '#0099CC',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 10,
    height: 40,
    alignItems: 'center',
  },
  logText: {
    marginLeft: 5,
    fontSize: 20,
    justifyContent: 'center',
  },
  logTextDate: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  button: {
    height: 65,
    width: Dimensions.get('window').width,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

/**
 * Displays a list of the Surveillance logs, also includes a buttom change your
 * location to home/away, incase the geofence isn't working correctly.
 */
export default class Surveillance extends React.Component {

  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    fetchLogs: React.PropTypes.func.isRequired,
    changeLocation: React.PropTypes.func.isRequired,
    dataReducer: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      atHome: false,
      hasFetchedOnce: false,
    };
    this.changeLocation = this.changeLocation.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ atHome: this.props.user.atHome });
      this.props.fetchLogs(this.props.user.accessToken);
    });
  }


  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (this.props.dataReducer.isFetchingLogs === true &&
      nextProps.dataReducer.isFetchingLogs === false) {
      if (nextProps.dataReducer.logs.length === 0) {
        ToastAndroid.show('No logs found', ToastAndroid.LONG);
        this.setState({ hasFetchedOnce: true });
      } else {
        this.setState({
          hasFetchedOnce: true,
          dataSource: this.ds.cloneWithRows(nextProps.dataReducer.logs),
        });
      }
    }
  }

  /**
   * Changes the location of the user to either home or away.
   */
  changeLocation() {
    fetch(config.serverURL + '/api/user/edit', {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': this.props.user.accessToken,
      },
      body: JSON.stringify({
        atHome: !this.state.atHome,
      }),
    })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        this.setState({ atHome: !this.state.atHome });
      } else {
        ToastAndroid.show('Failed to change location' + json, ToastAndroid.LONG);
      }
    })
  .catch((error) => ToastAndroid.show('Failed to change location' + error, ToastAndroid.LONG));
  }

  /**
   * Renders a one log row in the list.
   */
  renderLogRow(log) {
    const date = new Date(log.createdAt);
    return (
      <View style={styles.row}>
        <Icon name="exclamation" color="#0099CC" size={26} />
        <Text style={styles.logText}>Movement detected at </Text>
        <Text style={styles.logTextDate}>
          {toDateMonth(date) + ' ' + toHourMinutes(date)}
        </Text>
      </View>
    );
  }

  render() {
    if (this.props.dataReducer.isFetchingLogs === true || !this.state.hasFetchedOnce) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Logs</Text>
          </View>
          <MKProgress.Indeterminate
            style={styles.progress}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Logs</Text>
        </View>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          style={{ flex: 1 }}
          renderRow={this.renderLogRow}
        />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={this.changeLocation}
        >
          <Text style={styles.buttonText}>
            {this.state.atHome === true ? 'Leave home' : 'Teleport me home'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    dataReducer: state.data,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchLogs: (...args) => { dispatch(fetchLogs(...args)); },
    changeLocation: (...args) => { dispatch(changeLocation(...args)); },
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Surveillance);
