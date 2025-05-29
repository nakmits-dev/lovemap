import { 
  collection, 
  doc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  where,
  writeBatch,
  DocumentData,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';
import { Person, Relationship } from '../types';

// データ型の検証
const validatePerson = (data: DocumentData): data is Person => {
  return (
    typeof data.name === 'string' &&
    (data.gender === 'male' || data.gender === 'female') &&
    (data.profile === undefined || typeof data.profile === 'string')
  );
};

const validateRelationship = (data: DocumentData): data is Relationship => {
  return (
    typeof data.source === 'string' &&
    typeof data.target === 'string' &&
    typeof data.relation === 'string'
  );
};

// People Collection
export const addPersonToFirebase = async (person: Omit<Person, 'id'>) => {
  if (!validatePerson({ ...person, id: '' })) {
    throw new Error('Invalid person data');
  }
  const docRef = await addDoc(collection(db, 'people'), person);
  return { ...person, id: docRef.id };
};

export const updatePersonInFirebase = async (id: string, data: Partial<Person>) => {
  const docRef = doc(db, 'people', id);
  await updateDoc(docRef, data);
};

export const deletePersonFromFirebase = async (id: string) => {
  const batch = writeBatch(db);
  
  // 人物の削除
  const personRef = doc(db, 'people', id);
  batch.delete(personRef);
  
  // 関連する関係性の取得と削除
  const relationshipsQuery = query(
    collection(db, 'relationships'),
    where('source', '==', id)
  );
  const targetRelationshipsQuery = query(
    collection(db, 'relationships'),
    where('target', '==', id)
  );
  
  const [sourceSnap, targetSnap] = await Promise.all([
    getDocs(relationshipsQuery),
    getDocs(targetRelationshipsQuery)
  ]);
  
  sourceSnap.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  targetSnap.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  // バッチ処理の実行
  await batch.commit();
};

// Relationships Collection
export const addRelationshipToFirebase = async (relationship: Omit<Relationship, 'id'>) => {
  if (!validateRelationship({ ...relationship, id: '' })) {
    throw new Error('Invalid relationship data');
  }
  const docRef = await addDoc(collection(db, 'relationships'), relationship);
  return { ...relationship, id: docRef.id };
};

export const updateRelationshipInFirebase = async (id: string, data: Partial<Relationship>) => {
  const docRef = doc(db, 'relationships', id);
  await updateDoc(docRef, data);
};

export const deleteRelationshipFromFirebase = async (id: string) => {
  const docRef = doc(db, 'relationships', id);
  await deleteDoc(docRef);
};

// Real-time subscription
export const subscribeToData = (
  onPeopleUpdate: (people: Person[]) => void,
  onRelationshipsUpdate: (relationships: Relationship[]) => void
) => {
  // Subscribe to people collection
  const peopleUnsubscribe = onSnapshot(collection(db, 'people'), (snapshot) => {
    const people = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Person[];
    onPeopleUpdate(people);
  });

  // Subscribe to relationships collection
  const relationshipsUnsubscribe = onSnapshot(collection(db, 'relationships'), (snapshot) => {
    const relationships = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Relationship[];
    onRelationshipsUpdate(relationships);
  });

  // Return unsubscribe function
  return () => {
    peopleUnsubscribe();
    relationshipsUnsubscribe();
  };
};