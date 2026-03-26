import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Spin } from 'antd';
import OrderMenu from '../components/OrderMenu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const statusColor = {
  Pending: 'orange',
  Paid: 'blue',
  Completed: 'green',
  Failed: 'red',
  Cancelled: 'red',
  Refunded: 'purple'
};

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  const columns = [
    { title: 'Mã đơn', dataIndex: '_id' },
    { title: 'Tổng tiền', dataIndex: 'total', render: v => v.toLocaleString() + 'đ' },
    { title: 'Trạng thái', dataIndex: 'status', render: v => <Tag color={statusColor[v] || 'default'}>{v}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: v => new Date(v).toLocaleString() },
    { title: 'Thao tác', render: (_, r) => <Button onClick={() => navigate(`/order/${r._id}`)}>Xem chi tiết</Button> }
  ];

  return (
    <div style={{ padding: 32 }}>
      <OrderMenu />
      <h2>Lịch sử đơn hàng</h2>
      <Table rowKey="_id" columns={columns} dataSource={orders} loading={loading} pagination={false} />
    </div>
  );
};

export default OrderListPage;
