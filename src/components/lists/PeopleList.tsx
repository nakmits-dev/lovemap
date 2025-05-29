import React, { useState } from 'react';
import { useRelationships } from '../../context/RelationshipContext';
import { Edit, Search, Plus } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import PersonForm from '../forms/PersonForm';
import RelationshipForm from '../forms/RelationshipForm';
import ProfileModal from '../ProfileModal';

const PeopleList: React.FC = () => {
  const { state: { people } } = useRelationships();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPerson, setEditingPerson] = useState<{ id: string; name: string; gender: 'male' | 'female'; profile?: string } | null>(null);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRelationship = (personId: string) => {
    setSelectedPersonId(personId);
    setIsAddingRelationship(true);
  };

  const handleEditPerson = (person: typeof people[0]) => {
    setEditingPerson(person);
  };

  const handleViewProfile = (personId: string) => {
    setSelectedProfileId(personId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">一覧</span>
          <span className="text-sm text-slate-500">({people.length})</span>
        </div>
        <button 
          onClick={() => setIsAddingPerson(true)} 
          className="p-1.5 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
          title="登場人物を追加"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="検索..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-slate-400" />
      </div>
      
      <div className="flex-1 overflow-y-auto -mx-4">
        {filteredPeople.length > 0 ? (
          <ul className="divide-y">
            {filteredPeople.map(person => (
              <li 
                key={person.id} 
                className="px-4 py-2 hover:bg-slate-50"
              >
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleViewProfile(person.id)}
                    className="flex items-center gap-2 text-slate-800"
                  >
                    <FontAwesomeIcon 
                      icon={person.gender === 'male' ? faMars : faVenus}
                      className={person.gender === 'male' ? 'text-blue-500' : 'text-pink-500'}
                    />
                    <span className="truncate">{person.name}</span>
                  </button>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleAddRelationship(person.id)}
                      className="p-1 hover:bg-slate-100 rounded-full"
                      title="関係を追加"
                    >
                      <Plus size={16} />
                    </button>
                    <button 
                      onClick={() => handleEditPerson(person)}
                      className="p-1 hover:bg-slate-100 rounded-full"
                      title="編集"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center text-slate-500">
            {searchTerm ? '該当する人物が見つかりません' : 'まだ人物が追加されていません'}
          </div>
        )}
      </div>
      
      {editingPerson && (
        <PersonForm 
          onClose={() => setEditingPerson(null)} 
          initialName={editingPerson.name}
          initialGender={editingPerson.gender}
          initialProfile={editingPerson.profile}
          personId={editingPerson.id}
        />
      )}

      {isAddingPerson && (
        <PersonForm onClose={() => setIsAddingPerson(false)} />
      )}

      {isAddingRelationship && (
        <RelationshipForm 
          onClose={() => {
            setIsAddingRelationship(false);
            setSelectedPersonId(null);
          }}
          initialSourceId={selectedPersonId}
        />
      )}

      {selectedProfileId && (
        <ProfileModal
          personId={selectedProfileId}
          onClose={() => setSelectedProfileId(null)}
        />
      )}
    </div>
  );
};

export default PeopleList;