import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import { initialPapers, sessions, initialAllocations, teamChiefs, defaultExaminers } from './data';

function App() {
  const [allocations, setAllocations] = useState(() => {
    const saved = localStorage.getItem('valuation_allocations_camp2_v5');
    return saved ? JSON.parse(saved) : initialAllocations;
  });
  const [examiners, setExaminers] = useState(() => {
    const saved = localStorage.getItem('valuation_examiners_camp2_v5');
    return saved ? JSON.parse(saved) : defaultExaminers;
  });
  const [papers, setPapers] = useState(() => {
    const saved = localStorage.getItem('valuation_papers_camp2_v5');
    return saved ? JSON.parse(saved) : initialPapers;
  });
  const [sessionsList, setSessionsList] = useState(() => {
    const saved = localStorage.getItem('valuation_sessions_camp2_v5');
    return saved ? JSON.parse(saved) : sessions;
  });
  const [chiefs, setChiefs] = useState(() => {
    const saved = localStorage.getItem('valuation_chiefs_camp2_v5');
    return saved ? JSON.parse(saved) : teamChiefs;
  });
  const [fileHandle, setFileHandle] = useState(null);

  // Auto-save to localStorage seamlessly on every change
  useEffect(() => {
    localStorage.setItem('valuation_allocations_camp2_v5', JSON.stringify(allocations));
    localStorage.setItem('valuation_examiners_camp2_v5', JSON.stringify(examiners));
    localStorage.setItem('valuation_papers_camp2_v5', JSON.stringify(papers));
    localStorage.setItem('valuation_sessions_camp2_v5', JSON.stringify(sessionsList));
    localStorage.setItem('valuation_chiefs_camp2_v5', JSON.stringify(chiefs));
  }, [allocations, examiners, papers, sessionsList, chiefs]);

  // Auto-save when state changes and file is connected
  useEffect(() => {
    if (fileHandle) {
      const saveData = async () => {
        try {
          const writable = await fileHandle.createWritable();
          await writable.write(JSON.stringify({ allocations, examiners, papers, sessionsList, chiefs }, null, 2));
          await writable.close();
        } catch (e) {
          console.error("Auto-save failed", e);
        }
      };
      saveData();
    }
  }, [allocations, examiners, papers, sessionsList, chiefs, fileHandle]);

  const loadFromFile = async () => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
      });
      const file = await handle.getFile();
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.allocations && data.examiners) {
        setAllocations(data.allocations);
        setExaminers(data.examiners);
        if (data.papers) setPapers(data.papers);
        if (data.sessionsList) setSessionsList(data.sessionsList);
        if (data.chiefs) setChiefs(data.chiefs);
        setFileHandle(handle);
        alert("Data loaded successfully! Auto-saving is now active.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveAsNewFile = async () => {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'valuation_data.json',
        types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify({ allocations, examiners, papers, sessionsList, chiefs }, null, 2));
      await writable.close();
      setFileHandle(handle);
      alert("File created! Auto-saving is now active to this file.");
    } catch (e) {
      console.error(e);
    }
  };

  // Compute calculated allocations with False Numbers
  const { computedAllocations, paperStats } = useMemo(() => {
    // Clone papers to track current false numbers and remaining counts
    const trackers = {};
    Object.keys(papers).forEach(key => {
      trackers[key] = {
        current: papers[key].start,
        remaining: papers[key].count,
        used: 0
      };
    });

    let serialCounter = 1;

    const sessionOrder = sessionsList.reduce((acc, s, i) => ({ ...acc, [s]: i }), {});
    const examinerOrder = {};
    Object.keys(examiners).forEach(team => {
      examinerOrder[team] = examiners[team].reduce((acc, ex, i) => ({ ...acc, [ex]: i }), {});
    });

    const sortedAllocations = [...allocations].sort((a, b) => {
      if (sessionOrder[a.session] !== sessionOrder[b.session]) {
        return sessionOrder[a.session] - sessionOrder[b.session];
      }
      if (a.team !== b.team) {
        return a.team.localeCompare(b.team);
      }
      return examinerOrder[a.team][a.examiner] - examinerOrder[b.team][b.examiner];
    });

    const computed = sortedAllocations.map(alloc => {
      const pKey = alloc.paper;
      const count = parseInt(alloc.count, 10) || 0;
      
      let start = null;
      let end = null;
      let serial = null;
      
      if (count > 0) {
        start = trackers[pKey].current;
        end = start + count - 1;
        serial = serialCounter++;
        trackers[pKey].current += count;
        trackers[pKey].remaining -= count;
        trackers[pKey].used += count;
      }
      
      return { ...alloc, start, end, serial, actualCount: count };
    });
    
    return { computedAllocations: computed, paperStats: trackers };
  }, [allocations, examiners, papers, sessionsList]);

  const updateCount = (id, newCount) => {
    setAllocations(prev => prev.map(a => a.id === id ? { ...a, count: newCount } : a));
  };

  const swapExaminers = (team, ex1, ex2) => {
    if (!ex1 || !ex2 || ex1 === ex2) return;
    
    // Swap the names in the examiners list to change UI row order
    setExaminers(prev => ({
        ...prev,
        [team]: prev[team].map(e => e === ex1 ? ex2 : e === ex2 ? ex1 : e)
    }));

    // Swap the names attached to the allocations so the new row inherits the exact same scripts
    setAllocations(prev => prev.map(a => {
      if (a.team !== team) return a;
      if (a.examiner === ex1) return { ...a, examiner: ex2 };
      if (a.examiner === ex2) return { ...a, examiner: ex1 };
      return a;
    }));
  };

  const params = new URLSearchParams(window.location.search);
  const printMode = params.get('print');

  const handlePrintOverview = () => {
    window.open(window.location.pathname + '?print=overview', '_blank');
  };

  const handlePrintDaily = () => {
    window.open(window.location.pathname + '?print=daily', '_blank');
  };

  const handlePrintRosters = () => {
    window.open(window.location.pathname + '?print=rosters', '_blank');
  };

  const handlePrintSlips = () => {
    window.open(window.location.pathname + '?print=slips', '_blank');
  };

  if (printMode === 'slips') {
    return <BundleSlips standalone computedAllocations={computedAllocations} initialPapers={papers} teamChiefs={chiefs} />;
  }

  if (printMode === 'overview') {
    return (
      <StandalonePrintWrapper title="Master Overview" orientation="landscape">
        <TeamTable team="Team 1" chief={chiefs["Team 1"]} examiners={examiners["Team 1"]} sessions={sessionsList} computedAllocations={computedAllocations} updateCount={updateCount} swapExaminers={swapExaminers} />
        <TeamTable team="Team 2" chief={chiefs["Team 2"]} examiners={examiners["Team 2"]} sessions={sessionsList} computedAllocations={computedAllocations} updateCount={updateCount} swapExaminers={swapExaminers} />
      </StandalonePrintWrapper>
    );
  }

  if (printMode === 'daily') {
    return (
      <StandalonePrintWrapper title="Daily Handouts" orientation="portrait">
        <DailyReports team="Team 1" chief={chiefs["Team 1"]} examiners={examiners["Team 1"]} sessions={sessionsList} computedAllocations={computedAllocations} papers={papers} />
        <DailyReports team="Team 2" chief={chiefs["Team 2"]} examiners={examiners["Team 2"]} sessions={sessionsList} computedAllocations={computedAllocations} papers={papers} />
      </StandalonePrintWrapper>
    );
  }

  if (printMode === 'rosters') {
    return (
      <StandalonePrintWrapper title="Team Rosters" orientation="portrait">
        <TeamRosters teamChiefs={chiefs} examiners={examiners} standalone={true} />
      </StandalonePrintWrapper>
    );
  }

  return (
    <div className="app-container">
      <header className="no-print header-glass">
        <div>
          <h1>Valuation Strategy Manager</h1>
          <div className="file-status">
            {fileHandle ? <span className="status-connected">🟢 Connected to {fileHandle.name} (Auto-saving)</span> : <span className="status-disconnected">⚪ Working with default data (Not saving)</span>}
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={loadFromFile}>📁 Load JSON</button>
          <button className="btn-secondary" onClick={saveAsNewFile}>💾 Save JSON As...</button>
          <button className="btn-print" onClick={handlePrintOverview}>🖨️ Master Overview</button>
          <button className="btn-print" onClick={handlePrintDaily}>🖨️ Daily Handouts</button>
          <button className="btn-print" onClick={handlePrintRosters}>🖨️ Team Rosters</button>
          <button className="btn-print" onClick={handlePrintSlips}>🖨️ Bundle Slips</button>
        </div>
      </header>

      <div className="no-print paper-dashboard">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h2 style={{margin: 0}}>Papers Overview</h2>
          <div style={{background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
            <span style={{marginRight: '1rem', color: '#94a3b8'}}>Grand Total: <strong style={{color: '#f8fafc'}}>{Object.values(papers).reduce((sum, p) => sum + p.count, 0)}</strong></span>
            <span style={{color: '#94a3b8'}}>Total Remaining: <strong style={{color: Object.values(paperStats).reduce((sum, s) => sum + s.remaining, 0) === 0 ? '#10b981' : '#f59e0b'}}>{Object.values(paperStats).reduce((sum, s) => sum + s.remaining, 0)}</strong></span>
          </div>
        </div>
        <div className="paper-cards">
          {Object.entries(papers).map(([key, p]) => {
            const stats = paperStats[key];
            const isOver = stats.remaining < 0;
            const isUnder = stats.remaining > 0;
            return (
              <div key={key} className={`paper-card ${isOver ? 'error' : ''} ${isUnder ? 'warning' : 'success'}`}>
                <h3>{p.name}</h3>
                <div className="stats">
                  <span>Total: {p.count}</span>
                  <span>Used: {stats.used}</span>
                  <span className="remaining">Remaining: {stats.remaining}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tables-container print-overview-only">
        <TeamTable 
          team="Team 1" 
          chief={chiefs["Team 1"]} 
          examiners={examiners["Team 1"]}
          sessions={sessionsList}
          computedAllocations={computedAllocations}
          papers={papers}
          updateCount={updateCount}
          swapExaminers={swapExaminers}
        />
        
        <TeamTable 
          team="Team 2" 
          chief={chiefs["Team 2"]} 
          examiners={examiners["Team 2"]}
          sessions={sessionsList}
          computedAllocations={computedAllocations}
          papers={papers}
          updateCount={updateCount}
          swapExaminers={swapExaminers}
        />
      </div>

      <div className="daily-reports-wrapper print-daily-only">
        <DailyReports 
          team="Team 1" 
          chief={chiefs["Team 1"]} 
          examiners={examiners["Team 1"]}
          sessions={sessionsList}
          computedAllocations={computedAllocations}
          papers={papers}
        />
        <DailyReports 
          team="Team 2" 
          chief={chiefs["Team 2"]} 
          examiners={examiners["Team 2"]}
          sessions={sessionsList}
          computedAllocations={computedAllocations}
          papers={papers}
        />
      </div>

      <TeamRosters teamChiefs={chiefs} examiners={examiners} />
      <BundleSlips computedAllocations={computedAllocations} initialPapers={papers} teamChiefs={chiefs} />
    </div>
  );
}

function TeamRosters({ teamChiefs, examiners, standalone }) {
  return (
    <div className={standalone ? "rosters-wrapper" : "rosters-wrapper print-rosters-only"}>
      {Object.keys(teamChiefs).map(team => (
        <div key={team} className="roster-page">
          <div className="roster-header">
            <h1 className="roster-title">{team} Roster</h1>
          </div>
          
          <div className="roster-chief">
            <h2>CHIEF EXAMINER</h2>
            <div className="roster-card chief-card">
              <span className="roster-icon">⭐</span>
              <span className="roster-name">{teamChiefs[team]}</span>
            </div>
          </div>

          <div className="roster-members">
            <h2>TEAM EXAMINERS ({examiners[team].length})</h2>
            <div className="roster-grid">
              {examiners[team].map((ex, i) => (
                <div key={ex} className="roster-card">
                  <span className="roster-number">{i + 1}</span>
                  <span className="roster-name">{ex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DailyReports({ team, chief, examiners, sessions, computedAllocations, papers }) {
  // Build grid: [session][examiner] = array of allocs
  const sessionGrid = {};
  sessions.forEach(s => sessionGrid[s] = {});
  
  computedAllocations.forEach(a => {
    if (a.team === team && a.actualCount > 0) {
      if (!sessionGrid[a.session][a.examiner]) {
        sessionGrid[a.session][a.examiner] = [];
      }
      sessionGrid[a.session][a.examiner].push(a);
    }
  });

  // Calculate Chief bundles per session
  const chiefBundles = sessions.reduce((acc, s) => {
    const sessionAllocs = computedAllocations.filter(a => a.team === team && a.session === s && a.actualCount > 0);
    const paperGroups = {};
    let sessionTotal = 0;
    sessionAllocs.forEach(a => {
      if (!paperGroups[a.paper]) {
        paperGroups[a.paper] = { count: 0, start: a.start, end: a.end, qp: papers[a.paper].qp, name: papers[a.paper].name };
      }
      paperGroups[a.paper].count += a.actualCount;
      paperGroups[a.paper].start = Math.min(paperGroups[a.paper].start, a.start);
      paperGroups[a.paper].end = Math.max(paperGroups[a.paper].end, a.end);
      sessionTotal += a.actualCount;
    });
    acc[s] = { groups: Object.values(paperGroups), sessionTotal };
    return acc;
  }, {});

  return (
    <div className="daily-reports-container">
      {sessions.map(s => {
        const hasAnyAllocs = examiners.some(ex => sessionGrid[s][ex] && sessionGrid[s][ex].length > 0);
        if (!hasAnyAllocs && chiefBundles[s].groups.length === 0) return null; // Skip empty sessions
        
        return (
          <div key={s} className="daily-page">
            <div className="daily-header">
              <h2 className="daily-title">{team} - Session Handout</h2>
              <div className="daily-meta">
                <div><strong>Session:</strong> {s}</div>
                <div><strong>Chief:</strong> {chief}</div>
              </div>
            </div>
            
            <div className="daily-chief-bundle">
              <h3>CHIEF'S BUNDLE (Total: {chiefBundles[s].sessionTotal} Scripts)</h3>
              <div className="bundle-cards-row">
                {chiefBundles[s].groups.length === 0 ? "0 Scripts" : chiefBundles[s].groups.map((data, j) => (
                  <div key={j} className="bundle-content">
                     <div className="bundle-count">{data.count} {data.name}</div>
                     <div className="alloc-qp">[QP: {data.qp}]</div>
                     <div className="alloc-range">({data.start} to {data.end})</div>
                  </div>
                ))}
              </div>
            </div>

            <table className="daily-table">
              <thead>
                <tr>
                  <th style={{ width: '200px' }}>Examiner Name</th>
                  <th>Scripts to Hand Over</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {examiners.map(ex => {
                  const allocs = sessionGrid[s][ex];
                  if (!allocs || allocs.length === 0) return null; // Only show examiners active in this session
                  
                  const exTotal = allocs.reduce((sum, a) => sum + a.actualCount, 0);
                  
                  return (
                    <tr key={ex}>
                      <td className="examiner-name">{ex}</td>
                      <td>
                        <div className="daily-alloc-cards">
                          {allocs.map((a) => (
                             <div key={a.id} className="alloc-content daily-alloc-card">
                               <div className="alloc-header">
                                 <span className="alloc-count" style={{fontWeight: 'bold', fontSize: '1.2em', color: 'black'}}>{a.actualCount}</span>
                                 <span className="alloc-paper" style={{marginLeft: '8px'}}>{papers[a.paper].name}</span>
                               </div>
                               <div className="alloc-qp">[QP: {papers[a.paper].qp}]</div>
                               <div className="alloc-range">({a.start} to {a.end})</div>
                               <div className="alloc-serial" style={{color: 'black', fontWeight: 'bold', marginTop: '4px'}}>Bundle #{a.serial}</div>
                             </div>
                          ))}
                        </div>
                      </td>
                      <td className="total-col">{exTotal}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function TeamTable({ team, chief, examiners, sessions, computedAllocations, papers, updateCount, swapExaminers }) {
  const [swap1, setSwap1] = useState('');
  const [swap2, setSwap2] = useState('');

  const handleSwap = () => {
    swapExaminers(team, swap1, swap2);
    setSwap1('');
    setSwap2('');
  };

  // Build grid: [examiner][session] = array of allocs
  const grid = {};
  examiners.forEach(ex => {
    grid[ex] = {};
    sessions.forEach(s => grid[ex][s] = []);
  });

  computedAllocations.forEach(a => {
    if (a.team === team && grid[a.examiner]) {
      grid[a.examiner][a.session].push(a);
    }
  });

  // Chief bundles calculation
  const chiefBundles = sessions.map(s => {
    const sessionAllocs = computedAllocations.filter(a => a.team === team && a.session === s && a.actualCount > 0);
    const paperGroups = {};
    let sessionTotal = 0;
    sessionAllocs.forEach(a => {
      if (!paperGroups[a.paper]) {
        paperGroups[a.paper] = { count: 0, start: a.start, end: a.end, qp: papers[a.paper].qp };
      }
      paperGroups[a.paper].count += a.actualCount;
      paperGroups[a.paper].start = Math.min(paperGroups[a.paper].start, a.start);
      paperGroups[a.paper].end = Math.max(paperGroups[a.paper].end, a.end);
      sessionTotal += a.actualCount;
    });
    return { groups: Object.entries(paperGroups), sessionTotal };
  });

  return (
    <div className="team-section">
      <div className="team-header">
        <div className="team-title-block">
          <h2>{team} Allocation</h2>
          <div className="chief-box">CHIEF: {chief}</div>
        </div>
        
        <div className="no-print swap-controls">
          <select value={swap1} onChange={e => setSwap1(e.target.value)}>
            <option value="">Select Ex 1</option>
            {examiners.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <span className="swap-icon">⇄</span>
          <select value={swap2} onChange={e => setSwap2(e.target.value)}>
            <option value="">Select Ex 2</option>
            {examiners.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <button onClick={handleSwap} disabled={!swap1 || !swap2 || swap1 === swap2}>Swap</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Examiner Name<br/><small>(Chief: {chief})</small></th>
              {sessions.map(s => <th key={s}>{s}</th>)}
              <th>Total Scripts</th>
            </tr>
          </thead>
          <tbody>
            <tr className="chief-bundle-row">
              <td className="bundle-label">CHIEF'S BUNDLE<br/><small className="print-only">(Chief: {chief})</small><br/><small>(Total for Session)</small></td>
              {chiefBundles.map((b, i) => (
                <td key={i}>
                  {b.groups.length === 0 ? "0" : b.groups.map(([pKey, data], j) => (
                    <div key={pKey} className="bundle-block">
                      {j > 0 && <div className="plus-divider">+</div>}
                      <div className="bundle-content">
                        <div className="bundle-count">{data.count} {papers[pKey].name}</div>
                        <div className="alloc-qp">[QP: {data.qp}]</div>
                        <div className="alloc-range">({data.start} to {data.end})</div>
                      </div>
                    </div>
                  ))}
                </td>
              ))}
              <td className="total-col">{chiefBundles.reduce((sum, b) => sum + b.sessionTotal, 0)}</td>
            </tr>
            {examiners.map(ex => {
              let exTotal = 0;
              return (
                <tr key={ex}>
                  <td className="examiner-name">{ex}</td>
                  {sessions.map(s => {
                    const allocs = grid[ex][s];
                    if (!allocs || allocs.length === 0) return <td key={s} className="empty-cell">0 (Finished)</td>;
                    
                    return (
                      <td key={s}>
                        {allocs.map((a, i) => {
                          exTotal += a.actualCount;
                          return (
                            <div key={a.id} className="alloc-block">
                              {i > 0 && <div className="plus-divider">+</div>}
                              <div className="alloc-content">
                                <div className="alloc-header">
                                  <input 
                                    type="number" 
                                    className="no-print count-input" 
                                    value={a.count} 
                                    onChange={e => updateCount(a.id, e.target.value)} 
                                  />
                                  <span className="print-only alloc-count">{a.actualCount}</span>
                                  <span className="alloc-paper">{papers[a.paper].name}</span>
                                </div>
                                <div className="alloc-qp">[QP: {papers[a.paper].qp}]</div>
                                {a.actualCount > 0 && (
                                  <div className="alloc-range">({a.start} to {a.end})</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                  <td className="total-col">{exTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function BundleSlips({ computedAllocations, initialPapers, teamChiefs, standalone }) {
  const [orientation, setOrientation] = useState('portrait');

  // Sort allocations first by team, then by session, then by examiner
  const validAllocations = computedAllocations.filter(a => a.actualCount > 0);
  
  // Create a flattened, ordered list of all examiner bundles. 
  const slips = validAllocations.map(a => {
    const chief = teamChiefs[a.team];
    const paper = initialPapers[a.paper];
    return {
      serial: a.serial,
      session: a.session,
      qp: paper.qp,
      examiner: a.examiner,
      chief: chief,
      paperName: paper.name,
      start: a.start,
      end: a.end,
      count: a.actualCount
    };
  });

  return (
    <div className={standalone ? "slips-standalone" : "slips-wrapper print-slips-only"}>
      {standalone && (
        <div className="no-print print-toolbar">
          <label>
            Paper Orientation: 
            <select value={orientation} onChange={e => setOrientation(e.target.value)}>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </label>
          <button className="btn-print" onClick={() => window.print()}>🖨️ Print Now</button>
          <style>{`
            @page { size: A4 ${orientation}; margin: 5mm; }
            body { background: #fff; }
            .slip-item { margin-bottom: 1.5vh; page-break-inside: avoid; border: 2px dashed #000; padding: 10px; }
          `}</style>
        </div>
      )}
      
      {slips.map(slip => (
        <div key={slip.serial} className="slip-item">
          <div className="slip-header">
            <span className="slip-title">Answer Script Bundle</span>
            <span className="slip-serial">Bundle {slip.serial}</span>
          </div>
          
          <div className="slip-body">
            <div className="slip-row">
              <span className="slip-label">Date & Session</span>
              <span className="slip-value">{slip.session}</span>
            </div>
            <div className="slip-row">
              <span className="slip-label">QP Code</span>
              <span className="slip-value">{slip.qp}</span>
            </div>
            <div className="slip-row">
              <span className="slip-label">Examiner</span>
              <span className="slip-value">{slip.examiner}</span>
            </div>
            <div className="slip-row">
              <span className="slip-label">Chief Examiner</span>
              <span className="slip-value">{slip.chief}</span>
            </div>
            <div className="slip-row" style={{ gridColumn: "span 2" }}>
              <span className="slip-label">Paper</span>
              <span className="slip-value">{slip.paperName}</span>
            </div>
          </div>
          
          <div className="slip-footer">
            <div className="slip-row" style={{ flex: 1 }}></div>
            <div className="slip-row" style={{ flex: 2, textAlign: "center" }}>
              <span className="slip-label">False Numbers</span>
              <span className="slip-false-nos">{slip.start} to {slip.end}</span>
            </div>
            <div className="slip-row" style={{ flex: 1, textAlign: "right" }}>
              <span className="slip-label">Total Scripts</span>
              <span className="slip-count">{slip.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StandalonePrintWrapper({ title, children, orientation = 'portrait' }) {
  return (
    <div className="standalone-print-page" style={{ background: 'white', minHeight: '100vh', padding: '2rem', color: 'black' }}>
      <div className="no-print print-toolbar">
        <label style={{ marginRight: '1rem' }}>
          Paper Orientation: 
          <select value={orientation} onChange={() => {}} disabled>
            <option value={orientation}>{orientation.charAt(0).toUpperCase() + orientation.slice(1)}</option>
          </select>
        </label>
        <button className="btn-print" onClick={() => window.print()}>🖨️ Print {title}</button>
      </div>
      <div className="print-content-wrapper" style={{ color: 'black' }}>
        {children}
      </div>
      <style>{`
        @page { size: A4 ${orientation}; margin: 5mm; }
      `}</style>
    </div>
  );
}

export default App;
