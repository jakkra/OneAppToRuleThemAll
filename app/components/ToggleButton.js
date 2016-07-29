import React from 'react';

import {
StyleSheet,
View,
TouchableOpacity,
Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';


const styles = StyleSheet.create({
  numUnitsButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    padding: 2,
    paddingHorizontal: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});


export default class ToggleButton extends React.Component {

  static propTypes = {
    toggled: React.PropTypes.bool,
    onToggle: React.PropTypes.func,
    onUnToggle: React.PropTypes.func,
    text: React.PropTypes.string.isRequired,
    toggleColor: React.PropTypes.string,
    color: React.PropTypes.string,
    key: React.PropTypes.string,
  }

  static defaultProps = {
    onToggle: () => {},
    onUnToggle: () => {},
    toggleColor: '#FF3366',
    color: '#0099CC',
    key: 'button',
  }

  constructor(props) {
    super(props);
    this.state = {
      toggled: false,
    };
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
      
  }

  onPress(){
    this.setState({ toggled: !this.state.toggled });
    this.state.toggled ? this.props.onToggle(this.props.key) : this.props.onUnToggle(this.props.key);
  }

  render() {
    const toggleColor = this.state.toggled === false ? this.props.color : this.props.toggleColor;
    return (
      <TouchableOpacity onPress={this.onPress} {...this.props} style={[this.props.style, { backgroundColor: toggleColor }]}>
        <Text style={styles.numUnitsButtonText}> {this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}