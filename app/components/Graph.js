'use-strict';
import React from 'react';

import {
  StyleSheet,
  View,
  Picker,
  Dimensions,
  Text,
  InteractionManager,
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
    width: 400,
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
});


class Graph extends React.Component {

  static propTypes = {
    handleNavigate: React.PropTypes.func.isRequired,
    fetchTemperatures: React.PropTypes.func.isRequired,
    fetchTemperaturesLimit: React.PropTypes.func.isRequired,
    loginReducer: React.PropTypes.object.isRequired,
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
    this.lastWeekData = [];
    this.state = {
      mountedAndFetched: false,
      data: [[new Date(), 0]],
      lessData: [[new Date(), 0]],
      dayData: [[new Date(), 0]],
      min: 0,
      max: 1,
      day: {
        label: this.lastSevenDays[0].label,
        key: this.lastSevenDays[0].key,
        date: this.lastSevenDays[0].date,
      },
    };
    this.handleChangeDay = this.handleChangeDay.bind(this);
    this.renderXLabel = this.renderXLabel.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTemperatures(this.props.loginReducer.accessToken);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataReducer.isFetching === true && nextProps.dataReducer.isFetching === false) {
      if (nextProps.dataReducer.temperatures.length !==
        this.props.dataReducer.temperatures.length) {
        const chartData = nextProps.dataReducer.temperatures.map((temp) =>
          [temp.createdAt, temp.temperature]);

        this.lastWeekData = chartData.filter((t) => {
          const date = new Date(t[0]);
          return date.getTime() > this.oneWeekAgo.getTime()
            && date.getTime() <= this.today.getTime();
        });
        this.setState({
          mountedAndFetched: true,
          data: chartData,
          lessData: chartData,
          max: chartData.length,
          min: 0,
        });
      } else if (nextProps.dataReducer.limitedTemperatures.length !==
        this.props.dataReducer.limitedTemperatures.length) {
        let dayData = nextProps.dataReducer.limitedTemperatures.map((temp) =>
          [temp.createdAt, temp.temperature]);

        if (dayData.length < 1) {
          dayData = [[new Date(), 0]];
        }
        this.setState({ dayData });
      }
    }
  }

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

  handleChangeDay(val, index) {
    /* let selectedDayData = this.lastWeekData.filter((t) => {
      const date = new Date(t[0]);
      return date.toDateString() === this.lastSevenDays[index].date.toDateString();
    });
    if (selectedDayData.length < 1) {
      selectedDayData = [[new Date(), 0]];
    }
    this.setState({
      day: this.lastSevenDays[index],
      dayData: selectedDayData,
    }); */
    this.setState({
      day: this.lastSevenDays[index],
    });
    const date = this.lastSevenDays[index].date;
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    this.props.fetchTemperaturesLimit(this.props.loginReducer.accessToken,
      date.toUTCString(),
      'days',
      1,
      360
    );
  }

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
            <Text style={styles.headerText}>Temperatures at home</Text>
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
      const d1 = firstDate.getDate() + '/' + firstDate.getMonth();
      const d2 = lastDate.getDate() + '/' + lastDate.getMonth();
      if (d1 === d2) {
        graphLabel = d1;
      } else {
        graphLabel = d1 + ' - ' + d2;
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Temperatures at home</Text>
        </View>
        <Text style={styles.graphLabel}>
            {graphLabel}
        </Text>

        <Chart
          style={styles.chart}
          data={this.state.lessData}
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
          tightBounds={true}
          showDataPoint={false}
          yAxisWidth={40}
          xAxisTransform={this.renderXLabel}
          yAxisTransform={(d) => d + '°C'}
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
          showDataPoint={true}

          yAxisWidth={40}
          xAxisTransform={(val) => toHourMinutes(new Date(val))}
          yAxisTransform={(d) => d + '°C'}
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
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataReducer: state.data,
    loginReducer: state.login,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTemperatures: (...args) => { dispatch(fetchTemperatures(...args)); },
    fetchTemperaturesLimit: (...args) => { dispatch(fetchTemperaturesLimit(...args)); },
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Graph);
