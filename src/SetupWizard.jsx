import React, { useState } from 'react';
import './SetupWizard.css';

function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  
  // Data States
  const [sessions, setSessions] = useState([
    { date: '2026-07-07', type: 'FN' },
    { date: '2026-07-07', type: 'AN' },
    { date: '2026-07-08', type: 'FN' },
    { date: '2026-07-08', type: 'AN' }
  ]);
  const [teams, setTeams] = useState([{ name: 'Team 1', chief: '' }]);
  const [examinersData, setExaminersData] = useState([{ team: 'Team 1', name: '' }]);
  const [papersList, setPapersList] = useState([{ id: 'Paper1', name: '', qp: '', start: 1000000, count: 100 }]);

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
  const addPaper = () => setPapersList([...papersList, { id: `Paper${papersList.length + 1}`, name: '', qp: '', start: 1000000, count: 100 }]);
  const updatePaper = (index, field, value) => {
    const newP = [...papersList];
    newP[index][field] = field === 'start' || field === 'count' ? parseInt(value) || 0 : value;
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
        papers[p.id] = { name: p.name, qp: p.qp, start: p.start, count: p.count };
      }
    });

    // Generate Base Allocations (Grid of examiner x session x paper with count 0)
    const allocations = [];
    let idCounter = 1;
    
    Object.keys(examiners).forEach(teamName => {
      examiners[teamName].forEach(exName => {
        cleanSessions.forEach(session => {
          Object.keys(papers).forEach(paperId => {
            allocations.push({
              id: idCounter++,
              team: teamName,
              examiner: exName,
              session: session,
              paper: paperId,
              count: 0 // Blank starting grid
            });
          });
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
            <p>Define the subjects to be valued and their starting false numbers.</p>
            {papersList.map((paper, index) => (
              <div key={index} className="input-group paper-group">
                <input value={paper.id} onChange={(e) => updatePaper(index, 'id', e.target.value)} placeholder="Short ID (e.g. EVS)" />
                <input value={paper.name} onChange={(e) => updatePaper(index, 'name', e.target.value)} placeholder="Full Subject Name" />
                <input value={paper.qp} onChange={(e) => updatePaper(index, 'qp', e.target.value)} placeholder="QP Code" />
                <input type="number" value={paper.start} onChange={(e) => updatePaper(index, 'start', e.target.value)} placeholder="Start False No" title="Start False No" />
                <input type="number" value={paper.count} onChange={(e) => updatePaper(index, 'count', e.target.value)} placeholder="Total Scripts" title="Total Scripts" />
                <button onClick={() => removePaper(index)} className="btn-danger">X</button>
              </div>
            ))}
            <button onClick={addPaper} className="btn-secondary">+ Add Paper</button>
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
