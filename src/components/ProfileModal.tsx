import React from 'react';
import { useRelationships } from '../context/RelationshipContext';
import { X, Edit } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import PersonForm from './forms/PersonForm';

interface ProfileModalProps {
  personId: string;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ personId, onClose }) => {
  const { state: { people } } = useRelationships();
  const [isEditing, setIsEditing] = React.useState(false);

  const person = people.find(p => p.id === personId);
  if (!person) return null;

  if (isEditing) {
    return (
      <PersonForm
        onClose={() => setIsEditing(false)}
        initialName={person.name}
        initialGender={person.gender}
        initialProfile={person.profile}
        personId={person.id}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg mx-4 rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800">プロフィール</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-slate-100 rounded-full text-blue-600"
                title="編集"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-slate-500 mb-1">なまえ</div>
            <div className="text-lg font-medium text-slate-800">{person.name}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-slate-500 mb-1">性別</div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              person.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'
            } text-white`}>
              <FontAwesomeIcon icon={person.gender === 'male' ? faMars : faVenus} />
              <span>{person.gender === 'male' ? '男性' : '女性'}</span>
            </div>
          </div>

          {person.profile && (
            <div>
              <div className="text-sm text-slate-500 mb-1">プロフィール</div>
              <div className="bg-slate-50 p-4 rounded-lg text-slate-800 whitespace-pre-wrap">
                {person.profile}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;