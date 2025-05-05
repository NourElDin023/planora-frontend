import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const TaskManager = ({
  collectionId,
  permission,
  onTaskSelect,
  setShowSharePage,
  isSharedCollections
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
  const [taskToDelete, setTaskToDelete] = useState(null);

  // --- MODIFIED: Updated formData state ---
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    due_date: '',
    start_time: '', // Added start_time
    end_time: '',   // Added end_time
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
        `tasks/?collection=${collectionId}` // Ensure template literal is used correctly
      );

      setTasks(response.data);
      // Extract unique categories from tasks
      const uniqueCategories = [
        ...new Set(response.data.map((task) => task.category)),
      ].filter(Boolean);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId]); // Consider adding fetchTasks to dependencies if needed, but be careful of infinite loops

  // Form handling
  const resetForm = () => {
    // --- MODIFIED: Updated resetForm ---
    setFormData({
      title: '',
      details: '',
      due_date: '',
      start_time: '', // Added start_time
      end_time: '',   // Added end_time
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
          t.id === task.id ? { ...t, completed: !task.completed } : t
        )
      );
    } catch (err) {
      console.error('Error updating task:', err);
      alert(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`tasks/${taskId}/`);
      // Ensure we're filtering by the correct ID
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setTaskToDelete(null);
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

      // --- MODIFIED: Updated fields to send ---
      const fields = [
        'title',
        'details',
        'due_date',
        'start_time', // Added start_time
        'end_time',   // Added end_time
        'category',
        'collection',
      ];
      fields.forEach((field) => {
        if (formData[field]) taskData.append(field, formData[field]);
      });

      // Ensure start_time and end_time are required if needed by backend
      // You might want to add frontend validation here as well.

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
        // Make sure the response data includes the new fields
        return [...prev, response.data];
      });

      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error saving task:', err);
      // Provide more specific error feedback if possible
      let errorMessage = 'Failed to save task.';
      if (err.response?.data) {
        // Example: Check for specific field errors from backend
        if (err.response.data.start_time) errorMessage += ` Start Time: ${err.response.data.start_time.join(' ')}`;
        if (err.response.data.end_time) errorMessage += ` End Time: ${err.response.data.end_time.join(' ')}`;
        // Add more fields as needed
      }
      alert(errorMessage);
    }
  };

  // Filter tasks based on search query and category
   const filteredTasks = tasks
    .filter((task) => {
        // Apply category filter first
        if (categoryFilter && task.category !== categoryFilter) {
            return false;
        }
        return true; // Keep task if category matches or no filter applied
    })
    .filter((task) => {
        // Then apply search query filter
        if (!searchQuery) return true; // Keep task if no search query

        const query = searchQuery.toLowerCase();
        const fieldsToSearch = [];
        if (searchFilters.title) fieldsToSearch.push(task.title?.toLowerCase() || '');
        if (searchFilters.details) fieldsToSearch.push(task.details?.toLowerCase() || '');
        if (searchFilters.category) fieldsToSearch.push(task.category?.toLowerCase() || '');

        // Check if query exists in any of the selected fields
        return fieldsToSearch.some(field => field.includes(query));
    });


  return (
    <div
      className="container-fluid py-4"
      style={{
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="h3 mb-0 text-primary fw-bold">
          <i className="bi bi-collection me-2"></i>
          Collection Tasks{' '}
          {tasks.length > 0 && (
            <span className="badge bg-secondary ms-2">{tasks.length}</span>
          )}
            {isSharedCollections && (
              <span className="ms-2 fs-5 badge rounded-pill bg-secondary">
                Shared with {permission} access
              </span>
            )}
        </h2>
        <div className="d-flex gap-2">
          {permission === 'edit' && (
            <button
              className="btn btn-outline-primary d-flex align-items-center"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <i className="bi bi-plus-circle me-1"></i>
              New Task
            </button>
          )}
            {!isSharedCollections && (
              <button
              className="btn btn-outline-primary d-flex align-items-center"
              onClick={() => setShowSharePage(true)}
            >
              <i className="bi bi-share me-1"></i>
              Share Collection
            </button>
              )}
          
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="mb-4 p-3 bg-light border rounded">
        <div className="input-group mb-2">
          <span className="input-group-text bg-white border-end-0">
            <i className="fas fa-search text-primary"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search tasks..."
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
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-secondary'}`}
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            title="Search filters"
          >
            <i className="fa-solid fa-sliders"></i>
          </button>
        </div>

        {/* Search Filters - Only show when filters are toggled */}
        {showFilters && (
          <div className="mb-2 d-flex flex-wrap gap-3 border-top pt-2">
            <small className="text-muted me-2 align-self-center">Search in:</small>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="titleFilter"
                checked={searchFilters.title}
                onChange={() =>
                  setSearchFilters((prev) => ({ ...prev, title: !prev.title }))
                }
              />
              <label className="form-check-label" htmlFor="titleFilter">Title</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="detailsFilter"
                checked={searchFilters.details}
                onChange={() =>
                  setSearchFilters((prev) => ({ ...prev, details: !prev.details }))
                }
              />
              <label className="form-check-label" htmlFor="detailsFilter">Details</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="categoryFilterCheck" // Changed ID to avoid conflict
                checked={searchFilters.category}
                onChange={() =>
                  setSearchFilters((prev) => ({ ...prev, category: !prev.category }))
                }
              />
              <label className="form-check-label" htmlFor="categoryFilterCheck">Category</label>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="d-flex flex-wrap align-items-center gap-2 border-top pt-2">
          {categoryFilter && (
            <div className="d-flex align-items-center badge bg-primary p-2 rounded-pill">
              <span className="me-1">Filtering by: {categoryFilter}</span>
              <button
                className="btn btn-sm text-white p-0"
                onClick={() => setCategoryFilter('')}
                style={{ fontSize: '0.8rem', lineHeight: 1 }}
                title="Clear category filter"
              >
                <i className="fas fa-times-circle"></i>
              </button>
            </div>
          )}
          {categories.length > 0 && (
             <div className="ms-auto dropdown">
              <button
                  className="btn btn-sm btn-outline-primary dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="categoryFilterDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
              >
                  <i className="bi bi-filter me-1"></i> Filter Category
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="categoryFilterDropdown">
                  <li>
                      <button className={`dropdown-item ${!categoryFilter ? 'active' : ''}`} onClick={() => setCategoryFilter('')}>
                          All Categories
                      </button>
                  </li>
                  {categories.map((category, index) => (
                      <li key={index}>
                          <button
                              className={`dropdown-item ${categoryFilter === category ? 'active' : ''}`}
                              onClick={() => setCategoryFilter(category)}
                          >
                              {category}
                          </button>
                      </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>


      {/* Task Form */}
      {showForm && (
        <div className="card shadow mb-4 border border-primary">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-edit me-2"></i>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h5>
            <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={() => setShowForm(false)}
            ></button>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleFormSubmit}>
              <div className="row g-3"> {/* Reduced gap for tighter form */}
                {/* Title Input */}
                <div className="col-12">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      placeholder="Enter task title" // Placeholder helps accessibility
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="title">
                      <i className="bi bi-type me-2 text-primary"></i>
                      Task Title*
                    </label>
                  </div>
                </div>

                {/* Due Date Input */}
                <div className="col-12 col-md-4">
                  <label
                    htmlFor="due_date"
                    className="form-label d-flex align-items-center mb-1"
                  >
                    <i className="bi bi-calendar-date me-2 text-primary"></i>
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

                {/* --- NEW: Start Time Input --- */}
                <div className="col-12 col-md-4">
                  <label
                    htmlFor="start_time"
                    className="form-label d-flex align-items-center mb-1"
                  >
                    <i className="bi bi-clock-history me-2 text-primary"></i> {/* Changed Icon */}
                    Start Time*
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="start_time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required // Make required if necessary
                  />
                </div>

                {/* --- NEW: End Time Input --- */}
                <div className="col-12 col-md-4">
                  <label
                    htmlFor="end_time"
                    className="form-label d-flex align-items-center mb-1"
                  >
                    <i className="bi bi-clock-fill me-2 text-primary"></i> {/* Changed Icon */}
                    End Time*
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="end_time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required // Make required if necessary
                    // Add validation logic if needed (e.g., end_time > start_time)
                  />
                </div>


                {/* Category Input */}
                 <div className="col-12 col-md-6">
                     <label
                        htmlFor="category"
                        className="form-label d-flex align-items-center mb-1"
                     >
                        <i className="bi bi-tag me-2 text-primary"></i>
                        Category*
                     </label>
                     <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          placeholder="Enter or select category"
                          list="categoryOptions"
                          required
                        />
                        {categories.length > 0 && (
                          <datalist id="categoryOptions">
                            {categories.map((cat, idx) => (
                              <option key={idx} value={cat} />
                            ))}
                          </datalist>
                        )}
                     </div>
                     <small className="text-muted d-block mt-1">
                         Type a new category or choose from existing ones.
                     </small>
                 </div>

                {/* Task Icon Input */}
                <div className="col-12 col-md-6">
                     <label
                        htmlFor="task_icon"
                        className="form-label d-flex align-items-center mb-1"
                     >
                        <i className="bi bi-image me-2 text-primary"></i>
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
                     <small className="text-muted d-block mt-1">
                        Upload an image (e.g., .png, .jpg).
                     </small>
                 </div>

                {/* Details Input */}
                <div className="col-12">
                    <label
                        htmlFor="details"
                        className="form-label d-flex align-items-center mb-1"
                    >
                        <i className="bi bi-card-text me-2 text-primary"></i>
                        Details (Optional)
                    </label>
                    <textarea
                        className="form-control"
                        id="details"
                        name="details"
                        rows="3" // Reduced rows slightly
                        value={formData.details}
                        onChange={handleInputChange}
                        placeholder="Add any relevant details..."
                    ></textarea>
                </div>

                {/* Form Actions */}
                <div className="col-12 border-top pt-3 mt-3 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center"
                    onClick={() => setShowForm(false)}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center" // Changed to solid primary
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    {editingTask ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content Area: Task List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading your tasks...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
           <i className="fas fa-exclamation-triangle me-2"></i>
           <div>{error}</div>
        </div>
      ) : tasks.length === 0 ? ( // Check original tasks length for initial message
        <div className="text-center py-5 card shadow-sm bg-light">
          <div className="card-body">
            <i className="fas fa-clipboard-list fa-4x mb-3 text-primary opacity-50"></i>
            <h3 className="text-muted">No tasks found in this collection</h3>
            {permission === 'edit' && (
              <>
                <p className="lead">
                  Click the "New Task" button above to get started.
                </p>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => { resetForm(); setShowForm(true);}}
                >
                  <i className="fas fa-plus me-2"></i>Add Your First Task
                </button>
              </>
            )}
             {permission === 'view' && (
                 <p className="lead text-muted">Tasks added by others will appear here.</p>
             )}
          </div>
        </div>
      ) : filteredTasks.length === 0 ? ( // Check filtered tasks length for no results message
        <div className="text-center py-5 card shadow-sm bg-light">
           <div className="card-body">
              <i className="fas fa-search fa-4x mb-3 text-primary opacity-50"></i>
              <h3 className="text-muted">No tasks match your current filters</h3>
              <p className="lead">Try adjusting your search or category filter.</p>
              <button className="btn btn-outline-secondary mt-2 me-2" onClick={() => setSearchQuery('')}>Clear Search</button>
              {categoryFilter && <button className="btn btn-outline-secondary mt-2" onClick={() => setCategoryFilter('')}>Clear Category Filter</button>}
           </div>
        </div>
      ) : (
        // Display Filtered Tasks
        <div className="row row-cols-1 row-cols-lg-2 g-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="col">
              <div
                className={`card h-100 shadow-sm border-start border-5 ${
                  task.completed ? 'border-success bg-light' : 'border-primary'
                }`}
              >
                <div className="card-header py-3 d-flex justify-content-between align-items-center bg-transparent">
                  <div className="d-flex align-items-center flex-grow-1 me-2" style={{minWidth: 0}}> {/* Allow shrinking */}
                    {task.task_icon && (
                      <img
                        src={task.task_icon}
                        alt="" // Decorative icon
                        className="me-2 rounded-circle border"
                        style={{ width: '32px', height: '32px', objectFit: 'cover', flexShrink: 0 }}
                      />
                    )}
                    <h3
                      className={`h5 mb-0 fw-bold text-truncate ${ /* Added text-truncate */
                        task.completed
                          ? 'text-decoration-line-through text-muted'
                          : 'text-primary'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleTaskClick(task)}
                      title={`View details for ${task.title}`}
                      aria-label={`View details for ${task.title}`}
                    >
                      {task.title}
                    </h3>
                  </div>
                  {permission === 'edit' && (
                     <div className="d-flex flex-shrink-0"> {/* Prevent shrinking */}
                      <button
                        onClick={() => {
                          // --- MODIFIED: Ensure all fields are populated for editing ---
                          // Assuming backend returns start_time and end_time
                          setFormData({
                              ...task,
                              due_date: task.due_date || '', // Handle potential null date from backend
                              start_time: task.start_time || '',
                              end_time: task.end_time || '',
                              task_icon: null // Don't pre-fill file input
                          });
                          setEditingTask(task);
                          setShowForm(true);
                          window.scrollTo(0, 0); // Scroll to top to show form
                        }}
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Edit task"
                        aria-label={`Edit task ${task.title}`}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        onClick={() => setTaskToDelete(task)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete task"
                        aria-label={`Delete task ${task.title}`}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    </div>
                  )}
                </div>

                <div className="card-body">
                  <div className={task.completed ? 'text-muted' : ''}>
                    {task.details && <p className="mb-2 card-text">{task.details}</p>}
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {task.category && (
                        <span
                          className="badge bg-secondary" // Changed color
                          style={{ cursor: 'pointer' }}
                          onClick={() => setCategoryFilter(task.category)}
                          title={`Filter by category: ${task.category}`}
                        >
                          <i className="bi bi-tag-fill me-1"></i>
                          {task.category}
                        </span>
                       )}
                      <span className="badge bg-info text-dark"> {/* Changed color */}
                        <i className="bi bi-calendar3 me-1"></i>
                        {/* Format date robustly */}
                        {task.due_date ? new Date(task.due_date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'}) : 'No date'}
                      </span>
                      {/* --- MODIFIED: Display Start and End Time --- */}
                      {task.start_time && (
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-clock-history me-1"></i>
                          Start: {task.start_time.substring(0, 5)} {/* Format HH:MM */}
                        </span>
                      )}
                       {task.end_time && (
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-clock-fill me-1"></i>
                           End: {task.end_time.substring(0, 5)} {/* Format HH:MM */}
                        </span>
                      )}
                    </div>
                    {permission === 'edit' && (
                      <div className="form-check form-switch"> {/* Using form-switch */}
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch" // Add role for accessibility
                          checked={task.completed}
                          onChange={() => handleCompleteToggle(task)}
                          id={`complete-${task.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`complete-${task.id}`}
                        >
                          {task.completed ? 'Completed' : 'Mark as complete'}
                        </label>
                      </div>
                    )}
                    {/* Read-only view for 'view' permission */}
                    {permission === 'view' && (
                       <p className={`mb-0 small ${task.completed ? 'text-success fw-bold' : 'text-muted'}`}>
                         Status: {task.completed ? 'Completed' : 'Pending'}
                       </p>
                    )}
                  </div>
                </div>

                {task.owner && ( // Only show footer if owner exists
                   <div className="card-footer bg-transparent text-end border-top-0 pt-0">
                       <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                           <i className="bi bi-person-circle me-1"></i> Owner: {task.owner}
                       </small>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simple Delete Confirmation Modal */}
      {taskToDelete && (
        <div
            className="modal fade show d-block" // Use bootstrap classes for modal
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Semi-transparent background
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-danger" id="deleteModalLabel">
                           <i className="bi bi-exclamation-triangle-fill me-2"></i> Confirm Deletion
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setTaskToDelete(null)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you absolutely sure you want to delete this task?</p>
                        <p className="fw-bold text-primary">{taskToDelete.title}</p>
                        <p className="text-danger small">This action cannot be undone.</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setTaskToDelete(null)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleDeleteTask(taskToDelete.id)}
                        >
                             <i className="bi bi-trash3-fill me-1"></i> Delete Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;