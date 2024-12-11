import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';

const AppointmentRadialChart = ({ data }) => {
  const series = useMemo(
    () => [
      data?.completed_appointments || 0,
      data?.incomplete_appointments || 0,
    ],
    [data]
  );

  return (
    <Chart
      type="radialBar"
      width="100%"
      series={series}
      options={{
        colors: ['#097bb9', '#A629FF'],
        labels: ['Completed', 'Incomplete'],
        legend: {
          show: true,
          position: 'right',
          horizontalAlign: 'center',
          formatter: function (seriesName, opts) {
            return `<div style="padding-left: 0.5rem; position: relative; top: -4px; display: inline-flex; justify-content: center; flex-direction: column">
                <span>${seriesName}</span>
                <span style="font-size: 2rem">${
                  opts.w.globals.series[opts.seriesIndex]
                }</span>
              </div>`;
          },
          markers: {
            radius: 0,
            width: 16,
            height: 16,
          },
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              show: false,
            },
          },
        },
        responsive: [
          {
            breakpoint: 1200,
            options: {
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      }}
    />
  );
};

export default AppointmentRadialChart;
