'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  MKSlider,
} from 'react-native-material-kit';

import { connect } from 'react-redux';
import { sendHueLightChange, fetchHueLighsInfo } from '../actions/light';

import { createAnimatableComponent } from 'react-native-animatable';

import Ic from 'react-native-vector-icons/FontAwesome';

const Icon = createAnimatableComponent(Ic);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
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
  chart: {
    width: 350,
    height: 180,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'column',
  },
  listRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  lampText: {
    fontSize: 20,
    color: 'gray',
  },
});


class Lights extends React.Component {

  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    fetchHueLighsInfo: React.PropTypes.func.isRequired,
    sendHueLightChange: React.PropTypes.func.isRequired,
    loginReducer: React.PropTypes.object.isRequired,
    lightReducer: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      brightness: 127,
      lights: [],
      groups: [],
    };
    this.renderLights = this.renderLights.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
  }

  componentDidMount() {
    this.props.fetchHueLighsInfo(this.props.loginReducer.accessToken);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lightReducer.isFetching === true &&
      nextProps.lightReducer.isFetching === false) {
      // stop loading
    } else if (this.props.lightReducer.isFetching === false &&
      nextProps.lightReducer.isFetching === true) {
      // start loading
    }
    if (this.props.lightReducer.info === null &&
      nextProps.lightReducer.info !== null) {
      this.setState({
        lights: nextProps.lightReducer.info.lights,
        groups: nextProps.lightReducer.info.groups,
      });
    }
  }

  renderLights() {
    const rows = Object.keys(this.state.lights).map((light, index) => {
      return (
        <View key={index} style={styles.listRow}>
          <Icon ref="lightBulb" key={index} name="lightbulb-o" color="yellow" size={40} />
          <Text style={styles.lampText}>{this.state.lights[light].name}</Text>
        </View>
      );
    });
    return rows;
  }

  renderGroups() {
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Let there be light!</Text>
        </View>
        <MKSlider
          min={0}
          max={255}
          value={this.state.brightness}
          style={{ width: 200 }}
          ref="brightnessSlider"
          onConfirm={(curValue) => {
            this.setState({
              brightness: curValue,
            });
          }}
        />
        <ScrollView
          ref="scrollView"
          style={styles.scrollView}
        >
          {this.renderLights()}
          {this.renderGroups()}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    lightReducer: state.light,
    loginReducer: state.login,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendHueLightChange: (...args) => { dispatch(sendHueLightChange(...args)); },
    fetchHueLighsInfo: (...args) => { dispatch(fetchHueLighsInfo(...args)); },

  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Lights);
