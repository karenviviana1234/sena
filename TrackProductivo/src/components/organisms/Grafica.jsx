import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import axiosClient from '../../configs/axiosClient';

// Asegúrate de inicializar el módulo de drilldown
HighchartsDrilldown(Highcharts);

function Grafica() {
  const [data, setData] = useState({ Inicio: 0, Renuncia: 0, Terminado: 0 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Función para obtener los datos del backend
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('productiva/listarEstados'); // Cambia la URL según tu configuración
        const fetchedData = response.data;
        const total = Object.values(fetchedData).reduce((acc, value) => acc + value, 0);
        
        setTotal(total);
        setData(fetchedData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (total > 0) { // Solo renderizar si tenemos el total
      Highcharts.chart('container', {
        chart: {
          type: 'column',
        },
        title: {
          align: 'left',
          text: 'Resumen del Estado de las Etapas Productivas: Iniciadas, Terminadas y Renunciadas',
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
            text: 'Porcentaje (%)',
          },
          labels: {
            format: '{value}%',
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
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.1f}%</b><br/>',
        },
        series: [
          {
            name: 'Etapas Productivas',
            colorByPoint: true,
            data: [
              {
                name: 'Inicio',
                y: (data.Inicio / total) * 100,
                color: '#ffa808', // Naranja
                drilldown: null,
              },
              {
                name: 'Terminado',
                y: (data.Terminado / total) * 100,
                color: '#8cd024', // Verde
                drilldown: null,
              },
              {
                name: 'Renuncia',
                y: (data.Renuncia / total) * 100,
                color: '#dc3545', // Rojo
                drilldown: null,
              },
            ],
          },
        ],
      });
    }
  }, [data, total]);

  return <div id="container" style={{ width: '100%', height: '400px' }}></div>;
}

export default Grafica;
