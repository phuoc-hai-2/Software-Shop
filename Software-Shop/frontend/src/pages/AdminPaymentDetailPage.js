import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Tag, Spin } from 'antd';
import axios from 'axios';

const AdminPaymentDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrder(); /* eslint-disable-next-line */ }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/payments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrder(res.data);
    } catch {
      setOrder(null);
    }
    setLoading(false);
  };

  if (loading || !order) return <Spin />;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <Card title={`Chi tiết giao dịch #${order._id}`}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Khách hàng">{order.user}</Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">{order.total.toLocaleString()}đ</Descriptions.Item>
          <Descriptions.Item label="Trạng thái"><Tag color={order.status === 'Completed' ? 'green' : order.status === 'Paid' ? 'blue' : order.status === 'Pending' ? 'orange' : 'red'}>{order.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(order.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Phương thức">{order.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label="Thông tin VNPay">
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(order.paymentInfo, null, 2)}</pre>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default AdminPaymentDetailPage;
