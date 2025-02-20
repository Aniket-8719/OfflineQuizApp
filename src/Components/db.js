// Initialize the DB
export const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('QuizDatabase', 4);  // Incremented version to 4
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('subjects')) {
          const subjectsStore = db.createObjectStore('subjects', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          subjectsStore.createIndex('name', 'name', { unique: true });
        }
        
        if (!db.objectStoreNames.contains('attempts')) {
          const attemptsStore = db.createObjectStore('attempts', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          attemptsStore.createIndex('subjectId', 'subjectId', { unique: false });
        }
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        initializeSampleData(db).then(() => resolve(db)).catch(reject);
      };
  
      request.onerror = () => reject(request.error);
    });
  };
  
  // Initialize sample data if it doesn't exist
  async function initializeSampleData(db) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('subjects', 'readwrite');
      const store = tx.objectStore('subjects');
      const nameIndex = store.index('name');
  
      // Transaction handlers
      tx.oncomplete = () => resolve();
      tx.onerror = (err) => reject(err.target.error);
  
      // Check if sample quiz exists
      const getRequest = nameIndex.get('Sample Quiz');
  
      getRequest.onsuccess = (e) => {
        if (!e.target.result) {
          // Add sample data
          const addRequest = store.add({
            name: 'Sample Quiz',
            questions: [
              {
                text: "Which planet is closest to the Sun?",
                options: ["Venus", "Mercury", "Earth", "Mars"],
                correctIndex: 1
              },
              {
                text: "Which data structure uses FIFO (First-In-First-Out) principle?",
                options: ["Stack", "Queue", "Tree", "Graph"],
                correctIndex: 1
              },
              {
                text: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correctIndex: 2
              },
              {
                text: "Which language is primarily used for Android development?",
                options: ["Swift", "Java", "C#", "Python"],
                correctIndex: 1
              },
              {
                text: "What is the chemical symbol for gold?",
                options: ["Ag", "Fe", "Au", "Cu"],
                correctIndex: 2
              }
            ],
            createdAt: new Date()
          });
  
          addRequest.onerror = (err) => reject(err);
        }
      };
  
      getRequest.onerror = (err) => reject(err);
    });
  }
  
  // Database operations
  export const db = {
    async getAllSubjects() {
      const db = await initDB();
      return new Promise((resolve) => {
        const tx = db.transaction('subjects', 'readonly');
        const store = tx.objectStore('subjects');
        store.getAll().onsuccess = (e) => resolve(e.target.result);
      });
    },
  
    async saveSubject(subject) {
      const db = await initDB();
      return new Promise((resolve) => {
        const tx = db.transaction('subjects', 'readwrite');
        const store = tx.objectStore('subjects');
        store.add(subject).onsuccess = (e) => resolve(e.target.result);
      });
    },
  
    async getAttempts(subjectId) {
      const db = await initDB();
      return new Promise((resolve) => {
        const tx = db.transaction('attempts', 'readonly');
        const store = tx.objectStore('attempts');
        const index = store.index('subjectId');
        index.getAll(subjectId).onsuccess = (e) => resolve(e.target.result);
      });
    },
  
    async saveAttempt(attempt) {
      const db = await initDB();
      return new Promise((resolve) => {
        const tx = db.transaction('attempts', 'readwrite');
        const store = tx.objectStore('attempts');
        store.add(attempt).onsuccess = (e) => resolve(e.target.result);
      });
    }
  };