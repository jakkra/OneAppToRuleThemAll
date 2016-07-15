'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';

import {
  MKSlider,
  MKProgress,
  MKSwitch,
  MKColor,
} from 'react-native-material-kit';

import { connect } from 'react-redux';
import { fetchHueLighsInfo, changeLightState, changeGroupState } from '../actions/light';

import Accordion from 'react-native-collapsible/Accordion';

import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMA from 'react-native-vector-icons/MaterialIcons';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
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
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: Dimensions.get('window').width,
  },
  lampText: {
    flex: 0.8,
    fontSize: 30,
    color: 'gray',
    marginLeft: 30,
  },
  progress: {
    width: Dimensions.get('window').width,
  },
  lampIcon: {
    flex: 0.1,
    marginLeft: 30,
  },
  switch: {
  },
  divider: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 5,
  },
  dividerText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0099CC',
    marginLeft: 30,
  },
  slider: {
    width: 300,
    alignSelf: 'center',
  },
});


class Lights extends React.Component {

  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    fetchHueLighsInfo: React.PropTypes.func.isRequired,
    changeGroupState: React.PropTypes.func.isRequired,
    changeLightState: React.PropTypes.func.isRequired,
    loginReducer: React.PropTypes.object.isRequired,
    lightReducer: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      brightness: 127,
      lights: null,
      groups: null,
    };
    this.renderLights = this.renderLights.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchHueLighsInfo(this.props.loginReducer.accessToken);
    });
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
      const lights = Object.keys(nextProps.lightReducer.info.lights).map((key, index) => {
        const light = nextProps.lightReducer.info.lights[key];
        light.key = key;
        return light;
      })
      const groups = Object.keys(nextProps.lightReducer.info.groups).map((key, index) => {
        const group =  nextProps.lightReducer.info.groups[key];
        group.key = key;
        return group;
      }) 

      this.setState({
        lights: lights,
        groups: groups,
      });
    }
  }

  changeHueState(hue, params) {
    if (hue.type === 'ROOM ') {
      this.props.changeGroupState(
        this.props.loginReducer.accessToken,
        hue.key,
        params
      );
    } else {
      this.props.changeLightState(
        this.props.loginReducer.accessToken,
        hue.key,
        params
      );
    }
  }


  renderContent(light) {
    return (
      <MKSlider
        min={0}
        max={254}
        value={this.state.brightness}
        style={styles.slider}
        ref="brightnessSlider"
        onConfirm={(val) => this.changeHueState(light, { on: true, bri: val })}
      />
    );
  }

  renderLights() {
    function rh(light) {
      return (
        <View style={styles.listRow}>
          <IconFA
            ref="lightBulb"
            style={styles.lampIcon}
            name="lightbulb-o"
            color={(light.state.on === true) ? MKColor.Yellow : MKColor.Grey} size={40}
          />
          <Text style={styles.lampText}>{light.name}</Text>
          <MKSwitch style={styles.switch}
            checked={light.state.on}
            onColor='rgba(255, 152, 0, 0.3)'
            thumbOnColor={MKColor.Yellow}
            thumbOffColor='#0099CC'
            rippleColor='rgba(255, 152 ,0 , 0.2)'
            onCheckedChange={(val) => this.changeHueState(light, { on: val.checked })}
              />
        </View>
      );
    }
    const renderHeader = rh.bind(this);
    return (
      <View>
        <Accordion
          underlayColor="white"
          sections={this.state.lights}
          renderHeader={renderHeader}
          renderContent={this.renderContent}
        />
      </View>
    );
  }

  renderGroups() {
    function rh(group) {
      return (
        <View style={styles.listRow}>
          <IconMA
            ref="groupIcon"
            style={styles.lampIcon}
            name="group-work"
            color={(group.state.all_on === true) ? MKColor.Yellow : MKColor.Red}
            size={29}
          />
          <Text style={styles.lampText}>{group.name}</Text>
          <MKSwitch style={styles.switch}
            checked={group.state.all_on}
            onColor='rgba(255, 152, 0, 0.3)'
            thumbOnColor={MKColor.Yellow}
            thumbOffColor='#0099CC'
            rippleColor='rgba(255, 152 ,0 , 0.2)'
            onCheckedChange={(val) => this.changeHueState(group, { on: val.checked })}
          />
        </View>
      );
    }
    const renderHeader = rh.bind(this);

    return (
      <View>
        <Accordion
          underlayColor="white"
          sections={this.state.groups}
          renderHeader={renderHeader}
          renderContent={this.renderContent}
        />
      </View>
    );
  }

  renderDivider(text) {
    return (
      <View style={styles.divider}>
        <Text style={styles.dividerText}>{text}</Text>
      </View>
    );
  }

  render() {
    if (this.state.lights === null) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
          <Text style={styles.headerText}>Let there be light!</Text>
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
          <Text style={styles.headerText}>Let there be light!</Text>
        </View>
        <ScrollView
          ref="scrollView"
          style={styles.scrollView}
        >
          {this.renderDivider('Lights')}
          {this.renderLights()}
          {this.renderDivider('Groups')}
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
    changeGroupState: (...args) => { dispatch(changeGroupState(...args)); },
    changeLightState: (...args) => { dispatch(changeLightState(...args)); },
    fetchHueLighsInfo: (...args) => { dispatch(fetchHueLighsInfo(...args)); },

  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Lights);
