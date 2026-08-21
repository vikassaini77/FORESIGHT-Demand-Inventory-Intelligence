import React, { useState } from 'react';
import { UserPlus, MoreVertical, Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

function UserManagement() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  const mockUsers = [
    { id: 1, name: 'Jane Analyst', email: 'jane.analyst@northbay.com', role: 'Senior Analyst', status: 'Active', lastLogin: 'Today' },
    { id: 2, name: 'Mark Operations', email: 'mark.op@northbay.com', role: 'Warehouse Manager', status: 'Active', lastLogin: 'Yesterday' },
    { id: 3, name: 'Sarah Exec', email: 'sarah.ex@northbay.com', role: 'Executive (Read-Only)', status: 'Active', lastLogin: '3 days ago' },
    { id: 4, name: 'Tom Intern', email: 'tom.intern@northbay.com', role: 'Analyst', status: 'Suspended', lastLogin: '1 month ago' },
  ];

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsModalOpen(false);
    addToast(`Invitation sent to ${inviteEmail}`, 'success');
    setInviteEmail('');
  };

  return (
    <div className="page-container animate-fade-up">
      <header className="header">
        <div>
          <h1>User Management</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage platform access, roles, and security policies
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={16} /> Invite User
        </button>
      </header>

      <div className="chart-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
          <div className="input-icon-wrapper" style={{ flex: 1, maxWidth: '320px' }}>
            <Search size={16} />
            <input type="text" className="glass-input" placeholder="Search users by name or email..." style={{ width: '100%' }} />
          </div>
          
          <div className="input-icon-wrapper">
            <Filter size={16} />
            <select className="glass-select">
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Analyst">Analyst</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th style={{ paddingLeft: '1.5rem' }}>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th style={{ width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ paddingLeft: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{user.lastLogin}</td>
                  <td>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--panel-bg-hover)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Showing 1 to 4 of 4 results</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} disabled><ChevronLeft size={16} /></button>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content animate-slide-up">
            <div className="modal-header">
              <h2>Invite New User</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="auth-form" onSubmit={handleInvite}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={inviteEmail} 
                  onChange={(e) => setInviteEmail(e.target.value)} 
                  placeholder="colleague@northbay.com" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="glass-select" style={{ width: '100%', background: 'var(--bg-color)' }}>
                  <option>Senior Analyst</option>
                  <option>Analyst</option>
                  <option>Executive (Read-Only)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
