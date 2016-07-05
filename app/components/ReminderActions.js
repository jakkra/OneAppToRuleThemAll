import React from 'react';

import ReactNative, {
  StyleSheet,
} from 'react-native';

import { createAnimatableComponent, View } from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
const TouchableOpacity = createAnimatableComponent(ReactNative.TouchableOpacity);


const styles = StyleSheet.create({
  icon: {
    marginBottom: 5,
    flex: 0.2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});


const ReminderActions = ({ onComplete }) => (
  <View animation="lightSpeedIn" style={styles.row}>
    <TouchableOpacity onPress={onComplete} style={styles.icon}>
      <Icon name="check-circle" color="#0099CC" size={25} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onComplete} style={styles.icon}>
      <Icon name="alarm" color="#0099CC" size={25} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onComplete} style={styles.icon}>
      <Icon name="delete" color="#0099CC" size={25} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onComplete} style={styles.icon}>
      <Icon name="edit" color="#0099CC" size={25} />
    </TouchableOpacity>
  </View>
);

ReminderActions.propTypes = {
  onComplete: React.PropTypes.func,
};

export default ReminderActions;
