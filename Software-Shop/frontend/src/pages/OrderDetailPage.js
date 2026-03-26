import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Tag, Table, Button, message, Spin } from 'antd';
import axios from 'axios';

const statusColor = {
  Pending: 'orange',
  Paid: 'blue',
  Completed: 'green',
  Failed: 'red',
  Cancelled: 'red',
  Refunded: 'purple'
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
    }
    setLoading(false);
  };

  const downloadFile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/fulfillment/download/${id}`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', order.fileUrl.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      message.error('Không thể tải file');
    }
  };

  if (loading || !order) return <Spin />;

  const columns = [
    { title: 'Sản phẩm', dataIndex: ['product', 'name'] },
    { title: 'Gói', dataIndex: 'variant' },
    { title: 'Số lượng', dataIndex: 'quantity' },
    { title: 'Giá', dataIndex: 'price', render: v => v.toLocaleString() + 'đ' }
  ];

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <Card title={`Chi tiết đơn hàng #${order._id}`}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Trạng thái"><Tag color={statusColor[order.status] || 'default'}>{order.status}</Tag></Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">{order.total.toLocaleString()}đ</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{new Date(order.createdAt).toLocaleString()}</Descriptions.Item>
        </Descriptions>
        <Table rowKey={(_, i) => i} columns={columns} dataSource={order.items} pagination={false} style={{ marginTop: 24 }} />
        {order.status === 'Completed' && order.fileUrl && (
          <div style={{ marginTop: 24 }}>
            <Button type="primary" onClick={downloadFile}>Tải file nhận hàng</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrderDetailPage;
