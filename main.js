   // Initialize with empty arrays for questions until they're loaded
    const allQuestions = [];
    const focsQuestions = [];
    const bcrQuestions = [];
    const mskQuestions = [];
    const anatomyQuestions = [];
    
    // App State
    let questions = [];
    let currentQuestionIndex = 0;
    let selectedAnswer = null;
    let answerSubmitted = false;
    let userHistory = [];
    let currentSessionStats = {
      attempted: 0,
      correct: 0
    };
    let currentView = 'dashboard';
    let currentModule = 'all';
    let currentUserId = null;
    
    // API Helper Functions
    
    // Create a guest user in the database
    async function createGuestUser() {
      try {
        const response = await fetch('/api/users/guest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to create guest user');
        }
        
        const data = await response.json();
        return data.userId;
      } catch (error) {
        console.error('Error creating guest user:', error);
        return null;
      }
    }
    
    // Fetch question history for a user
    async function fetchQuestionHistory(userId) {
      try {
        const response = await fetch(`/api/users/${userId}/history`);
        
        if (!response.ok) {
          throw new Error('Failed to get question history');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error getting question history:', error);
        return [];
      }
    }
    
    // Fetch question order for a user and module
    async function fetchQuestionOrder(userId, module) {
      try {
        const response = await fetch(`/api/users/${userId}/order/${module}`);
        
        if (response.status === 404) {
          // Order not found, which is fine for new users
          return [];
        }
        
        if (!response.ok) {
          throw new Error('Failed to get question order');
        }
        
        const data = await response.json();
        return data.questionOrder || [];
      } catch (error) {
        console.error('Error getting question order:', error);
        return [];
      }
    }
    
    // Save a question history item
    async function saveQuestionHistoryItem(userId, questionText, selectedAnswer, isCorrect, module, questionData) {
      try {
        const response = await fetch(`/api/users/${userId}/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            questionText,
            selectedAnswer,
            isCorrect,
            module,
            timestamp: new Date().toISOString(),
            // Include additional metadata about the question
            topic: questionData.topic || '',
            explanation: questionData.explanations ? questionData.explanations[selectedAnswer] || '' : ''
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to save question history');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error saving question history:', error);
        return null;
      }
    }
    
    // Save question order for a user and module
    async function saveQuestionOrder(userId, module, questionOrder) {
      try {
        const response = await fetch(`/api/users/${userId}/order/${module}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            questionOrder
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to save question order');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error saving question order:', error);
        return null;
      }
    }
    let moduleQuestions = {
      all: allQuestions,
      focs: focsQuestions,
      bcr: bcrQuestions,
      msk: mskQuestions,
      anatomy: anatomyQuestions
    };
    
    // Load questions from server
    async function loadQuestions() {
      try {
        // For now we'll use sample data
        // These can be replaced with server-loaded questions later
        // Add some sample questions to each module
        addSampleQuestions();
        
        console.log("After adding sample questions:");
        console.log("All questions count:", allQuestions.length);
        console.log("FOCS questions count:", focsQuestions.length);
        console.log("BCR questions count:", bcrQuestions.length);
        console.log("MSK questions count:", mskQuestions.length);
        console.log("Anatomy questions count:", anatomyQuestions.length);
        
        // Initialize app after loading questions
        moduleQuestions.all = [...allQuestions];
        moduleQuestions.focs = [...focsQuestions];
        moduleQuestions.bcr = [...bcrQuestions];
        moduleQuestions.msk = [...mskQuestions];
        moduleQuestions.anatomy = [...anatomyQuestions];
        
        // Log module questions
        console.log("Module questions counts:");
        for (const moduleKey in moduleQuestions) {
          console.log(`${moduleKey}: ${moduleQuestions[moduleKey].length}`, 
            moduleQuestions[moduleKey].length > 0 ? 
            `First question: ${moduleQuestions[moduleKey][0]?.question || 'undefined'}` : 'No questions'
          );
        }
        
        // Make sure all questions are correctly processed
        for (const moduleKey in moduleQuestions) {
          const beforeCount = moduleQuestions[moduleKey].length;
          moduleQuestions[moduleKey] = moduleQuestions[moduleKey].filter(q => {
            const isValid = q && typeof q === 'object' && q.question && q.options && q.correctIndex !== undefined;
            if (!isValid) {
              console.warn(`Found invalid question in ${moduleKey}:`, q);
            }
            return isValid;
          });
          console.log(`Filtered ${moduleKey}: ${beforeCount} -> ${moduleQuestions[moduleKey].length}`);
        }
        
        // Make sure we have at least the main questions list
        questions = [...moduleQuestions.all];
        
        // Group similar questions by topic
        groupSimilarQuestions();
        
        // Initialize the app
        init();
      } catch (error) {
        console.error('Error loading questions:', error);
      }
    }
    
    // Group similar questions based on topics and content
    function groupSimilarQuestions() {
      const topicGroups = {};
      
      // First pass - group by exact topic matches
      allQuestions.forEach(question => {
        if (question && question.topic) {
          if (!topicGroups[question.topic]) {
            topicGroups[question.topic] = [];
          }
          topicGroups[question.topic].push(question);
        }
      });
      
      // Store the topic groups for later use
      window.topicGroups = topicGroups;
    }
    
    // Add sample questions for testing
    function addSampleQuestions() {
      // FOCS questions
      focsQuestions.push(...focsData);
      
      // Sample BCR question
      bcrQuestions.push(...bcrData);
      
      // Sample MSK question
      mskQuestions.push(...mskData);
      
      // Sample Anatomy question
      anatomyQuestions.push(...anatomyData);
      
      // Add to all questions
      allQuestions.push(...focsQuestions, ...bcrQuestions, ...mskQuestions, ...anatomyQuestions);
    }

    // DOM Elements
    const dashboardLink = document.getElementById('dashboard-link');
    const practiceLink = document.getElementById('practice-link');
    const modulesLink = document.getElementById('modules-link');
    const dashboardView = document.getElementById('dashboard-view');
    const practiceView = document.getElementById('practice-view');
    const topicFocusView = document.getElementById('topic-focus-view');
    const questionCounter = document.getElementById('question-counter');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const explanationContainer = document.getElementById('explanation-container');
    const explanationText = document.getElementById('explanation-text');
    const slideLink = document.getElementById('slide-link');
    const prevQuestion = document.getElementById('prev-question');
    const nextQuestion = document.getElementById('next-question');
    const skipQuestion = document.getElementById('skip-question');
    const questionProgress = document.getElementById('question-progress');
    const sessionAttempted = document.getElementById('session-attempted');
    const sessionCorrect = document.getElementById('session-correct');
    const sessionAccuracy = document.getElementById('session-accuracy');
    const currentTopic = document.getElementById('current-topic');
    const currentModuleBadge = document.getElementById('current-module-badge');
    const totalAttempted = document.getElementById('total-attempted');
    const totalCorrect = document.getElementById('total-correct');
    const overallAccuracy = document.getElementById('overall-accuracy');
    const accuracyProgress = document.getElementById('accuracy-progress');
    const recentActivity = document.getElementById('recent-activity');
    const focusTopicsContainer = document.getElementById('focus-topics-container');
    const topicsAnalysis = document.getElementById('topics-analysis');
    const exportData = document.getElementById('export-data');
    const resetData = document.getElementById('reset-data');
    const startNewSession = document.getElementById('start-new-session');
    const topicFilter = document.getElementById('topic-filter');
    const statusFilter = document.getElementById('status-filter');
    const startFocusedPractice = document.getElementById('start-focused-practice');
    const topicStatsContainer = document.getElementById('topic-stats-container');
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const confirmModalTitle = document.getElementById('confirmModalTitle');
    const confirmModalBody = document.getElementById('confirmModalBody');
    const confirmModalAction = document.getElementById('confirmModalAction');
    
    // Initialize app
    async function init() {
      // First, ensure we have a user ID - either from local storage or create a new one
      const savedUserId = localStorage.getItem('userID');
      if (savedUserId) {
        currentUserId = parseInt(savedUserId);
      } else {
        // Create a new guest user
        currentUserId = await createGuestUser();
        if (currentUserId) {
          localStorage.setItem('userID', currentUserId);
        } else {
          // If creating a guest user fails, fall back to local storage only
          console.warn('Failed to create guest user, falling back to local storage');
          loadUserHistory();
        }
      }
      
      // If we have a valid user ID, fetch history and question order from database
      if (currentUserId) {
        try {
          // Fetch user history from the database
          const dbHistory = await fetchQuestionHistory(currentUserId);
          if (dbHistory && dbHistory.length > 0) {
            // Convert DB history format to our app format
            userHistory = dbHistory.map(item => ({
              questionIndex: 0, // We'll need to find the actual index
              questionText: item.questionText, // Store the text for lookup
              selectedAnswer: item.selectedAnswer,
              isCorrect: item.isCorrect,
              timestamp: item.timestamp,
              module: item.module
            }));
            
            // Match DB history items with actual questions by text
            userHistory.forEach(historyItem => {
              for (const moduleKey in moduleQuestions) {
                const moduleQuestionsArray = moduleQuestions[moduleKey];
                const questionIndex = moduleQuestionsArray.findIndex(q => q.question === historyItem.questionText);
                if (questionIndex >= 0) {
                  historyItem.questionIndex = questionIndex;
                  break;
                }
              }
            });
          } else {
            // No database history, try local storage as backup
            loadUserHistory();
          }
        } catch (error) {
          console.error('Error initializing from database:', error);
          // Fall back to local storage
          loadUserHistory();
        }
      } else {
        // No user ID, use local storage
        loadUserHistory();
      }
      
      // Check if there's a saved question index and module to resume from
      const savedQuestionIndex = localStorage.getItem('lastQuestionIndex');
      const savedModule = localStorage.getItem('lastModule');
      
      if (savedModule && moduleQuestions[savedModule]) {
        currentModule = savedModule;
        
        // Update the module badge text
        const moduleName = savedModule === 'all' ? 'All Modules' : savedModule.toUpperCase();
        currentModuleBadge.textContent = moduleName;
      }
      
      // Set up event listeners
      setupEventListeners();
      
      // Try to get saved question order for current module from database
      if (currentUserId) {
        try {
          const savedOrder = await fetchQuestionOrder(currentUserId, currentModule);
          if (savedOrder && Array.isArray(savedOrder) && savedOrder.length > 0) {
            // We have a saved order, use it instead of random shuffling
            const orderedQuestions = [];
            
            // Get all module questions
            const allModuleQuestions = [...moduleQuestions[currentModule]];
            
            // Build the ordered questions array based on saved text
            savedOrder.forEach(questionText => {
              const foundQuestion = allModuleQuestions.find(q => q.question === questionText);
              if (foundQuestion) {
                orderedQuestions.push(foundQuestion);
              }
            });
            
            // Add any new questions that weren't in the saved order
            const savedQuestionTexts = new Set(savedOrder);
            const newQuestions = allModuleQuestions.filter(q => !savedQuestionTexts.has(q.question));
            
            // Shuffle only the new questions
            for (let i = newQuestions.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [newQuestions[i], newQuestions[j]] = [newQuestions[j], newQuestions[i]];
            }
            
            // Combine ordered and new questions
            questions = [...orderedQuestions, ...newQuestions];
          } else {
            // No saved order, filter unseen questions as before
            filterUnseenQuestions();
          }
        } catch (error) {
          console.error('Error fetching question order:', error);
          // Fall back to filtering unseen questions
          filterUnseenQuestions();
        }
      } else {
        // No user ID, filter unseen questions as before
        filterUnseenQuestions();
      }
      
      // Restore position if we have a saved index
      if (savedQuestionIndex) {
        // If we have a saved index, try to restore it
        currentQuestionIndex = parseInt(savedQuestionIndex);
        
        // Ensure the index is valid
        if (isNaN(currentQuestionIndex) || currentQuestionIndex >= questions.length) {
          currentQuestionIndex = 0;
        }
        
        // Add a resume banner
        const resumeBanner = document.createElement('div');
        resumeBanner.className = 'alert alert-info mb-3';
        resumeBanner.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <i class="bi bi-bookmark-check me-2"></i>
              Resuming from where you left off. Question ${currentQuestionIndex + 1} of ${questions.length}.
            </div>
            <button id="start-new-session" class="btn btn-sm btn-outline-primary">
              Start New Session
            </button>
          </div>
        `;
        
        const questionCard = document.querySelector('.question-card .card-body');
        if (questionCard) {
          questionCard.insertBefore(resumeBanner, questionCard.firstChild);
          
          // Add event listener to the new session button
          document.getElementById('start-new-session').addEventListener('click', async () => {
            // Remove the banner
            resumeBanner.remove();
            
            // Start a completely new session with current module questions (not filtering out attempted ones)
            await startFreshQuestionSet(currentModule);
            
            // Clear the saved index so we don't resume from this point next time
            localStorage.removeItem('lastQuestionIndex');
            
            // Reset to question 1
            currentQuestionIndex = 0;
            loadQuestion();
            
            // Reset session stats
            currentSessionStats = {
              attempted: 0,
              correct: 0
            };
            updateSessionStats();
          });
        }
      }
      
      // Load the current question
      loadQuestion();
      
      // Update dashboard stats
      updateDashboardStats();
      
      // Add a Resume Practice button to the dashboard if there's a saved session
      if (savedQuestionIndex && savedModule) {
        const resumeBtn = document.createElement('div');
        resumeBtn.className = 'col-md-6 mb-4';
        resumeBtn.innerHTML = `
          <div class="card h-100 bg-light">
            <div class="card-body">
              <h5 class="card-title">Resume Your Progress</h5>
              <p class="card-text">
                Continue your last ${savedModule === 'all' ? 'practice session' : savedModule.toUpperCase() + ' module'} from question ${parseInt(savedQuestionIndex) + 1}.
              </p>
              <button id="resume-practice-btn" class="btn btn-primary">
                <i class="bi bi-play-fill me-1"></i>Resume Practice
              </button>
            </div>
          </div>
        `;
        
        const dashboardStatsRow = document.querySelector('#dashboard-stats-row');
        if (dashboardStatsRow) {
          dashboardStatsRow.insertBefore(resumeBtn, dashboardStatsRow.firstChild);
          
          // Add event listener
          document.getElementById('resume-practice-btn').addEventListener('click', () => {
            // Set the module
            currentModule = savedModule;
            
            // Update the module badge text
            const moduleName = savedModule === 'all' ? 'All Modules' : savedModule.toUpperCase();
            currentModuleBadge.textContent = moduleName;
            
            // First, let's get unseen questions
            filterUnseenQuestions();
            
            // Now restore to the saved position (if valid)
            const savedIndex = parseInt(savedQuestionIndex);
            if (!isNaN(savedIndex) && savedIndex < questions.length) {
              currentQuestionIndex = savedIndex;
            } else {
              currentQuestionIndex = 0;
            }
            
            // Reset session stats
            currentSessionStats = {
              attempted: 0,
              correct: 0
            };
            updateSessionStats();
            
            // Load the question and switch to practice view
            loadQuestion();
            switchView('practice');
          });
        }
      }
    }
    
    // Filter for unseen questions and maintain persistent order
    // New function to create a fresh question set for a new session
    async function startFreshQuestionSet(specificModule = null) {
      // Use the specified module if provided, otherwise use current module
      const moduleToUse = specificModule || currentModule;
      
      // Get all questions for the specified module
      const allModuleQuestions = [...moduleQuestions[moduleToUse]];
      
      // Create a new random order for ALL questions (not filtering out attempted ones)
      const shuffledQuestions = [...allModuleQuestions];
      
      // Shuffle the questions
      for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
      }
      
      // Use this as our new question set
      questions = shuffledQuestions;
      
      // If we have a user ID, save this new order to the database
      if (currentUserId) {
        const questionTexts = questions.map(q => q.question);
        try {
          await saveQuestionOrder(currentUserId, currentModule, questionTexts);
          console.log(`Saved new order with ${questionTexts.length} questions for new session`);
        } catch (error) {
          console.error('Error saving new question order:', error);
        }
      }
      
      // Important: Create a new, clean session
      window.sessionQuestions = [...questions];
      
      // Log for debugging
      console.log(`Created fresh set of ${questions.length} questions for module ${currentModule}`);
    }
    
    async function filterUnseenQuestions() {
      // Get all questions for the current module
      const allModuleQuestions = [...moduleQuestions[currentModule]];
      
      // Find which questions have been attempted
      const attemptedQuestionTexts = new Set();
      
      userHistory.forEach(item => {
        // First try to use the question text directly if available (from database)
        if (item.questionText) {
          // Check if this question exists in our current module
          if (allModuleQuestions.some(q => q.question === item.questionText)) {
            attemptedQuestionTexts.add(item.questionText);
            return; // Continue to next item
          }
        }
        
        // If no question text or not found, look through all modules using index (local storage format)
        for (const modKey in moduleQuestions) {
          const moduleQuestionsArray = moduleQuestions[modKey];
          if (item.questionIndex < moduleQuestionsArray.length) {
            const questionText = moduleQuestionsArray[item.questionIndex].question;
            
            // Check if this is a question in our current module
            if (allModuleQuestions.some(q => q.question === questionText)) {
              attemptedQuestionTexts.add(questionText);
              break;
            }
          }
        }
      });
      
      // First check if we have a saved question order in the database
      let savedOrder = null;
      if (currentUserId) {
        try {
          savedOrder = await fetchQuestionOrder(currentUserId, currentModule);
        } catch (error) {
          console.error('Error fetching question order:', error);
        }
      }
      
      if (savedOrder && Array.isArray(savedOrder) && savedOrder.length > 0) {
        console.log(`Using saved order with ${savedOrder.length} questions`);
        
        // Recreate the questions array based on the saved order
        const orderedQuestions = [];
        const remainingQuestions = [];
        
        // First add questions from the saved order that haven't been attempted
        savedOrder.forEach(questionText => {
          const foundQuestion = allModuleQuestions.find(q => q.question === questionText);
          if (foundQuestion && !attemptedQuestionTexts.has(questionText)) {
            orderedQuestions.push(foundQuestion);
          }
        });
        
        // Then add any new questions that weren't in the saved order
        const savedQuestionTexts = new Set(savedOrder);
        allModuleQuestions.forEach(question => {
          if (!savedQuestionTexts.has(question.question) && !attemptedQuestionTexts.has(question.question)) {
            remainingQuestions.push(question);
          }
        });
        
        // Combine the sets, with new questions at the end
        questions = [...orderedQuestions, ...remainingQuestions];
        
        // If all questions have been seen, use all questions in saved order
        if (questions.length === 0) {
          const allOrderedQuestions = [];
          savedOrder.forEach(questionText => {
            const foundQuestion = allModuleQuestions.find(q => q.question === questionText);
            if (foundQuestion) {
              allOrderedQuestions.push(foundQuestion);
            }
          });
          
          // Add any questions not in the saved order
          allModuleQuestions.forEach(question => {
            if (!savedQuestionTexts.has(question.question)) {
              allOrderedQuestions.push(question);
            }
          });
          
          questions = allOrderedQuestions;
        }
      } else {
        // Filter to only unseen questions
        questions = allModuleQuestions.filter(question => !attemptedQuestionTexts.has(question.question));
        
        // If all questions have been seen, reset to all questions
        if (questions.length === 0) {
          questions = [...allModuleQuestions];
        }
        
        // No saved order - create a shuffled order but save it for consistency
        // Shuffle the filtered questions
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        
        // Save this order to the database for future sessions if we have a user ID
        if (currentUserId) {
          const questionTexts = questions.map(q => q.question);
          try {
            await saveQuestionOrder(currentUserId, currentModule, questionTexts);
            console.log(`Saved new order with ${questionTexts.length} questions`);
          } catch (error) {
            console.error('Error saving question order:', error);
          }
        }
      }
      
      console.log(`Selected ${questions.length} questions for module ${currentModule}`);
      
      // Important: Create a new, clean session - store these questions as the current session's questions
      window.sessionQuestions = [...questions]; 
      
      // Reset the index
      currentQuestionIndex = 0;
    }
    
    // Load user history from local storage
    function loadUserHistory() {
      const savedHistory = localStorage.getItem('userHistory');
      if (savedHistory) {
        userHistory = JSON.parse(savedHistory);
      }
    }
    
    // Save user history to local storage
    function saveUserHistory() {
      localStorage.setItem('userHistory', JSON.stringify(userHistory));
    }
    
    // Shuffle questions array - now uses filterUnseenQuestions to only show unseen 
    // questions by default in practice mode
    async function shuffleQuestions() {
      // Filter for unseen questions - when starting a new session
      await filterUnseenQuestions();
      currentQuestionIndex = 0;
    }
    
    // Load current question
    function loadQuestion() {
      if (questions.length === 0) {
        questionText.textContent = "No questions available.";
        optionsContainer.innerHTML = "";
        return;
      }
      
      const question = questions[currentQuestionIndex];
      questionText.textContent = question.question;
      questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
      currentTopic.textContent = question.topic;
      
      // Update progress bar
      const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
      questionProgress.style.width = `${progressPercent}%`;
      
      // Clear previous options and explanation
      optionsContainer.innerHTML = "";
      explanationContainer.classList.add('d-none');
      
      // Randomize the options order (but maintain the correct answer)
      const randomizedOptions = randomizeOptions(question.options, question.correctIndex);
      const correctOptionNewIndex = randomizedOptions.correctNewIndex;
      
      // Populate options with randomized order
      randomizedOptions.options.forEach((option, displayIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option.text;
        optionDiv.dataset.index = displayIndex;
        optionDiv.dataset.originalIndex = option.originalIndex;
        
        // Check if this question has been answered in this session
        const historyItem = findQuestionInHistory(currentQuestionIndex);
        if (historyItem) {
          if (historyItem.selectedAnswer === option.originalIndex) {
            optionDiv.classList.add('selected');
            if (option.originalIndex === question.correctIndex) {
              optionDiv.classList.add('correct');
            } else {
              optionDiv.classList.add('incorrect');
            }
          } else if (option.originalIndex === question.correctIndex) {
            optionDiv.classList.add('correct');
          }
          answerSubmitted = true;
          explanationContainer.classList.remove('d-none');
          populateExplanation(question);
        } else {
          answerSubmitted = false;
          optionDiv.addEventListener('click', () => selectOption(displayIndex, option.originalIndex));
        }
        
        optionsContainer.appendChild(optionDiv);
      });
      
      // Update navigation buttons
      prevQuestion.disabled = currentQuestionIndex === 0;
      nextQuestion.disabled = !answerSubmitted;
    }
    
    // Randomize the order of options while keeping track of the correct answer
    function randomizeOptions(options, correctIndex) {
      // Create an array with the options and their original indices
      const optionsWithIndices = options.map((text, index) => ({
        text,
        originalIndex: index
      }));
      
      // Shuffle the options
      for (let i = optionsWithIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndices[i], optionsWithIndices[j]] = [optionsWithIndices[j], optionsWithIndices[i]];
      }
      
      // Find the new index of the correct answer
      const correctNewIndex = optionsWithIndices.findIndex(option => option.originalIndex === correctIndex);
      
      return {
        options: optionsWithIndices,
        correctNewIndex
      };
    }
    
    // Select an option
    function selectOption(displayIndex, originalIndex) {
      if (answerSubmitted) return;
      
      selectedAnswer = originalIndex; // Use the original index for tracking
      const question = questions[currentQuestionIndex];
      
      // Mark the selected option
      const options = optionsContainer.querySelectorAll('.quiz-option');
      options.forEach(option => {
        const optionDisplayIndex = parseInt(option.dataset.index);
        const optionOriginalIndex = parseInt(option.dataset.originalIndex);
        option.classList.remove('selected', 'correct', 'incorrect');
        
        if (optionDisplayIndex === displayIndex) {
          option.classList.add('selected');
          if (optionOriginalIndex === question.correctIndex) {
            option.classList.add('correct');
          } else {
            option.classList.add('incorrect');
          }
        } else if (optionOriginalIndex === question.correctIndex) {
          option.classList.add('correct');
        }
      });
      
      // Show explanation
      explanationContainer.classList.remove('d-none');
      populateExplanation(question);
      
      // Record answer using the original index for correctness checking
      const isCorrect = selectedAnswer === question.correctIndex;
      recordAnswer(currentQuestionIndex, selectedAnswer, isCorrect);
      
      // Save the current question index for resume functionality
      localStorage.setItem('lastQuestionIndex', currentQuestionIndex);
      localStorage.setItem('lastModule', currentModule);
      
      // Update stats
      currentSessionStats.attempted++;
      if (isCorrect) currentSessionStats.correct++;
      updateSessionStats();
      
      // Enable next button
      nextQuestion.disabled = false;
      answerSubmitted = true;
    }
    
    // Populate explanation
    function populateExplanation(question) {
      explanationText.innerHTML = '';
      question.explanations.forEach((exp, index) => {
        const expPara = document.createElement('p');
        expPara.className = 'mb-1';
        if (exp.includes('Correct:')) {
          expPara.className += ' text-success fw-bold';
        }
        expPara.textContent = exp;
        explanationText.appendChild(expPara);
      });
      
      slideLink.textContent = question.slideLink;
    }
    
    // Record answer in history
    async function recordAnswer(questionIndex, selectedAnswer, isCorrect) {
      const question = questions[questionIndex];
      
      // Create a history item
      const historyItem = {
        questionIndex: questionIndex,
        questionText: question.question, // Store actual question text for better lookup
        selectedAnswer: selectedAnswer,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString(),
        module: currentModule
      };
      
      // Check if this question has already been answered in this session
      const existingIndex = userHistory.findIndex(item => 
        (item.questionIndex === questionIndex && 
         questions[item.questionIndex]?.question === questions[questionIndex].question) ||
        (item.questionText === question.question) // Also match by text in case indices change
      );
      
      if (existingIndex !== -1) {
        userHistory[existingIndex] = historyItem;
      } else {
        userHistory.push(historyItem);
      }
      
      // Save to local storage as backup
      saveUserHistory();
      
      // Save to database if we have a user ID
      if (currentUserId) {
        try {
          // Save the history item to the database
          await saveQuestionHistoryItem(
            currentUserId,
            question.question,
            selectedAnswer,
            isCorrect,
            currentModule,
            {
              topic: question.topic || '',
              slideLink: question.slideLink || '',
              options: question.options || [],
              correctIndex: question.correctIndex,
              explanations: question.explanations || []
            }
          );
          
          // Also save the current question order to maintain consistency
          const questionTexts = questions.map(q => q.question);
          await saveQuestionOrder(currentUserId, currentModule, questionTexts);
        } catch (error) {
          console.error('Error saving to database:', error);
          // Continue with local storage version
        }
      }
      
      updateDashboardStats();
    }
    
    // Find a question in history
    function findQuestionInHistory(questionIndex) {
      if (!questions[questionIndex]) return null;
      const questionText = questions[questionIndex].question;
      
      return userHistory.find(item => 
        // Try to match by index and question text
        (item.questionIndex === questionIndex && 
         questions[item.questionIndex]?.question === questionText) ||
        // Or match directly by question text (for database-loaded history)
        item.questionText === questionText
      );
    }
    
    // Update session statistics
    function updateSessionStats() {
      sessionAttempted.textContent = currentSessionStats.attempted;
      sessionCorrect.textContent = currentSessionStats.correct;
      
      const accuracy = currentSessionStats.attempted ? 
        Math.round((currentSessionStats.correct / currentSessionStats.attempted) * 100) : 0;
      sessionAccuracy.textContent = `${accuracy}%`;
    }
    
    // Update dashboard statistics
    function updateDashboardStats() {
      // Update overall stats
      const attemptedCount = userHistory.length;
      const correctCount = userHistory.filter(item => item.isCorrect).length;
      const accuracyRate = attemptedCount ? Math.round((correctCount / attemptedCount) * 100) : 0;
      
      totalAttempted.textContent = attemptedCount;
      totalCorrect.textContent = correctCount;
      overallAccuracy.textContent = `${accuracyRate}%`;
      accuracyProgress.style.width = `${accuracyRate}%`;
      
      // Update recent activity
      updateRecentActivity();
      
      // Update focus topics
      updateFocusTopics();
      
      // Update topics analysis
      updateTopicsAnalysis();
      
      // Update topic stats in the focus view
      updateTopicStats();
    }
    
    // Update recent activity
    function updateRecentActivity() {
      const recentItems = [...userHistory]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
      
      if (recentItems.length === 0) {
        recentActivity.innerHTML = '<p class="text-center text-muted">No recent activity</p>';
        return;
      }
      
      const activityList = document.createElement('ul');
      activityList.className = 'list-group';
      
      recentItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // First try to get question text directly from the history item (database format)
        let questionText = item.questionText;
        
        // If not found, try to get it from the questions array (local storage format)
        if (!questionText && questions[item.questionIndex]) {
          questionText = questions.find(q => q.question === questions[item.questionIndex].question)?.question;
        }
        
        const truncatedQuestion = questionText ? 
          (questionText.length > 70 ? questionText.substring(0, 70) + '...' : questionText) : 
          'Unknown question';
        
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleString();
        
        listItem.innerHTML = `
          <div>
            <small class="text-muted">${timeStr}</small>
            <div>${truncatedQuestion}</div>
          </div>
          <span class="badge ${item.isCorrect ? 'bg-success' : 'bg-danger'} rounded-pill ms-2">
            ${item.isCorrect ? 'Correct' : 'Incorrect'}
          </span>
        `;
        
        activityList.appendChild(listItem);
      });
      
      recentActivity.innerHTML = '';
      recentActivity.appendChild(activityList);
    }
    
    // Update focus topics
    function updateFocusTopics() {
      if (userHistory.length < 5) {
        focusTopicsContainer.innerHTML = '<p class="text-center text-muted">Complete more questions to get recommendations</p>';
        return;
      }
      
      // Get topic stats
      const topicStats = {};
      userHistory.forEach(item => {
        // First try to find the question by text if available in the history item (DB format)
        let question;
        if (item.questionText) {
          // Search in all modules for this question text
          for (const modKey in moduleQuestions) {
            question = moduleQuestions[modKey].find(q => q.question === item.questionText);
            if (question) break;
          }
        } 
        
        // If not found by text, try by index (local storage format)
        if (!question && questions[item.questionIndex]) {
          question = questions.find(q => q.question === questions[item.questionIndex].question);
        }
        
        if (!question) return;
        
        const topic = question.topic;
        if (!topicStats[topic]) {
          topicStats[topic] = { attempted: 0, correct: 0 };
        }
        
        topicStats[topic].attempted++;
        if (item.isCorrect) {
          topicStats[topic].correct++;
        }
      });
      
      // Calculate accuracy for each topic
      for (const topic in topicStats) {
        const stats = topicStats[topic];
        stats.accuracy = stats.attempted ? (stats.correct / stats.attempted) * 100 : 0;
      }
      
      // Sort topics by accuracy (ascending) and get the bottom 3
      const focusTopics = Object.entries(topicStats)
        .filter(([_, stats]) => stats.attempted >= 2) // At least 2 attempts
        .sort(([_, statsA], [__, statsB]) => statsA.accuracy - statsB.accuracy)
        .slice(0, 3);
      
      if (focusTopics.length === 0) {
        focusTopicsContainer.innerHTML = '<p class="text-center text-muted">Complete more questions in each topic to get recommendations</p>';
        return;
      }
      
      const focusList = document.createElement('div');
      focusList.className = 'row';
      
      focusTopics.forEach(([topic, stats]) => {
        const accuracy = Math.round(stats.accuracy);
        let reason, backgroundColor;
        
        if (accuracy < 40) {
          reason = 'Major improvement needed';
          backgroundColor = '#fee2e2'; // Light red
        } else if (accuracy < 70) {
          reason = 'Needs more practice';
          backgroundColor = '#fef3c7'; // Light yellow
        } else {
          reason = 'Good but can improve';
          backgroundColor = '#d1fae5'; // Light green
        }
        
        const topicCol = document.createElement('div');
        topicCol.className = 'col-md-4 mb-3';
        topicCol.innerHTML = `
          <div class="card h-100" style="background-color: ${backgroundColor};">
            <div class="card-body">
              <h5 class="card-title">${topic}</h5>
              <div class="d-flex justify-content-between mb-2">
                <div>
                  <small class="text-muted">Accuracy</small>
                  <div class="h4">${accuracy}%</div>
                </div>
                <div>
                  <small class="text-muted">Attempted</small>
                  <div class="h4">${stats.attempted}</div>
                </div>
              </div>
              <p class="card-text"><small>${reason}</small></p>
              <button class="btn btn-sm btn-primary focus-topic-btn" data-topic="${topic}">
                Practice Now
              </button>
            </div>
          </div>
        `;
        
        focusList.appendChild(topicCol);
      });
      
      focusTopicsContainer.innerHTML = '';
      focusTopicsContainer.appendChild(focusList);
      
      // Add event listeners to focus topic buttons
      document.querySelectorAll('.focus-topic-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const topic = btn.dataset.topic;
          
          // Find appropriate module for this topic
          for (const moduleKey in moduleQuestions) {
            const moduleQuestionsArray = moduleQuestions[moduleKey];
            const hasTopic = moduleQuestionsArray.some(q => q.topic === topic);
            
            if (hasTopic) {
              // Select the module and incorrect filter
              currentModule = moduleKey;
              const filteredQuestions = getFilteredQuestions(moduleKey, 'incorrect');
              
              if (filteredQuestions.length === 0) {
                alert('No incorrect questions for this topic. Try a different filter.');
                return;
              }
              
              questions = filteredQuestions;
              currentQuestionIndex = 0;
              loadQuestion();
              
              // Reset session stats
              currentSessionStats = {
                attempted: 0,
                correct: 0
              };
              updateSessionStats();
              
              // Switch to practice view
              switchView('practice');
              return;
            }
          }
          
          // If no module found with this topic
          alert('Could not find this topic in any module.');
        });
      });
    }
    
    // Update topics analysis
    function updateTopicsAnalysis() {
      // Get all unique topics
      const allTopics = [...new Set(questions.map(q => q.topic))];
      
      if (userHistory.length === 0) {
        topicsAnalysis.innerHTML = '<p class="text-center text-muted">Complete more questions to see topic analysis</p>';
        return;
      }
      
      // Get detailed stats for each topic
      const topicAnalysis = allTopics.map(topic => {
        const topicQuestions = questions.filter(q => q.topic === topic);
        const attemptedHistory = userHistory.filter(item => {
          // First try to find the question by text if available in the history item (DB format)
          if (item.questionText) {
            // Find the question in all modules with this text
            for (const modKey in moduleQuestions) {
              const question = moduleQuestions[modKey].find(q => q.question === item.questionText);
              if (question && question.topic === topic) {
                return true;
              }
            }
            return false;
          } 
          
          // If not found by text, try by index (local storage format)
          const question = questions.find(q => q.question === questions[item.questionIndex]?.question);
          return question && question.topic === topic;
        });
        
        const attempted = attemptedHistory.length;
        const correct = attemptedHistory.filter(item => item.isCorrect).length;
        const accuracy = attempted ? (correct / attempted) * 100 : 0;
        
        // Extract key concepts (simplified)
        const keyConcepts = topicQuestions
          .map(q => q.question.split(' ').slice(0, 3).join(' ') + '...')
          .slice(0, 3);
        
        return {
          name: topic,
          attempted,
          correct,
          accuracy,
          keyConcepts
        };
      }).filter(topic => topic.attempted > 0);
      
      if (topicAnalysis.length === 0) {
        topicsAnalysis.innerHTML = '<p class="text-center text-muted">Complete more questions to see topic analysis</p>';
        return;
      }
      
      // Sort by most attempted
      topicAnalysis.sort((a, b) => b.attempted - a.attempted);
      
      const analysisCards = document.createElement('div');
      analysisCards.className = 'row';
      
      topicAnalysis.forEach(topic => {
        const accuracyRounded = Math.round(topic.accuracy);
        let textColor = 'text-danger';
        
        if (accuracyRounded >= 70) {
          textColor = 'text-success';
        } else if (accuracyRounded >= 40) {
          textColor = 'text-warning';
        }
        
        const topicCard = document.createElement('div');
        topicCard.className = 'col-md-4 mb-3';
        topicCard.innerHTML = `
          <div class="card topic-card h-100">
            <div class="card-header">
              ${topic.name}
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between mb-3">
                <div>
                  <small class="text-muted">Attempted</small>
                  <div class="h4">${topic.attempted}</div>
                </div>
                <div>
                  <small class="text-muted">Correct</small>
                  <div class="h4">${topic.correct}</div>
                </div>
                <div>
                  <small class="text-muted">Accuracy</small>
                  <div class="h4 ${textColor}">${accuracyRounded}%</div>
                </div>
              </div>
              
              <h6 class="card-subtitle mb-2 text-muted">Key Concepts:</h6>
              <ul class="list-group list-group-flush">
                ${topic.keyConcepts.map(concept => `
                  <li class="list-group-item py-1">${concept}</li>
                `).join('')}
              </ul>
            </div>
          </div>
        `;
        
        analysisCards.appendChild(topicCard);
      });
      
      topicsAnalysis.innerHTML = '';
      topicsAnalysis.appendChild(analysisCards);
    }
    
    // Update topic filters function was removed as we no longer use topic filtering dropdowns
    
    // Get filtered questions based on module and filter type
    function getFilteredQuestions(moduleType, filterType) {
      // Get all questions from the specified module
      const allModuleQuestions = [...moduleQuestions[moduleType]];
      
      // If we want all questions, just return them all
      if (filterType === 'all') {
        return allModuleQuestions;
      }
      
      // Find which questions from this module have been attempted
      const attemptedQuestionTexts = new Set();
      const correctQuestionTexts = new Set();
      const incorrectQuestionTexts = new Set();
      
      userHistory.forEach(item => {
        let questionText;
        let foundInTargetModule = false;
        
        // First try to get question text directly from history item (DB format)
        if (item.questionText) {
          questionText = item.questionText;
          
          // Check if this question exists in our target module
          foundInTargetModule = allModuleQuestions.some(q => q.question === questionText);
          
          if (foundInTargetModule) {
            attemptedQuestionTexts.add(questionText);
            if (item.isCorrect) {
              correctQuestionTexts.add(questionText);
            } else {
              incorrectQuestionTexts.add(questionText);
            }
            return; // Continue to next history item
          }
        }
        
        // If not found by text, or no text available, try by index (local storage format)
        // Look through all modules to find the question
        for (const modKey in moduleQuestions) {
          const moduleQuestionsArray = moduleQuestions[modKey];
          if (item.questionIndex < moduleQuestionsArray.length) {
            const questionText = moduleQuestionsArray[item.questionIndex].question;
            
            // Check if this question exists in our target module
            const foundInTargetModule = allModuleQuestions.some(q => q.question === questionText);
            
            if (foundInTargetModule) {
              attemptedQuestionTexts.add(questionText);
              if (item.isCorrect) {
                correctQuestionTexts.add(questionText);
              } else {
                incorrectQuestionTexts.add(questionText);
              }
              break;
            }
          }
        }
      });
      
      // Filter based on the filterType
      let filteredQuestions = [];
      
      switch (filterType) {
        case 'correct':
          filteredQuestions = allModuleQuestions.filter(q => correctQuestionTexts.has(q.question));
          break;
        case 'incorrect':
          filteredQuestions = allModuleQuestions.filter(q => incorrectQuestionTexts.has(q.question));
          break;
        case 'unattempted':
          filteredQuestions = allModuleQuestions.filter(q => !attemptedQuestionTexts.has(q.question));
          break;
        default:
          filteredQuestions = allModuleQuestions;
      }
      
      // Shuffle the filtered questions
      for (let i = filteredQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
      }
      
      return filteredQuestions;
    }
    
    // Update module stats
    function updateTopicStats() {
      // Update stats for each module
      updateModuleStats('all', allQuestions);
      updateModuleStats('focs', focsQuestions);
      updateModuleStats('bcr', bcrQuestions);
      updateModuleStats('msk', mskQuestions);
      updateModuleStats('anatomy', anatomyQuestions);
    }
    
    // Update stats for a specific module
    function updateModuleStats(moduleType, moduleQuestions) {
      // Get all questions from this module
      const allModuleQuestions = [...moduleQuestions];
      
      // Find the attempted questions
      const attemptedCount = userHistory.filter(item => {
        // First try to find by question text if available (DB format)
        if (item.questionText) {
          return allModuleQuestions.some(q => q.question === item.questionText);
        }
        
        // Otherwise try by index (local storage format)
        for (const modKey in moduleQuestions) {
          const modQuestionsArray = moduleQuestions[modKey];
          if (item.questionIndex < modQuestionsArray.length) {
            const questionText = modQuestionsArray[item.questionIndex].question;
            return allModuleQuestions.some(q => q.question === questionText);
          }
        }
        return false;
      }).length;
      
      // Find the correct answers
      const correctCount = userHistory.filter(item => {
        if (!item.isCorrect) return false;
        
        // First try to find by question text if available (DB format)
        if (item.questionText) {
          return allModuleQuestions.some(q => q.question === item.questionText);
        }
        
        // Otherwise try by index (local storage format)
        for (const modKey in moduleQuestions) {
          const modQuestionsArray = moduleQuestions[modKey];
          if (item.questionIndex < modQuestionsArray.length) {
            const questionText = modQuestionsArray[item.questionIndex].question;
            return allModuleQuestions.some(q => q.question === questionText);
          }
        }
        return false;
      }).length;
      
      // Calculate accuracy
      const accuracy = attemptedCount ? Math.round((correctCount / attemptedCount) * 100) : 0;
      
      // Update the HTML elements
      document.getElementById(`${moduleType}-total`).textContent = allModuleQuestions.length;
      document.getElementById(`${moduleType}-completed`).textContent = attemptedCount;
      document.getElementById(`${moduleType}-accuracy`).textContent = `${accuracy}%`;
    }
    
    // Set up module selection
    function setupModuleSelection() {
      document.querySelectorAll('.dropdown-menu a[data-module]').forEach(item => {
        item.addEventListener('click', async (event) => {
          event.preventDefault();
          const module = event.target.dataset.module;
          currentModule = module;
          
          // Update badge
          currentModuleBadge.textContent = module === 'all' ? 'All Questions' : module.toUpperCase();
          
          // Reset session stats
          currentSessionStats = {
            attempted: 0,
            correct: 0
          };
          
          // Check if we have a saved order for this module in the database
          let savedOrder = null;
          if (currentUserId) {
            try {
              savedOrder = await fetchQuestionOrder(currentUserId, module);
              console.log(`Module ${module}: Found saved order with ${savedOrder ? savedOrder.length : 0} questions`);
            } catch(error) {
              console.error(`Error fetching order for module ${module}:`, error);
            }
          }
          
          if (savedOrder && Array.isArray(savedOrder) && savedOrder.length > 0) {
            // We have a saved order, use it to maintain consistency
            questions = [];
            const allModuleQuestions = [...moduleQuestions[module]];
            const questionMap = new Map(allModuleQuestions.map(q => [q.question, q]));
            
            // First add questions from the saved order
            savedOrder.forEach(questionText => {
              if (questionMap.has(questionText)) {
                questions.push(questionMap.get(questionText));
                questionMap.delete(questionText);
              }
            });
            
            // Add any new questions that weren't in the saved order
            questionMap.forEach(q => questions.push(q));
            
            console.log(`Loaded ${questions.length} questions based on saved order for module ${module}`);
          } else {
            // No saved order, create a new one
            // First get raw questions
            questions = [...moduleQuestions[module]];
            
            // Then filter and shuffle them
            await filterUnseenQuestions();
          }
          
          // Load the first question
          currentQuestionIndex = 0;
          loadQuestion();
          updateSessionStats();
        });
      });
    }
    
    // We've removed the old focused practice functionality 
    // in favor of the module filter buttons
    
    // Set up event listeners
    function setupEventListeners() {
      // Navigation links
      dashboardLink.addEventListener('click', () => switchView('dashboard'));
      practiceLink.addEventListener('click', async () => await switchView('practice'));
      modulesLink.addEventListener('click', () => switchView('topic-focus'));

      document.querySelectorAll('.dropdown-menu a[data-module]').forEach(item => {
        item.addEventListener('click', async (event) => {
          event.preventDefault();
          const module = event.target.dataset.module;
          currentModule = module;

           // Update badge
          currentModuleBadge.textContent = module === 'all' ? 'All Questions' : module.toUpperCase();
          
          // Reset session stats
          currentSessionStats = {
            attempted: 0,
            correct: 0
          };
          
          
          
          // Check if we have a saved order for this module in localStorage
          let savedOrder = null;
          if (currentUserId) {
            try {
              savedOrder = await fetchQuestionOrder(currentUserId, module);
              console.log(`Module ${module}: Found saved order with ${savedOrder ? savedOrder.length : 0} questions`);
            } catch(error) {
              console.error(`Error fetching order for module ${module}:`, error);
            }
          }
          
          if (savedOrder && Array.isArray(savedOrder) && savedOrder.length > 0) {
            // We have a saved order, use it to maintain consistency
            questions = [];
            const allModuleQuestions = [...moduleQuestions[module]];
            const questionMap = new Map(allModuleQuestions.map(q => [q.question, q]));
            
            // First add questions from the saved order
            savedOrder.forEach(questionText => {
              if (questionMap.has(questionText)) {
                questions.push(questionMap.get(questionText));
                questionMap.delete(questionText);
              }
            });
            
            // Add any new questions that weren't in the saved order
            questionMap.forEach(q => questions.push(q));
            
            console.log(`Loaded ${questions.length} questions based on saved order for module ${module}`);
          } else {
            // No saved order, create a new one
            // First get raw questions
            questions = [...moduleQuestions[module]];
            
            // Then filter and shuffle them
            await filterUnseenQuestions();
          }
          
          // Load the first question
          currentQuestionIndex = 0;
          loadQuestion();
          updateSessionStats();
        });
      });
      
      // Module filter buttons
      document.querySelectorAll('.module-filter-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const moduleType = btn.dataset.module;
          const filterType = btn.dataset.filter;
          
          if (moduleType && filterType) {
            // Set the current module
            currentModule = moduleType;
            
            // Update the module badge text
            const moduleName = moduleType === 'all' ? 'All Modules' : moduleType.toUpperCase();
            currentModuleBadge.textContent = moduleName;
            
            // Special case: If "unattempted" filter is selected, use the startFreshQuestionSet function 
            // to avoid filtering issues with previously answered questions
            if (filterType === 'unattempted') {
              // Set the current module before generating fresh questions
              currentModule = moduleType;
              
              // Create a completely fresh set of ALL questions for the specific module (not filtered)
              await startFreshQuestionSet(moduleType);
              
              console.log(`Created fresh set of all ${questions.length} questions for module ${moduleType} (unattempted filter)`);
            } else {
              // For other filter types, proceed with normal process
              
              // First check if we have a saved order for this module
              let savedOrder = null;
              let useFilteredQuestions = true;
              
              if (currentUserId && filterType === 'all') {
                try {
                  savedOrder = await fetchQuestionOrder(currentUserId, moduleType);
                  console.log(`Module filter ${moduleType}: Found saved order with ${savedOrder ? savedOrder.length : 0} questions`);
                  
                  // Only use saved order for "all" filter type
                  if (savedOrder && Array.isArray(savedOrder) && savedOrder.length > 0) {
                    useFilteredQuestions = false;
                  }
                } catch(error) {
                  console.error(`Error fetching order for module ${moduleType}:`, error);
                }
              }
              
              if (!useFilteredQuestions) {
                // Use the saved order for consistency
                questions = [];
                const allModuleQuestions = [...moduleQuestions[moduleType]];
                const questionMap = new Map(allModuleQuestions.map(q => [q.question, q]));
                
                // First add questions from the saved order
                savedOrder.forEach(questionText => {
                  if (questionMap.has(questionText)) {
                    questions.push(questionMap.get(questionText));
                    questionMap.delete(questionText);
                  }
                });
                
                // Add any new questions that weren't in the saved order
                questionMap.forEach(q => questions.push(q));
                
                console.log(`Loaded ${questions.length} questions based on saved order for module ${moduleType}`);
              } else {
                // Get filtered questions based on the filter type
                const filteredQuestions = getFilteredQuestions(moduleType, filterType);
                
                // If no questions match, alert the user
                if (filteredQuestions.length === 0) {
                  alert('No questions match this filter. Please try a different one.');
                  return;
                }
                
                // Set the filtered questions
                questions = filteredQuestions;
                
                // Since this is a filtered view, save it as the new order for this module
                // This ensures filtered views (e.g., incorrect questions) maintain the same order
                if (currentUserId) {
                  const questionTexts = questions.map(q => q.question);
                  try {
                    await saveQuestionOrder(currentUserId, moduleType, questionTexts);
                    console.log(`Saved new filtered order for ${moduleType} with ${questionTexts.length} questions`);
                  } catch (error) {
                    console.error(`Error saving filtered order for ${moduleType}:`, error);
                  }
                }
              }
            }
            
            // Reset session stats
            currentSessionStats = {
              attempted: 0,
              correct: 0
            };
            updateSessionStats();
            
            // Reset index and load the first question
            currentQuestionIndex = 0;
            loadQuestion();
            
            // Switch to practice view
            await switchView('practice');
          }
        });
      });
      
      // Question navigation
      prevQuestion.addEventListener('click', () => {
        // Only allow navigation within the current session questions
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          loadQuestion();
        }
      });
      
      nextQuestion.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
          currentQuestionIndex++;
          loadQuestion();
          nextQuestion.disabled = true;
        }
      });
      
      skipQuestion.addEventListener('click', async () => {
        if (currentQuestionIndex < questions.length - 1) {
          currentQuestionIndex++;
          loadQuestion();
        } else {
          // If we're at the end of the current questions, get a fresh set of questions for current module
          await startFreshQuestionSet(currentModule);
          currentQuestionIndex = 0;
          loadQuestion();
        }
      });
      
      // Export data
      exportData.addEventListener('click', () => {
        const dataStr = JSON.stringify({
          userHistory,
          timestamp: new Date().toISOString(),
          stats: {
            totalAttempted: userHistory.length,
            totalCorrect: userHistory.filter(item => item.isCorrect).length
          }
        });
        
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'quiz_data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      });
      
      // Reset data
      startNewSession.addEventListener('click', () => {
        confirmModalTitle.textContent = 'Start New Session';
        confirmModalBody.textContent = 'Start a new session with fresh questions? Your history will be preserved, but you\'ll start with a new set of questions.';
        
        confirmModalAction.onclick = async () => {
          // Remove saved position
          localStorage.removeItem('lastQuestionIndex');
          
          // Start with fresh questions for the current module in a randomized order
          await startFreshQuestionSet(currentModule);
          
          // Reset to question 1
          currentQuestionIndex = 0;
          loadQuestion();
          
          // Reset session stats
          currentSessionStats = {
            attempted: 0,
            correct: 0
          };
          updateSessionStats();
          
          // Switch to practice view
          switchView('practice');
          
          // Close modal
          confirmModal.hide();
        };
        
        confirmModal.show();
      });
      
      resetData.addEventListener('click', () => {
        confirmModalTitle.textContent = 'Reset Data';
        confirmModalBody.textContent = 'Are you sure you want to reset all your quiz data? This action cannot be undone.';
        
        confirmModalAction.onclick = async () => {
          // Clear local storage history
          userHistory = [];
          saveUserHistory();
          
          // If we have a user ID, clear database data too
          if (currentUserId) {
            try {
              // Delete question history
              const historyResponse = await fetch(`/api/users/${currentUserId}/history`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              
              if (!historyResponse.ok) {
                console.error('Failed to clear question history in database');
              }
              
              // Delete question orders for all modules
              const modules = ['all', 'focs', 'bcr', 'msk', 'anatomy'];
              for (const module of modules) {
                const orderResponse = await fetch(`/api/users/${currentUserId}/order/${module}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
                
                if (!orderResponse.ok && orderResponse.status !== 404) {
                  console.error(`Failed to clear question order for module ${module} in database`);
                }
              }
              
              console.log('Successfully reset all data in database');
            } catch (error) {
              console.error('Error clearing database data:', error);
            }
          }
          
          // Reset current session stats
          currentSessionStats = {
            attempted: 0,
            correct: 0
          };
          
          // Update UI stats
          updateSessionStats();
          updateDashboardStats();
          
          // Close the modal
          confirmModal.hide();
          
          // Reload questions to get a fresh start with ALL questions
          (async () => {
            // For reset data, always use 'all' module
            currentModule = 'all';
            // Update UI to show current module
            currentModuleBadge.textContent = 'All Questions';
            // Get a fresh set of all questions
            await startFreshQuestionSet('all');
            currentQuestionIndex = 0;
            loadQuestion();
          })();
        };
        
        confirmModal.show();
      });
      
      // No filters to handle anymore
    }
    
    // Switch between views
    async function switchView(view) {
      currentView = view;
      
      // Update navigation links
      dashboardLink.classList.toggle('active', view === 'dashboard');
      practiceLink.classList.toggle('active', view === 'practice');
      modulesLink.classList.toggle('active', view === 'topic-focus');
      
      // Show/hide views
      dashboardView.classList.toggle('d-none', view !== 'dashboard');
      practiceView.classList.toggle('d-none', view !== 'practice');
      topicFocusView.classList.toggle('d-none', view !== 'topic-focus');
      
      // When switching to practice view, check if we should resume last session
      if (view === 'practice') {
        const savedModule = localStorage.getItem('lastModule');
        const savedQuestionIndex = localStorage.getItem('lastQuestionIndex');
        
        if (savedModule && savedQuestionIndex !== null) {
          // Only resume if we're not already in the correct position
          const parsedIndex = parseInt(savedQuestionIndex, 10);
          
          if (savedModule !== currentModule || (parsedIndex !== currentQuestionIndex && !isNaN(parsedIndex))) {
            console.log(`Resuming last session: module ${savedModule}, question ${parsedIndex}`);
            
            // Set the current module
            currentModule = savedModule;
            
            // Update UI to show current module
            currentModuleBadge.textContent = 
              currentModule === 'all' ? 'All Questions' : currentModule.toUpperCase();
              
            // Get questions for this module with proper order
            if (currentUserId) {
              try {
                const savedOrder = await fetchQuestionOrder(currentUserId, currentModule);
                
                if (savedOrder && Array.isArray(savedOrder) && savedOrder.length > 0) {
                  // We have a saved order, use it
                  questions = [];
                  const allModuleQuestions = [...moduleQuestions[currentModule]];
                  const questionMap = new Map(allModuleQuestions.map(q => [q.question, q]));
                  
                  // First add questions from the saved order
                  savedOrder.forEach(questionText => {
                    if (questionMap.has(questionText)) {
                      questions.push(questionMap.get(questionText));
                      questionMap.delete(questionText);
                    }
                  });
                  
                  // Add any new questions that weren't in the saved order
                  questionMap.forEach(q => questions.push(q));
                } else {
                  // No saved order, create a new one
                  questions = [...moduleQuestions[currentModule]];
                  await filterUnseenQuestions();
                }
              } catch(error) {
                console.error(`Error fetching order for module ${currentModule}:`, error);
                questions = [...moduleQuestions[currentModule]];
                await filterUnseenQuestions();
              }
            } else {
              // No user ID, just use the module questions
              questions = [...moduleQuestions[currentModule]];
              await filterUnseenQuestions();
            }
            
            // Set question index if it's valid
            if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < questions.length) {
              currentQuestionIndex = parsedIndex;
            } else {
              currentQuestionIndex = 0;
            }
            
            // Load the question
            loadQuestion();
          }
        }
      }
      
      // Update data for the view
      if (view === 'dashboard') {
        updateDashboardStats();
      } else if (view === 'topic-focus') {
        updateTopicStats();
      }
    }
    
    // Initialize by loading questions and starting the app
    loadQuestions();
