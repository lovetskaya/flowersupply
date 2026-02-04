import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import Dashboard from './components/Dashboard';
import Suppliers from './components/Suppliers';
import Orders from './components/Orders';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Reports from './components/Reports';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="container-fluid mt-4">
          <div className="row">
            <div className="col-md-3">
              {/* Боковое меню */}
              <div className="list-group mb-4">
                <a href="/" className="list-group-item list-group-item-action">
                  <i className="bi bi-speedometer2"></i> Панель управления
                </a>
                <a href="/suppliers" className="list-group-item list-group-item-action">
                  <i className="bi bi-people"></i> Поставщики
                </a>
                <a href="/orders" className="list-group-item list-group-item-action">
                  <i className="bi bi-truck"></i> Заказы
                </a>
                <a href="/inventory" className="list-group-item list-group-item-action">
                  <i className="bi bi-box-seam"></i> Инвентарь
                </a>
                <a href="/sales" className="list-group-item list-group-item-action">
                  <i className="bi bi-cash-coin"></i> Продажи
                </a>
                <a href="/reports" className="list-group-item list-group-item-action">
                  <i className="bi bi-graph-up"></i> Отчеты
                </a>
              </div>
            </div>
            <div className="col-md-9">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;