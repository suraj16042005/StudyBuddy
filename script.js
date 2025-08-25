import { initAuthModalUI, showAuthModal, hideAuthModal, AuthService, showFormError, clearFormError } from './auth.js';
import { localDb } from './localDb.js';
import { CourseService } from './courseService.js';

// --- Utility Functions ---
export function showNotification(message, type = 'info', duration = 3000) {
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notificationArea.appendChild(notification);

    // Trigger reflow to enable transition
    void notification.offsetWidth;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        }, { once: true });
    }, duration);
}

function getStarRatingHtml(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < (5 - fullStars - (halfStar ? 1 : 0)); i++) {
        starsHtml += '<i class="far fa-star"></i>'; // Empty star
    }
    return starsHtml;
}

function getFlagIcon(language) {
    const flags = {
        english: 'gb', // Great Britain for English
        hindi: 'in',
        marathi: 'in',
        tamil: 'in',
        telugu: 'in',
        bengali: 'in',
        gujarati: 'in',
        // Add more languages and their corresponding flag codes if needed
    };
    const flagCode = flags[language.toLowerCase()] || 'us'; // Default to US flag if not found
    return `https://flagcdn.com/w20/${flagCode}.png`;
}

// --- Navbar & User State Management ---
const joinBtn = document.getElementById('join-btn');
const userDropdownWrapper = document.getElementById('user-dropdown-wrapper');
const userProfileBtn = document.getElementById('user-profile-btn');
const userDropdownMenu = document.getElementById('user-dropdown-menu');
const userAvatarSmall = document.getElementById('user-avatar-small');
const userNameDisplay = document.getElementById('user-name-display');
const myDashboardLink = document.getElementById('my-dashboard-link');
const logoutBtn = document.getElementById('logout-btn');
const tutorNavLink = document.getElementById('tutor-nav-link');


// Mobile Navbar Elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const mobileNav = document.getElementById('mobileNav');
const mobileUserDropdownWrapper = document.getElementById('mobile-user-dropdown-wrapper');
const mobileUserProfileBtn = document.getElementById('mobile-user-profile-btn');
const mobileUserDropdownMenu = document.getElementById('mobile-user-dropdown-menu');
const mobileUserAvatarSmall = document.getElementById('mobile-user-avatar-small');
const mobileUserNameDisplay = document.getElementById('mobile-user-name-display');
const mobileMyDashboardLink = document.getElementById('mobile-my-dashboard-link');
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
const mobileJoinBtn = document.getElementById('mobile-join-btn');
const mobileCoinsDisplay = document.getElementById('mobileCoinsDisplay'); // This was the duplicate declaration issue, now correctly referenced
const mobileTutorNavLink = document.getElementById('mobile-tutor-nav-link');


export function updateUIForAuth() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
        if (joinBtn) joinBtn.style.display = 'none';
        if (userDropdownWrapper) userDropdownWrapper.style.display = 'block';
        if (userAvatarSmall) userAvatarSmall.src = currentUser.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=320&h=320';
        if (userNameDisplay) userNameDisplay.textContent = `Hi, ${currentUser.full_name.split(' ')[0]}!`;

        // Mobile UI
        if (mobileJoinBtn) mobileJoinBtn.style.display = 'none';
        if (mobileUserDropdownWrapper) mobileUserDropdownWrapper.style.display = 'block';
        if (mobileUserAvatarSmall) mobileUserAvatarSmall.src = currentUser.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=320&h=320';
        if (mobileUserNameDisplay) mobileUserNameDisplay.textContent = `Hi, ${currentUser.full_name.split(' ')[0]}!`;
        if (mobileCoinsDisplay) mobileCoinsDisplay.style.display = 'flex'; // Ensure coins display in mobile menu

        if (myDashboardLink) {
            if (currentUser.role === 'mentor' || currentUser.role === 'admin') {
                myDashboardLink.style.display = 'block';
            } else {
                myDashboardLink.style.display = 'none';
            }
        }
        if (mobileMyDashboardLink) {
            if (currentUser.role === 'mentor' || currentUser.role === 'admin') {
                mobileMyDashboardLink.style.display = 'block';
            } else {
                mobileMyDashboardLink.style.display = 'none';
            }
        }

        // Update Tutor link based on role
        if (tutorNavLink) {
            tutorNavLink.href = (currentUser.role === 'mentor' || currentUser.role === 'admin') ? '/dashboard.html' : '/become-a-mentor.html';
        }
        if (mobileTutorNavLink) {
            mobileTutorNavLink.href = (currentUser.role === 'mentor' || currentUser.role === 'admin') ? '/dashboard.html' : '/become-a-mentor.html';
        }

        updateCoinBalanceDisplay(); // Update coin balance on login
    } else {
        if (joinBtn) joinBtn.style.display = 'block';
        if (userDropdownWrapper) userDropdownWrapper.style.display = 'none';

        // Mobile UI
        if (mobileJoinBtn) mobileJoinBtn.style.display = 'block';
        if (mobileUserDropdownWrapper) mobileUserDropdownWrapper.style.display = 'none';
        if (mobileCoinsDisplay) mobileCoinsDisplay.style.display = 'none'; // Hide coins display in mobile menu if not logged in

        // Reset Tutor link
        if (tutorNavLink) {
            tutorNavLink.href = '/become-a-mentor.html';
        }
        if (mobileTutorNavLink) {
            mobileTutorNavLink.href = '/become-a-mentor.html';
        }
    }
}

// Toggle user dropdown
userProfileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdownMenu?.classList.toggle('show');
});

mobileUserProfileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileUserDropdownMenu?.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (userDropdownMenu && userDropdownMenu.classList.contains('show') && !userDropdownMenu.contains(e.target) && !(userProfileBtn && userProfileBtn.contains(e.target))) {
        userDropdownMenu.classList.remove('show');
    }
    if (mobileUserDropdownMenu && mobileUserDropdownMenu.classList.contains('show') && !mobileUserDropdownMenu.contains(e.target) && !(mobileUserProfileBtn && mobileUserProfileBtn.contains(e.target))) {
        mobileUserDropdownMenu.classList.remove('show');
    }
});

// Logout functionality
logoutBtn?.addEventListener('click', () => {
    AuthService.logout();
    updateUIForAuth();
    hideAuthModal();
    window.location.href = 'index.html'; // Redirect to home after logout
});

mobileLogoutBtn?.addEventListener('click', () => {
    AuthService.logout();
    updateUIForAuth();
    hideAuthModal();
    mobileNavOverlay?.classList.remove('active'); // Close mobile menu
    window.location.href = 'index.html'; // Redirect to home after logout
});

// Mobile menu toggle
mobileMenuToggle?.addEventListener('click', () => {
    mobileNavOverlay?.classList.add('active');
    mobileNav?.classList.add('active');
});

closeMobileMenu?.addEventListener('click', () => {
    mobileNavOverlay?.classList.remove('active');
    mobileNav?.classList.remove('active');
});

mobileNavOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileNavOverlay) {
        mobileNavOverlay?.classList.remove('active');
        mobileNav?.classList.remove('active');
    }
});

// --- Coin Balance Display & Popover ---
const coinsDisplay = document.getElementById('coinsDisplay');
const coinBalanceSpan = coinsDisplay?.querySelector('.coin-balance');
const coinPopover = document.getElementById('coin-popover');
const mobileCoinBalanceSpan = mobileCoinsDisplay?.querySelector('.coin-balance');
const mobileCoinPopover = document.getElementById('mobile-coin-popover');

function updateCoinBalanceDisplay() {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
        const balance = currentUser.excel_coin_balance;
        if (coinBalanceSpan) coinBalanceSpan.textContent = balance;
        if (mobileCoinBalanceSpan) mobileCoinBalanceSpan.textContent = balance;

        // Apply color coding and pulsing animation
        if (coinsDisplay) coinsDisplay.classList.remove('sufficient', 'low', 'critical');
        if (mobileCoinsDisplay) mobileCoinsDisplay.classList.remove('sufficient', 'low', 'critical');

        if (balance < 100) {
            if (coinsDisplay) coinsDisplay.classList.add('critical');
            if (mobileCoinsDisplay) mobileCoinsDisplay.classList.add('critical');
        } else if (balance >= 100 && balance <= 500) {
            if (coinsDisplay) coinsDisplay.classList.add('low');
            if (mobileCoinsDisplay) mobileCoinsDisplay.classList.add('low');
        } else {
            if (coinsDisplay) coinsDisplay.classList.add('sufficient');
            if (mobileCoinsDisplay) mobileCoinsDisplay.classList.add('sufficient');
        }
    }
}

async function renderCoinPopover(targetPopover) { // Made async to await transactions
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
        if (targetPopover) {
            targetPopover.innerHTML = '<div class="popover-body"><p>Please log in to view your transactions.</p></div>';
        }
        return;
    }

    const transactions = await localDb.getTransactionsForUser(currentUser.id); // Await the call
    let transactionsHtml = '';

    if (transactions.length === 0) {
        transactionsHtml = '<p>No recent transactions.</p>';
    } else {
        transactionsHtml = `<ul class="transaction-list">
            ${transactions.map(t => `
                <li class="transaction-item">
                    <div class="transaction-details">
                        <span class="transaction-icon ${t.type.toLowerCase().replace(' ', '-')}">
                            <i class="${getTransactionIcon(t.type)}"></i>
                        </span>
                        <div class="transaction-info">
                            <p>${t.description}</p>
                            <small>${new Date(t.date).toLocaleDateString()}</small>
                        </div>
                    </div>
                    <span class="transaction-amount ${t.amount > 0 ? 'credit' : 'debit'}">
                        ${t.amount > 0 ? '+' : ''}${t.amount} <i class="fas fa-coins"></i>
                    </span>
                </li>
            `).join('')}
        </ul>`;
    }

    if (targetPopover) {
        targetPopover.innerHTML = `
            <div class="popover-header">Recent Transactions</div>
            <div class="popover-body">
                ${transactionsHtml}
            </div>
            <div class="popover-footer">
                <button class="btn btn-primary buy-coins-btn">Buy More Coins</button>
                <a href="/transaction-history.html" class="view-history-link">View Full History</a>
            </div>
        `;
    }
}

function getTransactionIcon(type) {
    switch (type.toLowerCase()) {
        case 'purchase': return 'fas fa-plus';
        case 'session payment': return 'fas fa-minus';
        case 'refund': return 'fas fa-undo-alt';
        case 'bonus': return 'fas fa-star';
        default: return 'fas fa-info-circle';
    }
}

coinsDisplay?.addEventListener('click', (e) => {
    e.stopPropagation();
    coinPopover?.classList.toggle('visible');
    if (coinPopover?.classList.contains('visible')) {
        renderCoinPopover(coinPopover);
    }
});

mobileCoinsDisplay?.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileCoinPopover?.classList.toggle('visible');
    if (mobileCoinPopover?.classList.contains('visible')) {
        renderCoinPopover(mobileCoinPopover);
    }
});

document.addEventListener('click', (e) => {
    if (coinPopover && coinPopover.classList.contains('visible') && !(coinsDisplay && coinsDisplay.contains(e.target)) && !coinPopover.contains(e.target)) {
        coinPopover.classList.remove('visible');
    }
    if (mobileCoinPopover && mobileCoinPopover.classList.contains('visible') && !(mobileCoinsDisplay && mobileCoinsDisplay.contains(e.target)) && !mobileCoinPopover.contains(e.target)) {
        mobileCoinPopover.classList.remove('visible');
    }
});

// --- Authentication Forms ---
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const signupNextBtn = document.getElementById('signup-next-btn');
const signupBackBtn = document.getElementById('signup-back-btn');
const startExploringBtn = document.getElementById('start-exploring-btn');

let currentSignupStep = 1;

function showSignupStep(step) {
    document.querySelectorAll('.signup-step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.signup-step[data-step="${step}"]`)?.classList.add('active');
    currentSignupStep = step;
}

signupNextBtn?.addEventListener('click', () => {
    // Validate Step 1 fields
    const fullNameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    const termsCheckbox = document.getElementById('signup-terms');

    let isValid = true;

    clearFormError(fullNameInput);
    clearFormError(emailInput);
    clearFormError(passwordInput);
    clearFormError(confirmPasswordInput);

    if (fullNameInput && fullNameInput.value.trim() === '') {
        showFormError(fullNameInput, 'Full Name is required.');
        isValid = false;
    }
    if (emailInput && !emailInput.value.includes('@')) {
        showFormError(emailInput, 'Please enter a valid email address.');
        isValid = false;
    }
    if (passwordInput && passwordInput.value.length < 8) {
        showFormError(passwordInput, 'Password must be at least 8 characters.');
        isValid = false;
    }
    if (passwordInput && confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
        showFormError(confirmPasswordInput, 'Passwords do not match.');
        isValid = false;
    }
    if (termsCheckbox && !termsCheckbox.checked) {
        showNotification('You must agree to the Terms & Conditions.', 'error');
        isValid = false;
    }

    if (isValid) {
        showSignupStep(2);
    }
});

signupBackBtn?.addEventListener('click', () => {
    showSignupStep(1);
});

startExploringBtn?.addEventListener('click', () => {
    hideAuthModal();
    window.location.href = 'index.html'; // Redirect to home page
});

loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const email = emailInput ? emailInput.value : '';
    const password = passwordInput ? passwordInput.value : '';

    clearFormError(emailInput);
    clearFormError(passwordInput);

    if (!email || !password) {
        showFormError(emailInput, 'Email and password are required.');
        return;
    }

    const user = await AuthService.login(email, password);
    if (user) {
        hideAuthModal();
        updateUIForAuth();
        // Redirect based on role if needed, for now just refresh UI
        if (user.role === 'admin' || user.role === 'mentor') {
            window.location.href = '/dashboard.html';
        } else {
            window.location.href = '/index.html';
        }
    } else {
        showFormError(passwordInput, 'Invalid credentials.');
    }
});

signupForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (currentSignupStep !== 2) return; // Only submit if on the final step

    const fullName = document.getElementById('signup-name')?.value;
    const email = document.getElementById('signup-email')?.value;
    const password = document.getElementById('signup-password')?.value;
    const username = document.getElementById('signup-username')?.value;
    const selectedRole = document.querySelector('input[name="signup-role"]:checked')?.value; // Get the role selected by the user

    clearFormError(document.getElementById('signup-username'));

    if (username && username.trim() === '') {
        showFormError(document.getElementById('signup-username'), 'Username is required.');
        return;
    }

    const newUser = await AuthService.signup(fullName, email, password, username, selectedRole); // Pass the selected role
    if (newUser) {
        const successUsernameEl = document.getElementById('success-username');
        if (successUsernameEl) {
            successUsernameEl.textContent = newUser.username;
        }
        showSignupStep(3); // Show success message
        updateUIForAuth(); // Update navbar for new user

        // Special redirection for mentor signups
        if (selectedRole === 'mentor') {
            // Give them a student ID (already handled by AuthService.signup setting actualRole to 'student')
            // Redirect to become-a-mentor page
            setTimeout(() => {
                window.location.href = 'become-a-mentor.html';
            }, 1500); // Small delay for success message to be seen
        } else {
            // For student signups, redirect to index.html
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }
});

// --- Password Strength Meter (Signup) ---
const signupPasswordInput = document.getElementById('signup-password');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');
const passwordCriteria = {
    length: document.querySelector('[data-criterion="length"]'),
    capital: document.querySelector('[data-criterion="capital"]'),
    symbol: document.querySelector('[data-criterion="symbol"]')
};

// Check if all necessary elements for the password strength meter exist
const allStrengthMeterElementsExist = signupPasswordInput && strengthBar && strengthText &&
                                     passwordCriteria.length && passwordCriteria.capital && passwordCriteria.symbol;

if (allStrengthMeterElementsExist) {
    signupPasswordInput.addEventListener('input', () => {
        const password = signupPasswordInput.value;
        let strength = 0;

        // Length check
        if (password.length >= 8) {
            strength += 1;
            passwordCriteria.length?.classList.add('valid');
        } else {
            passwordCriteria.length?.classList.remove('valid');
        }

        // Capital letter check
        if (/[A-Z]/.test(password)) {
            strength += 1;
            passwordCriteria.capital?.classList.add('valid');
        } else {
            passwordCriteria.capital?.classList.remove('valid');
        }

        // Symbol check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            strength += 1;
            passwordCriteria.symbol?.classList.add('valid');
        } else {
            passwordCriteria.symbol?.classList.remove('valid');
        }

        // Update strength bar and text
        let barWidth = (strength / 3) * 100;
        let barColor = '#e5e7eb'; // Default grey

        if (strength === 1) {
            barColor = '#f87171'; // Red
            strengthText.textContent = 'Weak';
        } else if (strength === 2) {
            barColor = '#facc15'; // Yellow
            strengthText.textContent = 'Medium';
        } else if (strength === 3) {
            barColor = '#4ade80'; // Green
            strengthText.textContent = 'Strong';
        } else {
            strengthText.textContent = '';
        }

        strengthBar.style.width = `${barWidth}%`;
        strengthBar.style.backgroundColor = barColor;
    });
}

// --- Course Listing & Filtering (Only for index.html) ---
// These elements and functions are specific to index.html and should only run there.
// Check if elements exist before adding listeners or calling functions.
const courseGrid = document.getElementById('courseGrid');
const resultsCount = document.querySelector('.results-count');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const emptyState = document.querySelector('.empty-state');

const filterSidebar = document.getElementById('filterSidebar');
const mobileFiltersToggle = document.getElementById('mobileFiltersToggle');
const clearFiltersBtn = document.getElementById('clearFilters');
const filterGroupHeaders = document.querySelectorAll('.filter-group-header');
const priceSlider = document.getElementById('priceSlider');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const languageFilters = document.querySelectorAll('.language-filters input[type="checkbox"]');
const selectAllLanguagesCheckbox = document.getElementById('selectAllLanguages');
const subjectCategoryItems = document.querySelectorAll('.subject-category-item');
const subjectCategoryCheckboxes = document.querySelectorAll('.subject-categories > .subject-category-item > label > input[type="checkbox"]');
const subcategoryToggles = document.querySelectorAll('.subject-category-item .subcategory-toggle');
const subcategoryCheckboxes = document.querySelectorAll('.subject-category-item .subcategories input[type=\'checkbox\']');
const availabilityBtns = document.querySelectorAll('.availability-btn');
const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
const sessionTypeBtns = document.querySelectorAll('.session-type-btn');
const groupSizeDiv = document.getElementById('groupSize');
const groupSizeBtns = document.querySelectorAll('.group-size-btn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const courseFeaturesCheckboxes = document.querySelectorAll('.course-features input[type="checkbox"]');
const instructorTypeCheckboxes = document.querySelectorAll('.instructor-type-filters input[type="checkbox"]');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const autocompleteResults = document.getElementById('autocomplete-results');

let allCourses = [];
let displayedCourses = [];
const coursesPerPage = 6;
let currentPage = 0;
let isLoading = false;
let currentSearchTerm = '';
let debounceTimer;

const subjectCounts = {}; // To store counts for badges

async function fetchAndRenderCourses() {
    console.log('fetchAndRenderCourses called'); // Debugging log
    if (!courseGrid) {
        console.log('courseGrid not found, skipping course rendering.');
        return; // Only run if on index.html
    }

    showLoadingSkeletons();
    isLoading = true;

    try {
        console.log('Fetching courses from localDb...');
        const courses = await CourseService.getAllCourses();
        console.log('Courses fetched:', courses);
        console.log('Fetching users from localDb...');
        const users = await localDb.getUsers(); // Fetch all users to get mentor details
        console.log('Users fetched:', users);

        // Map mentor details to courses and calculate subject counts
        allCourses = courses.map(course => {
            const mentor = users.find(user => user.id === course.mentor_id);
            const isAvailableNow = checkAvailability(course.availability, course.time_slots);
            
            // Initialize subject counts
            if (course.subject) {
                const mainSubject = course.subject.toLowerCase();
                subjectCounts[mainSubject] = (subjectCounts[mainSubject] || 0) + 1;
                if (course.sub_category) {
                    const subCategory = course.sub_category.toLowerCase();
                    subjectCounts[subCategory] = (subjectCounts[subCategory] || 0) + 1;
                }
            }

            return {
                ...course,
                mentor_name: mentor ? mentor.full_name : 'Unknown Mentor',
                mentor_avatar_url: mentor ? mentor.avatar_url : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=320&h=320',
                mentor_headline: mentor ? mentor.headline : 'Mentor',
                is_verified: true, // Placeholder for verified badge
                is_available_now: isAvailableNow // Placeholder for real-time availability
            };
        });
        console.log('All courses (with mentor info):', allCourses);
        updateSubjectCountBadges();
        applyFiltersAndSort();
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        showNotification('Failed to load courses. Please try again later.', 'error');
        if (emptyState) emptyState.style.display = 'block'; // Show empty state on error
    } finally {
        isLoading = false;
        hideLoadingSkeletons();
    }
}

function checkAvailability(availability, timeSlots) {
    // Simplified logic for demo. In a real app, this would check current time/date.
    const now = new Date();
    const currentHour = now.getHours();

    if (availability && availability.today) { // Added null check for availability
        if (timeSlots && timeSlots.includes('morning') && currentHour >= 6 && currentHour < 12) return true;
        if (timeSlots && timeSlots.includes('afternoon') && currentHour >= 12 && currentHour < 17) return true;
        if (timeSlots && timeSlots.includes('evening') && currentHour >= 17 && currentHour < 22) return true;
        if (timeSlots && timeSlots.includes('night') && (currentHour >= 22 || currentHour < 6)) return true;
    }
    // More complex logic for 'this_week' and 'weekends_only' would go here
    return false;
}

function updateSubjectCountBadges() {
    document.querySelectorAll('.course-count-badge').forEach(badge => {
        const subject = badge.dataset.subject;
        badge.textContent = `(${subjectCounts[subject] || 0})`;
    });
}

function showLoadingSkeletons() {
    if (!courseGrid) return;
    courseGrid.innerHTML = '';
    for (let i = 0; i < coursesPerPage; i++) {
        const skeleton = document.createElement('div');
        skeleton.classList.add('loading-skeleton');
        courseGrid.appendChild(skeleton);
    }
    if (emptyState) emptyState.style.display = 'none';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

function hideLoadingSkeletons() {
    if (!courseGrid) return;
    document.querySelectorAll('.loading-skeleton').forEach(s => s.remove());
}

async function renderCourses(coursesToRender, append = false) {
    console.log('Rendering courses:', coursesToRender);
    if (!courseGrid) return;

    if (!append) {
        courseGrid.innerHTML = '';
        // Trigger reflow for fade-in animation
        void courseGrid.offsetWidth;
    }

    if (coursesToRender.length === 0 && !append) {
        if (emptyState) emptyState.style.display = 'block';
        if (resultsCount) resultsCount.textContent = 'Showing 0 of 0 courses';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    } else {
        if (emptyState) emptyState.style.display = 'none';
    }

    const startIndex = currentPage * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const paginatedCourses = coursesToRender.slice(startIndex, endIndex);

    const currentUser = AuthService.getCurrentUser();
    const userFavorites = currentUser ? (currentUser.favorites || []) : [];
    console.log('Current user favorites:', userFavorites);

    paginatedCourses.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (userFavorites.includes(course.id)) {
            card.classList.add('favorited');
        }

        const languagesHtml = course.languages_taught?.map(lang => `
            <img src="${getFlagIcon(lang)}" alt="${lang} flag" title="${lang}">
        `).join('') || ''; // Added null check and default empty string

        const tagsHtml = course.tags?.slice(0, 3).map(tag => `<span class="subject-tag">${tag}</span>`).join('') || ''; // Added null check and default empty string

        card.innerHTML = `
            <div class="course-header">
                <div class="course-image">
                    <img src="${course.course_image_url}" alt="${course.title}" loading="lazy">
                </div>
                <span class="difficulty-badge ${course.difficulty_level}">${course.difficulty_level}</span>
            </div>
            <div class="course-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-headline">${course.short_description}</p>
                <div class="mentor-info">
                    <img src="${course.mentor_avatar_url}" alt="${course.mentor_name}" class="mentor-avatar-small">
                    <span class="mentor-name">${course.mentor_name} ${course.is_verified ? '<i class="fas fa-check-circle verified-badge" title="Verified Instructor"></i>' : ''}</span>
                </div>
                <div class="course-stats">
                    <div class="course-rating">
                        <span class="stars">${getStarRatingHtml(course.average_rating)}</span>
                        <span class="rating-text">${course.average_rating} (${course.total_reviews} reviews)</span>
                    </div>
                </div>
                <div class="languages-offered">
                    ${languagesHtml}
                </div>
                <div class="price-section">
                    <span class="coin-price"><i class="fas fa-coins"></i> ${course.price_per_session} </span>
                    ${course.is_available_now ? '<span class="available-now"><span class="dot"></span> Available Now</span>' : ''}
                </div>
                <div class="subject-tags">
                    ${tagsHtml}
                </div>
                <div class="course-actions">
                    <button class="btn btn-primary preview-btn">Preview</button>
                    <button class="favorite-btn" data-course-id="${course.id}"><i class="${userFavorites.includes(course.id) ? 'fas' : 'far'} fa-heart"></i></button>
                </div>
            </div>
        `;
        courseGrid.appendChild(card);

        // Add event listener for preview button
        card.querySelector('.preview-btn')?.addEventListener('click', () => {
            window.location.href = `course-detail.html?id=${course.id}`;
        });
    });

    if (resultsCount) resultsCount.textContent = `Showing ${Math.min(endIndex, coursesToRender.length)} of ${coursesToRender.length} courses`;

    if (endIndex < coursesToRender.length) {
        if (loadMoreBtn) loadMoreBtn.style.display = 'block';
    } else {
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    }

    // Add event listeners for favorite buttons
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.onclick = async (e) => {
            e.stopPropagation();
            const courseId = button.dataset.courseId;
            const currentUser = AuthService.getCurrentUser();
            if (!currentUser) {
                showNotification('Please log in to favorite courses.', 'info');
                showAuthModal();
                return;
            }

            let user = await localDb.getUser(currentUser.id);
            if (!user) {
                showNotification('User data not found.', 'error');
                return;
            }

            let favorites = new Set(user.favorites || []);
            const isFavorited = favorites.has(courseId);

            if (isFavorited) {
                favorites.delete(courseId);
                button.querySelector('i')?.classList.replace('fas', 'far');
                button.classList.remove('favorited');
                showNotification('Course removed from favorites.', 'info');
            } else {
                favorites.add(courseId);
                button.querySelector('i')?.classList.replace('far', 'fas');
                button.classList.add('favorited');
                showNotification('Course added to favorites!', 'success');
            }
            user.favorites = Array.from(favorites);
            await localDb.updateUser(user.id, { favorites: user.favorites });
            AuthService.updateCurrentUser(user); // Update local storage
            console.log('User favorites updated:', user.favorites);
        };
    });
}

function applyFiltersAndSort() {
    if (!courseGrid) return; // Only run if on index.html

    let filteredCourses = [...allCourses];

    // Apply Price Filter
    const minPrice = minPriceInput ? parseInt(minPriceInput.value) : 0;
    const maxPrice = maxPriceInput ? parseInt(maxPriceInput.value) : 5000;
    filteredCourses = filteredCourses.filter(course =>
        course.price_per_session >= minPrice && course.price_per_session <= maxPrice
    );

    // Apply Language Filter
    const selectedLanguages = Array.from(languageFilters)
        .filter(checkbox => checkbox.checked && checkbox.value !== 'selectAllLanguages')
        .map(checkbox => checkbox.value);
    if (selectedLanguages.length > 0) {
        filteredCourses = filteredCourses.filter(course =>
            course.languages_taught?.some(lang => selectedLanguages.includes(lang.toLowerCase())) // Added null check
        );
    }

    // Apply Subject Filter (main categories and subcategories)
    const selectedMainSubjects = Array.from(subjectCategoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value.toLowerCase());
    const selectedSubcategories = Array.from(subcategoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value.toLowerCase());

    if (selectedMainSubjects.length > 0 || selectedSubcategories.length > 0) {
        filteredCourses = filteredCourses.filter(course => {
            const courseSubject = course.subject ? course.subject.toLowerCase() : '';
            const courseSubCategory = course.sub_category ? course.sub_category.toLowerCase() : '';
            return selectedMainSubjects.includes(courseSubject) || selectedSubcategories.includes(courseSubCategory);
        });
    }

    // Apply Availability Filter
    const selectedAvailability = Array.from(availabilityBtns).find(btn => btn.classList.contains('active'))?.dataset.value;
    if (selectedAvailability) {
        filteredCourses = filteredCourses.filter(course => course.availability && course.availability[selectedAvailability]); // Added null check
    }

    // Apply Time Slot Filter
    const selectedTimeSlot = Array.from(timeSlotBtns).find(btn => btn.classList.contains('active'))?.dataset.value;
    if (selectedTimeSlot) {
        filteredCourses = filteredCourses.filter(course => course.availability && course.availability.time_slots && course.availability.time_slots.includes(selectedTimeSlot)); // Added null check
    }

    // Apply Session Type Filter
    const selectedSessionType = Array.from(sessionTypeBtns).find(btn => btn.classList.contains('active'))?.dataset.type;
    if (selectedSessionType) {
        filteredCourses = filteredCourses.filter(course => course.session_type === selectedSessionType);
        if (selectedSessionType === 'group') {
            const selectedGroupSize = Array.from(groupSizeBtns).find(btn => btn.classList.contains('active'))?.dataset.size;
            if (selectedGroupSize) {
                filteredCourses = filteredCourses.filter(course => course.group_size === selectedGroupSize);
            }
        }
    }

    // Apply Difficulty Filter
    const selectedDifficulty = Array.from(difficultyBtns).find(btn => btn.classList.contains('active'))?.dataset.value;
    if (selectedDifficulty) {
        filteredCourses = filteredCourses.filter(course =>
            course.difficulty_level?.toLowerCase() === selectedDifficulty // Added null check
        );
    }

    // Apply Course Features Filter
    const selectedFeatures = Array.from(courseFeaturesCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value.toLowerCase());
    if (selectedFeatures.length > 0) {
        filteredCourses = filteredCourses.filter(course =>
            selectedFeatures.every(feature => course.features?.includes(feature)) // Added null check
        );
    }

    // Apply Instructor Type Filter
    const selectedInstructorTypes = Array.from(instructorTypeCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value.toLowerCase());
    if (selectedInstructorTypes.length > 0) {
        filteredCourses = filteredCourses.filter(course =>
            course.instructor_type?.toLowerCase() === selectedInstructorTypes[0] // Assuming single selection for simplicity
        );
    }

    // Apply Search Input Filter
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchTerm) {
        filteredCourses = filteredCourses.filter(course =>
            course.title?.toLowerCase().includes(searchTerm) ||
            course.short_description?.toLowerCase().includes(searchTerm) ||
            course.subject?.toLowerCase().includes(searchTerm) ||
            course.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            course.mentor_name?.toLowerCase().includes(searchTerm)
        );
    }

    // Apply Sorting
    const sortBy = sortSelect ? sortSelect.value : 'relevance';
    filteredCourses.sort((a, b) => {
        if (sortBy === 'rating') {
            return b.average_rating - a.average_rating;
        } else if (sortBy === 'priceLow') {
            return a.price_per_session - b.price_per_session;
        } else if (sortBy === 'priceHigh') {
            return b.price_per_session - a.price_per_session;
        } else if (sortBy === 'newest') {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        // 'relevance' would require more complex logic/data
        return 0;
    });

    displayedCourses = filteredCourses;
    currentPage = 0; // Reset to first page on filter/sort change
    renderCourses(displayedCourses);
}

// Debounce function for search input
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

const debouncedApplyFiltersAndSort = debounce(applyFiltersAndSort, 300);

// Autocomplete for search input
async function updateAutocomplete() {
    if (!searchInput || !autocompleteResults) return;

    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.length < 2) {
        autocompleteResults.style.display = 'none';
        return;
    }

    const suggestions = new Set();
    allCourses.forEach(course => {
        if (course.title?.toLowerCase().includes(searchTerm)) {
            suggestions.add(course.title);
        }
        if (course.mentor_name?.toLowerCase().includes(searchTerm)) {
            suggestions.add(course.mentor_name);
        }
        course.tags?.forEach(tag => {
            if (tag.toLowerCase().includes(searchTerm)) {
                suggestions.add(tag);
            }
        });
    });

    autocompleteResults.innerHTML = '';
    if (suggestions.size > 0) {
        Array.from(suggestions).slice(0, 5).forEach(suggestion => {
            const item = document.createElement('div');
            item.classList.add('autocomplete-item');
            item.innerHTML = suggestion.replace(new RegExp(searchTerm, 'gi'), (match) => `<strong>${match}</strong>`);
            item.addEventListener('click', () => {
                searchInput.value = suggestion;
                autocompleteResults.style.display = 'none';
                applyFiltersAndSort();
            });
            autocompleteResults.appendChild(item);
        });
        autocompleteResults.style.display = 'block';
    } else {
        autocompleteResults.style.display = 'none';
    }
}

// Event Listeners for Filters (Only add if elements exist)
if (minPriceInput) minPriceInput.addEventListener('input', () => {
    if (priceSlider) priceSlider.value = Math.max(parseInt(minPriceInput.value), parseInt(priceSlider.min));
    debouncedApplyFiltersAndSort();
});
if (maxPriceInput) maxPriceInput.addEventListener('input', () => {
    if (priceSlider) priceSlider.value = Math.min(parseInt(maxPriceInput.value), parseInt(priceSlider.max));
    debouncedApplyFiltersAndSort();
});
if (priceSlider) priceSlider.addEventListener('input', () => {
    if (maxPriceInput) maxPriceInput.value = priceSlider.value;
    debouncedApplyFiltersAndSort();
});

languageFilters.forEach(checkbox => {
    if (checkbox) checkbox.addEventListener('change', (e) => {
        if (e.target.id === 'selectAllLanguages') {
            languageFilters.forEach(cb => {
                if (cb.id !== 'selectAllLanguages') {
                    cb.checked = e.target.checked;
                }
            });
        } else {
            // If any language is unchecked, uncheck "Select All"
            if (!e.target.checked && selectAllLanguagesCheckbox) {
                selectAllLanguagesCheckbox.checked = false;
            } else {
                // If all other languages are checked, check "Select All"
                const allOthersChecked = Array.from(languageFilters).every(cb => cb.id === 'selectAllLanguages' || cb.checked);
                if (allOthersChecked && selectAllLanguagesCheckbox) {
                    selectAllLanguagesCheckbox.checked = true;
                }
            }
        }
        applyFiltersAndSort();
    });
});

// Subject category expand/collapse
subjectCategoryItems.forEach(item => {
    const toggle = item.querySelector('.subcategory-toggle');
    const subcategories = item.querySelector('.subcategories');
    if (toggle && subcategories) {
        toggle.addEventListener('click', () => {
            subcategories.classList.toggle('expanded');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
        });
    }
});

// Subject checkboxes (main and sub)
subjectCategoryCheckboxes.forEach(checkbox => { if (checkbox) checkbox.addEventListener('change', applyFiltersAndSort); });
subcategoryCheckboxes.forEach(checkbox => { if (checkbox) checkbox.addEventListener('change', applyFiltersAndSort); });


availabilityBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
        availabilityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFiltersAndSort();
    });
});

timeSlotBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
        timeSlotBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFiltersAndSort();
    });
});

sessionTypeBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
        sessionTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.type === 'group') {
            if (groupSizeDiv) groupSizeDiv.style.display = 'block';
        } else {
            if (groupSizeDiv) groupSizeDiv.style.display = 'none';
        }
        applyFiltersAndSort();
    });
});

groupSizeBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
        groupSizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFiltersAndSort();
    });
});

difficultyBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
        difficultyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFiltersAndSort();
    });
});

courseFeaturesCheckboxes.forEach(checkbox => { if (checkbox) checkbox.addEventListener('change', applyFiltersAndSort); });
instructorTypeCheckboxes.forEach(checkbox => { if (checkbox) checkbox.addEventListener('change', applyFiltersAndSort); });

if (sortSelect) sortSelect.addEventListener('change', applyFiltersAndSort);

if (searchInput) {
    searchInput.addEventListener('input', () => {
        debouncedApplyFiltersAndSort();
        updateAutocomplete();
    });
    searchInput.addEventListener('focus', updateAutocomplete);
    searchInput.addEventListener('blur', () => {
        // Delay hiding to allow click on autocomplete item
        setTimeout(() => {
            if (autocompleteResults) autocompleteResults.style.display = 'none';
        }, 100);
    });
}


if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', () => {
    // Reset price
    if (minPriceInput) minPriceInput.value = 50;
    if (maxPriceInput) maxPriceInput.value = 2000;
    if (priceSlider) priceSlider.value = 2000;

    // Reset checkboxes
    document.querySelectorAll('.filter-group-content input[type="checkbox"]').forEach(cb => cb.checked = false);
    // Ensure "Select All" is unchecked
    if (selectAllLanguagesCheckbox) selectAllLanguagesCheckbox.checked = false;

    // Reset radio buttons/toggles
    sessionTypeBtns.forEach(btn => btn.classList.remove('active'));
    const defaultSessionType = document.querySelector('.session-type-btn[data-type="1-on-1"]');
    if (defaultSessionType) defaultSessionType.classList.add('active');
    if (groupSizeDiv) groupSizeDiv.style.display = 'none';

    // Reset active buttons
    document.querySelectorAll('.availability-btn, .time-slot-btn, .difficulty-btn, .group-size-btn').forEach(btn => btn.classList.remove('active'));
    // No default active for these, user must select

    // Reset search input
    if (searchInput) searchInput.value = '';

    // Reset sort
    if (sortSelect) sortSelect.value = 'relevance';

    applyFiltersAndSort();
});

// Filter group expand/collapse
filterGroupHeaders.forEach(header => {
    if (header) header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const expandBtn = header.querySelector('.expand-btn i');
        if (content) content.classList.toggle('expanded');
        if (expandBtn) {
            expandBtn.classList.toggle('fa-chevron-down');
            expandBtn.classList.toggle('fa-chevron-up');
        }
    });
});

// Mobile filters toggle
if (mobileFiltersToggle && filterSidebar) { // Ensure both elements exist before attaching listener
    mobileFiltersToggle.addEventListener('click', () => {
        filterSidebar.classList.toggle('active');
        if (filterSidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling body when sidebar is open
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close sidebar when clicking outside (on overlay)
    filterSidebar.addEventListener('click', (e) => {
        if (e.target === filterSidebar) { // Only close if clicking the overlay part of the sidebar
            filterSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Load More button
loadMoreBtn?.addEventListener('click', () => {
    if (!isLoading) {
        currentPage++;
        renderCourses(displayedCourses, true); // Append new courses
    }
});

// --- Initializations ---
document.addEventListener('DOMContentLoaded', async () => {
    // Await localDb.open() to ensure database is ready and populated
    try {
        await localDb.open();
        console.log('IndexedDB is open and ready.');
    } catch (error) {
        console.error('Failed to open IndexedDB:', error);
        showNotification('Failed to initialize local database. Please refresh.', 'error');
        return; // Stop further execution if DB fails to open
    }

    initAuthModalUI();
    updateUIForAuth(); // Call this on every page load

    // Only fetch and render courses if on index.html
    if (document.getElementById('courseGrid')) {
        console.log('Course grid found. Initiating course fetch and render.');
        fetchAndRenderCourses();
    } else {
        console.log('Course grid not found on this page.');
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar'); // Changed to .navbar
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Attach event listener to "Join StudyBuddy" button to show auth modal
    joinBtn?.addEventListener('click', showAuthModal);
    mobileJoinBtn?.addEventListener('click', showAuthModal);

    // Set initial state for password strength meter
    // Only dispatch event if all strength meter elements exist
    if (allStrengthMeterElementsExist) {
        signupPasswordInput.dispatchEvent(new Event('input'));
    }

    // Event listener for "Apply Now" button on become-a-mentor.html
    const mentorSignupBtn = document.getElementById('mentor-signup-btn');
    if (mentorSignupBtn) {
        mentorSignupBtn.addEventListener('click', () => {
            showAuthModal();
            // Optionally switch to signup tab and pre-select mentor role
            const signupTabBtn = document.querySelector('.auth-tab-btn[data-tab="signup"]');
            if (signupTabBtn) signupTabBtn.click();
            const mentorRoleRadio = document.querySelector('input[name="signup-role"][value="mentor"]');
            if (mentorRoleRadio) mentorRoleRadio.checked = true;
        });
    }
});
