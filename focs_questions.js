// FOCS Questions - Foundations of Clinical Science
const focsQuestions = [
  {
    question: "A 23-year-old student has been feeling increasingly fatigued and notices his heart rate is elevated. A blood test reveals increased serum lactate levels. Which of the following best explains why a lack of oxygen leads to lactate accumulation?",
    options: [
      "A) Inhibition of glycolysis",
      "B) Activation of the pentose phosphate pathway",
      "C) Impaired electron transport chain function",
      "D) Increased mitochondrial ATP output",
      "E) Excess protein catabolism"
    ],
    correctIndex: 2,
    explanations: [
      "Incorrect: Glycolysis actually continues during anaerobic conditions.",
      "Incorrect: This is a separate pathway not directly linked to lactate accumulation.",
      "Correct: Oxygen is the final electron acceptor in the ETC. Without it, oxidative phosphorylation stops, and cells shift to anaerobic glycolysis, leading to lactate build-up.",
      "Incorrect: Mitochondrial ATP production decreases without oxygen.",
      "Incorrect: Protein catabolism doesn't directly cause lactate rise."
    ],
    slideLink: "Lecture 22 – Enzymes, Krebs, ATP",
    topic: "Cellular Respiration"
  },
  {
    question: "What does a high KA value indicate about a drug's affinity for its receptor?",
    options: [
      "A) Strong binding and high receptor occupancy",
      "B) Weak binding and low receptor occupancy",
      "C) Rapid elimination of the drug",
      "D) High intrinsic efficacy",
      "E) Increased maximum response"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect: Strong binding corresponds to a low KA.",
      "Correct: A high KA indicates weaker binding affinity, hence low occupancy.",
      "Incorrect: KA relates to binding, not elimination.",
      "Incorrect: KA does not describe efficacy.",
      "Incorrect: Maximum response is related to intrinsic efficacy, not KA."
    ],
    slideLink: "2024 Treatment Lecture 2 Pharmacodynamics.pdf (Slide: Occupancy Equation for Agonist Drug A)",
    topic: "Pharmacology"
  },
  {
    question: "Which enzyme family is primarily responsible for Phase I metabolism in the liver?",
    options: [
      "A) Acetyltransferases",
      "B) Glucuronosyltransferases",
      "C) Cytochrome P450 enzymes",
      "D) Monoamine oxidases",
      "E) Peptidases"
    ],
    correctIndex: 2,
    explanations: [
      "Incorrect: Acetyltransferases are involved in Phase II reactions.",
      "Incorrect: Glucuronosyltransferases are Phase II enzymes.",
      "Correct: Cytochrome P450 enzymes mediate oxidation, reduction, and hydrolysis in Phase I metabolism.",
      "Incorrect: Monoamine oxidases break down neurotransmitters, not general drug metabolism.",
      "Incorrect: Peptidases degrade peptides but are not key in Phase I metabolism."
    ],
    slideLink: "MED1028 FoCS Lecture Pre-rec - Drug Handling Processes Pharmacokinetics part1 RPlumb accessible Oct21.pdf (Slide: Metabolism – Phase I)",
    topic: "Pharmacology"
  },
  {
    question: "What is the main reason abscesses are poorly treated by antibiotics alone?",
    options: [
      "A) Antibiotics cause increased inflammation",
      "B) Abscesses are primarily viral in origin",
      "C) Abscesses have no immune response",
      "D) Antibiotics cannot effectively penetrate the low pH, avascular environment",
      "E) Bacteria in abscesses are antibiotic-resistant by nature"
    ],
    correctIndex: 3,
    explanations: [
      "Incorrect: Inflammation is part of the body's response, not caused by antibiotics.",
      "Incorrect: Abscesses are typically bacterial.",
      "Incorrect: There is an immune response, which leads to pus formation.",
      "Correct: Abscesses have poor blood supply and acidic pH, limiting antibiotic action.",
      "Incorrect: Resistance is not guaranteed; the issue is access and effectiveness."
    ],
    slideLink: "Y1 FoCS Preventing and Managing Infection notes pages.pdf (Slide: 14)",
    topic: "Microbiology"
  },
  {
    question: "Which component of Gram-negative bacteria contributes significantly to septic shock?",
    options: [
      "A) Peptidoglycan",
      "B) Lipoteichoic acid",
      "C) Lipopolysaccharide",
      "D) Capsule",
      "E) Teichoic acid"
    ],
    correctIndex: 2,
    explanations: [
      "Incorrect: Peptidoglycan is structural but not the main endotoxin.",
      "Incorrect: Lipoteichoic acid is found in Gram-positive bacteria.",
      "Correct: Lipopolysaccharide (LPS) is a potent endotoxin found in Gram-negative bacteria.",
      "Incorrect: Capsules help with immune evasion, not endotoxin effects.",
      "Incorrect: Teichoic acid is also Gram-positive associated."
    ],
    slideLink: "Y1 FoCS Organisms and Infection 2.pdf (Slide: Bacterial endotoxins)",
    topic: "Microbiology"
  }
];

// Export the questions array for use in the main app
export default focsQuestions;