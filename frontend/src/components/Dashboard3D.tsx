import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

interface SummaryResponse {
  summary: string;
  key_points: string[];
  terminology: { term: string; short_def: string }[];
}

interface ClauseItem {
  clause_id: string;
  clause_type: string;
  text: string;
  start_index: number;
  end_index: number;
  risk_score: number;
  reason: string;
}

export default function Dashboard3D({ summary, clauses }: { summary: SummaryResponse | null, clauses: ClauseItem[] }) {
  const ref = useRef<any>();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={ref} position={[0,0,0]}>
      <mesh position={[0,0,0]}>
        <boxGeometry args={[1.6, 0.1, 1.2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <Html position={[1.8, 0.6, 0]}>
        <div className="card">
          <h3>Summary</h3>
          <p style={{ maxWidth: 260 }}>{summary ? summary.summary : 'No summary yet'}</p>
        </div>
      </Html>

      <Html position={[-1.8,0.6,0]}>
        <div className="card">
          <h3>Risk Highlights</h3>
          <p>{clauses?.length ? `${clauses.length} clauses found` : 'No analysis yet'}</p>
        </div>
      </Html>

      <Html position={[0,-1.4,0]}>
        <div className="card">
          <h3>Comparison</h3>
          <p>Drag clauses here to compare</p>
        </div>
      </Html>
    </group>
  );
}
