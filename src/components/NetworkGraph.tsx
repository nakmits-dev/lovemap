import React, { useEffect, useRef, useState } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import { useRelationships } from '../context/RelationshipContext';
import RelationshipDetail from './RelationshipDetail';
import ProfileModal from './ProfileModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

const NetworkGraph: React.FC = () => {
  const { 
    state: { people, relationships },
    setSelectedRelationship
  } = useRelationships();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<any>(null);
  const graphRef = useRef<any>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [showMaleToFemale, setShowMaleToFemale] = useState(true);
  const [showProfile, setShowProfile] = useState<string | null>(null);

  const resetView = () => {
    setSelectedPerson(null);
    setShowProfile(null);
    setSelectedRelationship(null);
    
    if (sigmaRef.current) {
      sigmaRef.current.getCamera().animate({
        x: 0,
        y: 0,
        ratio: window.innerWidth < 768 ? 0.8 : 0.5,
        angle: 0
      }, {
        duration: 600
      });
    }
  };

  const handleToggleGender = (value: boolean) => {
    setShowMaleToFemale(value);
    resetView();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const getNodeColor = (gender: string) => {
    return gender === 'male' ? '#60a5fa' : '#f472b6';
  };

  const getNodeSize = (personId: string) => {
    const targetCount = relationships.filter(rel => rel.target === personId).length;
    const baseSize = window.innerWidth < 768 ? 6 : 8;
    return Math.max(baseSize, baseSize + (targetCount * 2));
  };

  const calculateNodePositions = () => {
    const positions: { id: string; x: number; y: number }[] = [];
    const radius = Math.min(
      window.innerWidth < 768 ? window.innerWidth * 0.4 : window.innerWidth * 0.35,
      window.innerHeight * 0.35
    );
    
    const males = people.filter(p => p.gender === 'male');
    const females = people.filter(p => p.gender === 'female');
    
    const maxCount = Math.max(males.length, females.length);
    const angleStep = (2 * Math.PI) / (maxCount * 2);

    for (let i = 0; i < maxCount; i++) {
      if (i < males.length) {
        const angle = i * 2 * angleStep;
        positions.push({
          id: males[i].id,
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)
        });
      }
      
      if (i < females.length) {
        const angle = (i * 2 + 1) * angleStep;
        positions.push({
          id: females[i].id,
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)
        });
      }
    }

    return positions;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (sigmaRef.current) {
      sigmaRef.current.kill();
      sigmaRef.current = null;
    }

    const graph = new Graph();
    graphRef.current = graph;

    const positions = calculateNodePositions();

    people.forEach(person => {
      const position = positions.find(p => p.id === person.id);
      if (position) {
        graph.addNode(person.id, {
          x: position.x,
          y: position.y,
          label: person.name,
          size: getNodeSize(person.id),
          color: getNodeColor(person.gender),
          type: 'circle'
        });
      }
    });

    relationships.forEach(rel => {
      if (graph.hasNode(rel.source) && graph.hasNode(rel.target)) {
        const sourcePerson = people.find(p => p.id === rel.source);
        const targetPerson = people.find(p => p.id === rel.target);
        
        if (sourcePerson && targetPerson) {
          const isValidRelation = showMaleToFemale 
            ? sourcePerson.gender === 'male' && targetPerson.gender === 'female'
            : sourcePerson.gender === 'female' && targetPerson.gender === 'male';

          if (isValidRelation && !graph.hasEdge(rel.source, rel.target)) {
            graph.addEdge(rel.source, rel.target, {
              size: window.innerWidth < 768 ? 1 : 2,
              label: rel.relation,
              type: 'arrow',
              color: sourcePerson.gender === 'male' ? '#3b82f6' : '#ec4899',
              forceLabel: true,
              hidden: false,
              relationId: rel.id
            });
          }
        }
      }
    });

    const initialRatio = window.innerWidth < 768 ? 0.8 : 0.5;

    sigmaRef.current = new Sigma(graph, containerRef.current, {
      minCameraRatio: 0.2,
      maxCameraRatio: 5,
      defaultCameraRatio: initialRatio,
      initialCameraState: { 
        x: 0,
        y: 0,
        ratio: initialRatio,
        angle: 0
      },
      labelFont: '"Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", sans-serif',
      labelSize: window.innerWidth < 768 ? 12 : 14,
      labelWeight: '500',
      defaultEdgeType: 'arrow',
      defaultEdgeColor: '#94a3b8',
      edgeLabelSize: window.innerWidth < 768 ? 10 : 12,
      renderEdgeLabels: true,
      labelColor: {
        color: '#1e293b'
      },
      nodeReducer: (node, data) => {
        const person = people.find(p => p.id === node);
        const isHighlighted = selectedPerson === node;
        const isConnected = selectedPerson && graph.neighbors(selectedPerson).includes(node);
        const baseSize = getNodeSize(node);

        return {
          ...data,
          size: isHighlighted ? baseSize * 1.5 : isConnected ? baseSize * 1.3 : baseSize,
          color: getNodeColor(person?.gender || 'male'),
          label: person?.name || '',
          type: 'circle',
          shadowColor: isHighlighted ? '#3b82f6' : isConnected ? '#60a5fa' : '#e2e8f0',
          shadowSize: isHighlighted ? 16 : isConnected ? 14 : 12,
          shadowBlur: isHighlighted ? 10 : isConnected ? 8 : 6,
          zIndex: isHighlighted ? 2 : isConnected ? 1 : 0
        };
      },
      edgeReducer: (edge, data) => {
        const sourcePerson = people.find(p => p.id === graph.source(edge));
        const relationship = relationships.find(r => r.id === data.relationId);
        const isHighlighted = selectedPerson && 
          (graph.source(edge) === selectedPerson || graph.target(edge) === selectedPerson);

        return {
          ...data,
          size: isHighlighted ? (window.innerWidth < 768 ? 2 : 3) : (window.innerWidth < 768 ? 1 : 2),
          color: sourcePerson?.gender === 'male' ? '#3b82f6' : '#ec4899',
          label: isHighlighted ? relationship?.relation || '' : '',
          labelSize: window.innerWidth < 768 ? 10 : 12,
          labelColor: sourcePerson?.gender === 'male' ? '#2563eb' : '#db2777',
          forceLabel: true,
          hidden: selectedPerson && !isHighlighted,
          zIndex: isHighlighted ? 1 : 0
        };
      }
    });

    const handleNodeClick = (e: any) => {
      if (selectedPerson === e.node) {
        setShowProfile(e.node);
        setSelectedPerson(null);
      } else {
        setSelectedPerson(prev => prev === e.node ? null : e.node);
      }
    };

    const handleClickEdge = (e: any) => {
      const relationship = relationships.find(rel => rel.id === graph.getEdgeAttribute(e.edge, 'relationId'));
      if (relationship) {
        setSelectedRelationship(relationship);
      }
    };

    const handleStageClick = (e: any) => {
      if (!e.node && !e.edge) {
        setSelectedPerson(null);
      }
    };

    sigmaRef.current.on('clickNode', handleNodeClick);
    sigmaRef.current.on('clickEdge', handleClickEdge);
    sigmaRef.current.on('clickStage', handleStageClick);

    const handleResize = () => {
      if (sigmaRef.current) {
        sigmaRef.current.refresh();
        resetView();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (sigmaRef.current) {
        sigmaRef.current.removeListener('clickNode', handleNodeClick);
        sigmaRef.current.removeListener('clickEdge', handleClickEdge);
        sigmaRef.current.removeListener('clickStage', handleStageClick);
        sigmaRef.current.kill();
        sigmaRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [people, relationships, setSelectedRelationship, showMaleToFemale, selectedPerson]);

  // データ変更時にビューをリセット
  useEffect(() => {
    resetView();
  }, [people.length, relationships.length]);

  return (
    <div className="flex flex-col flex-grow relative bg-slate-50">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => handleToggleGender(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            showMaleToFemale
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FontAwesomeIcon icon={faMars} />
          男子
        </button>
        <button
          onClick={() => handleToggleGender(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            !showMaleToFemale
              ? 'bg-pink-500 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FontAwesomeIcon icon={faVenus} />
          女子
        </button>
      </div>
      <div 
        ref={containerRef} 
        className="w-full h-full touch-manipulation"
      />
      <RelationshipDetail />
      {showProfile && (
        <ProfileModal
          personId={showProfile}
          onClose={() => setShowProfile(null)}
        />
      )}
    </div>
  );
};

export default NetworkGraph;