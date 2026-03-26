import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin } from 'antd';
import axios from 'axios';
import { Line, Bar } from '@ant-design/plots';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [orderGrowth, setOrderGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const [s, r, u, o] = await Promise.all([
      axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`, { headers }),
      axios.get(`${process.env.REACT_APP_API_URL}/api/admin/revenue-by-month`, { headers }),
      axios.get(`${process.env.REACT_APP_API_URL}/api/admin/user-growth`, { headers }),
      axios.get(`${process.env.REACT_APP_API_URL}/api/admin/order-by-month`, { headers })
    ]);
    setStats(s.data);
    setRevenue(r.data);
    setUserGrowth(u.data);
    setOrderGrowth(o.data);
    setLoading(false);
  };

  if (loading || !stats) return <Spin />;

  return (
    <div style={{ padding: 32 }}>
      <h2>Admin Dashboard</h2>
      <Row gutter={16} style={{ marginBottom: 32 }}>
        <Col span={6}><Card><Statistic title="Tổng doanh thu" value={stats.totalRevenue.toLocaleString()} suffix="đ" /></Card></Col>
        <Col span={6}><Card><Statistic title="Tổng user" value={stats.totalUser} /></Card></Col>
        <Col span={6}><Card><Statistic title="Tổng đơn hàng" value={stats.totalOrder} /></Card></Col>
      </Row>
      <Row gutter={32}>
        <Col span={12}>
          <Card title="Doanh thu theo tháng">
            <Line
              data={revenue}
              xField="_id"
              yField="total"
              point={{ size: 5, shape: 'diamond' }}
              xAxis={{ title: { text: 'Tháng' } }}
              yAxis={{ title: { text: 'Doanh thu' } }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Tăng trưởng user">
            <Bar
              data={userGrowth}
              xField="_id"
              yField="count"
              xAxis={{ title: { text: 'Tháng' } }}
              yAxis={{ title: { text: 'User mới' } }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={32} style={{ marginTop: 32 }}>
        <Col span={24}>
          <Card title="Tăng trưởng đơn hàng">
            <Bar
              data={orderGrowth}
              xField="_id"
              yField="count"
              xAxis={{ title: { text: 'Tháng' } }}
              yAxis={{ title: { text: 'Đơn hàng' } }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardPage;
