import React, { useEffect, useState } from 'react';
import { Table, Tag, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPaymentListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/payments`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  const columns = [
    { title: 'Mã đơn', dataIndex: '_id' },
    { title: 'Khách hàng', dataIndex: 'user' },
    { title: 'Tổng tiền', dataIndex: 'total', render: v => v.toLocaleString() + 'đ' },
    { title: 'Trạng thái', dataIndex: 'status', render: v => <Tag color={v === 'Completed' ? 'green' : v === 'Paid' ? 'blue' : v === 'Pending' ? 'orange' : 'red'}>{v}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: v => new Date(v).toLocaleString() },
    { title: 'Xem', render: (_, r) => <Button size="small" onClick={() => navigate(`/admin/payment/${r._id}`)}>Chi tiết</Button> }
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2>Lịch sử giao dịch</h2>
      <Table rowKey="_id" columns={columns} dataSource={orders} loading={loading} pagination={false} />
    </div>
  );
};

export default AdminPaymentListPage;
