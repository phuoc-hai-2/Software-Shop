import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Table, Button, message, Spin } from 'antd';
import axios from 'axios';

const AdminUserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchUser(); fetchOrders(); /* eslint-disable-next-line */ }, [id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
    } catch {
      message.error('Không tìm thấy user');
      navigate('/admin/users');
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users/${id}/orders`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch {
      setOrders([]);
    }
  };

  if (loading || !user) return <Spin />;

  const columns = [
    { title: 'Mã đơn', dataIndex: '_id' },
    { title: 'Tổng tiền', dataIndex: 'total', render: v => v.toLocaleString() + 'đ' },
    { title: 'Trạng thái', dataIndex: 'status', render: v => <Tag color={v === 'Completed' ? 'green' : v === 'Paid' ? 'blue' : v === 'Pending' ? 'orange' : 'red'}>{v}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: v => new Date(v).toLocaleString() },
    { title: 'Xem', render: (_, r) => <Button size="small" onClick={() => navigate(`/order/${r._id}`)}>Chi tiết</Button> }
  ];

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <Card title={`Hồ sơ User: ${user.email}`}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò"><Tag color={user.role === 'admin' ? 'volcano' : 'blue'}>{user.role}</Tag></Descriptions.Item>
          <Descriptions.Item label="Trạng thái"><Tag color={user.status === 'banned' ? 'red' : 'green'}>{user.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(user.createdAt).toLocaleString()}</Descriptions.Item>
        </Descriptions>
        <h3 style={{ marginTop: 32 }}>Lịch sử mua hàng</h3>
        <Table rowKey="_id" columns={columns} dataSource={orders} pagination={false} />
      </Card>
    </div>
  );
};

export default AdminUserDetailPage;
