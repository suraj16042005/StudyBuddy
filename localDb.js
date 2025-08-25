const DB_NAME = 'StudyBuddyDB';
const DB_VERSION = 9; // Increment DB version to trigger onupgradeneeded

export const localDb = {
    db: null,

    async open() {
        return new Promise((resolve, reject) => {
            console.log('IndexedDB: Attempting to open DB...');
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                this.db = db; // Set db reference during upgrade
                console.log(`IndexedDB: Upgrade needed. Old version: ${event.oldVersion}, New version: ${event.newVersion}`);

                // Create object stores if they don't exist
                if (!db.objectStoreNames.contains('users')) {
                    const usersStore = db.createObjectStore('users', { keyPath: 'id' });
                    usersStore.createIndex('email', 'email', { unique: true });
                    usersStore.createIndex('username', 'username', { unique: true });
                    usersStore.createIndex('role', 'role', { unique: false });
                    usersStore.createIndex('instructor_type', 'instructor_type', { unique: false }); // New index
                    console.log('IndexedDB: Created "users" store.');
                }

                if (!db.objectStoreNames.contains('courses')) {
                    const coursesStore = db.createObjectStore('courses', { keyPath: 'id' });
                    coursesStore.createIndex('mentor_id', 'mentor_id', { unique: false });
                    coursesStore.createIndex('subject', 'subject', { unique: false });
                    coursesStore.createIndex('sub_category', 'sub_category', { unique: false });
                    coursesStore.createIndex('difficulty_level', 'difficulty_level', { unique: false });
                    coursesStore.createIndex('price_per_session', 'price_per_session', { unique: false });
                    coursesStore.createIndex('average_rating', 'average_rating', { unique: false });
                    coursesStore.createIndex('created_at', 'created_at', { unique: false });
                    coursesStore.createIndex('languages_taught', 'languages_taught', { multiEntry: true }); // New index
                    coursesStore.createIndex('features', 'features', { multiEntry: true }); // New index
                    coursesStore.createIndex('tags', 'tags', { multiEntry: true }); // New index
                    console.log('IndexedDB: Created "courses" store.');
                }

                if (!db.objectStoreNames.contains('reviews')) {
                    const reviewsStore = db.createObjectStore('reviews', { keyPath: 'id' });
                    reviewsStore.createIndex('course_id', 'course_id', { unique: false });
                    reviewsStore.createIndex('student_id', 'student_id', { unique: false });
                    console.log('IndexedDB: Created "reviews" store.');
                }

                if (!db.objectStoreNames.contains('sessions')) {
                    const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
                    sessionsStore.createIndex('course_id', 'course_id', { unique: false });
                    sessionsStore.createIndex('mentor_id', 'mentor_id', { unique: false });
                    sessionsStore.createIndex('student_id', 'student_id', { unique: false });
                    sessionsStore.createIndex('status', 'status', { unique: false });
                    console.log('IndexedDB: Created "sessions" store.');
                }

                if (!db.objectStoreNames.contains('messages')) {
                    const messagesStore = db.createObjectStore('messages', { keyPath: 'id' });
                    messagesStore.createIndex('course_id', 'course_id', { unique: false });
                    messagesStore.createIndex('sender_id', 'sender_id', { unique: false });
                    messagesStore.createIndex('created_at', 'created_at', { unique: false });
                    console.log('IndexedDB: Created "messages" store.');
                }

                if (!db.objectStoreNames.contains('transactions')) {
                    const transactionsStore = db.createObjectStore('transactions', { keyPath: 'id' });
                    transactionsStore.createIndex('user_id', 'user_id', { unique: false });
                    transactionsStore.createIndex('date', 'date', { unique: false });
                    transactionsStore.createIndex('type', 'type', { unique: false });
                    console.log('IndexedDB: Created "transactions" store.');
                }

                if (!db.objectStoreNames.contains('mentorApplications')) {
                    const mentorApplicationsStore = db.createObjectStore('mentorApplications', { keyPath: 'id' });
                    mentorApplicationsStore.createIndex('user_id', 'user_id', { unique: true });
                    mentorApplicationsStore.createIndex('status', 'status', { unique: false });
                    console.log('IndexedDB: Created "mentorApplications" store.');
                }

                console.log(`IndexedDB upgrade complete. Version: ${event.oldVersion} -> ${event.newVersion}`);
                // Call initializeData here during upgrade to ensure data is added immediately after store creation
                // This is crucial for initial population on first open or version change
                event.target.transaction.oncomplete = () => {
                    console.log('IndexedDB: Upgrade transaction complete. Initializing data...');
                    this.initializeData().then(resolve).catch(reject);
                };
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('IndexedDB opened successfully');
                // If no upgrade was needed, check if data needs initialization
                if (event.oldVersion === DB_VERSION) { // No upgrade, so check if data exists
                    console.log('IndexedDB: No upgrade needed. Checking for existing data...');
                    this.initializeData().then(resolve).catch(reject);
                } else {
                    // If upgrade was needed, initializeData was already called in onupgradeneeded
                    resolve(this.db);
                }
            };

            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                reject('IndexedDB error');
            };
        });
    },

    async initializeData() {
        console.log('IndexedDB: initializeData called.');
        try {
            const userCount = await this.count('users');
            if (userCount === 0) {
                console.log('IndexedDB: No existing data found. Fetching db.json...');
                const response = await fetch('/db.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('IndexedDB: db.json fetched successfully. Adding data...');

                const transaction = this.db.transaction(['users', 'courses', 'reviews', 'sessions', 'messages', 'transactions', 'mentorApplications'], 'readwrite');
                
                // Use Promise.all to wait for all adds to complete
                const addPromises = [];
                for (const storeName in data) {
                    if (this.db.objectStoreNames.contains(storeName)) {
                        const store = transaction.objectStore(storeName);
                        data[storeName].forEach(item => {
                            addPromises.push(new Promise((resolve, reject) => {
                                const request = store.add(item);
                                request.onsuccess = () => resolve();
                                request.onerror = (event) => {
                                    console.error(`Error adding item to ${storeName}:`, event.target.error);
                                    reject(event.target.error);
                                };
                            }));
                        });
                    } else {
                        console.warn(`IndexedDB: Object store "${storeName}" not found during initialization.`);
                    }
                }

                await Promise.all(addPromises); // Wait for all add operations to finish

                await new Promise((resolve, reject) => {
                    transaction.oncomplete = () => {
                        console.log('IndexedDB: All default data added successfully!');
                        resolve();
                    };
                    transaction.onerror = (event) => {
                        console.error('IndexedDB: Error adding default data transaction:', event.target.error);
                        reject(event.target.error);
                    };
                });
            } else {
                console.log('IndexedDB: Data already exists, skipping initialization.');
            }
        } catch (error) {
            console.error('IndexedDB: Error during initializeData:', error);
            throw error; // Re-throw to propagate the error
        }
    },

    _getTransaction(storeNames, mode) {
        if (!this.db) {
            console.error('Database not open. Call open() first.');
            throw new Error('Database not open.');
        }
        return this.db.transaction(storeNames, mode);
    },

    async add(storeName, item) {
        const transaction = this._getTransaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.add(item);
            request.onsuccess = () => resolve(item);
            request.onerror = (event) => {
                console.error(`Error adding to ${storeName}:`, event.target.error);
                reject(event.target.error);
            };
        });
    },

    async get(storeName, key) {
        const transaction = this._getTransaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    },

    async getAll(storeName) {
        const transaction = this._getTransaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    },

    async update(storeName, key, updates) {
        const transaction = this._getTransaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const getRequest = store.get(key);
            getRequest.onsuccess = () => {
                const item = getRequest.result;
                if (!item) {
                    reject(new Error(`${storeName} with key ${key} not found.`));
                    return;
                }
                const updatedItem = { ...item, ...updates };
                const putRequest = store.put(updatedItem);
                putRequest.onsuccess = () => resolve(updatedItem);
                putRequest.onerror = (event) => reject(event.target.error);
            };
            getRequest.onerror = (event) => reject(event.target.error);
        });
    },

    async delete(storeName, key) {
        const transaction = this._getTransaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    },

    async count(storeName) {
        const transaction = this._getTransaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.count();
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    },

    // Specific methods for convenience
    async addUser(user) {
        return this.add('users', user);
    },

    async getUser(userId) {
        return this.get('users', userId);
    },

    async getUsers() {
        return this.getAll('users');
    },

    async updateUser(userId, updates) {
        return this.update('users', userId, updates);
    },

    async getCourse(courseId) {
        return this.get('courses', courseId);
    },

    async getCourses() {
        return this.getAll('courses');
    },

    async updateCourse(courseId, updates) {
        return this.update('courses', courseId, updates);
    },

    async getTransactionsForUser(userId) {
        const transaction = this._getTransaction('transactions', 'readonly');
        const store = transaction.objectStore('transactions');
        const index = store.index('user_id');
        return new Promise((resolve, reject) => {
            const request = index.getAll(userId);
            request.onsuccess = () => resolve(request.result.sort((a, b) => new Date(b.date) - new Date(a.date))); // Sort by date descending
            request.onerror = (event) => reject(event.target.error);
        });
    },

    async getMentorApplication(userId) {
        const transaction = this._getTransaction('mentorApplications', 'readonly');
        const store = transaction.objectStore('mentorApplications');
        const index = store.index('user_id');
        return new Promise((resolve, reject) => {
            const request = index.get(userId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    },

    async getAllMentorApplications() {
        return this.getAll('mentorApplications');
    },

    async updateMentorApplication(applicationId, updates) {
        return this.update('mentorApplications', applicationId, updates);
    }
};
