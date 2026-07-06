import React, { useState, useEffect } from 'react';
import './SetupWizard.css';

function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  
  // Data States with localStorage persistence
  const [fnRate, setFnRate] = useState(() => {
    const saved = localStorage.getItem('vw_fnRate');
    return saved ? parseInt(saved) : 18;
  });
  const [anRate, setAnRate] = useState(() => {
    const saved = localStorage.getItem('vw_anRate');
    return saved ? parseInt(saved) : 12;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('vw_sessions');
    return saved ? JSON.parse(saved) : [
      { date: '2026-07-07', type: 'FN' },
      { date: '2026-07-07', type: 'AN' },
      { date: '2026-07-08', type: 'FN' },
      { date: '2026-07-08', type: 'AN' }
    ];
  });
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('vw_teams');
    return saved ? JSON.parse(saved) : [{ name: 'Team 1', chief: '' }];
  });
  const [examinersData, setExaminersData] = useState(() => {
    const saved = localStorage.getItem('vw_examinersData');
    return saved ? JSON.parse(saved) : [{ team: 'Team 1', name: '' }];
  });
  const [papersList, setPapersList] = useState(() => {
    const saved = localStorage.getItem('vw_papersList');
    return saved ? JSON.parse(saved) : [{ id: 'Paper1', name: '', qp: '', start: 1000000, end: 1000099 }];
  });

  // Auto-save Wizard state
  useEffect(() => localStorage.setItem('vw_fnRate', fnRate), [fnRate]);
  useEffect(() => localStorage.setItem('vw_anRate', anRate), [anRate]);
  useEffect(() => localStorage.setItem('vw_sessions', JSON.stringify(sessions)), [sessions]);
  useEffect(() => localStorage.setItem('vw_teams', JSON.stringify(teams)), [teams]);
  useEffect(() => localStorage.setItem('vw_examinersData', JSON.stringify(examinersData)), [examinersData]);
  useEffect(() => localStorage.setItem('vw_papersList', JSON.stringify(papersList)), [papersList]);

  // Handlers for Sessions
  const addSession = () => setSessions([...sessions, { date: '', type: 'FN' }]);
  const updateSession = (index, field, value) => {
    const newSessions = [...sessions];
    newSessions[index][field] = value;
    setSessions(newSessions);
  };
  const removeSession = (index) => setSessions(sessions.filter((_, i) => i !== index));

  // Handlers for Teams
  const addTeam = () => setTeams([...teams, { name: `Team ${teams.length + 1}`, chief: '' }]);
  const updateTeam = (index, field, value) => {
    const newTeams = [...teams];
    newTeams[index][field] = value;
    setTeams(newTeams);
  };

  // Handlers for Examiners
  const addExaminer = () => setExaminersData([...examinersData, { team: teams[0].name, name: '' }]);
  const updateExaminer = (index, field, value) => {
    const newEx = [...examinersData];
    newEx[index][field] = value;
    setExaminersData(newEx);
  };
  const removeExaminer = (index) => setExaminersData(examinersData.filter((_, i) => i !== index));

  // Handlers for Papers
  const addPaper = () => setPapersList([...papersList, { id: `Paper${papersList.length + 1}`, name: '', qp: '', start: 1000000, end: 1000099 }]);
  const updatePaper = (index, field, value) => {
    const newP = [...papersList];
    newP[index][field] = field === 'start' || field === 'end' ? parseInt(value) || 0 : value;
    setPapersList(newP);
  };
  const removePaper = (index) => setPapersList(papersList.filter((_, i) => i !== index));

  const handleFinish = () => {
    // Process Data into App shape
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"], v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };
    
    const cleanSessions = sessions
      .filter(s => s.date)
      .map(s => {
        const d = new Date(s.date);
        const day = d.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[d.getMonth()];
        return `${day}${getOrdinal(day)} ${month} (${s.type})`;
      });
    
    const teamChiefs = {};
    teams.forEach(t => { if (t.name) teamChiefs[t.name] = t.chief; });
    
    const examiners = {};
    teams.forEach(t => { examiners[t.name] = []; });
    examinersData.forEach(ex => {
      if (ex.name && ex.team) {
        if (!examiners[ex.team]) examiners[ex.team] = [];
        examiners[ex.team].push(ex.name);
      }
    });

    const papers = {};
    papersList.forEach(p => {
      if (p.id) {
        // Calculate count dynamically from start and end false numbers
        const calculatedCount = p.end >= p.start ? (p.end - p.start + 1) : 0;
        papers[p.id] = { name: p.name, qp: p.qp, start: p.start, count: calculatedCount };
      }
    });

    // Generate Base Allocations (Grid of examiner x session x paper with count 0)
    const allocations = [];
    let idCounter = 1;
    
    Object.keys(examiners).forEach(teamName => {
      examiners[teamName].forEach(exName => {
        cleanSessions.forEach(sessionStr => {
          Object.keys(papers).forEach(paperId => {
            allocations.push({
              id: idCounter++,
              team: teamName,
              examiner: exName,
              session: sessionStr,
              paper: paperId,
              count: 0 // Blank starting grid
            });
          });
        });
      });
    });

    // Auto-Allocator Logic
    const paperTracker = {};
    Object.keys(papers).forEach(pId => {
      paperTracker[pId] = papers[pId].count; // remaining scripts
    });

    const paperKeys = Object.keys(papers);

    Object.keys(examiners).forEach(teamName => {
      examiners[teamName].forEach(exName => {
        cleanSessions.forEach(sessionStr => {
          let remainingCapacity = sessionStr.includes('(FN)') ? fnRate : anRate;

          for (const pId of paperKeys) {
            if (remainingCapacity <= 0) break;
            
            if (paperTracker[pId] > 0) {
              const scriptsToTake = Math.min(remainingCapacity, paperTracker[pId]);
              
              const targetAlloc = allocations.find(a => 
                a.team === teamName && a.examiner === exName && a.session === sessionStr && a.paper === pId
              );
              
              if (targetAlloc) {
                targetAlloc.count = scriptsToTake;
                paperTracker[pId] -= scriptsToTake;
                remainingCapacity -= scriptsToTake;
              }
            }
          }
        });
      });
    });

    onComplete({
      sessionsList: cleanSessions,
      teamChiefs,
      examiners,
      papers,
      allocations
    });
  };

  return (
    <div className="setup-wizard">
      <div className="setup-card">
        <h1>Valuation Camp Setup Wizard</h1>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        {step === 1 && (
          <div className="step-content">
            <h2>Step 1: Define Sessions</h2>
            <p>Enter the dates and sessions for the valuation camp.</p>
            {sessions.map((session, index) => (
              <div key={index} className="input-row">
                <input 
                  type="date"
                  value={session.date} 
                  onChange={(e) => updateSession(index, 'date', e.target.value)} 
                />
                <select value={session.type} onChange={(e) => updateSession(index, 'type', e.target.value)}>
                  <option value="FN">FN</option>
                  <option value="AN">AN</option>
                </select>
                <button onClick={() => removeSession(index)} className="btn-danger">X</button>
              </div>
            ))}
            <button onClick={addSession} className="btn-secondary">+ Add Session</button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Step 2: Teams & Chiefs</h2>
            <p>Define your teams and assign a Chief Examiner to each.</p>
            {teams.map((team, index) => (
              <div key={index} className="input-group">
                <input 
                  value={team.name} 
                  onChange={(e) => updateTeam(index, 'name', e.target.value)} 
                  placeholder="Team Name"
                />
                <input 
                  value={team.chief} 
                  onChange={(e) => updateTeam(index, 'chief', e.target.value)} 
                  placeholder="Chief Examiner Name"
                />
              </div>
            ))}
            <button onClick={addTeam} className="btn-secondary">+ Add Team</button>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Step 3: Examiners</h2>
            <p>Add examiners to their respective teams.</p>
            {examinersData.map((ex, index) => (
              <div key={index} className="input-group">
                <select value={ex.team} onChange={(e) => updateExaminer(index, 'team', e.target.value)}>
                  {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
                <input 
                  value={ex.name} 
                  onChange={(e) => updateExaminer(index, 'name', e.target.value)} 
                  placeholder="Examiner Name"
                />
                <button onClick={() => removeExaminer(index)} className="btn-danger">X</button>
              </div>
            ))}
            <button onClick={addExaminer} className="btn-secondary">+ Add Examiner</button>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h2>Step 4: Papers & False Numbers</h2>
            <p>Define the subjects to be valued and their starting and ending false numbers.</p>
            {papersList.map((paper, index) => (
              <div key={index} className="input-group paper-group">
                <input value={paper.id} onChange={(e) => updatePaper(index, 'id', e.target.value)} placeholder="Short ID (e.g. EVS)" />
                <input value={paper.name} onChange={(e) => updatePaper(index, 'name', e.target.value)} placeholder="Full Subject Name" />
                <input value={paper.qp} onChange={(e) => updatePaper(index, 'qp', e.target.value)} placeholder="QP Code" />
                <input type="number" value={paper.start} onChange={(e) => updatePaper(index, 'start', e.target.value)} placeholder="Start False No" title="Start False No" />
                <input type="number" value={paper.end} onChange={(e) => updatePaper(index, 'end', e.target.value)} placeholder="End False No" title="End False No" />
                <button onClick={() => removePaper(index)} className="btn-danger">X</button>
              </div>
            ))}
            <button onClick={addPaper} className="btn-secondary">+ Add Paper</button>

            <div className="rate-settings" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: '#cbd5e1', marginBottom: '1rem' }}>Auto-Allocator Settings</h3>
              <p style={{ marginBottom: '1rem' }}>Adjust the capacity rates before completing setup to see different generation results.</p>
              <div className="input-group" style={{ display: 'flex', gap: '2rem' }}>
                <label style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  FN Capacity:
                  <input type="number" value={fnRate} onChange={(e) => setFnRate(parseInt(e.target.value) || 0)} style={{ width: '100px', flex: 'none' }} />
                </label>
                <label style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  AN Capacity:
                  <input type="number" value={anRate} onChange={(e) => setAnRate(parseInt(e.target.value) || 0)} style={{ width: '100px', flex: 'none' }} />
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="wizard-actions">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="btn-secondary">Back</button>}
          {step < 4 && <button onClick={() => setStep(step + 1)} className="btn-primary">Next</button>}
          {step === 4 && <button onClick={handleFinish} className="btn-success">Complete Setup</button>}
        </div>
      </div>
    </div>
  );
}

export default SetupWizard;
