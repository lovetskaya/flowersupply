import React, { useState, useEffect } from 'react';
import { orderApi, supplierApi } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrder, setNewOrder] = useState({
    supplierId: '',
    expectedDate: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    totalAmount: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, suppliersRes] = await Promise.all([
        orderApi.getAll(),
        supplierApi.getAll()
      ]);
      setOrders(ordersRes.data);
      setSuppliers(suppliersRes.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedSupplier = suppliers.find(s => s.id == newOrder.supplierId);
      const orderData = {
        supplier: selectedSupplier,
        expectedDate: newOrder.expectedDate,
        status: newOrder.status,
        totalAmount: parseFloat(newOrder.totalAmount)
      };
      
      await orderApi.create(orderData);
      fetchData();
      setNewOrder({
        supplierId: '',
        expectedDate: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        totalAmount: 0
      });
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await orderApi.updateStatus(id, newStatus);
      fetchData();
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { class: 'warning', text: 'В ожидании' },
      'IN_PROGRESS': { class: 'info', text: 'В процессе' },
      'DELIVERED': { class: 'success', text: 'Доставлено' },
      'CANCELLED': { class: 'danger', text: 'Отменено' }
    };
    const config = statusConfig[status] || { class: 'secondary', text: status };
    return <span className={`badge bg-${config.class}`}>{config.text}</span>;
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-truck"></i> Управление заказами</h2>
        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newOrderModal">
          <i className="bi bi-plus-circle"></i> Новый заказ
        </button>
      </div>

      {/* Модальное окно для создания заказа */}
      <div className="modal fade" id="newOrderModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Новый заказ</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Поставщик *</label>
                  <select 
                    className="form-select"
                    value={newOrder.supplierId}
                    onChange={(e) => setNewOrder({...newOrder, supplierId: e.target.value})}
                    required
                  >
                    <option value="">Выберите поставщика</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.country})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Ожидаемая дата доставки</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newOrder.expectedDate}
                    onChange={(e) => setNewOrder({...newOrder, expectedDate: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Статус</label>
                  <select
                    className="form-select"
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                  >
                    <option value="PENDING">В ожидании</option>
                    <option value="IN_PROGRESS">В процессе</option>
                    <option value="DELIVERED">Доставлено</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Сумма заказа (руб.)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={newOrder.totalAmount}
                    onChange={(e) => setNewOrder({...newOrder, totalAmount: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  Создать заказ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Таблица заказов */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Поставщик</th>
              <th>Дата заказа</th>
              <th>Ожидаемая доставка</th>
              <th>Статус</th>
              <th>Сумма</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.supplier?.name || 'Не указан'}</td>
                <td>{new Date(order.orderDate).toLocaleDateString('ru-RU')}</td>
                <td>{new Date(order.expectedDate).toLocaleDateString('ru-RU')}</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{order.totalAmount.toFixed(2)} руб.</td>
                <td>
                  <div className="btn-group" role="group">
                    {order.status === 'PENDING' && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => updateStatus(order.id, 'IN_PROGRESS')}
                        title="Начать выполнение"
                      >
                        <i className="bi bi-play-fill"></i>
                      </button>
                    )}
                    {order.status === 'IN_PROGRESS' && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => updateStatus(order.id, 'DELIVERED')}
                        title="Отметить как доставлено"
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                    )}
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => updateStatus(order.id, 'CANCELLED')}
                      title="Отменить заказ"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Статистика по заказам */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6>Всего заказов</h6>
              <h3>{orders.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6>Активные заказы</h6>
              <h3 className="text-primary">
                {orders.filter(o => o.status === 'PENDING' || o.status === 'IN_PROGRESS').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6>Общая сумма</h6>
              <h3 className="text-success">
                {orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)} руб.
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;