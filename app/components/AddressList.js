'use client';
import EmptyState from './EmptyState';
import AddressCard from './AddressCard';

export default function AddressList({
  addresses,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onSetDefaultClick
}) {
  return (
    <div className="space-y-6">
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address._id || address.id}  // Use a proper unique identifier
              address={address}
              onEdit={onEditClick}
              onDelete={onDeleteClick}
              onSetDefault={onSetDefaultClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState onAddClick={onAddClick} />
      )}
    </div>
  );
}