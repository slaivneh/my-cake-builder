import React from 'react';
import './OrderHistory.css';
import { ORDER_STATUS } from '../../utils/constants';

const STATUS_STEPS = [
  { key: 'Pending', label: 'Chờ Xử Lý' },
  { key: 'Preparing', label: 'Chuẩn Bị' },
  { key: 'Baking', label: 'Đang Nướng' },
  { key: 'Decorating', label: 'Trang Trí' },
  { key: 'Ready', label: 'Đã Xong' },
  { key: 'Shipping', label: 'Đang Giao' },
  { key: 'Completed', label: 'Hoàn Thành' }
];

const OrderStatusTracker = ({ currentStatus }) => {
  const currentIndex = STATUS_STEPS.findIndex(s => s.key === currentStatus);
  const isCancelled = currentStatus === 'Cancelled';

  if (isCancelled) {
    return (
      <div className="status-tracker cancelled">
        <h3>Đơn Hàng Đã Bị Hủy</h3>
      </div>
    );
  }

  return (
    <div className="status-tracker">
      <div className="progress-bar-container">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <div key={step.key} className={`status-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              <div className="step-circle">
                {isCompleted ? '✓' : index + 1}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
          );
        })}
        {/* Line behind the circles */}
        <div 
          className="progress-line" 
          style={{ width: `${(Math.max(0, currentIndex) / (STATUS_STEPS.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default OrderStatusTracker;
