export const initialPapers = {
    "EVS": { name: "Biodiversity and Conservation--(Core 2)--(EVS2CJ102)", start: 100001, count: 23, qp: "EVS102" },
    "Microbial": { name: "MIcrobial Diversity and Phyto Pathology--(Core 2)--(BOT2CJ101)", start: 200001, count: 165, qp: "BOT101" },
    "Crypto": { name: "CRYPTOGAMS, GYMNOSPERMS AND PLANT PATHOLOGY--(BOT2C02T)", start: 300001, count: 10, qp: "BOTC02T" },
    "Minor3": { name: "Plant Morphology, physiology and plant resources--(Minor 3)--(BOT2MN101)", start: 400001, count: 166, qp: "MN101-3" },
    "Minor4": { name: "Plant Morphology, physiology and plant resources--(Minor 4)--(BOT2MN101)", start: 500001, count: 49, qp: "MN101-4" },
    "Nutra": { name: "Plant Nutraceuticals--(Minor 3)--(BOT2MN103)", start: 600001, count: 18, qp: "MN103" },
    "MDC": { name: "Plants in Everyday Life--(MDC 2)--(BOT2FM106-2)", start: 700001, count: 61, qp: "FM106-2" }
};

export const sessions = [
    "7th Jul (FN) - Discussion", "7th Jul (AN)", "8th Jul (FN)", "8th Jul (AN)", "9th Jul (FN)", "9th Jul (AN)"
];

export const initialAllocations = [
    // Team 1
    { id: 1, team: "Team 1", examiner: "Examiner 1 (EVS)", session: "7th Jul (AN)", paper: "EVS", count: 12 },
    { id: 2, team: "Team 1", examiner: "Examiner 1 (EVS)", session: "8th Jul (FN)", paper: "EVS", count: 11 },

    { id: 3, team: "Team 1", examiner: "Examiner 2", session: "7th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 4, team: "Team 1", examiner: "Examiner 2", session: "8th Jul (FN)", paper: "Microbial", count: 18 },
    { id: 5, team: "Team 1", examiner: "Examiner 2", session: "8th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 6, team: "Team 1", examiner: "Examiner 2", session: "9th Jul (FN)", paper: "Microbial", count: 17 },
    { id: 7, team: "Team 1", examiner: "Examiner 2", session: "9th Jul (AN)", paper: "MDC", count: 8 },

    { id: 8, team: "Team 1", examiner: "Examiner 3", session: "7th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 9, team: "Team 1", examiner: "Examiner 3", session: "8th Jul (FN)", paper: "Microbial", count: 18 },
    { id: 10, team: "Team 1", examiner: "Examiner 3", session: "8th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 11, team: "Team 1", examiner: "Examiner 3", session: "9th Jul (FN)", paper: "Microbial", count: 16 },
    { id: 12, team: "Team 1", examiner: "Examiner 3", session: "9th Jul (AN)", paper: "MDC", count: 9 },

    { id: 13, team: "Team 1", examiner: "Examiner 4", session: "7th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 14, team: "Team 1", examiner: "Examiner 4", session: "8th Jul (FN)", paper: "Microbial", count: 18 },
    { id: 15, team: "Team 1", examiner: "Examiner 4", session: "8th Jul (AN)", paper: "Microbial", count: 12 },
    { id: 16, team: "Team 1", examiner: "Examiner 4", session: "9th Jul (FN)", paper: "Microbial", count: 6 },
    { id: 17, team: "Team 1", examiner: "Examiner 4", session: "9th Jul (FN)", paper: "Crypto", count: 10 },
    { id: 18, team: "Team 1", examiner: "Examiner 4", session: "9th Jul (AN)", paper: "MDC", count: 8 },

    // Team 2
    { id: 19, team: "Team 2", examiner: "Examiner 5", session: "7th Jul (AN)", paper: "Minor3", count: 12 },
    { id: 20, team: "Team 2", examiner: "Examiner 5", session: "8th Jul (FN)", paper: "Minor3", count: 18 },
    { id: 21, team: "Team 2", examiner: "Examiner 5", session: "8th Jul (AN)", paper: "Minor3", count: 12 },
    { id: 22, team: "Team 2", examiner: "Examiner 5", session: "9th Jul (FN)", paper: "Minor3", count: 17 },
    { id: 23, team: "Team 2", examiner: "Examiner 5", session: "9th Jul (AN)", paper: "MDC", count: 9 },

    { id: 24, team: "Team 2", examiner: "Examiner 6", session: "7th Jul (AN)", paper: "Minor3", count: 12 },
    { id: 25, team: "Team 2", examiner: "Examiner 6", session: "8th Jul (FN)", paper: "Minor3", count: 18 },
    { id: 26, team: "Team 2", examiner: "Examiner 6", session: "8th Jul (AN)", paper: "Minor3", count: 12 },
    { id: 27, team: "Team 2", examiner: "Examiner 6", session: "9th Jul (FN)", paper: "Minor3", count: 16 },
    { id: 28, team: "Team 2", examiner: "Examiner 6", session: "9th Jul (AN)", paper: "MDC", count: 9 },

    { id: 29, team: "Team 2", examiner: "Examiner 7", session: "7th Jul (AN)", paper: "Minor3", count: 12 },
    { id: 30, team: "Team 2", examiner: "Examiner 7", session: "8th Jul (FN)", paper: "Minor3", count: 18 },
    { id: 31, team: "Team 2", examiner: "Examiner 7", session: "8th Jul (AN)", paper: "Minor3", count: 10 },
    { id: 32, team: "Team 2", examiner: "Examiner 7", session: "8th Jul (AN)", paper: "Nutra", count: 2 },
    { id: 33, team: "Team 2", examiner: "Examiner 7", session: "9th Jul (FN)", paper: "Nutra", count: 16 },
    { id: 34, team: "Team 2", examiner: "Examiner 7", session: "9th Jul (AN)", paper: "MDC", count: 9 },

    { id: 35, team: "Team 2", examiner: "Examiner 8", session: "7th Jul (AN)", paper: "Minor4", count: 12 },
    { id: 36, team: "Team 2", examiner: "Examiner 8", session: "8th Jul (FN)", paper: "Minor4", count: 18 },
    { id: 37, team: "Team 2", examiner: "Examiner 8", session: "8th Jul (AN)", paper: "Minor4", count: 12 },
    { id: 38, team: "Team 2", examiner: "Examiner 8", session: "9th Jul (FN)", paper: "Minor4", count: 7 },
    { id: 39, team: "Team 2", examiner: "Examiner 8", session: "9th Jul (FN)", paper: "Minor3", count: 9 },
    { id: 40, team: "Team 2", examiner: "Examiner 8", session: "9th Jul (AN)", paper: "MDC", count: 9 }
];

export const teamChiefs = {
    "Team 1": "Chief 1",
    "Team 2": "Chief 2"
};

export const defaultExaminers = {
    "Team 1": [
        "Examiner 1 (EVS)", "Examiner 2", "Examiner 3", "Examiner 4"
    ],
    "Team 2": [
        "Examiner 5", "Examiner 6", "Examiner 7", "Examiner 8"
    ]
};
