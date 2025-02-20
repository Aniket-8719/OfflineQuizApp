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
  
      // Check if sample quiz already exists
      const getRequest = nameIndex.get('Sample Quiz');
  
      getRequest.onsuccess = (e) => {
        if (!e.target.result) {
          // Create sample data
          const sampleData = {
            name: 'Sample Quiz',
            questions: [
              // ... (keep the sample questions array same)
            ],
            createdAt: new Date()
          };
  
          // Add sample data
          const addRequest = store.add(sampleData);
          
          addRequest.onsuccess = () => resolve();
          addRequest.onerror = (err) => reject(err);
        } else {
          resolve();
        }
      };
  
      getRequest.onerror = (err) => reject(err);
      tx.onerror = (err) => reject(err.target.error);
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