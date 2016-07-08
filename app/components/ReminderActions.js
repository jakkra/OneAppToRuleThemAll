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
  rowMiddle: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});


const ReminderActions = ({ onComplete, event }) => (
  <View animation="lightSpeedIn" style={styles.row}>
    <TouchableOpacity
      onPress={() => onComplete('alarm')}
      style={[styles.icon, { alignItems: 'flex-start' }]}
    >
      <Icon name="alarm" color={(event.reminderActive === true) ? 'lime' : '#0099CC'} size={25} />
    </TouchableOpacity>
    <View style={styles.rowMiddle}>
      {/* <TouchableOpacity
        onPress={onAlarm}
        style={[styles.icon, { alignItems: 'center', paddingRight: 12.5 }]}
      >
        <Icon name="alarm" color="#0099CC" size={25} />
      </TouchableOpacity>*/}
      <TouchableOpacity
        onPress={() => onComplete('edit')}
        style={[styles.icon, { alignItems: 'center' }]}
      >
        <Icon name="edit" color="#0099CC" size={25} />
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      onPress={() => onComplete('delete')}
      style={[styles.icon, { alignItems: 'flex-end', marginRight: 30 }]}
    >
      <Icon name="delete" color="#0099CC" size={25} />
    </TouchableOpacity>
  </View>
);

ReminderActions.propTypes = {
  onComplete: React.PropTypes.func.isRequired,
  event: React.PropTypes.object.isRequired,
};

export default ReminderActions;
