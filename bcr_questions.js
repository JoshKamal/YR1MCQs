// BCR Questions - Blood, Cardiovascular and Respiratory
const bcrQuestions = [
  {
    question: "A 65-year-old patient with a history of myocardial infarction presents with dyspnea. Which of the following represents a preload-reducing therapy?",
    options: [
      "A) Digoxin",
      "B) Dobutamine",
      "C) Nitroglycerin",
      "D) Norepinephrine",
      "E) Phenylephrine"
    ],
    correctIndex: 2,
    explanations: [
      "Incorrect: Digoxin increases contractility, not reducing preload.",
      "Incorrect: Dobutamine is a positive inotrope that increases contractility.",
      "Correct: Nitroglycerin causes venodilation and reduces preload by decreasing venous return.",
      "Incorrect: Norepinephrine increases afterload by vasoconstriction.",
      "Incorrect: Phenylephrine is an alpha-1 agonist that increases afterload."
    ],
    slideLink: "Slide set 5: Treatment of Heart Failure, Slide 10",
    topic: "Cardiovascular Pharmacology"
  },
  {
    question: "What is the most likely diagnosis in a patient with normal arterial pO2 but elevated bicarbonate levels and pH?",
    options: [
      "A) Metabolic acidosis",
      "B) Respiratory acidosis",
      "C) Metabolic alkalosis",
      "D) Respiratory alkalosis",
      "E) Mixed acid-base disorder"
    ],
    correctIndex: 2,
    explanations: [
      "Incorrect: Metabolic acidosis presents with low bicarbonate and low pH.",
      "Incorrect: Respiratory acidosis shows high pCO2, low pH, and normal/slightly elevated bicarbonate.",
      "Correct: Metabolic alkalosis is characterized by elevated bicarbonate and elevated pH.",
      "Incorrect: Respiratory alkalosis shows low pCO2, high pH, and normal/slightly decreased bicarbonate.",
      "Incorrect: Information provided clearly indicates a pure metabolic alkalosis."
    ],
    slideLink: "Acid Base Balance Week 22.pdf, slide 15",
    topic: "Acid-base Physiology"
  },
  {
    question: "Which blood cell is primarily involved in antigen presentation to T cells?",
    options: [
      "A) Neutrophil",
      "B) Eosinophil",
      "C) Dendritic cell",
      "D) Erythrocyte",
      "E) Basophil"
    ],
    correctIndex: 2,
    explanations: [
      "Incorrect: Neutrophils are phagocytes that kill bacteria directly, not primary antigen presenters.",
      "Incorrect: Eosinophils primarily fight parasitic infections and allergic reactions.",
      "Correct: Dendritic cells are professional antigen-presenting cells that bridge innate and adaptive immunity.",
      "Incorrect: Erythrocytes (red blood cells) transport oxygen and have no role in antigen presentation.",
      "Incorrect: Basophils release histamine in allergic responses and are not primary antigen presenters."
    ],
    slideLink: "Immunology: The Immune Response, Slide 23",
    topic: "Immunology"
  },
  {
    question: "A patient with a pulmonary embolism would most likely demonstrate which of the following on ventilation-perfusion (V/Q) scanning?",
    options: [
      "A) Matched V/Q defect",
      "B) Normal V/Q ratio",
      "C) Decreased ventilation with normal perfusion",
      "D) Normal ventilation with decreased perfusion",
      "E) Increased ventilation with increased perfusion"
    ],
    correctIndex: 3,
    explanations: [
      "Incorrect: Matched defects are seen in conditions like pneumonia where both ventilation and perfusion are affected.",
      "Incorrect: A pulmonary embolism disrupts the V/Q ratio.",
      "Incorrect: Pulmonary embolism affects blood flow, not airflow initially.",
      "Correct: Pulmonary embolism blocks blood flow (perfusion) while ventilation remains normal in that area.",
      "Incorrect: Neither ventilation nor perfusion would be increased in pulmonary embolism."
    ],
    slideLink: "Respiratory Physiology Week 20.pdf, slide 42",
    topic: "Respiratory Physiology"
  },
  {
    question: "Which heart sound is associated with mitral stenosis?",
    options: [
      "A) Split S1",
      "B) Opening snap",
      "C) Midsystolic click",
      "D) Summation gallop",
      "E) Pericardial knock"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect: Split S1 can occur in bundle branch blocks but is not typical of mitral stenosis.",
      "Correct: The opening snap is a high-pitched early diastolic sound heard after S2 in mitral stenosis.",
      "Incorrect: Midsystolic click is associated with mitral valve prolapse, not stenosis.",
      "Incorrect: Summation gallop occurs with tachycardia when S3 and S4 merge.",
      "Incorrect: Pericardial knock is heard in constrictive pericarditis."
    ],
    slideLink: "Cardiovascular Examination.pdf, slide 31",
    topic: "Cardiovascular Examination"
  }
];

// Export the questions array for use in the main app
export default bcrQuestions;