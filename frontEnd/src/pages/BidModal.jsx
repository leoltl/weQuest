import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import Modal from '../components/Modal';
import ErrorAlert from '../components/ErrorAlert';
import BidModalList from '../components/BidList/BidModalList';

export default function BidModal({ showModal, setShowModal, request, updateRequestById }) {

  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // bids data - from server
  const [bids, setBids] = useState([]);

  const selectWinner = useCallback((bidId) => {
    setShowSpinner('Saving...');

    axios
      .put(`/api/requests/${request.id}`, { winningBidId: bidId })
      .then(data => {
        console.log('winning bid updated');
        setShowModal(false);
        // updateRequestById(requestId, { priceCent });
      })
      .catch(err => setErrorMessage(err.message))
      .finally(() => setShowSpinner(false));

  }, [request.id]);

  // load bid data
  useEffect(() => {
    if (showModal) {
      setShowSpinner(true);
      axios
        .get(`/api/requests/${request.id}/bids`)
        .then(({ data: bids }) => {
          setBids(bids);
        })
        .catch(err => setErrorMessage(err.message))
        .finally(() => setShowSpinner(false));
    }
  }, [showModal, request.id]);

  return (
    <Modal {...{ showModal, setShowModal, showSpinner, title: `Bids for ${request.title}` }}>
      {errorMessage && <ErrorAlert {...{ message: errorMessage, clear: () => setErrorMessage('') }} />}
      <BidModalList {...{
        selectWinner: request.requestStatus === 'active' ? selectWinner : undefined,
        winningBidId: request.requestStatus === 'closed' ? request.currentBidId : undefined,
        bids
      }} />
    </Modal>
  );
}
