// Anatomy Questions
const anatomyQuestions = [
  {
    question: "Which of the following structures passes through the carpal tunnel?",
    options: [
      "A) Ulnar nerve",
      "B) Ulnar artery",
      "C) Radial artery",
      "D) Median nerve",
      "E) Superficial palmar arch"
    ],
    correctIndex: 3,
    explanations: [
      "Incorrect: The ulnar nerve passes through Guyon's canal, not the carpal tunnel.",
      "Incorrect: The ulnar artery passes superficial to the flexor retinaculum in Guyon's canal.",
      "Incorrect: The radial artery is located at the lateral aspect of the wrist, not in the carpal tunnel.",
      "Correct: The median nerve passes through the carpal tunnel with the flexor tendons.",
      "Incorrect: The superficial palmar arch is located in the palm, distal to the carpal tunnel."
    ],
    slideLink: "Upper Limb Anatomy Lecture 4, Slide 18",
    topic: "Upper Limb Anatomy"
  },
  {
    question: "Which embryological structure gives rise to the trigone of the urinary bladder?",
    options: [
      "A) Allantois",
      "B) Urorectal septum",
      "C) Mesonephric duct",
      "D) Paramesonephric duct",
      "E) Urogenital sinus"
    ],
    correctIndex: 2,
    explanations: [
      "Incorrect: The allantois contributes to the urachus, not the trigone.",
      "Incorrect: The urorectal septum divides the cloaca into urogenital sinus and rectum.",
      "Correct: The mesonephric (Wolffian) ducts contribute to the formation of the bladder trigone.",
      "Incorrect: Paramesonephric (Müllerian) ducts form female reproductive structures.",
      "Incorrect: The urogenital sinus forms most of the bladder, but not the trigone specifically."
    ],
    slideLink: "Urinary System Development, Slide 12",
    topic: "Developmental Anatomy"
  },
  {
    question: "A lesion of the recurrent laryngeal nerve would most likely affect which of the following?",
    options: [
      "A) Sensation above the vocal folds",
      "B) Abduction of the vocal folds",
      "C) All intrinsic muscles of the larynx except cricothyroid",
      "D) External rotation of the shoulder",
      "E) Elevation of the soft palate"
    ],
    correctIndex: 2,
    explanations: [
      "Incorrect: Sensation above the vocal folds is supplied by the internal laryngeal nerve.",
      "Incorrect: While the recurrent laryngeal nerve does supply the posterior cricoarytenoid (the only abductor), it supplies all intrinsic muscles except cricothyroid.",
      "Correct: The recurrent laryngeal nerve supplies all intrinsic muscles of the larynx except the cricothyroid (supplied by external laryngeal nerve).",
      "Incorrect: External rotation of the shoulder involves the rotator cuff muscles, innervated by suprascapular and axillary nerves.",
      "Incorrect: Elevation of the soft palate is controlled by pharyngeal plexus branches, not the recurrent laryngeal nerve."
    ],
    slideLink: "Head and Neck Anatomy Lecture 8, Slide 25",
    topic: "Head and Neck Anatomy"
  },
  {
    question: "Which venous structure drains the basal nuclei and thalamus?",
    options: [
      "A) Great cerebral vein (of Galen)",
      "B) Superior sagittal sinus",
      "C) Straight sinus",
      "D) Inferior sagittal sinus",
      "E) Cavernous sinus"
    ],
    correctIndex: 0,
    explanations: [
      "Correct: The great cerebral vein (of Galen) receives the internal cerebral veins, which drain the basal nuclei, thalamus, and deep white matter.",
      "Incorrect: The superior sagittal sinus primarily drains the cerebral cortex and superficial white matter.",
      "Incorrect: The straight sinus receives blood from the great cerebral vein but does not directly drain these structures.",
      "Incorrect: The inferior sagittal sinus drains parts of the corpus callosum and frontal lobes.",
      "Incorrect: The cavernous sinus drains the orbit and anterior parts of the brain, not the basal nuclei."
    ],
    slideLink: "Neuroanatomy Week 14, Slide 32",
    topic: "Neuroanatomy"
  },
  {
    question: "Through which structure does the femoral artery enter the adductor canal?",
    options: [
      "A) Adductor hiatus",
      "B) Femoral triangle",
      "C) Obturator foramen",
      "D) Greater sciatic foramen",
      "E) Lacuna musculorum"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect: The adductor hiatus is where the femoral artery exits the adductor canal to become the popliteal artery.",
      "Correct: The femoral artery passes through the femoral triangle before entering the adductor canal.",
      "Incorrect: The obturator foramen is traversed by the obturator vessels and nerve, not the femoral artery.",
      "Incorrect: The greater sciatic foramen is a pathway for the sciatic nerve and other structures leaving the pelvis.",
      "Incorrect: The lacuna musculorum allows passage of iliopsoas and femoral nerve, not the femoral artery (which passes through lacuna vasorum)."
    ],
    slideLink: "Lower Limb Anatomy Lecture 5, Slide 14",
    topic: "Lower Limb Anatomy"
  }
];

// Export the questions array for use in the main app
export default anatomyQuestions;