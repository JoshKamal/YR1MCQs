// Import all question modules
import focsQuestions from './focs_questions.js';
import bcrQuestions from './bcr_questions.js';
import mskQuestions from './msk_questions.js';
import anatomyQuestions from './anatomy_questions.js';

// Export combined questions
export const allQuestions = [
  ...focsQuestions,
  ...bcrQuestions,
  ...mskQuestions,
  ...anatomyQuestions
];

// Export by module
export {
  focsQuestions,
  bcrQuestions,
  mskQuestions,
  anatomyQuestions
};