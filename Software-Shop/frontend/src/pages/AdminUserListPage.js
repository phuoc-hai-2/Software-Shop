import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  const handleStatus = (id, status) => {
    Modal.confirm({
      title: status === 'banned' ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
          message.success('Cập nhật thành công');
          fetchUsers();
        } catch {
          message.error('Lỗi thao tác');
        }
      }
    });
  };

  const columns = [
    { title: 'Email', dataIndex: 'email' },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Vai trò', dataIndex: 'role', render: v => <Tag color={v === 'admin' ? 'volcano' : 'blue'}>{v}</Tag> },
    { title: 'Trạng thái', dataIndex: 'status', render: v => <Tag color={v === 'banned' ? 'red' : 'green'}>{v}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: v => new Date(v).toLocaleString() },
    { title: 'Thao tác', render: (_, r) => <>
      <Button size="small" onClick={() => navigate(`/admin/user/${r._id}`)}>Chi tiết</Button>
      {r.status === 'active' ? (
        <Button size="small" danger style={{ marginLeft: 8 }} onClick={() => handleStatus(r._id, 'banned')}>Khóa</Button>
      ) : (
        <Button size="small" style={{ marginLeft: 8 }} onClick={() => handleStatus(r._id, 'active')}>Mở khóa</Button>
      )}
    </> }
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2>Quản lý Người dùng</h2>
      <Table rowKey="_id" columns={columns} dataSource={users} loading={loading} pagination={false} />
    </div>
  );
};

export default AdminUserListPage;
