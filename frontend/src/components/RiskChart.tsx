import React, { useMemo, useEffect, useState } from 'react';

interface ClauseItem {
  clause_id: string;
  clause_type: string;
  text: string;
  start_index: number;
  end_index: number;
  risk_score: number;
  reason: string;
}

function bucket(score: number) {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

export default function RiskChart({ clauses }: { clauses: ClauseItem[] }) {
  const [animatedHeights, setAnimatedHeights] = useState({ Low: 0, Medium: 0, High: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const { byBucket, maxCount, riskDistribution, totalClauses } = useMemo(() => {
    const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
    const distribution: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
    
    for (const c of clauses || []) {
      const bucketType = bucket(c.risk_score);
      counts[bucketType]++;
      distribution[bucketType] += c.risk_score;
    }
    
    const max = Math.max(1, ...Object.values(counts));
    const total = clauses?.length || 0;
    
    // Calculate average risk scores
    Object.keys(distribution).forEach(key => {
      distribution[key] = counts[key] > 0 ? distribution[key] / counts[key] : 0;
    });
    
    return { byBucket: counts, maxCount: max, riskDistribution: distribution, totalClauses: total };
  }, [clauses]);

  // Animate bars when data changes
  useEffect(() => {
    if (clauses && clauses.length > 0) {
      setIsAnimating(true);
      const targetHeights = {
        Low: (byBucket.Low / maxCount) * 200 + 20,
        Medium: (byBucket.Medium / maxCount) * 200 + 20,
        High: (byBucket.High / maxCount) * 200 + 20
      };
      
      setAnimatedHeights(targetHeights);
      
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [byBucket, maxCount, clauses]);

  const colors: Record<string, string> = {
    Low: 'linear-gradient(135deg, #4ade80, #22c55e, #16a34a)',
    Medium: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
    High: 'linear-gradient(135deg, #f87171, #ef4444, #dc2626)'
  };

  const glowColors: Record<string, string> = {
    Low: 'rgba(34, 197, 94, 0.3)',
    Medium: 'rgba(245, 158, 11, 0.3)',
    High: 'rgba(239, 68, 68, 0.3)'
  };

  const icons: Record<string, string> = {
    Low: '🟢',
    Medium: '🟡',
    High: '🔴'
  };

  return (
    <div className="panel risk-chart-panel">
      <div className="panel-head">
        <h3 className="panel-title">Risk Analysis Dashboard</h3>
        <div className="risk-summary">
          <span className="total-clauses">{totalClauses} Clauses</span>
        </div>
      </div>
      
      {clauses && clauses.length ? (
        <div className="advanced-chart-container">
          {/* 3D Animated Bars */}
          <div className="chart-3d">
            {(['Low', 'Medium', 'High'] as const).map((k, index) => {
              const height = animatedHeights[k];
              const percentage = totalClauses > 0 ? Math.round((byBucket[k] / totalClauses) * 100) : 0;
              const avgRisk = Math.round(riskDistribution[k]);
              
              return (
                <div key={k} className="bar-col-3d" style={{ animationDelay: `${index * 200}ms` }}>
                  <div className="bar-container">
                    <div 
                      className={`bar-3d ${isAnimating ? 'animating' : ''}`}
                      style={{ 
                        height: `${height}px`,
                        background: colors[k],
                        boxShadow: `0 0 20px ${glowColors[k]}, inset 0 2px 4px rgba(255,255,255,0.2)`
                      }}
                    >
                      <div className="bar-inner-glow"></div>
                      <div className="bar-particles">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="particle" style={{ animationDelay: `${i * 0.5}s` }}></div>
                        ))}
                      </div>
                    </div>
                    <div className="bar-base"></div>
                  </div>
                  
                  <div className="bar-info">
                    <div className="risk-icon">{icons[k]}</div>
                    <div className="bar-label-3d">{k} Risk</div>
                    <div className="bar-count-3d">{byBucket[k]}</div>
                    <div className="bar-percentage">{percentage}%</div>
                    <div className="avg-risk">Avg: {avgRisk}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk Distribution Pie Chart */}
          <div className="pie-chart-container">
            <div className="pie-chart">
              <svg width="120" height="120" viewBox="0 0 120 120" className="pie-svg">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="20"
                  strokeDasharray={`${(byBucket.Low / totalClauses) * 314} 314`}
                  strokeDashoffset="0"
                  className="pie-segment low"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="20"
                  strokeDasharray={`${(byBucket.Medium / totalClauses) * 314} 314`}
                  strokeDashoffset={`-${(byBucket.Low / totalClauses) * 314}`}
                  className="pie-segment medium"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray={`${(byBucket.High / totalClauses) * 314} 314`}
                  strokeDashoffset={`-${((byBucket.Low + byBucket.Medium) / totalClauses) * 314}`}
                  className="pie-segment high"
                />
              </svg>
              <div className="pie-center">
                <div className="pie-center-text">
                  <div className="total-number">{totalClauses}</div>
                  <div className="total-label">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Level Indicators */}
          <div className="risk-indicators">
            {(['Low', 'Medium', 'High'] as const).map((k) => (
              <div key={k} className="risk-indicator">
                <div className="indicator-dot" style={{ background: colors[k] }}></div>
                <span className="indicator-label">{k}: {byBucket[k]} clauses</span>
                <span className="indicator-percentage">
                  ({totalClauses > 0 ? Math.round((byBucket[k] / totalClauses) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="placeholder-enhanced">
          <div className="placeholder-icon">📊</div>
          <div className="placeholder-text">No analysis yet</div>
          <div className="placeholder-subtext">Click "Analyze Clauses" to see risk breakdown</div>
        </div>
      )}
    </div>
  );
}
