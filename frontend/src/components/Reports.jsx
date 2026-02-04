import React, { useState, useEffect } from 'react';
import { saleApi, orderApi, inventoryApi } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Reports = () => {
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState('month');
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    fetchReportData();
  }, [reportPeriod]);

  const fetchReportData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch(reportPeriod) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        default:
          startDate.setMonth(endDate.getMonth() - 1);
      }

      const [salesRes, ordersRes, inventoryRes, revenueRes] = await Promise.all([
        saleApi.getByDateRange(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]),
        orderApi.getAll(),
        inventoryApi.getAll(),
        saleApi.getRevenue(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0])
      ]);

      setSalesData(salesRes.data);
      setOrdersData(ordersRes.data);
      setInventoryData(inventoryRes.data);
      setRevenue(revenueRes.data.revenue || 0);
    } catch (error) {
      console.error('Ошибка загрузки отчетов:', error);
    } finally {
      setLoading(false);
    }
  };

  // График продаж по дням
  const salesChartData = {
    labels: [...new Set(salesData.map(s => new Date(s.saleDate).toLocaleDateString('ru-RU')))],
    datasets: [
      {
        label: 'Выручка (руб.)',
        data: salesData.reduce((acc, sale) => {
          const date = new Date(sale.saleDate).toLocaleDateString('ru-RU');
          acc[date] = (acc[date] || 0) + sale.totalAmount;
          return acc;
        }, {}),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  // Круговая диаграмма популярных цветов
  const flowersChartData = {
    labels: [...new Set(salesData.map(s => s.flowerType))],
    datasets: [
      {
        data: salesData.reduce((acc, sale) => {
          acc[sale.flowerType] = (acc[sale.flowerType] || 0) + sale.quantity;
          return acc;
        }, {}),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#8AC926', '#1982C4'
        ]
      }
    ]
  };

  // График статусов заказов
  const ordersChartData = {
    labels: ['В ожидании', 'В процессе', 'Доставлено', 'Отменено'],
    datasets: [
      {
        label: 'Количество заказов',
        data: [
          ordersData.filter(o => o.status === 'PENDING').length,
          ordersData.filter(o => o.status === 'IN_PROGRESS').length,
          ordersData.filter(o => o.status === 'DELIVERED').length,
          ordersData.filter(o => o.status === 'CANCELLED').length
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ]
      }
    ]
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-graph-up"></i> Отчеты и аналитика</h2>
        <div className="btn-group">
          <button 
            className={`btn btn-outline-primary ${reportPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setReportPeriod('week')}
          >
            Неделя
          </button>
          <button 
            className={`btn btn-outline-primary ${reportPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setReportPeriod('month')}
          >
            Месяц
          </button>
          <button 
            className={`btn btn-outline-primary ${reportPeriod === 'quarter' ? 'active' : ''}`}
            onClick={() => setReportPeriod('quarter')}
          >
            Квартал
          </button>
        </div>
      </div>

      {/* Ключевые метрики */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Выручка</h5>
              <h2>{revenue.toFixed(2)} руб.</h2>
              <small>За выбранный период</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Продажи</h5>
              <h2>{salesData.length}</h2>
              <small>Количество транзакций</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>Заказы</h5>
              <h2>{ordersData.filter(o => o.status === 'DELIVERED').length}</h2>
              <small>Доставленные заказы</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5>Низкий запас</h5>
              <h2>{inventoryData.filter(i => i.quantity < i.minQuantity).length}</h2>
              <small>Товаров на складе</small>
            </div>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <i className="bi bi-bar-chart"></i> Динамика продаж
            </div>
            <div className="card-body">
              <Bar 
                data={salesChartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Выручка по дням' }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <i className="bi bi-pie-chart"></i> Популярные цветы
            </div>
            <div className="card-body">
              <Pie 
                data={flowersChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <i className="bi bi-list-check"></i> Статусы заказов
            </div>
            <div className="card-body">
              <Bar 
                data={ordersChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <i className="bi bi-exclamation-triangle"></i> Товары с низким запасом
            </div>
            <div className="card-body">
              <div className="list-group">
                {inventoryData
                  .filter(item => item.quantity < item.minQuantity)
                  .map(item => (
                    <div key={item.id} className="list-group-item list-group-item-warning">
                      <div className="d-flex justify-content-between">
                        <span>{item.flowerType}</span>
                        <span>
                          <span className="badge bg-danger me-2">{item.quantity} шт.</span>
                          <small>мин: {item.minQuantity} шт.</small>
                        </span>
                      </div>
                      <small className="text-muted">{item.storeLocation}</small>
                    </div>
                  ))}
                {inventoryData.filter(item => item.quantity < item.minQuantity).length === 0 && (
                  <p className="text-success text-center mt-3">
                    <i className="bi bi-check-circle"></i> Все товары в норме
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Детальный отчет */}
      <div className="card mt-4">
        <div className="card-header">
          <i className="bi bi-table"></i> Детальный отчет по продажам
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Товар</th>
                  <th>Количество</th>
                  <th>Цена</th>
                  <th>Сумма</th>
                  <th>Клиент</th>
                </tr>
              </thead>
              <tbody>
                {salesData.slice(0, 10).map(sale => (
                  <tr key={sale.id}>
                    <td>{new Date(sale.saleDate).toLocaleDateString('ru-RU')}</td>
                    <td>{sale.flowerType}</td>
                    <td>{sale.quantity}</td>
                    <td>{sale.price.toFixed(2)} руб.</td>
                    <td><strong>{sale.totalAmount.toFixed(2)} руб.</strong></td>
                    <td>{sale.customerName || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {salesData.length > 10 && (
            <div className="text-center mt-2">
              <small className="text-muted">
                Показано 10 из {salesData.length} записей
              </small>
            </div>
          )}
        </div>
        <div className="card-footer text-end">
          <button className="btn btn-outline-primary">
            <i className="bi bi-download"></i> Экспорт в Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;