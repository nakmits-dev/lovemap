import React, { useState } from 'react';
import { useRelationships } from '../../context/RelationshipContext';
import { X, ArrowRight, Check } from 'lucide-react';

interface RelationshipFormProps {
  onClose: () => void;
  initialSourceId?: string | null;
  initialData?: {
    sourceId: string;
    targetId: string;
    relation: string;
    relationshipId: string;
  };
}

const RelationshipForm: React.FC<RelationshipFormProps> = ({ 
  onClose,
  initialSourceId,
  initialData
}) => {
  const { 
    state: { people, relationships }, 
    addRelationship,
    updateRelationship
  } = useRelationships();

  const [sourceId, setSourceId] = useState(initialSourceId || initialData?.sourceId || '');
  const [targetId, setTargetId] = useState(initialData?.targetId || '');
  const [relation, setRelation] = useState(initialData?.relation || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sourceId && targetId && relation.trim()) {
      if (initialData?.relationshipId) {
        updateRelationship(initialData.relationshipId, {
          source: sourceId,
          target: targetId,
          relation: relation.trim()
        });
        onClose();
      } else {
        addRelationship(sourceId, targetId, relation.trim());
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        setTargetId('');
        setRelation('');
      }
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSourceId = e.target.value;
    setSourceId(newSourceId);
    setTargetId('');
    setRelation('');
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTargetId = e.target.value;
    setTargetId(newTargetId);
    
    if (sourceId) {
      const existing = relationships.find(
        rel => rel.source === sourceId && rel.target === newTargetId
      );
      
      if (existing && !initialData) {
        setRelation(existing.relation);
      } else {
        setRelation('');
      }
    }
  };

  const sourcePerson = sourceId ? people.find(p => p.id === sourceId) : null;
  const targetPeople = people.filter(p => 
    p.gender !== sourcePerson?.gender && p.id !== sourceId
  );

  const isFormValid = sourceId && targetId && sourceId !== targetId && relation.trim();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg mx-4 rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800">関係を追加</h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          {showSuccess && (
            <div className="mb-6 p-2 bg-green-50 text-green-800 rounded-lg flex items-center gap-2">
              <Check size={16} />
              <span className="text-sm">追加しました</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1">
                <label htmlFor="source" className="block text-sm font-medium mb-2 text-slate-700">
                  From
                </label>
                <select
                  id="source"
                  value={sourceId}
                  onChange={handleSourceChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                >
                  <option value="">選択してください</option>
                  {people.map(person => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <ArrowRight className="mt-8 text-slate-400" size={20} />
              
              <div className="flex-1">
                <label htmlFor="target" className="block text-sm font-medium mb-2 text-slate-700">
                  To
                </label>
                <select
                  id="target"
                  value={targetId}
                  onChange={handleTargetChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                  disabled={!sourceId}
                >
                  <option value="">選択してください</option>
                  {targetPeople.map(person => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="relation" className="block text-sm font-medium mb-2 text-slate-700">
                関係
              </label>
              <input
                id="relation"
                type="text"
                value={relation}
                onChange={e => setRelation(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="関係を入力"
                required
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isFormValid 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {initialData ? '更新' : '追加'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RelationshipForm;