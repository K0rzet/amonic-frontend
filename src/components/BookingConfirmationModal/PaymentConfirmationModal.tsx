import React, { useState } from 'react';
import styles from './BookingConfirmationModal.module.scss';
import Button from '@/ui/Button/Button';

interface PaymentConfirmationModalProps {
  totalAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  totalAmount,
  onConfirm,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Billing Confirmation</h2>
        <p>Total amount: ${totalAmount.toFixed(2)}</p>
        <div>
          <p>Paid using:</p>
          <label>
            <input
              type="radio"
              value="Credit Card"
              checked={paymentMethod === 'Credit Card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit Card
          </label>
          <label>
            <input
              type="radio"
              value="Cash"
              checked={paymentMethod === 'Cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash
          </label>
          <label>
            <input
              type="radio"
              value="Voucher"
              checked={paymentMethod === 'Voucher'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Voucher
          </label>
        </div>
        <div className={styles.actions}>
          <Button text="Issue tickets" onClick={onConfirm} />
          <Button text="Cancel" onClick={onCancel} style={{ backgroundColor: '#EA292C', color: 'white' }}/>
        </div>
      </div>
    </div>
  );
};