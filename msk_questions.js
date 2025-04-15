// MSK Questions - Musculoskeletal System
const mskQuestions = [
  {
    question: "A 55-year-old woman presents with pain and stiffness in her hand joints, primarily affecting the distal interphalangeal (DIP) joints and first carpometacarpal (CMC) joints. X-rays show joint space narrowing and osteophytes. What is the most likely diagnosis?",
    options: [
      "A) Rheumatoid arthritis",
      "B) Psoriatic arthritis",
      "C) Osteoarthritis",
      "D) Gout",
      "E) Systemic lupus erythematosus"
    ],
    correctIndex: 2,
    explanations: [
      "Incorrect: Rheumatoid arthritis typically affects proximal interphalangeal (PIP) and metacarpophalangeal (MCP) joints, usually sparing DIP joints.",
      "Incorrect: While psoriatic arthritis can affect DIP joints, it typically presents with nail changes and psoriatic skin lesions.",
      "Correct: Osteoarthritis commonly affects DIP and first CMC joints, with radiographic findings of joint space narrowing and osteophytes.",
      "Incorrect: Gout typically presents as acute monoarthritis often affecting the first metatarsophalangeal joint.",
      "Incorrect: SLE is a systemic autoimmune disease that can cause arthritis but typically affects PIP and MCP joints with less erosive changes."
    ],
    slideLink: "MSK Week 26: Osteoarthritis, Slide 8",
    topic: "Arthritis"
  },
  {
    question: "Which of the following best describes the mechanism of action of bisphosphonates in treating osteoporosis?",
    options: [
      "A) Inhibition of osteoblast activity",
      "B) Inhibition of osteoclast-mediated bone resorption",
      "C) Stimulation of parathyroid hormone production",
      "D) Inhibition of vitamin D synthesis",
      "E) Promotion of calcium excretion"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect: Bisphosphonates do not primarily inhibit osteoblasts (bone-forming cells).",
      "Correct: Bisphosphonates inhibit osteoclast function and induce osteoclast apoptosis, thereby reducing bone resorption.",
      "Incorrect: Bisphosphonates do not stimulate PTH; teriparatide (recombinant PTH) is a different osteoporosis treatment.",
      "Incorrect: Bisphosphonates do not affect vitamin D metabolism directly.",
      "Incorrect: Bisphosphonates help retain calcium in bone, not promote its excretion."
    ],
    slideLink: "MSK Pharmacology: Treatment of Bone Disorders, Slide 15",
    topic: "Bone Disorders"
  },
  {
    question: "A 28-year-old male presents with low back pain that improves with exercise and worsens with rest, especially at night. He also reports morning stiffness lasting over an hour. Laboratory tests show elevated C-reactive protein and HLA-B27 positivity. What is the most likely diagnosis?",
    options: [
      "A) Mechanical low back pain",
      "B) Ankylosing spondylitis",
      "C) Diffuse idiopathic skeletal hyperostosis (DISH)",
      "D) Lumbar disc herniation",
      "E) Osteoarthritis of the spine"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect: Mechanical back pain typically improves with rest and worsens with activity.",
      "Correct: Ankylosing spondylitis is an inflammatory spondyloarthropathy associated with HLA-B27, characterized by inflammatory back pain that improves with exercise and prolonged morning stiffness.",
      "Incorrect: DISH is a non-inflammatory condition typically affecting older adults.",
      "Incorrect: Disc herniation typically causes radicular symptoms and is not associated with HLA-B27 or inflammatory markers.",
      "Incorrect: Osteoarthritis of the spine typically affects older individuals and pain usually worsens with activity."
    ],
    slideLink: "MSK Week 25: Spondyloarthropathies, Slide 12",
    topic: "Inflammatory Arthritis"
  },
  {
    question: "Which of the following is the most appropriate initial imaging study for suspected acute compartment syndrome of the leg?",
    options: [
      "A) Plain radiographs",
      "B) Computed tomography (CT)",
      "C) Magnetic resonance imaging (MRI)",
      "D) Ultrasound",
      "E) No imaging is necessary; diagnosis is clinical"
    ],
    correctIndex: 4,
    explanations: [
      "Incorrect: X-rays may show fractures but cannot diagnose compartment syndrome.",
      "Incorrect: CT is not the initial study of choice for suspected compartment syndrome.",
      "Incorrect: While MRI can eventually show muscle changes, it takes too long for an acute emergency.",
      "Incorrect: Ultrasound may show decreased blood flow but is not reliable for diagnosis.",
      "Correct: Compartment syndrome is a clinical diagnosis confirmed by measuring compartment pressures; imaging delays definitive treatment."
    ],
    slideLink: "MSK Emergencies Week 27, Slide 18",
    topic: "Musculoskeletal Emergencies"
  },
  {
    question: "What is the primary cellular defect in Duchenne muscular dystrophy?",
    options: [
      "A) Deficiency of dystrophin protein",
      "B) Abnormal myosin heavy chain",
      "C) Defective acetylcholine receptors",
      "D) Mitochondrial DNA mutations",
      "E) Abnormal calcium channel function"
    ],
    correctIndex: 0,
    explanations: [
      "Correct: Duchenne muscular dystrophy is caused by mutations in the DMD gene leading to absence of functional dystrophin protein.",
      "Incorrect: Myosin abnormalities are associated with some congenital myopathies, not DMD.",
      "Incorrect: Acetylcholine receptor defects cause myasthenia gravis, not muscular dystrophy.",
      "Incorrect: Mitochondrial DNA mutations cause mitochondrial myopathies, not DMD.",
      "Incorrect: Calcium channel dysfunction is associated with periodic paralyses, not DMD."
    ],
    slideLink: "MSK Neuromuscular Disorders Week 28, Slide 7",
    topic: "Neuromuscular Disorders"
  }
];

// Export the questions array for use in the main app
export default mskQuestions;