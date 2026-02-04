import React, { useState, useEffect } from 'react';
import { supplierApi } from '../services/api';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    country: '',
    phone: '',
    email: '',
    rating: 3,
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await supplierApi.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Ошибка загрузки поставщиков:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await supplierApi.create(newSupplier);
      fetchSuppliers();
      setNewSupplier({
        name: '',
        country: '',
        phone: '',
        email: '',
        rating: 3,
      });
    } catch (error) {
      console.error('Ошибка создания поставщика:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить поставщика?')) {
      try {
        await supplierApi.delete(id);
        fetchSuppliers();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2><i className="bi bi-people"></i> Поставщики</h2>
      
      {/* Форма добавления */}
      <div className="card mb-4">
        <div className="card-header">Добавить нового поставщика</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Название *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Страна</label>
                <input
                  type="text"
                  className="form-control"
                  value={newSupplier.country}
                  onChange={(e) => setNewSupplier({...newSupplier, country: e.target.value})}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Телефон</label>
                <input
                  type="tel"
                  className="form-control"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Рейтинг</label>
              <select
                className="form-select"
                value={newSupplier.rating}
                onChange={(e) => setNewSupplier({...newSupplier, rating: parseInt(e.target.value)})}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {'★'.repeat(num) + '☆'.repeat(5 - num)}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-plus-circle"></i> Добавить
            </button>
          </form>
        </div>
      </div>

      {/* Таблица поставщиков */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Страна</th>
              <th>Телефон</th>
              <th>Рейтинг</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id}>
                <td>{supplier.id}</td>
                <td><strong>{supplier.name}</strong></td>
                <td>{supplier.country || '—'}</td>
                <td>{supplier.phone || '—'}</td>
                <td>
                  <span className="text-warning">
                    {'★'.repeat(supplier.rating) + '☆'.repeat(5 - supplier.rating)}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2">
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(supplier.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;