import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';

const AppointmentBarChart = ({ data }) => {
  const series = useMemo(() => {
    return [
      {
        data: [
          {
            x: 'Last Term',
            y: data?.appointments_last_term || 0,
            fillColor: '#707070',
          },
          {
            x: 'This Term',
            y: data?.appointments_this_term || 0,
            fillColor: '#097BB9',
          },
        ],
      },
    ];
  }, [data]);

  return (
    <Chart
      type="bar"
      width="100%"
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
            fillColors: ['#707070', '#097BB9'],
          },
        },
        plotOptions: {
          bar: {
            columnWidth: '40%',
            distributed: true,
          },
        },
      }}
    />
  );
};

export default AppointmentBarChart;
