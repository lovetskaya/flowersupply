import React, { useState, useEffect } from 'react';
import { inventoryApi } from '../services/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalItems: 0, lowStockCount: 0 });

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, []);

  const fetchInventory = async () => {
    try {
      const [inventoryRes, lowStockRes] = await Promise.all([
        inventoryApi.getAll(),
        inventoryApi.getLowStock()
      ]);
      setInventory(inventoryRes.data);
      setLowStock(lowStockRes.data);
    } catch (error) {
      console.error('Ошибка загрузки инвентаря:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await inventoryApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      await inventoryApi.updateQuantity(id, newQuantity);
      fetchInventory();
      fetchStats();
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2><i className="bi bi-box-seam"></i> Управление инвентарем</h2>
      
      {/* Статистика */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5><i className="bi bi-box-seam"></i> Всего товаров</h5>
              <h2>{stats.totalItems}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5><i className="bi bi-exclamation-triangle"></i> Низкий запас</h5>
              <h2>{stats.lowStockCount}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Предупреждение о низком запасе */}
      {lowStock.length > 0 && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle"></i>
          <strong> Внимание!</strong> {lowStock.length} товаров имеют низкий запас
        </div>
      )}

      {/* Таблица инвентаря */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Тип цветов</th>
              <th>Место хранения</th>
              <th>Количество</th>
              <th>Мин. запас</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const isLowStock = item.quantity < item.minQuantity;
              return (
                <tr 
                  key={item.id} 
                  className={isLowStock ? 'table-warning' : ''}
                >
                  <td>{item.flowerType}</td>
                  <td>{item.storeLocation}</td>
                  <td>{item.quantity}</td>
                  <td>{item.minQuantity}</td>
                  <td>
                    {isLowStock ? (
                      <span className="badge bg-warning">Низкий запас</span>
                    ) : (
                      <span className="badge bg-success">В норме</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-success me-2"
                      onClick={() => updateQuantity(item.id, item.quantity + 10)}
                    >
                      <i className="bi bi-plus-lg"></i> Добавить 10
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 10))}
                    >
                      <i className="bi bi-dash-lg"></i> Убрать 10
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;