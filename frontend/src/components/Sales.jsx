import React, { useState, useEffect } from 'react';
import { saleApi, inventoryApi } from '../services/api';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSale, setNewSale] = useState({
    flowerType: '',
    quantity: 1,
    price: 0,
    customerName: ''
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchSales();
    fetchInventory();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await saleApi.getAll();
      setSales(response.data);
    } catch (error) {
      console.error('Ошибка загрузки продаж:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await inventoryApi.getAll();
      setInventory(response.data);
    } catch (error) {
      console.error('Ошибка загрузки инвентаря:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const saleData = {
        ...newSale,
        quantity: parseInt(newSale.quantity),
        price: parseFloat(newSale.price)
      };
      
      await saleApi.create(saleData);
      fetchSales();
      setNewSale({
        flowerType: '',
        quantity: 1,
        price: 0,
        customerName: ''
      });
    } catch (error) {
      console.error('Ошибка регистрации продажи:', error);
    }
  };

  const filterByDateRange = async () => {
    try {
      const response = await saleApi.getByDateRange(dateRange.start, dateRange.end);
      setSales(response.data);
    } catch (error) {
      console.error('Ошибка фильтрации:', error);
    }
  };

  const getAvailableFlowers = () => {
    return inventory.filter(item => item.quantity > 0);
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="fade-in">
      <h2><i className="bi bi-cash-coin"></i> Учет продаж</h2>

      {/* Форма добавления продажи */}
      <div className="card mb-4">
        <div className="card-header">Регистрация новой продажи</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Тип цветов *</label>
                <select
                  className="form-select"
                  value={newSale.flowerType}
                  onChange={(e) => {
                    const selected = inventory.find(i => i.flowerType === e.target.value);
                    setNewSale({
                      ...newSale,
                      flowerType: e.target.value,
                      price: selected ? selected.quantity > 0 ? 100 : 0 : 0
                    });
                  }}
                  required
                >
                  <option value="">Выберите цветы</option>
                  {getAvailableFlowers().map(item => (
                    <option key={item.id} value={item.flowerType}>
                      {item.flowerType} (доступно: {item.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 mb-3">
                <label className="form-label">Количество *</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={newSale.quantity}
                  onChange={(e) => setNewSale({...newSale, quantity: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-2 mb-3">
                <label className="form-label">Цена за шт. (руб.) *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={newSale.price}
                  onChange={(e) => setNewSale({...newSale, price: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Клиент</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Имя клиента или компании"
                  value={newSale.customerName}
                  onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
                />
              </div>
            </div>
            <div className="mb-3">
              <strong>Итого: {(newSale.quantity * newSale.price).toFixed(2)} руб.</strong>
            </div>
            <button type="submit" className="btn btn-success">
              <i className="bi bi-cart-check"></i> Зарегистрировать продажу
            </button>
          </form>
        </div>
      </div>

      {/* Фильтр по дате */}
      <div className="card mb-4">
        <div className="card-header">Фильтр по дате</div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">С</label>
              <input
                type="date"
                className="form-control"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">По</label>
              <input
                type="date"
                className="form-control"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-primary" onClick={filterByDateRange}>
                <i className="bi bi-funnel"></i> Применить фильтр
              </button>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-secondary" onClick={fetchSales}>
                <i className="bi bi-x-circle"></i> Сбросить фильтр
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица продаж */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Тип цветов</th>
              <th>Количество</th>
              <th>Цена за шт.</th>
              <th>Сумма</th>
              <th>Клиент</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
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

      {/* Статистика продаж */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Итоги продаж</div>
            <div className="card-body">
              <p>Всего продаж: <strong>{sales.length}</strong></p>
              <p>Общая выручка: <strong className="text-success">
                {sales.reduce((sum, sale) => sum + sale.totalAmount, 0).toFixed(2)} руб.
              </strong></p>
              <p>Средний чек: <strong>
                {sales.length > 0 
                  ? (sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length).toFixed(2)
                  : '0.00'} руб.
              </strong></p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Популярные товары</div>
            <div className="card-body">
              {(() => {
                const flowerStats = {};
                sales.forEach(sale => {
                  flowerStats[sale.flowerType] = (flowerStats[sale.flowerType] || 0) + sale.quantity;
                });
                const popular = Object.entries(flowerStats).sort((a, b) => b[1] - a[1]).slice(0, 3);
                
                return popular.length > 0 ? (
                  <ul className="list-group">
                    {popular.map(([flower, quantity]) => (
                      <li key={flower} className="list-group-item d-flex justify-content-between">
                        <span>{flower}</span>
                        <span className="badge bg-primary">{quantity} шт.</span>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-muted">Нет данных</p>;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;