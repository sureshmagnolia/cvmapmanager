export const initialPapers = {
    "EVS": { name: "Biodiversity and Conservation", start: 9324049, count: 23, qp: "141311" },
    "Microbial": { name: "Microbial Diversity and Phytopathology", start: 9323521, count: 165, qp: "141289" },
    "Crypto": { name: "Cryptogams, Gymnosperms and Plant Pathology", start: 9324076, count: 10, qp: "142703" },
    "Minor3": { name: "Plant Morphology, Physiology and Plant Resources", start: 9323697, count: 166, qp: "141454" },
    "Minor4": { name: "Plant Morphology Physiology and Plant Resources", start: 9323897, count: 49, qp: "141816" },
    "Nutra": { name: "Plant Nutraceuticals", start: 9323873, count: 18, qp: "141456" },
    "MDC": { name: "Plants in Everyday Life", start: 9323961, count: 61, qp: "142335" }
};

export const sessions = [
    "7th Jul (FN) - Discussion", "7th Jul (AN)", "8th Jul (FN)", "8th Jul (AN)", "9th Jul (FN)", "9th Jul (AN)"
];

export const initialAllocations = [
    // Team 1
    { id: 1, team: "Team 1", examiner: "DR. C KAVITHA", session: "7th Jul (AN)", paper: "EVS", count: 12 },
    { id: 2, team: "Team 1", examiner: "DR. C KAVITHA", session: "8th Jul (FN)", paper: "EVS", count: 11 },

    { id: 3, team: "Team 1", examiner: "NAZEEMA M K", session: "7th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 4, team: "Team 1", examiner: "NAZEEMA M K", session: "8th Jul (FN)", paper: "Microbial", count: 18 },
    { id: 5, team: "Team 1", examiner: "NAZEEMA M K", session: "8th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 6, team: "Team 1", examiner: "NAZEEMA M K", session: "9th Jul (FN)", paper: "Microbial", count: 17 },
    { id: 7, team: "Team 1", examiner: "NAZEEMA M K", session: "9th Jul (FN)", paper: "MDC", count: 1 },
    { id: 8, team: "Team 1", examiner: "NAZEEMA M K", session: "9th Jul (AN)", paper: "MDC", count: 7 },

    { id: 9, team: "Team 1", examiner: "SREEJA PS", session: "7th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 10, team: "Team 1", examiner: "SREEJA PS", session: "8th Jul (FN)", paper: "Microbial", count: 18 },
    { id: 11, team: "Team 1", examiner: "SREEJA PS", session: "8th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 12, team: "Team 1", examiner: "SREEJA PS", session: "9th Jul (FN)", paper: "Microbial", count: 16 },
    { id: 13, team: "Team 1", examiner: "SREEJA PS", session: "9th Jul (FN)", paper: "MDC", count: 2 },
    { id: 14, team: "Team 1", examiner: "SREEJA PS", session: "9th Jul (AN)", paper: "MDC", count: 7 },

    { id: 15, team: "Team 1", examiner: "DR. PRAJITH T M", session: "7th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 16, team: "Team 1", examiner: "DR. PRAJITH T M", session: "8th Jul (FN)", paper: "Microbial", count: 18 },
    { id: 17, team: "Team 1", examiner: "DR. PRAJITH T M", session: "8th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 18, team: "Team 1", examiner: "DR. PRAJITH T M", session: "9th Jul (FN)", paper: "Microbial", count: 6 },
    { id: 19, team: "Team 1", examiner: "DR. PRAJITH T M", session: "9th Jul (FN)", paper: "Crypto", count: 10 },
    { id: 20, team: "Team 1", examiner: "DR. PRAJITH T M", session: "9th Jul (FN)", paper: "MDC", count: 2 },
    { id: 21, team: "Team 1", examiner: "DR. PRAJITH T M", session: "9th Jul (AN)", paper: "MDC", count: 6 },

    // Team 2
    { id: 22, team: "Team 2", examiner: "Preetha U", session: "7th Jul (AN)", paper: "Minor3", count: 12 },
    { id: 23, team: "Team 2", examiner: "Preetha U", session: "8th Jul (FN)", paper: "Minor3", count: 18 },
    { id: 24, team: "Team 2", examiner: "Preetha U", session: "8th Jul (AN)", paper: "Minor3", count: 12 },
    { id: 25, team: "Team 2", examiner: "Preetha U", session: "9th Jul (FN)", paper: "Minor3", count: 17 },
    { id: 26, team: "Team 2", examiner: "Preetha U", session: "9th Jul (FN)", paper: "MDC", count: 1 },
    { id: 27, team: "Team 2", examiner: "Preetha U", session: "9th Jul (AN)", paper: "MDC", count: 8 },

    { id: 28, team: "Team 2", examiner: "SEENA K.K.", session: "7th Jul (AN)", paper: "Minor3", count: 12 },
    { id: 29, team: "Team 2", examiner: "SEENA K.K.", session: "8th Jul (FN)", paper: "Minor3", count: 18 },
    { id: 30, team: "Team 2", examiner: "SEENA K.K.", session: "8th Jul (AN)", paper: "Minor3", count: 12 },
    { id: 31, team: "Team 2", examiner: "SEENA K.K.", session: "9th Jul (FN)", paper: "Minor3", count: 16 },
    { id: 32, team: "Team 2", examiner: "SEENA K.K.", session: "9th Jul (FN)", paper: "MDC", count: 2 },
    { id: 33, team: "Team 2", examiner: "SEENA K.K.", session: "9th Jul (AN)", paper: "MDC", count: 7 },

    { id: 34, team: "Team 2", examiner: "REEDHU RAJ", session: "7th Jul (AN)", paper: "Minor3", count: 12 },
    { id: 35, team: "Team 2", examiner: "REEDHU RAJ", session: "8th Jul (FN)", paper: "Minor3", count: 18 },
    { id: 36, team: "Team 2", examiner: "REEDHU RAJ", session: "8th Jul (AN)", paper: "Minor3", count: 10 },
    { id: 37, team: "Team 2", examiner: "REEDHU RAJ", session: "8th Jul (AN)", paper: "Nutra", count: 2 },
    { id: 38, team: "Team 2", examiner: "REEDHU RAJ", session: "9th Jul (FN)", paper: "Nutra", count: 16 },
    { id: 39, team: "Team 2", examiner: "REEDHU RAJ", session: "9th Jul (FN)", paper: "MDC", count: 2 },
    { id: 40, team: "Team 2", examiner: "REEDHU RAJ", session: "9th Jul (AN)", paper: "MDC", count: 7 },

    { id: 41, team: "Team 2", examiner: "DR. SOUMYA M", session: "7th Jul (AN)", paper: "Minor4", count: 12 },
    { id: 42, team: "Team 2", examiner: "DR. SOUMYA M", session: "8th Jul (FN)", paper: "Minor4", count: 18 },
    { id: 43, team: "Team 2", examiner: "DR. SOUMYA M", session: "8th Jul (AN)", paper: "Minor4", count: 12 },
    { id: 44, team: "Team 2", examiner: "DR. SOUMYA M", session: "9th Jul (FN)", paper: "Minor4", count: 7 },
    { id: 45, team: "Team 2", examiner: "DR. SOUMYA M", session: "9th Jul (FN)", paper: "Minor3", count: 9 },
    { id: 46, team: "Team 2", examiner: "DR. SOUMYA M", session: "9th Jul (FN)", paper: "MDC", count: 2 },
    { id: 47, team: "Team 2", examiner: "DR. SOUMYA M", session: "9th Jul (AN)", paper: "MDC", count: 7 }
];

export const teamChiefs = {
    "Team 1": "SURESH KUMAR. K. A",
    "Team 2": "DR. PRAMOD KUMAR.N"
};

export const defaultExaminers = {
    "Team 1": [
        "DR. C KAVITHA", "NAZEEMA M K", "SREEJA PS", "DR. PRAJITH T M"
    ],
    "Team 2": [
        "Preetha U", "SEENA K.K.", "REEDHU RAJ", "DR. SOUMYA M"
    ]
};
