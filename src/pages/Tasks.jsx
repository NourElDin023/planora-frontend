import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import PomodoroTimer from '../components/PomodoroTimer';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    due_date: '',
    due_time: '',
    category: '',
    task_icon: null,
  });

  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split('T')[0];

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('tasks/');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      details: '',
      due_date: '',
      due_time: '',
      category: '',
      task_icon: null,
    });
    setEditingTask(null);
  };

  const handleAddButtonClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setFormData({
      title: task.title,
      details: task.details || '',
      due_date: task.due_date,
      due_time: task.due_time,
      category: task.category,
      task_icon: null, // Can't pre-fill file input
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'task_icon' && files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const taskData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          taskData.append(key, formData[key]);
        }
      });

      let response;
      if (editingTask) {
        response = await axiosInstance.patch(
          `tasks/${editingTask.id}/`,
          taskData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setTasks(
          tasks.map((task) =>
            task.id === editingTask.id ? response.data : task
          )
        );
      } else {
        response = await axiosInstance.post('tasks/', taskData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setTasks([...tasks, response.data]);
      }

      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error saving task:', err);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleCompleteToggle = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await axiosInstance.patch(`tasks/${task.id}/`, {
        completed: updatedTask.completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axiosInstance.delete(`tasks/${taskId}/`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="container">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 fw-bold" style={{ color: '#6a11cb' }}>
            <i className="fas fa-tasks me-2"></i>
            Tasks
            {tasks.length > 0 && (
              <span className="ms-2 badge rounded-pill bg-primary">
                {tasks.length}
              </span>
            )}
          </h1>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary me-2"
              onClick={() => setShowPomodoro(!showPomodoro)}
            >
              <i className="fas fa-clock me-1"></i>
              <span className="d-none d-md-inline">Pomodoro Timer</span>
            </button>
            <button className="btn btn-primary" onClick={handleAddButtonClick}>
              <i className="fas fa-plus me-1"></i>
              <span className="d-none d-md-inline">New Task</span>
            </button>
          </div>
        </div>

        {/* Pomodoro Timer (Collapsible) */}
        {showPomodoro && (
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Focus Timer
              </h5>
              <button
                className="btn btn-sm btn-light"
                onClick={() => setShowPomodoro(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="card-body">
              <PomodoroTimer />
            </div>
          </div>
        )}

        {/* Task Form (Collapsible) */}
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

        {/* Tasks List */}
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
                style={{ color: '#6a11cb' }}
              ></i>
              <h3 className="text-muted">No tasks yet</h3>
              <p className="lead">
                Click the "New Task" button to add your first task
              </p>
              <button
                className="btn btn-primary mt-2"
                onClick={handleAddButtonClick}
              >
                <i className="fas fa-plus me-2"></i>Add New Task
              </button>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {tasks.map((task) => (
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
                        style={{ color: task.completed ? '' : '#6a11cb' }}
                      >
                        {task.title}
                      </h3>
                    </div>
                    <div className="dropdown d-md-none">
                      <button
                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                        type="button"
                        id={`taskActions-${task.id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby={`taskActions-${task.id}`}
                      >
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleEditTask(task)}
                          >
                            <i className="fas fa-edit me-2"></i>Edit
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <i className="fas fa-trash me-2"></i>Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="d-none d-md-flex">
                      <button
                        onClick={() => handleEditTask(task)}
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
                          Mark as {task.completed ? 'incomplete' : 'complete'}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent text-end">
                    <small className="text-muted">
                      Created: {new Date(task.created_at).toLocaleString()}
                    </small>
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

export default Tasks;
