import fs from 'fs';
import { initialPapers, initialAllocations, sessions, defaultExaminers, teamChiefs } from './src/data.js';

const sessionOrder = Object.fromEntries(sessions.map((s, i) => [s, i]));
const examinerOrder = {};
Object.keys(defaultExaminers).forEach(team => {
  examinerOrder[team] = Object.fromEntries(defaultExaminers[team].map((ex, i) => [ex, i]));
});

const sortedAllocations = [...initialAllocations].sort((a, b) => {
  if (sessionOrder[a.session] !== sessionOrder[b.session]) {
    return sessionOrder[a.session] - sessionOrder[b.session];
  }
  if (a.team !== b.team) {
    return a.team.localeCompare(b.team);
  }
  return examinerOrder[a.team][a.examiner] - examinerOrder[b.team][b.examiner];
});

const examiners = {};
const trackers = {};
Object.keys(initialPapers).forEach(key => {
  trackers[key] = { current: initialPapers[key].start };
});

let serialCounter = 1;

sortedAllocations.forEach(a => {
  const pKey = a.paper;
  const count = parseInt(a.count, 10) || 0;
  if (count > 0) {
    const start = trackers[pKey].current;
    const end = start + count - 1;
    const serial = serialCounter++;
    trackers[pKey].current += count;
    
    if (!examiners[a.examiner]) {
      examiners[a.examiner] = { 
        papers: [],
        chief: teamChiefs[a.team] 
      };
    }
    
    examiners[a.examiner].papers.push({
      paperName: initialPapers[pKey].name,
      qp: initialPapers[pKey].qp,
      session: a.session,
      count: count,
      start: start,
      end: end,
      serial: serial
    });
  }
});

fs.writeFileSync('examiner_data.json', JSON.stringify(examiners, null, 2));
console.log('Successfully generated examiner_data.json!');
