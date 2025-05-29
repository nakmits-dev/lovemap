import React, { useState } from 'react';
import { useRelationships } from '../../context/RelationshipContext';
import { X } from 'lucide-react';
import { Person } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

interface PersonFormProps {
  onClose: () => void;
  initialName?: string;
  initialGender?: Person['gender'];
  initialProfile?: string;
  personId?: string;
}

const PersonForm: React.FC<PersonFormProps> = ({ 
  onClose, 
  initialName = '', 
  initialGender = 'male',
  initialProfile = '',
  personId 
}) => {
  const [name, setName] = useState(initialName);
  const [gender, setGender] = useState<Person['gender']>(initialGender);
  const [profile, setProfile] = useState(initialProfile);
  const [nameError, setNameError] = useState('');
  const { addPerson, removePerson, updatePerson } = useRelationships();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isHiragana = /^[ぁ-んー]*$/.test(value);
    
    if (!isHiragana && value !== '') {
      setNameError('ひらがなで入力してください');
    } else {
      setNameError('');
    }
    
    setName(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && !nameError) {
      if (personId) {
        updatePerson(personId, name.trim(), gender, profile.trim());
      } else {
        addPerson(name.trim(), gender, profile.trim());
      }
      onClose();
    }
  };

  const handleDelete = () => {
    if (personId && window.confirm('本当に削除しますか？この登場人物に関連する全ての関係も削除されます。')) {
      removePerson(personId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg mx-4 rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-800">
              {personId ? '登場人物を編集' : '登場人物を追加'}
            </h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="personName" className="block text-sm font-medium mb-2 text-slate-700">
                なまえ
              </label>
              <input
                id="personName"
                type="text"
                value={name}
                onChange={handleNameChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                  nameError ? 'border-red-500' : ''
                }`}
                required
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-500">{nameError}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-slate-700">
                性別
              </label>
              <div className="flex gap-4">
                {personId ? (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    gender === 'male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'
                  }`}>
                    <FontAwesomeIcon icon={gender === 'male' ? faMars : faVenus} />
                    <span>{gender === 'male' ? '男性' : '女性'}</span>
                  </div>
                ) : (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={e => setGender(e.target.value as Person['gender'])}
                        className="sr-only"
                      />
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        gender === 'male' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}>
                        <FontAwesomeIcon icon={faMars} />
                        <span>男性</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={e => setGender(e.target.value as Person['gender'])}
                        className="sr-only"
                      />
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        gender === 'female' 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}>
                        <FontAwesomeIcon icon={faVenus} />
                        <span>女性</span>
                      </div>
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="profile" className="block text-sm font-medium mb-2 text-slate-700">
                プロフィール
              </label>
              <textarea
                id="profile"
                value={profile}
                onChange={e => setProfile(e.target.value.slice(0, 200))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 min-h-[100px]"
                maxLength={200}
              />
              <div className="text-right text-sm text-slate-500 mt-1">
                {profile.length}/200
              </div>
            </div>
            
            <div className="flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors whitespace-nowrap"
              >
                キャンセル
              </button>
              {personId && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  削除
                </button>
              )}
              <button
                type="submit"
                disabled={!!nameError}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  nameError
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                {personId ? '更新' : '追加'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonForm;