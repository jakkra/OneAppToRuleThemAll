'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput,
  InteractionManager,
  ToastAndroid,
  Clipboard,
} from 'react-native';

import { connect } from 'react-redux';

import { updateHueSettings } from '../actions/user';

import Icon from 'react-native-vector-icons/FontAwesome';

import {
  MKButton,
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
  settingsView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  labelText: {
    marginTop: 50,
    fontSize: 18,
    color: '#0099CC',
  },
  textFieldId: {
    width: Dimensions.get('window').width - 100,
    borderBottomColor: '#0099CC',
    color: '#0099CC',
  },
  textFieldToken: {
    width: Dimensions.get('window').width - 100,
    color: '#0099CC',
  },
  saveButton: {
    width: 130,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  saveButtonText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 2,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

/**
 * Displays the Settings screen.
 */
export default class Settings extends React.Component {

  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
    userReducer: React.PropTypes.object.isRequired,
    updateHueSettings: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    if (this.props.userReducer.user.hueBridgeId !== null &&
      this.props.userReducer.user.hueBridgeToken) {
      this.state = {
        hueBridgeId: this.props.userReducer.user.hueBridgeId,
        hueBridgeToken: this.props.userReducer.user.hueBridgeToken,
      };
    } else {
      this.state = {
        hueBridgeId: '',
        hueBridgeToken: '',
      };
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      console.log(this.props.userReducer);
    });
    // ToastAndroid.show('Error getting location status', ToastAndroid.SHORT)
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.userReducer.isUpdatingUser === true &&
      nextProps.userReducer.isUpdatingUser === false) {
      ToastAndroid.show('Successfully updated settings', ToastAndroid.SHORT);
    }
  }

  saveSettings() {
    this.props.updateHueSettings(
      this.props.userReducer.accessToken,
      this.state.hueBridgeId,
      this.state.hueBridgeToken
    );
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Settings</Text>
        </View>
        <View style={styles.settingsView}>
          <Text style={styles.labelText}>Hue Bridge Id</Text>
          <TextInput
            autoCorrect={false}
            style={styles.textFieldId}
            placeholder={'Bridge ID'}
            value={this.state.hueBridgeId}
            onChangeText={text => this.setState({ ...{ hueBridgeId: text } })}
            onSubmitEditing={() => {
              this.updateSettings();
            }}
          />
          <Text style={styles.labelText}>Hue Bridge Access Token</Text>
          <TextInput
            autoCorrect={false}
            style={styles.textFieldToken}
            value={this.state.hueBridgeToken}
            placeholder={'Access Token'}
            onChangeText={text => this.setState({ ...{ hueBridgeToken: text } })}
          />
          <MKButton
            style={styles.saveButton}
            backgroundColor={'#0099CC'}
            shadowRadius={2}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.7}
            shadowColor="black"
            onPress={() => {
              this.saveSettings();
            }}
          >
            <Text
              pointerEvents="none"
              style={styles.saveButtonText}
            > Save</Text>
          </MKButton>
          <Text style={styles.labelText}>Your access token! Copy it!</Text>
          <MKButton
            style={styles.saveButton}
            backgroundColor={'#0099CC'}
            shadowRadius={2}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.7}
            shadowColor="black"
            onPress={() => {
              Clipboard.setString(this.props.userReducer.accessToken);
            }}
          >
            <Text
              pointerEvents="none"
              style={styles.saveButtonText}
            > Copy token</Text>
          </MKButton>
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

function mapDispatchToProps(dispatch) {
  return {
    updateHueSettings: (...args) => { dispatch(updateHueSettings(...args)); },
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Settings);
