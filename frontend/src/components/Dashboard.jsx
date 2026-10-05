import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard({ logout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user tasks from Express backend
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/tasks');
      // Supports array directly or nested response wrapper
      const taskList = Array.isArray(res.data) ? res.data : res.data.data || [];
      setTasks(taskList);
    } catch (err) {
      console.error('Fetch Tasks Error:', err);
      setError('Failed to load tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await API.post('/tasks', { title, description, priority });
      setTitle('');
      setDescription('');
      setPriority('Medium');
      fetchTasks();
    } catch (err) {
      console.error('Add Task Error:', err);
      setError('Failed to create task.');
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Delete Task Error:', err);
      setError('Failed to delete task.');
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', padding: '24px', border: '1px solid #e0e0e0', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Conscious Task Dashboard</h2>
        <button 
          onClick={logout} 
          style={{ padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}

      {/* Form */}
      <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Task Title *"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Priority:</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button 
            type="submit" 
            style={{ marginLeft: 'auto', padding: '10px 20px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Task List */}
      <h3>Your Tasks</h3>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p style={{ color: '#666', italic: 'true' }}>No tasks found. Add your first task above!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li 
              key={task._id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px 16px', 
                marginBottom: '10px', 
                border: '1px solid #eee', 
                borderRadius: '6px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div>
                <strong>{task.title}</strong>
                {task.description && <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#555' }}>{task.description}</p>}
                <span style={{ fontSize: '12px', color: '#888' }}>Priority: {task.priority || 'Medium'}</span>
              </div>
              
              <button 
                onClick={() => handleDeleteTask(task._id)}
                style={{ padding: '6px 12px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}