'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  InteractionManager,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';

import { connect } from 'react-redux';
import config from '../util/config';

import { createAnimatableComponent } from 'react-native-animatable';

import Picker from 'react-native-wheel-picker';
const PickerItem = Picker.Item;
import Modal from 'react-native-modalbox';
import { TriangleColorPicker } from 'react-native-color-picker';

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
  header: {
    flexDirection: 'row',
    height: 50,
    borderBottomWidth: 0.3,
    borderBottomColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'stretch',
    color: '#0099CC',
  },
  headerColumn: {
    flexDirection: 'column',
    flex: 0.5,
    marginHorizontal: 20,
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
  sidePicker: {
    width: 200,
    height: 100,
    alignSelf: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 500,
    width: 330,
  },
  modalRow: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
      component: 'All',
      selectedComponent: 2,
      itemList: ['All', 'News', 'Forecasts', 'Weather', 'Article', 'Tasks'],
      textToSpeak: '',
      ledSideList: ['All', 'Top', 'Right', 'Bottom', 'Left'],
      selectedLedSide: 'All',
    };
    this.hideMirrorComponent = this.hideMirrorComponent.bind(this);
    this.showMirrorComponent = this.showMirrorComponent.bind(this);
    this.rightPage = this.rightPage.bind(this);
    this.leftPage = this.leftPage.bind(this);
    this.sendSpeak = this.sendSpeak.bind(this);
    this.showColorPicker = this.showColorPicker.bind(this);
    this.colorSelected = this.colorSelected.bind(this);
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
    if (this.state.component === 'all') {
      fetch(config.mirrorURL + '/api/show/');
    } else {
      fetch(config.mirrorURL + '/api/show/' + this.state.component);
    }
  }

  leftPage() {
    fetch(config.mirrorURL + '/api/previous/');
  }

  rightPage() {
    fetch(config.mirrorURL + '/api/next/');
  }

  powerOffMirror() {
    Alert.alert(
      'Shutdown Mirror',
      'Are you sure?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Yes', onPress: () => fetch(config.mirrorURL + '/api/shutdown/') },
      ]
    );
  }

  sendSpeak() {
    fetch(config.mirrorURL + '/api/speak/' + this.state.textToSpeak);
  }

  showColorPicker() {
    this.refs.modal.open();
  }

  colorSelected(color) {
    console.log(color, this.state.selectedLedSide, this.hexToRgb(color));
    const options = {
      method: 'POST',
      body: JSON.stringify({
        side: this.state.selectedLedSide,
        rgb: this.hexToRgb(color),
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    fetch(config.mirrorURL + '/api/serial/', options)
    .then(response => console.log(response))
    .then(json => console.log(json))
    .catch(err => console.log(err));
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }

  handleMode(mode){
    const options = {
      method: 'POST',
      body: JSON.stringify({
        mode: mode,
        speed: 50,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    fetch(config.mirrorURL + '/api/serial/', options)
    .then(response => console.log(response))
    .then(json => console.log(json))
    .catch(err => console.log(err));
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerColumn}>
            <Text style={styles.headerText}>{'Smart Mirror'}</Text>
          </View>
          <View style={[styles.headerColumn, { alignItems: 'flex-end' }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { fontSize: 12 }]}>
                OPTIONS
              </Text>
              <TouchableOpacity onPress={this.showColorPicker} style={styles.rowElement}>
                <IconFA ref="reminderButton" name="lightbulb-o" color="#0099CC" size={45} />
              </TouchableOpacity>

              <TouchableOpacity onPress={this.powerOffMirror} style={styles.rowElement}>
                <IconFA ref="signOutButton" name="power-off" color="#0099CC" size={35} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
              onValueChange={(index) => this.setState({
                selectedComponent: index,
                component: this.state.itemList[index].toLowerCase(),
              })}
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
          <View style={[styles.row, { borderTopWidth: 0.2 }]}>
            <View style={[styles.grid, { marginLeft: 0 }]}>
              <View style={styles.row}>
                <TextInput
                  style={[styles.rowElement, { fontSize: 12, color: '#0099CC' }]}
                  placeholder={'This will be spoken'}
                  placeholderTextColor="lightgray"
                  value={this.state.textToSpeak}
                  onChangeText={text => this.setState({ ...{ textToSpeak: text } })}
                  onSubmitEditing={this.sendSpeak}
                />
                <TouchableOpacity onPress={this.sendSpeak} style={styles.rowElement}>
                  <IconFA ref="reminderButton" name="volume-up" color="#0099CC" size={25} />
                  <Text style={[styles.label, { fontSize: 12 }]}>
                    Speak
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row} />
            </View>
          </View>

        </View>
        <Modal
          style={styles.modal}
          position={"center"}
          ref={"modal"}
          isDisabled={false}
          swipeToClose={false}
        >
          <View style={{ flex: 1, backgroundColor: '#212021' }}>
            <TriangleColorPicker
              oldColor="purple"
              onColorSelected={this.colorSelected}
              style={{ flex: 1, width: 330, alignSelf: 'center', padding: 10 }}
            />
            <Picker
              style={styles.sidePicker}
              selectedValue={this.state.selectedLedSide}
              itemStyle={{ color: 'black', fontSize: 26 }}
              onValueChange={(index) => this.setState({
                selectedLedSide: this.state.ledSideList[index].toLowerCase(),
              })}
            >
              {this.state.ledSideList.map((value, i) => (
                <PickerItem label={value} value={i} key={value} />
              ))}
            </Picker>
            <View style={styles.modalRow}>
              <TouchableOpacity onPress={() => this.handleMode('rainbow')} style={styles.rowElement}>
                <IconFA ref="reminderButton" name="lightbulb-o" color="#0099CC" size={25} />
                <Text style={[styles.label, { fontSize: 12 }]}>
                  Rainbow
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleMode('rainbowCycle')} style={styles.rowElement}>
                <IconFA ref="reminderButton" name="lightbulb-o" color="#0099CC" size={25} />
                <Text style={[styles.label, { fontSize: 12 }]}>
                  Rainbow Cycle
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.handleMode('theaterChaseRainbow')} style={styles.rowElement}>
                <IconFA ref="reminderButton" name="lightbulb-o" color="#0099CC" size={25} />
                <Text style={[styles.label, { fontSize: 12 }]}>
                  Chase Rainbow
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>
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
