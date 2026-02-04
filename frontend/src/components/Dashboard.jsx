import React, { useState, useEffect } from 'react';
import { supplierApi, inventoryApi, orderApi, saleApi } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    suppliers: 0,
    inventory: 0,
    lowStock: 0,
    activeOrders: 0,
    recentSales: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [suppliersRes, inventoryRes, ordersRes, salesRes] = await Promise.all([
        supplierApi.getAll(),
        inventoryApi.getStats(),
        orderApi.getAll(),
        saleApi.getRecent(5)
      ]);

      setStats({
        suppliers: suppliersRes.data.length,
        inventory: inventoryRes.data.totalItems,
        lowStock: inventoryRes.data.lowStockCount,
        activeOrders: ordersRes.data.filter(o => 
          o.status === 'PENDING' || o.status === 'IN_PROGRESS'
        ).length,
        recentSales: salesRes.data.reduce((sum, sale) => sum + sale.totalAmount, 0)
      });
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  return (
    <div className="fade-in">
      <h2><i className="bi bi-speedometer2"></i> Панель управления</h2>
      
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card stat-card bg-primary text-white">
            <div className="card-body">
              <h5><i className="bi bi-people"></i> Поставщики</h5>
              <h3>{stats.suppliers}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card stat-card bg-success text-white">
            <div className="card-body">
              <h5><i className="bi bi-box-seam"></i> На складе</h5>
              <h3>{stats.inventory}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card stat-card bg-warning text-white">
            <div className="card-body">
              <h5><i className="bi bi-exclamation-triangle"></i> Низкий запас</h5>
              <h3>{stats.lowStock}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card stat-card bg-info text-white">
            <div className="card-body">
              <h5><i className="bi bi-cash-coin"></i> Продажи (5 дн.)</h5>
              <h3>{stats.recentSales.toFixed(2)} ₽</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-4">
        <i className="bi bi-info-circle"></i>
        Добро пожаловать в систему управления поставками цветов!
      </div>
    </div>
  );
};

export default Dashboard;