import React, { Component } from 'react';
import Home from './Home';
import Login from './Login';
import Graph from './Graph';
import Menu from './Menu';
import Lights from './Lights';
import Surveillance from './Surveillance';

import {
  BackAndroid,
  NavigationExperimental,
} from 'react-native';

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

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
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackAction);
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackAction);
  }

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
      default:
        return false;
    }
  }

  handleBackAction() {
    if (this.props.navigation.index === 0 || this.props.navigation.index === 1) {
      return false;
    }
    this.props.popRoute();
    return true;
  }

  renderScene(props) {
    const prefix = 'scene_';
    const { scene } = props;
    if (scene.key === prefix + 'home') {
      return <Home handleNavigate={this.handleNavigate} />;
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
    }

    return null;
  }

  render() {
    return (
      <NavigationCardStack
        direction="horizontal"
        navigationState={this.props.navigation}
        onNavigate={this.handleNavigate}
        renderScene={this.renderScene}
      />
    );
  }
}

export default NavRoot;
