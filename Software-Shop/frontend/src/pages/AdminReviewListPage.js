import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, Input, message } from 'antd';
import axios from 'axios';

const AdminReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState(false);
  const [reply, setReply] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/reviews/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      setReviews(res.data);
    } catch {
      setReviews([]);
    }
    setLoading(false);
  };

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/reviews/admin/status/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Cập nhật thành công');
      fetchReviews();
    } catch {
      message.error('Lỗi thao tác');
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Xóa đánh giá?',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/reviews/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          message.success('Đã xóa');
          fetchReviews();
        } catch {
          message.error('Lỗi thao tác');
        }
      }
    });
  };

  const openReply = (id, currentReply) => {
    setSelectedId(id);
    setReply(currentReply || '');
    setReplyModal(true);
  };

  const handleReply = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/api/reviews/admin/reply/${selectedId}`, { reply }, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Đã phản hồi');
      setReplyModal(false);
      fetchReviews();
    } catch {
      message.error('Lỗi thao tác');
    }
  };

  const columns = [
    { title: 'Sản phẩm', dataIndex: ['product', 'name'] },
    { title: 'Khách hàng', dataIndex: ['user', 'name'] },
    { title: 'Nội dung', dataIndex: 'content' },
    { title: 'Sao', dataIndex: 'rating', render: v => <Tag color="gold">{v}</Tag> },
    { title: 'Trạng thái', dataIndex: 'status', render: v => <Tag color={v === 'approved' ? 'green' : v === 'pending' ? 'orange' : 'red'}>{v}</Tag> },
    { title: 'Phản hồi', dataIndex: 'adminReply', render: v => v || <i>Chưa phản hồi</i> },
    { title: 'Ngày', dataIndex: 'createdAt', render: v => new Date(v).toLocaleString() },
    { title: 'Thao tác', render: (_, r) => <>
      <Button size="small" onClick={() => handleStatus(r._id, r.status === 'approved' ? 'hidden' : 'approved')}>{r.status === 'approved' ? 'Ẩn' : 'Duyệt'}</Button>
      <Button size="small" style={{ marginLeft: 8 }} onClick={() => openReply(r._id, r.adminReply)}>Phản hồi</Button>
      <Button size="small" danger style={{ marginLeft: 8 }} onClick={() => handleDelete(r._id)}>Xóa</Button>
    </> }
  ];

  return (
    <div style={{ padding: 32 }}>
      <h2>Quản lý Đánh giá</h2>
      <Table rowKey="_id" columns={columns} dataSource={reviews} loading={loading} pagination={false} />
      <Modal open={replyModal} onCancel={() => setReplyModal(false)} onOk={handleReply} title="Phản hồi đánh giá">
        <Input.TextArea rows={4} value={reply} onChange={e => setReply(e.target.value)} />
      </Modal>
    </div>
  );
};

export default AdminReviewListPage;
