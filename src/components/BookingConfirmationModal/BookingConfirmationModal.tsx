import React, { useState, useCallback, useEffect } from 'react';
import styles from './BookingConfirmationModal.module.scss';
import Button from '@/ui/Button/Button';
import { PaymentConfirmationModal } from './PaymentConfirmationModal';
import { instance } from '@/api/axios';

interface Country {
  id: number;
  name: string;
}

interface Passenger {
  firstname: string;
  lastname: string;
  phone: string;
  passportnumber: string;
  passportcountry: string;
  email: string;
  birthdate: string;
}

interface BookingConfirmationModalProps {
  outboundFlight: {
    from: string;
    to: string;
    cabinType: string;
    date: string;
    flightNumber: string;
  };
  returnFlight?: {
    from: string;
    to: string;
    cabinType: string;
    date: string;
    flightNumber: string;
  };
  onClose: () => void;
  onConfirm: (passengers: Passenger[]) => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  outboundFlight,
  returnFlight,
  onClose,
  onConfirm,
}) => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [newPassenger, setNewPassenger] = useState<Passenger>({
    firstname: '',
    lastname: '',
    phone: '',
    passportnumber: '',
    passportcountry: '',
    email: '',
    birthdate: '',
  });
  const [countries, setCountries] = useState<Country[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await instance.get<Country[]>('/airports/countries');
        setCountries(response.data || []); // Ensure we set an empty array if data is null or undefined
      } catch (error) {
        console.error('Error fetching countries:', error);
        setCountries([]); // Set to empty array in case of error
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPassenger((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = useCallback(() => {
    return (
      newPassenger.firstname.trim() !== '' &&
      newPassenger.lastname.trim() !== '' &&
      newPassenger.phone.trim() !== '' &&
      newPassenger.passportnumber.trim() !== '' &&
      newPassenger.passportcountry.trim() !== '' &&
      newPassenger.email.trim() !== ''
    );
  }, [newPassenger]);

  const addPassenger = () => {
    if (isFormValid()) {
      setPassengers((prev) => [...prev, newPassenger]);
      setNewPassenger({
        firstname: '',
        lastname: '',
        phone: '',
        passportnumber: '',
        passportcountry: '',
        email: '',
        birthdate: '',
      });
    }
  };

  const removePassenger = (index: number) => {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmBooking = () => {
    // Calculate total amount here based on passengers and flight details
    const calculatedTotalAmount = 1000; // Replace with your actual calculation
    setTotalAmount(calculatedTotalAmount);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    onConfirm(passengers);
    setShowPaymentModal(false);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Booking confirmation</h2>
        <div className={styles.flightDetails}>
          <h3>Outbound flight details:</h3>
          <p>From: {outboundFlight.from} To: {outboundFlight.to}</p>
          <p>Cabin Type: {outboundFlight.cabinType} Date: {outboundFlight.date}</p>
          <p>Flight number: {outboundFlight.flightNumber}</p>
        </div>
        {returnFlight && (
          <div className={styles.flightDetails}>
            <h3>Return flight details:</h3>
            <p>From: {returnFlight.from} To: {returnFlight.to}</p>
            <p>Cabin Type: {returnFlight.cabinType} Date: {returnFlight.date}</p>
            <p>Flight number: {returnFlight.flightNumber}</p>
          </div>
        )}
        <div className={styles.passengerForm}>
          <input
            type="text"
            name="firstname"
            value={newPassenger.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            name="lastname"
            value={newPassenger.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
          />
          <input
            type="tel"
            name="phone"
            value={newPassenger.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            required
          />
          <input
            type="text"
            name="passportnumber"
            value={newPassenger.passportnumber}
            onChange={handleInputChange}
            placeholder="Passport number"
            required
          />
          <select
            name="passportcountry"
            value={newPassenger.passportcountry}
            onChange={handleInputChange}
            required
          >
            <option value="">Select passport country</option>
            {Array.isArray(countries) && countries.map((country) => (
              <option key={country.id} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <input
            type="email"
            name="email"
            value={newPassenger.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          <input
            type="date"
            name="birthdate"
            value={newPassenger.birthdate}
            onChange={handleInputChange}
            placeholder="Birth Date"
          />
          <Button 
            text="Add passenger" 
            className={styles.addPassengerButton}
            onClick={addPassenger} 
            disabled={!isFormValid()}
          />
        </div>
        <div className={styles.passengersList}>
          <h3>Passengers list</h3>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Passport number</th>
                <th>Passport country</th>
                <th>Email</th>
                <th>Birth Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, index) => (
                <tr key={index}>
                  <td>{passenger.firstname}</td>
                  <td>{passenger.lastname}</td>
                  <td>{passenger.phone}</td>
                  <td>{passenger.passportnumber}</td>
                  <td>{passenger.passportcountry}</td>
                  <td>{passenger.email}</td>
                  <td>{passenger.birthdate}</td>
                  <td>
                    <Button text="Remove passenger" onClick={() => removePassenger(index)} style={{ borderColor: 'red' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.actions}>
          <Button text="Back to search for flights" onClick={onClose} style={{ backgroundColor: '#EA292C', color: 'white' }}/>
          <Button text="Confirm booking" onClick={handleConfirmBooking}/>
        </div>
      </div>
      {showPaymentModal && (
        <PaymentConfirmationModal
          totalAmount={totalAmount}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};
