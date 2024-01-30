import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Preloader from 'Components/Preloader';
import { autobind } from 'core-decorators';

export default class CommonDiagram extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({ msg: PropTypes.string }),
    ]),
    size: PropTypes.oneOf(['nano', 'small', 'default', 'large'])
  }

  static defaultProps = {
    data: [],
    size: 'default',
  }

  @autobind drawChart() {
    $(this.container).highcharts(this.props);
  }

  componentWillMount() {
    (function (Highcharts) {
      Highcharts.wrap(Highcharts.Legend.prototype, 'renderItem', function (proceed, item) {

        proceed.call(this, item);

        var isPoint = !!item.series,
          collection = isPoint ? item.series.points : this.chart.series,
          element = item.legendGroup.element;

        element.onmouseover = function () {
          if (isPoint) {
            Highcharts.each(collection, function (seriesItem) {
              if (seriesItem === item) {
                Highcharts.each(item.series.data, function (data) {
                  if (data.drilldown == item.drilldown) {
                    item.series.chart.tooltip.refresh(data);
                  };
                });
              };
            });
          };
        }
        element.onmouseout = function () {
          if (isPoint) {
            item.series.chart.tooltip.hide();
          };
        };
      });
    }(Highcharts));
  }

  shouldComponentUpdate({ data, loading }) {
    return (JSON.stringify(data) !== JSON.stringify(this.props.data) ||
      loading !== this.props.loading);
  }

  componentDidUpdate() {
    this.drawChart();
  }

  componentDidMount() {
    this.drawChart();
  }

  render() {
    const { data, loading, size } = this.props;
    if (!!loading) {
      return (<Preloader height="120px" />);
    }
    if (!!data && data.msg) {
      return (<div className="chart-msg">{data.msg}</div>);
    }

    return (
      <div className={`graph-container graph-container--${size}`} ref={(r) => { this.container = r; }}></div>
    );
  }
}
