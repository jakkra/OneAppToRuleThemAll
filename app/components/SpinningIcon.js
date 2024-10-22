import React from 'react';

import {
StyleSheet,
View,
Animated,
Easing,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';


const styles = StyleSheet.create({
  container: {
    height: 130,
    borderRadius: 65,
    width: 130,
    alignSelf: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * Component that displays some spinning icon from react-native-vector-icons/FontAwesome.
 * Can be used as a spinner when changing the prop loading.
 * It can take a list of boolean props { loading },
 * so the component will spin if any of them are true.
 */
export default class SpinningIcon extends React.Component {

  static propTypes = {
    loading: React.PropTypes.array,
    icon: React.PropTypes.string.isRequired,
  }

  static defaultProps = {
    loading: [false, false],
  }

  constructor(props) {
    super(props);
    this.state = {
      spinValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    if (this.isAnyPropLoading(this.props)) {
      this.spin();
      /* this.timer = setInterval(() => {
        this.stopSpin();
      }, 2000);*/
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.hasPropsChanged(nextProps)) {
      if (this.isAnyPropLoading(nextProps) === true) {
        this.spin();
      } else {
        this.stopSpin();
      }
    }
  }

  /**
   * Check if any props changed.
   */
  hasPropsChanged(nextProps) {
    if (this.props.loading.length !== nextProps.loading.length) {
      return true;
    }
    for (let i = 0; i < this.props.loading.length; i++) {
      if (this.props.loading[i] !== nextProps.loading[i]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if any boolean in the loading prop list are true.
   */
  isAnyPropLoading(props) {
    for (let i = 0; i < props.loading.length; i++) {
      if (props.loading[i] === true) {
        return true;
      }
    }
    return false;
  }

  /**
   * Starts spinning the icon.
   */
  spin() {
    this.state.spinValue.setValue(0);
    Animated.timing(
      this.state.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
      }
    ).start(endState => {
      if (endState.finished) {
        if (this.props.loading) {
          this.spin();
        }
      }
    });
  }

  /**
   * Stops the spinning.
   */
  stopSpin() {
    this.state.spinValue.stopAnimation();
  }

  render() {
    const getStartValue = () => '0deg';
    const getEndValue = () => '360deg';

    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: [getStartValue(), getEndValue()],
    });

    /* This also works, just using above example to show functions instead of strings /*
    /*
    const spin = this.state.spinValue.interpolate({
       inputRange: [0, 1],
       outputRange: ['0deg', '360deg']
    }) */

    return (
      <Animated.View style={[styles.container, { transform: [{ rotate: spin }] }]}>
        <Icon
          style={{ marginRight: 10 }}
          name={this.props.icon}
          color="#4D4D4D" size={90}
        />
      </Animated.View>
    );
  }
}
