import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Result, Button, Spin } from 'antd';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VnPayReturnPage = () => {
  const query = useQuery();
  const [status, setStatus] = useState('pending');
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const vnp_TxnRef = query.get('vnp_TxnRef');
    setOrderId(vnp_TxnRef);
    if (vnp_TxnRef) {
      checkOrder(vnp_TxnRef);
    } else {
      setStatus('fail');
    }
    // eslint-disable-next-line
  }, []);

  const checkOrder = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 'Paid' || res.data.status === 'Completed') setStatus('success');
      else setStatus('fail');
    } catch {
      setStatus('fail');
    }
  };

  if (status === 'pending') return <Spin style={{ display: 'block', margin: '60px auto' }} />;

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <Card>
        {status === 'success' ? (
          <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle={`Đơn hàng #${orderId} đã được thanh toán.`}
            extra={<Button type="primary" onClick={() => navigate('/orders')}>Xem đơn hàng</Button>}
          />
        ) : (
          <Result
            status="error"
            title="Thanh toán thất bại!"
            subTitle="Có lỗi xảy ra hoặc giao dịch bị hủy."
            extra={<Button onClick={() => navigate('/')}>Về trang chủ</Button>}
          />
        )}
      </Card>
    </div>
  );
};

export default VnPayReturnPage;
