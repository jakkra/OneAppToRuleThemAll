import React, { Component } from 'react';

import Reminders from './Reminders';
import Login from './Login';
import Graph from './Graph';
import Menu from './Menu';
import Lights from './Lights';
import Surveillance from './Surveillance';
import Settings from './Settings';
import MirrorConfig from './MirrorConfig';
import ReminderNotificationModal from './ReminderNotificationModal';

import {
  BackAndroid,
  NavigationExperimental,
  View,
} from 'react-native';

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

/**
 * Root component of the navigator, handles swaping screens and displaying notification modal.
 */
class NavRoot extends Component {

  static propTypes = {
    navigation: React.PropTypes.object.isRequired,
    popRoute: React.PropTypes.func.isRequired,
    pushRoute: React.PropTypes.func.isRequired,
    resetRoute: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
    this.handleBackAction = this.handleBackAction.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.state = {
      modalOpen: false,
      modal: null,
      modalProps: null,
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackAction);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackAction);
  }

  onModalClose() {
    this.setState({ modalOpen: false });
  }

  /**
   * Changes the state so that a Modal will show.
   */
  showModal(route, props) {
    if (route.key === 'ReminderNotificationModal') {
      this.setState({ modal: ReminderNotificationModal, modalOpen: true, modalProps: props });
    }
  }

  /**
   * Handles rendering of the different screens.
   */
  handleNavigate(action) {
    switch (action && action.type) {
      case 'push':
        this.props.pushRoute(action.route);
        return true;
      case 'back':
      case 'pop':
        return this.handleBackAction();
      case 'reset':
        return this.props.resetRoute();
      case 'modal':
        return this.showModal(action.route, action.passProps);
      default:
        return false;
    }
  }

  /**
   * Overrides the back button, lets me handle it. For example, close the Modal if it's open.
   */
  handleBackAction() {
    if (this.props.navigation.index === 0 || this.props.navigation.index === 1) {
      return false;
    }
    if (this.state.modalOpen === true) {
      this.setState({ modalOpen: false });
      return true;
    }
    this.props.popRoute();
    return true;
  }

  /**
   * Renders a screen/scence in this root component.
   */
  renderScene(props) {
    const prefix = 'scene_';
    const { scene } = props;
    if (scene.key === prefix + 'home') {
      return <Reminders handleNavigate={this.handleNavigate} />;
    } else if (scene.key === prefix + 'login') {
      return <Login goBack={this.handleBackAction} handleNavigate={this.handleNavigate} />;
    } else if (scene.key === prefix + 'graph') {
      return <Graph handleNavigate={this.handleNavigate} />;
    } else if (scene.key === prefix + 'menu') {
      return <Menu goBack={this.handleBackAction} handleNavigate={this.handleNavigate} />;
    } else if (scene.key === prefix + 'lights') {
      return <Lights goBack={this.handleBackAction} handleNavigate={this.handleNavigate} />;
    } else if (scene.key === prefix + 'surveillance') {
      return <Surveillance goBack={this.handleBackAction} handleNavigate={this.handleNavigate} />;
    } else if (scene.key === prefix + 'settings') {
      return <Settings goBack={this.handleBackAction} handleNavigate={this.handleNavigate} />;
    } else if (scene.key === prefix + 'mirror') {
      return <MirrorConfig goBack={this.handleBackAction} handleNavigate={this.handleNavigate} />;
    }

    return null;
  }

  render() {
    const modal = this.state.modal ?
      <this.state.modal
        isOpen={this.state.modalOpen}
        passProps={this.state.modalProps}
        onClose={this.onModalClose}
      /> : null;
    return (
      <View style={{ flex: 1 }}>
        <NavigationCardStack
          direction="horizontal"
          navigationState={this.props.navigation}
          onNavigate={this.handleNavigate}
          renderScene={this.renderScene}
        />
        {modal}
      </View>
    );
  }
}

export default NavRoot;
