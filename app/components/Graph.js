'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  Picker,
  Dimensions,
  Text,
  InteractionManager,
  PanResponder,
} from 'react-native';

import {
  MKRangeSlider,
  MKProgress,
} from 'react-native-material-kit';

import { connect } from 'react-redux';
import { fetchTemperatures, fetchTemperaturesLimit } from '../actions/data';
import { getDayName, toHourMinutes, toDateMonth } from '../util/DateUtils';


import Chart from './Charts/Chart';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
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
  chart: {
    width: Dimensions.get('window').width - 5,
    height: 200,
    marginTop: 2,
  },
  picker: {
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0099CC',
  },
  pickerItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphLabel: {
    color: '#0099CC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progress: {
    width: Dimensions.get('window').width,
  },
  navigationView: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  activeDot: {
    backgroundColor: '#007aff',
    width: 20,
    height: 20,
    borderRadius: 10,
    margin: 7,
  },
  unActiveDot: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 16,
    height: 16,
    borderRadius: 8,
    margin: 7,
  },
});

/**
 * Displays graphs of temperatures from different sources.
 */
class Graph extends React.Component {

  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    fetchTemperatures: React.PropTypes.func.isRequired,
    fetchTemperaturesLimit: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired,
    dataReducer: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.today = new Date();
    this.oneWeekAgo = new Date();
    this.oneWeekAgo.setDate(this.oneWeekAgo.getDate() - 7);
    this.oneWeekAgo.setHours(0);
    this.oneWeekAgo.setMinutes(1);
    this.lastSevenDays = this.getLastDays();
    this.state = {
      mountedAndFetched: false,
      data: [[new Date(), 0]],
      dataInside: [[new Date(), 0]],
      dataOutside: [[new Date(), 0]],
      lessData: [[new Date(), 0]],
      dayData: [[new Date(), 0]],
      dayDataInside: [[new Date(), 0]],
      dayDataOutside: [[new Date(), 0]],
      tempSource: 'inside',
      min: 0,
      max: 1,
      day: {
        label: this.lastSevenDays[0].label,
        key: this.lastSevenDays[0].key,
        date: new Date(this.lastSevenDays[0].date),
      },
    };
    this.handleChangeDay = this.handleChangeDay.bind(this);
    this.renderXLabel = this.renderXLabel.bind(this);
    this.changeTempSource = this.changeTempSource.bind(this);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      // Only respond to movements if the gesture is a horizontal swipe
      onMoveShouldSetPanResponder: (e, gs) => {
        return Math.abs(gs.dx) > Math.abs(gs.dy) ? true : false;
      },
      onPanResponderRelease: (e, gs) => {
        if (Math.abs(gs.dx / Dimensions.get('window').width) > 0.5) {
          this.changeTempSource();
        }
      },
    });
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTemperatures(this.props.user.accessToken);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataReducer.isFetching === true && nextProps.dataReducer.isFetching === false) {
      let chartData = nextProps.dataReducer.temperatures.map((temp) =>
        [temp.createdAt, temp.temperature, temp.name]);

      let chartDataInside = chartData.filter((t) => {
        return t[2] === 'inside';
      });

      let chartDataOutside = chartData.filter((t) => {
        return t[2] === 'outside';
      });

      if (chartData.length < 1) {
        chartData = [[new Date(), 0]];
      }
      if (chartDataInside.length < 1) {
        chartDataInside = [[new Date(), 0]];
      }
      if (chartDataOutside.length < 1) {
        chartDataOutside = [[new Date(), 0]];
      }

      this.setState({
        mountedAndFetched: true,
        data: chartDataInside,
        dataInside: chartDataInside,
        dataOutside: chartDataOutside,
        lessData: chartDataInside,
        max: chartDataInside.length,
        min: 0,
      });
    }
    if (this.props.dataReducer.isFetchingLimited === true &&
        nextProps.dataReducer.isFetchingLimited === false) {
      let data = nextProps.dataReducer.limitedTemperatures.map((temp) =>
        [temp.createdAt, temp.temperature, temp.name]);

      let dayDataInside = data.filter((t) => {
        return t[2] === 'inside';
      });

      let dayDataOutside = data.filter((t) => {
        return t[2] === 'outside';
      });

      if (data.length < 1) {
        data = [[new Date(), 0]];
      }
      if (dayDataInside.length < 1) {
        dayDataInside = [[new Date(), 0]];
      }
      if (dayDataOutside.length < 1) {
        dayDataOutside = [[new Date(), 0]];
      }
      this.setState({
        dayData: dayDataInside,
        dayDataInside,
        dayDataOutside,
      });
    }
  }


  /**
   * Returns a list of the last seven days, with data of each day.
   * Like a label (monday/tomorrow/today...)
   * A key and a Date object of the day.
   */
  getLastDays() {
    const today = new Date();
    const initialDayNbr = today.getDate();
    const lastSevenDays = [];
    let dayName;
    for (let i = initialDayNbr; i < 7 + initialDayNbr; i++) {
      if (i === initialDayNbr) {
        dayName = 'Today ' + toDateMonth(today);
      } else if (i === initialDayNbr + 1) {
        dayName = 'Yesterday ' + toDateMonth(today);
      } else {
        dayName = getDayName(today.getDay()) + ' ' + toDateMonth(today);
      }
      lastSevenDays.push({ label: dayName, key: (i % 7), date: new Date(today) });
      today.setDate(today.getDate() - 1);
    }
    return lastSevenDays;
  }

  /**
   * Updates the state when the user changes the day to view temperatures of.
   */
  handleChangeDay(val, index) {
    this.setState({
      day: this.lastSevenDays[index],
    });
    const date = this.lastSevenDays[index].date;
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    this.props.fetchTemperaturesLimit(this.props.user.accessToken,
      date.toUTCString(),
      'days',
      1,
      360
    );
  }

  /**
   * Handles when the user changes the source of the temperature.
   */
  changeTempSource() {
    // TODO, handle if there are more/less than two temp sources
    if (this.state.tempSource === 'inside') {
      this.setState({
        data: this.state.dataOutside,
        lessData: this.state.dataOutside,
        max: this.state.dataOutside.length,
        min: 0,
        dayData: this.state.dayDataOutside,
        tempSource: 'outside',
      });
    } else {
      this.setState({
        data: this.state.dataInside,
        lessData: this.state.dataInside,
        max: this.state.dataInside.length,
        min: 0,
        dayData: this.state.dayDataInside,
        tempSource: 'inside',
      });
    }
  }

  /**
   * Renders the x-labels in the Graphs
   */
  renderXLabel(val) {
    const firstDate = new Date(this.state.lessData[0][0]);
    const lastDate = new Date(this.state.lessData[this.state.lessData.length - 1][0]);
    const date = new Date(val);
    if (firstDate.toDateString() === lastDate.toDateString()) {
      return toHourMinutes(date);
    }
    return date.getDate() + '/' + date.getUTCMonth();
  }

  render() {
    if (this.state.mountedAndFetched === false) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Temperatures at home ({this.state.tempSource})</Text>
          </View>
          <MKProgress.Indeterminate
            style={styles.progress}
          />
        </View>
      );
    }
    const firstDate = new Date(this.state.lessData[0][0]);
    const lastDate = new Date(this.state.lessData[this.state.lessData.length - 1][0]);
    let graphLabel = '';
    if (firstDate !== null && lastDate !== null) {
      const d1 = firstDate.getDate() + '/' + (firstDate.getMonth() + 1);
      const d2 = lastDate.getDate() + '/' + (lastDate.getMonth() + 1);
      if (d1 === d2) {
        graphLabel = d1;
      } else {
        graphLabel = d1 + ' - ' + d2;
      }
    }

    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Temperatures at home ({this.state.tempSource})</Text>
        </View>
        <Text style={styles.graphLabel}>
            {graphLabel}
        </Text>

        <Chart
          style={styles.chart}
          data={this.state.lessData}
          // data={data}
          horizontalGridStep={5}
          verticalGridStep={5}
          color="#ff69b4"
          gridColor="#d3d3d3"
          axisColor="darkgrey"
          dataPointColor="gray"
          dataPointFillColor="#ff69b4"
          axisLabelColor="darkgrey"
          gridLineWidth={0.2}
          type="line"
          tightBounds
          showDataPoint={false}
          yAxisWidth={40}
          xAxisTransform={this.renderXLabel}
          yAxisTransform={(d) => d + '°C'}
          yAxisUseDecimal
        />
        <MKRangeSlider
          min={0}
          max={this.state.data.length}
          minValue={this.state.min}
          maxValue={this.state.max}
          style={{ width: 200 }}
          ref="sliderWithRange"

          onConfirm={(curValue) => {
            this.setState({
              lessData: this.state.data.slice(
                Math.round(curValue.min),
                Math.round(curValue.max)
              ),
              min: curValue.min,
              max: curValue.max,
            });
          }}
        />
        <Chart
          style={styles.chart}
          data={this.state.dayData}
          horizontalGridStep={5}
          verticalGridStep={5}
          color="#ff69b4"
          gridColor="#d3d3d3"
          axisColor="darkgrey"
          dataPointColor="gray"
          dataPointFillColor="#ff69b4"
          axisLabelColor="darkgrey"
          gridLineWidth={0.2}
          type="line"
          showDataPoint
          yAxisWidth={40}
          xAxisTransform={(val) => toHourMinutes(new Date(val))}
          yAxisTransform={(d) => d + '°C'}
          yAxisUseDecimal
        />
        <Picker
          selectedValue={this.state.day.key}
          onValueChange={this.handleChangeDay}
          mode="dialog"
          prompt="Select day"
          itemStyle={styles.pickerItem}
          style={styles.picker}
        >
          {this.lastSevenDays.map((day, index) =>
            <Picker.Item
              style={styles.pickerItem}
              key={index} label={day.label}
              value={day.key}
            />
          )}

        </Picker>
        {
          this.state.tempSource === 'inside' ? (
            <View style={styles.navigationView}>
              <View style={styles.activeDot} />
              <View style={styles.unActiveDot} />
            </View>
            )
            :
            (
            <View style={styles.navigationView}>
              <View style={styles.unActiveDot} />
              <View style={styles.activeDot} />
            </View>
          )
        }
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataReducer: state.data,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTemperatures: (...args) => { dispatch(fetchTemperatures(...args)); },
    fetchTemperaturesLimit: (...args) => { dispatch(fetchTemperaturesLimit(...args)); },
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Graph);
