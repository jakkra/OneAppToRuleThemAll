'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  InteractionManager,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import config from '../util/config';

import { createAnimatableComponent } from 'react-native-animatable';

import Picker from 'react-native-wheel-picker';
const PickerItem = Picker.Item;

import IcFA from 'react-native-vector-icons/FontAwesome';

const IconFA = createAnimatableComponent(IcFA);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  grid: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 20,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderColor: 'lightgray',
  },
  rowElement: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'lightgray',

  },
  label: {
    fontSize: 16,
    color: 'gray',
    fontWeight: 'bold',
    paddingHorizontal: 2,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: 200,
    height: 180,
    alignSelf: 'center',
  },
});

/**
 * Displays the Mirror Config screen.
 */
export default class MirrorConfig extends React.Component {

  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
    userReducer: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      component: 'all',
      selectedComponent: 2,
      itemList: ['All', 'News', 'Forecasts', 'Weather', 'Article', 'Tasks'],
    };
    this.hideMirrorComponent = this.hideMirrorComponent.bind(this);
    this.showMirrorComponent = this.showMirrorComponent.bind(this);
    this.rightPage = this.rightPage.bind(this);
    this.leftPage = this.leftPage.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      console.log(this.props.userReducer);
    });
  }

  hideMirrorComponent() {
    console.log('Hide component on mirror', this.state.component);
    if (this.state.component === 'all') {
      fetch(config.mirrorURL + '/api/hide/');
    } else {
      fetch(config.mirrorURL + '/api/hide/' + this.state.component)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
    }
  }

  showMirrorComponent() {
    console.log('Hide component on mirror', this.state.component);
    if (this.state.component === 'all') {
      fetch(config.mirrorURL + '/api/show/');
    } else {
      fetch(config.mirrorURL + '/api/show/' + this.state.component);
    }
  }

  leftPage() {
    console.log('Left page');
    fetch(config.mirrorURL + '/api/previous/');
  }

  rightPage() {
    console.log('Left page');
    fetch(config.mirrorURL + '/api/next/');
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.grid}>
          <View style={[styles.row, { borderBottomWidth: 0.2 }]}>
            <TouchableOpacity
              onPress={this.showMirrorComponent}
              style={[styles.rowElement, { borderRightWidth: 0.2 }]}
            >
              <IconFA ref="reminderButton" name="eye" color="#0099CC" size={60} />
              <Text style={styles.label}>
                Show element
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.hideMirrorComponent} style={styles.rowElement}>
              <IconFA ref="reminderButton" name="eye-slash" color="#0099CC" size={60} />
              <Text style={styles.label}>
                Hide element
              </Text>
            </TouchableOpacity>

          </View>
          <View style={[styles.row, { borderBottomWidth: 0.2, justifyContent: 'center' }]}>
            <Picker
              style={styles.picker}
              selectedValue={this.state.selectedComponent}
              itemStyle={{ color: 'black', fontSize: 26 }}
              onValueChange={(index) => this.setState({ selectedComponent: index, component: this.state.itemList[index].toLowerCase() })}
            >
              {this.state.itemList.map((value, i) => (
                <PickerItem label={value} value={i} key={value} />
              ))}
            </Picker>
          </View>
          <View style={[styles.row]}>
            <TouchableOpacity
              onPress={this.leftPage}
              style={[styles.rowElement, { borderRightWidth: 0.2 }]}
            >
              <IconFA ref="reminderButton" name="arrow-left" color="#0099CC" size={60} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.rightPage} style={styles.rowElement}>
              <IconFA ref="reminderButton" name="arrow-right" color="#0099CC" size={60} />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userReducer: state.user,
  };
}

function mapDispatchToProps() {
  return {
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(MirrorConfig);
