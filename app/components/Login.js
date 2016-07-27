import React from 'react';

import ReactNative, {
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  ToastAndroid,
  BackAndroid,
} from 'react-native';

import { connect } from 'react-redux';
import { authenticate, createUser } from '../actions/login';

import SpinningIcon from './SpinningIcon';
import { createAnimatableComponent, View, Text } from 'react-native-animatable';

const TouchableHighlight = createAnimatableComponent(ReactNative.TouchableHighlight);
const backgroundImg = require('../img/rsz_stars.png');


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'transparent',
  },
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
    backgroundColor: 'transparent',
  },
  mark: {
    width: 150,
    height: 150,
  },
  signinButton: {
    backgroundColor: '#FF3366',
    padding: 20,
    alignItems: 'center',
  },
  signup: {
    alignItems: 'center',
    flex: 0.15,
  },
  inputs: {
    marginTop: 10,
    marginBottom: 10,
    flex: 0.30,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  inputPassword: {
    marginLeft: 25,
    width: 20,
    height: 21,
  },
  inputUsername: {
    marginLeft: 25,
    width: 20,
    height: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderBottomColor: '#CCC',
    borderColor: 'transparent',
    alignItems: 'center',
    height: 40,
    marginBottom: 20,
  },
  input: {
    alignSelf: 'stretch',
    width: Dimensions.get('window').width,
    backgroundColor: 'transparent',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    padding: 15,
  },
  greyFont: {
    color: '#D8D8D8',
  },
  whiteFont: {
    color: '#FFF',
  },
});

class Login extends React.Component {

  static propTypes = {
    loginReducer: React.PropTypes.object.isRequired,
    authenticate: React.PropTypes.func.isRequired,
    handleNavigate: React.PropTypes.func.isRequired,
    goBack: React.PropTypes.func.isRequired,
    createUser: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.buttonPress = this.buttonPress.bind(this);
    this.pushAfterSuccesLogin = this.pushAfterSuccesLogin.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.handleBackAction = this.handleBackAction.bind(this);

    this.state = {
      email: 'ijakkra@gmail.com',
      password: 'password',
      name: '',
      showCreate: false,
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackAction);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loginReducer.isLoggingIn === false
      && this.props.loginReducer.isLoggingIn === true) {
      this.pushAfterSuccesLogin();
    } else if (nextProps.loginReducer.error === true &&
      this.props.loginReducer.error === false) {
      ToastAndroid.show('Login Failure', ToastAndroid.SHORT);
    } else if (nextProps.loginReducer.isCreatingUser === false
      && this.props.loginReducer.isCreatingUser === true) {
      ToastAndroid.show('User successfully created', ToastAndroid.SHORT);
      this.swapUI();
    }
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackAction);
  }

  handleBackAction() {
    if (this.state.showCreate === true) {
      this.swapUI();
      return true;
    }
    return false;
  }

  buttonPress() {
    if (this.state.showCreate === false) {
      this.handleLoginClick();
    } else {
      this.handleCreateUserClick();
    }
  }
  handleLoginClick() {
    if (this.state.email !== '' && this.state.password !== '') {
      this.props.authenticate(this.state.email, this.state.password);
    } else {
      ToastAndroid.show('Missing information', ToastAndroid.SHORT);
    }
  }

  handleCreateUserClick() {
    if (this.state.email !== '' && this.state.password !== '' && this.state.name !== '') {
      this.props.createUser(this.state.name, this.state.email, this.state.password);
    } else {
      ToastAndroid.show('Missing information', ToastAndroid.SHORT);
    }
  }

  pushAfterSuccesLogin() {
    const route = {
      type: 'push',
      route: {
        key: 'menu',
        title: 'Menu',
      },
    };
    this.props.handleNavigate(route);
  }

  swapUI() {
    if (this.state.showCreate === false) {
      this.refs.button.slideOutRight(500);
      this.refs.signUpText.slideOutRight(500);
      this.timer = setInterval(() => {
        this.setState({ showCreate: true });
        this.refs.button.slideInLeft(500);
        clearInterval(this.timer);
      }, 1000);
    } else {
      this.refs.button.slideOutLeft(500);
      this.refs.signUpText.slideInLeft(500);
      this.timer = setInterval(() => {
        this.setState({ showCreate: false });
        this.refs.button.slideInRight(500);
        clearInterval(this.timer);
      }, 1000);
    }
  }

  createAccount() {
    this.swapUI();
  }

  render() {
    let nameInput = null;
    if (this.state.showCreate === true) {
      nameInput = (<View animation="fadeInLeft" style={styles.inputContainer}>
        <Image style={styles.inputUsername} source={{ uri: 'http://i.imgur.com/iVVVMRX.png' }} />
        <TextInput
          style={[styles.input, styles.whiteFont]}
          placeholder="Name"
          placeholderTextColor="#FFF"
          value={this.state.name}
          onChangeText={text => this.setState({ ...{ name: text } })}
          onSubmitEditing={() => {
            this.refs.password.focus();
          }}
        />
      </View>);
    }

    return (
      <View style={styles.container}>
        <Image style={styles.bg} source={backgroundImg} />
        <View style={styles.header}>
          <SpinningIcon
            icon={"rocket"}
            loading={[this.props.loginReducer.isLoggingIn, this.props.loginReducer.isCreatingUser]}
          />
        </View>
        <View style={styles.inputs}>
          {nameInput}
          <View style={styles.inputContainer}>
            <Image style={styles.inputUsername} source={{ uri: 'http://i.imgur.com/iVVVMRX.png' }} />
            <TextInput
              style={[styles.input, styles.whiteFont]}
              placeholder="Email"
              placeholderTextColor="#FFF"
              value={this.state.email}
              onChangeText={text => this.setState({ ...{ email: text } })}
              onSubmitEditing={() => {
                this.refs.password.focus();
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Image style={styles.inputPassword} source={{ uri: 'http://i.imgur.com/ON58SIG.png' }} />
            <TextInput
              ref="password"
              style={[styles.input, styles.whiteFont]}
              placeholder="Password"
              placeholderTextColor="#FFF"
              value={this.state.password}
              onChangeText={text => this.setState({ ...{ password: text } })}
              onSubmitEditing={() => {
                this.buttonPress();
              }}
            />
          </View>
        </View>
        <TouchableHighlight
          ref="button"
          underlayColor={'white'}
          style={styles.signinButton}
          onPress={this.buttonPress}
        >
          <Text style={styles.whiteFont}>{this.state.showCreate ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableHighlight>
        <View style={styles.signup}>
          <Text ref="signUpText" style={styles.greyFont}>
          {this.state.showCreate ? '' : 'Don\'t have an account?'}
            <Text
              onPress={this.createAccount}
              style={[styles.whiteFont, { fontWeight: 'bold' }]}
            >{this.state.showCreate ? '' : '  Sign Up Here!'}</Text></Text>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginReducer: state.login,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authenticate: (...args) => { dispatch(authenticate(...args)); },
    createUser: (...args) => { dispatch(createUser(...args)); },

  };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Login);
