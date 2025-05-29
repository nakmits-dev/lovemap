export interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female';
  profile?: string;
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  relation: string;
}

export interface RelationshipState {
  people: Person[];
  relationships: Relationship[];
}

export interface RelationshipContextType {
  state: RelationshipState;
  addPerson: (name: string, gender: Person['gender'], profile?: string) => void;
  updatePerson: (id: string, name: string, gender: Person['gender'], profile?: string) => void;
  removePerson: (id: string) => void;
  addRelationship: (source: string, target: string, relation: string) => void;
  updateRelationship: (id: string, data: Partial<Relationship>) => void;
  removeRelationship: (id: string) => void;
  selectedRelationship: Relationship | null;
  setSelectedRelationship: (relationship: Relationship | null) => void;
  saveNetwork: () => void;
  loadNetwork: (data: RelationshipState) => void;
}