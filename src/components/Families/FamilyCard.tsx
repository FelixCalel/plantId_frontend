import React from 'react';
import type { Familia } from '../../models/types';


interface Props {
  familia: Familia;
}

const FamilyCard: React.FC<Props> = ({ familia }) => (
  <div className="family-card p-4 bg-white rounded-lg shadow">
    <h2 className="text-lg font-semibold">{familia.nombre}</h2>
    {familia.descripcion && <p className="text-gray-600 mt-1">{familia.descripcion}</p>}
  </div>
);

export default FamilyCard;