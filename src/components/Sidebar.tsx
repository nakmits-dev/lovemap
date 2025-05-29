import React, { useState } from 'react';
import { useRelationships } from '../context/RelationshipContext';
import { X, Share2 } from 'lucide-react';
import RelationshipForm from './forms/RelationshipForm';
import PeopleList from './lists/PeopleList';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onShare }) => {
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed md:hidden inset-0 bg-black bg-opacity-30 z-20"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-full md:w-80 
        border-r border-slate-200 flex flex-col h-full bg-white 
        transition-transform duration-300 z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex-1 p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <button
              onClick={onShare}
              className="p-2 hover:bg-slate-100 rounded"
              title="共有"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded"
            >
              <X size={18} />
            </button>
          </div>
          <PeopleList />
        </div>

        {isAddingRelationship && (
          <RelationshipForm onClose={() => setIsAddingRelationship(false)} />
        )}
      </aside>
    </>
  );
};

export default Sidebar;