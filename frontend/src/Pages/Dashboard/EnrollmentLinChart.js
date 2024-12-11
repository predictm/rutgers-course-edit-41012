import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';

const EnrollmentLineChart = ({ data }) => {
  const series = useMemo(() => {
    return [
      {
        data: [
          {
            x: 'Last Term',
            y: data?.enrollments_last_term || 0,
            fillColor: '#097BB9',
          },
          {
            x: 'This Term',
            y: data?.enrollments_this_term || 0,
            fillColor: '#A629FF',
          },
        ],
      },
    ];
  }, [data]);

  return (
    <Chart
      //type="line"
      type="bar"
      width="100%"
      /*series={[
        {
          name: 'Last Term',
          data: [10, 20, 1, 12, 16],
        },
        {
          name: 'This Term',
          data: [13, 12, 16, 19, 26],
        },
      ]}*/
      series={series}
      options={{
        chart: {
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          enabled: false,
        },
        xaxis: {
          axisBorder: {
            show: true,
            color: '#888888',
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          axisBorder: {
            show: true,
            color: '#888888',
          },
        },
        legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'center',
          markers: {
            fillColors: ['#097BB9', '#A629FF'],
          },
        },
        plotOptions: {
          bar: {
            columnWidth: '40%',
            distributed: true,
          },
        },
      }}
      /*
      options={{
        stroke: {
          curve: 'straight',
          colors: ['#707070', '#2b7d3b'],
          width: '1',
        },
        markers: {
          size: 4,
          colors: ['#707070', '#2b7d3b'],
          fillColors: ['#097BB9', '#A629FF'],
        },
        tooltip: {
          x: { show: false },
          markers: {
            colors: ['#707070', '#2b7d3b'],
          },
          intersect: true,
          shared: false,
        },
        chart: {
          toolbar: {
            show: false,
          },
        },
        legend: {
          show: true,
          markers: {
            fillColors: ['#707070', '#2b7d3b'],
          },
        },
        xaxis: {
          axisBorder: {
            show: true,
            color: '#888888',
          },
        },
        yaxis: {
          axisBorder: {
            show: true,
            color: '#888888',
          },
        },

        onItemClick: {
          toggleDataSeries: true,
        },
        onItemHover: {
          highlightDataSeries: true,
        },
      }}*/
    />
  );
};

export default EnrollmentLineChart;
