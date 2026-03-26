import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, message, Spin } from 'antd';
import axios from 'axios';

const CheckoutPage = () => {
  const { id } = useParams(); // orderId
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrder(res.data);
    } catch {
      message.error('Không tìm thấy đơn hàng');
      navigate('/cart');
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/create`, { orderId: id }, { headers: { Authorization: `Bearer ${token}` } });
      window.location.href = res.data.paymentUrl;
    } catch {
      message.error('Không thể tạo link thanh toán');
    }
    setPaying(false);
  };

  if (loading || !order) return <Spin />;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <Card title="Thanh toán đơn hàng">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Mã đơn hàng">{order._id}</Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">{order.total.toLocaleString()}đ</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{order.status}</Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Button type="primary" size="large" onClick={handlePayment} loading={paying} disabled={order.status !== 'Pending'}>
            Thanh toán VNPay
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutPage;
