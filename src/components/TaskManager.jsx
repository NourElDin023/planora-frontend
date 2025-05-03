import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
const TaskManager = ({
  collectionId,
  permission,
  onTaskSelect,
  setShowSharePage,
}) => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    title: true,
    details: true,
    category: true,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    details: '',
    due_date: '',
    due_time: '',
    category: '',
    task_icon: null,
    collection: collectionId,
  });
  const handleTaskClick = (task) => {
    onTaskSelect(task);
  };

  const today = new Date().toISOString().split('T')[0];

  // Fetch tasks for specific collection
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `tasks/?collection=${collectionId}`
      );
      setTasks(response.data);

      // Extract unique categories from tasks
      const uniqueCategories = [...new Set(response.data.map(task => task.category))].filter(Boolean);
      setCategories(uniqueCategories);

      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (collectionId) {
      fetchTasks();
    }
  }, [collectionId]);

  // Form handling
  const resetForm = () => {
    setFormData({
      title: '',
      details: '',
      due_date: '',
      due_time: '',
      category: '',
      task_icon: null,
      collection: collectionId,
    });
    setEditingTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files?.[0] || value,
    }));
  };

  // React component
  const handleCompleteToggle = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      // Send only the changed field
      await axiosInstance.patch(`tasks/${task.id}/`, {
        completed: updatedTask.completed,
      });

      // Update state using functional update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      console.error('Error updating task:', err);
      alert(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axiosInstance.delete(`tasks/${taskId}/`);
      // Ensure we're filtering by the correct ID
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = new FormData();

      // Handle file uploads properly
      if (formData.task_icon instanceof File) {
        taskData.append('task_icon', formData.task_icon);
      }

      // Append other fields
      const fields = [
        'title',
        'details',
        'due_date',
        'due_time',
        'category',
        'collection',
      ];
      fields.forEach((field) => {
        if (formData[field]) taskData.append(field, formData[field]);
      });

      const response = editingTask
        ? await axiosInstance.patch(`tasks/${editingTask.id}/`, taskData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await axiosInstance.post('tasks/', taskData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

      // Update state with proper data handling
      setTasks((prev) => {
        if (editingTask) {
          return prev.map((task) =>
            task.id === editingTask.id ? response.data : task
          );
        }
        return [...prev, response.data];
      });

      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error saving task:', err);
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{
        minHeight: '100vh',
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-start mb-4">
          <h1 className="h2 fs-3 fw-bold" style={{ color: '#0d6efd' }}>
            <i className="fas fs-3 fa-tasks me-2"></i>
            Collection Tasks{' '}
            {tasks.length > 0 && (
              <span className="ms-2 fs-5 badge rounded-pill bg-primary">
                {tasks.length}
              </span>
            )}
          </h1>
          <div className="d-flex gap-2">
            {permission === 'edit' && (
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                style={{
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d6efd';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="fas fa-plus me-1"></i>
                New Task
              </button>
            )}
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowSharePage(true)}
              style={{
                transition: 'all 0.2s ease-in-out',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0d6efd';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = '';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-share-alt me-1"></i>
              Share Collection
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search for task title, details or category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
            <button
              className={`btn ${
                showFilters || Object.values(searchFilters).some((v) => !v)
                  ? 'btn-primary'
                  : 'btn-outline-secondary'
              }`}
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              title="Search filters"
            >
              <i className="fa-solid fa-sliders"></i>
            </button>
          </div>

          {/* Category Filter */}
          <div className="mt-3 d-flex align-items-center gap-2">
            <div className="ms-auto dropdown">
              <button 
                className="btn btn-outline-primary dropdown-toggle" 
                type="button"
                id="categoryFilterDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="fas fa-filter me-1"></i>
                Filter by Category
              </button>
              <ul className="dropdown-menu" aria-labelledby="categoryFilterDropdown">
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => setCategoryFilter('')}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((category, index) => (
                  <li key={index}>
                    <button 
                      className="dropdown-item" 
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {categoryFilter && (
              <div className="d-flex align-items-center badge bg-primary p-2">
                <span>Category: {categoryFilter}</span>
                <button 
                  className="btn btn-sm text-white ms-2 p-0" 
                  onClick={() => setCategoryFilter('')}
                  style={{ fontSize: '0.8rem' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>

          {/* Search Filters - Only show when filters are toggled */}
          {showFilters && (
            <div className="mt-2 d-flex gap-2">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="titleFilter"
                  checked={searchFilters.title}
                  onChange={() =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      title: !prev.title,
                    }))
                  }
                />
                <label className="form-check-label" htmlFor="titleFilter">
                  Title
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="detailsFilter"
                  checked={searchFilters.details}
                  onChange={() =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      details: !prev.details,
                    }))
                  }
                />
                <label className="form-check-label" htmlFor="detailsFilter">
                  Details
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="categoryFilter"
                  checked={searchFilters.category}
                  onChange={() =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      category: !prev.category,
                    }))
                  }
                />
                <label className="form-check-label" htmlFor="categoryFilter">
                  Category
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Task Form */}
        {showForm && (
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-edit me-2"></i>
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h5>
              <button
                className="btn btn-sm btn-light"
                onClick={() => setShowForm(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="card-body">
              <form onSubmit={handleFormSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="title" className="form-label">
                      Title*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="due_date" className="form-label">
                      Due Date*
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="due_date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      min={today}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="due_time" className="form-label">
                      Due Time*
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="due_time"
                      name="due_time"
                      value={formData.due_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="category" className="form-label">
                      Category*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="task_icon" className="form-label">
                      Task Icon (Optional)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="task_icon"
                      name="task_icon"
                      onChange={handleInputChange}
                      accept="image/*"
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="details" className="form-label">
                      Details (Optional)
                    </label>
                    <textarea
                      className="form-control"
                      id="details"
                      name="details"
                      rows="3"
                      value={formData.details}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your tasks...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-5 card shadow-sm">
            <div className="card-body">
              <i
                className="fas fa-clipboard-check fa-4x mb-3"
                style={{ color: '#0d6efd' }}
              ></i>
              <h3 className="text-muted">No tasks yet</h3>

              {permission === 'edit' && (
                <>
                  <p className="lead">
                    Click the "New Task" button to add your first task
                  </p>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => setShowForm(true)}
                  >
                    <i className="fas fa-plus me-2"></i>Add New Task
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-lg-2 g-4">
            {tasks
              .filter((task) => {
                // First apply search query filter
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();

                return (
                  (searchFilters.title &&
                    task.title?.toLowerCase().includes(query)) ||
                  (searchFilters.details &&
                    task.details?.toLowerCase().includes(query)) ||
                  (searchFilters.category &&
                    task.category?.toLowerCase().includes(query))
                );
              })
              .filter((task) => {
                // Then apply category filter
                if (!categoryFilter) return true;
                return task.category === categoryFilter;
              })
              .map((task) => (
                <div key={task.id} className="col">
                  <div
                    className={`card h-100 shadow-sm ${
                      task.completed ? 'bg-light' : ''
                    }`}
                  >
                    <div
                      className="card-header py-3 d-flex justify-content-between align-items-center"
                      style={{
                        background: task.completed
                          ? 'linear-gradient(135deg, rgba(106,17,203,0.05) 0%, rgba(37,117,252,0.05) 100%)'
                          : 'linear-gradient(135deg, rgba(106,17,203,0.1) 0%, rgba(37,117,252,0.1) 100%)',
                      }}
                    >
                      <div className="d-flex align-items-center">
                        {task.task_icon && (
                          <img
                            src={task.task_icon}
                            alt="Task Icon"
                            className="me-2 rounded-circle"
                            style={{
                              width: '32px',
                              height: '32px',
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        <h3
                          className={`h5 mb-0 fw-bold ${
                            task.completed
                              ? 'text-decoration-line-through text-muted'
                              : ''
                          }`}
                          style={{ color: task.completed ? '' : '#0d6efd' }}
                        >
                          {task.title}
                        </h3>
                      </div>
                      {permission === 'edit' && (
                        <div className="d-none d-md-flex">
                          <button
                            onClick={() => {
                              setFormData({ ...task, task_icon: null });
                              setEditingTask(task);
                              setShowForm(true);
                            }}
                            className="btn btn-sm btn-outline-primary me-1"
                            title="Edit task"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="btn btn-sm btn-outline-danger"
                            title="Delete task"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="card-body">
                      <div className={task.completed ? 'text-muted' : ''}>
                        {task.details && <p>{task.details}</p>}
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <span className="badge bg-primary">
                            <i className="fas fa-tag me-1"></i>
                            {task.category}
                          </span>
                          <span className="badge bg-info">
                            <i className="far fa-calendar me-1"></i>
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                          <span className="badge bg-warning text-dark">
                            <i className="far fa-clock me-1"></i>
                            {task.due_time}
                          </span>
                        </div>
                        {permission === 'edit' && (
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleCompleteToggle(task)}
                              id={`complete-${task.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`complete-${task.id}`}
                            >
                              Mark as{' '}
                              {task.completed ? 'incomplete' : 'complete'}
                            </label>
                          </div>
                        )}
                        {permission === 'view' && (
                          <div className="form-check">
                            <label
                              className="form-check-label"
                              htmlFor={`complete-${task.id}`}
                            >
                              Marked as{' '}
                              {task.completed ? 'incomplete' : 'complete'}
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="card-footer bg-transparent text-end">
                      <div
                        className="d-flex flex-column flex-lg-row justify-content-between gap-2 pb-2"
                      >
                        <small className="text-muted text-start">
                          Owner: <br />
                          {task.owner}
                        </small>
                        <small className="text-muted text-start">
                          Created: <br />{' '}
                          {new Date(task.created_at).toLocaleString()}
                        </small>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task);
                        }}
                        style={{
                          background: '#7D26CD',
                          color: 'white',
                          border: '1px solid #7D26CD',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          ':hover': {
                            background: '#6a1fb5',
                            borderColor: '#6a1fb5',
                            transform: 'translateY(-1px)',
                          },
                          ':active': {
                            transform: 'translateY(0)',
                          },
                        }}
                        title="View full task details"
                        aria-label={`View details for ${task.title}`}
                      >
                        <i
                          className="fas fa-search-plus"
                          style={{ fontSize: '0.9rem' }}
                        ></i>
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
