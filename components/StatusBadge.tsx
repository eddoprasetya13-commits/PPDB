import React from 'react';
import { StatusPeserta } from '../types';

const StatusBadge: React.FC<{ status: StatusPeserta }> = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800';

  switch (status) {
    case StatusPeserta.DRAFT:
      colorClass = 'bg-gray-200 text-gray-700';
      break;
    case StatusPeserta.SUBMITTED:
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case StatusPeserta.PERBAIKAN:
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case StatusPeserta.DITERIMA:
      colorClass = 'bg-green-100 text-green-800';
      break;
    case StatusPeserta.DITOLAK:
      colorClass = 'bg-red-100 text-red-800';
      break;
  }

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
