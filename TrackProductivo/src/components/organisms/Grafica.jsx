import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsDrilldown from 'highcharts/modules/drilldown';

// Asegúrate de inicializar el módulo de drilldown
HighchartsDrilldown(Highcharts);

function Grafica() {
  useEffect(() => {
    Highcharts.chart('container', {
      chart: {
        type: 'column',
      },
      title: {
        align: 'left',
        text: 'Porcentajes de Seguimientos Aprobados, en Proceso y Desaprobados',
      },
      subtitle: {
        align: 'left',
        text: 'A continuacion se muestran tres barras cada una representa un seguimiento',
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          text: 'Total percent market share',
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.1f}%',
          },
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
      },
      series: [
        {
          name: 'Seguimientos',
          colorByPoint: true,
          data: [
            {
              name: 'Aprobados',
              y: 1.582,
              color: '#28a745', // Verde
              drilldown: null,
            },
            {
              name: 'En Proceso',
              y: 1.582,
              color: '#fd7e14', // Naranja
              drilldown: null,
            },
            {
              name: 'Desaprobados',
              y: 1.582,
              color: '#dc3545', // Rojo
              drilldown: null,
            },
          ],
        },
      ],
    });
  }, []);

  return <div id="container"></div>;
}

export default Grafica;
