import React from 'react';
import { useRelationships } from '../context/RelationshipContext';
import { X, Edit, Trash } from 'lucide-react';
import RelationshipForm from './forms/RelationshipForm';

const RelationshipDetail: React.FC = () => {
  const { 
    selectedRelationship, 
    setSelectedRelationship,
    removeRelationship,
    state: { people }
  } = useRelationships();
  
  const [isEditing, setIsEditing] = React.useState(false);

  if (!selectedRelationship) return null;

  const person1 = people.find(p => p.id === selectedRelationship.source);
  const person2 = people.find(p => p.id === selectedRelationship.target);

  if (!person1 || !person2) return null;

  const handleDelete = () => {
    if (window.confirm('この関係を削除してもよろしいですか？')) {
      removeRelationship(selectedRelationship.id);
    }
  };

  if (isEditing) {
    return (
      <RelationshipForm 
        onClose={() => setIsEditing(false)} 
        initialData={{
          sourceId: selectedRelationship.source,
          targetId: selectedRelationship.target,
          relation: selectedRelationship.relation,
          relationshipId: selectedRelationship.id
        }}
      />
    );
  }

  return (
    <div className="absolute bottom-4 right-4 w-80 bg-white rounded shadow-lg p-4 z-10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-slate-800">関係の詳細</h3>
        <div className="flex space-x-1">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-slate-100 rounded-full text-blue-600"
            title="編集"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1 hover:bg-slate-100 rounded-full text-red-600"
            title="削除"
          >
            <Trash size={18} />
          </button>
          <button 
            onClick={() => setSelectedRelationship(null)}
            className="p-1 hover:bg-slate-100 rounded-full"
            title="閉じる"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="text-sm text-slate-500">関係者</div>
        <div className="font-medium text-slate-800">
          {person1.name} と {person2.name}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="text-sm text-slate-500">関係</div>
        <div className="p-2 bg-slate-50 text-slate-800 rounded">
          {selectedRelationship.relation}
        </div>
      </div>
    </div>
  );
};

export default RelationshipDetail;