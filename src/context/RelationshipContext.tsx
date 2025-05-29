import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Person, 
  Relationship, 
  RelationshipState, 
  RelationshipContextType
} from '../types';
import {
  addPersonToFirebase,
  updatePersonInFirebase,
  deletePersonFromFirebase,
  addRelationshipToFirebase,
  updateRelationshipInFirebase,
  deleteRelationshipFromFirebase,
  subscribeToData
} from '../firebase/services';

const initialState: RelationshipState = {
  people: [],
  relationships: []
};

const RelationshipContext = createContext<RelationshipContextType | undefined>(undefined);

export const useRelationships = (): RelationshipContextType => {
  const context = useContext(RelationshipContext);
  if (!context) {
    throw new Error('useRelationships must be used within a RelationshipProvider');
  }
  return context;
};

export const RelationshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<RelationshipState>(initialState);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToData(
      (people) => setState(prev => ({ ...prev, people })),
      (relationships) => setState(prev => ({ ...prev, relationships }))
    );

    return () => unsubscribe();
  }, []);

  const addPerson = async (name: string, gender: Person['gender'], profile?: string) => {
    try {
      await addPersonToFirebase({ name, gender, profile });
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  const updatePerson = async (id: string, name: string, gender: Person['gender'], profile?: string) => {
    try {
      await updatePersonInFirebase(id, { name, gender, profile });
    } catch (error) {
      console.error('Error updating person:', error);
    }
  };

  const removePerson = async (id: string) => {
    try {
      await deletePersonFromFirebase(id);
    } catch (error) {
      console.error('Error removing person:', error);
    }
  };

  const addRelationship = async (source: string, target: string, relation: string) => {
    try {
      await addRelationshipToFirebase({ source, target, relation });
    } catch (error) {
      console.error('Error adding relationship:', error);
    }
  };

  const updateRelationship = async (id: string, data: Partial<Relationship>) => {
    try {
      await updateRelationshipInFirebase(id, data);
    } catch (error) {
      console.error('Error updating relationship:', error);
    }
  };

  const removeRelationship = async (id: string) => {
    try {
      await deleteRelationshipFromFirebase(id);
      if (selectedRelationship?.id === id) {
        setSelectedRelationship(null);
      }
    } catch (error) {
      console.error('Error removing relationship:', error);
    }
  };

  const saveNetwork = () => {
    // Firebase を使用する場合、ローカルストレージへの保存は不要
    console.warn('saveNetwork is deprecated when using Firebase');
  };

  const loadNetwork = (data: RelationshipState) => {
    // Firebase を使用する場合、手動でのデータロードは不要
    console.warn('loadNetwork is deprecated when using Firebase');
  };

  return (
    <RelationshipContext.Provider
      value={{
        state,
        addPerson,
        updatePerson,
        removePerson,
        addRelationship,
        updateRelationship,
        removeRelationship,
        selectedRelationship,
        setSelectedRelationship,
        saveNetwork,
        loadNetwork
      }}
    >
      {children}
    </RelationshipContext.Provider>
  );
};