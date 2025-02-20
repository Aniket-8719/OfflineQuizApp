export const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('QuizDatabase', 3);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('subjects')) {
          const subjectsStore = db.createObjectStore('subjects', { keyPath: 'id', autoIncrement: true });
          subjectsStore.createIndex('name', 'name', { unique: true });
        }
        
        if (!db.objectStoreNames.contains('attempts')) {
          const attemptsStore = db.createObjectStore('attempts', { keyPath: 'id', autoIncrement: true });
          attemptsStore.createIndex('subjectId', 'subjectId', { unique: false });
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
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