import { AuthService } from './auth.js'; // Corrected import to use localDb-based AuthService
import { localDb } from './localDb.js'; // Import localDb for saving applications
import { showNotification } from './script.js'; // Import showNotification

document.addEventListener('DOMContentLoaded', async () => {
    // Lottie Animations
    lottie.loadAnimation({
        container: document.getElementById('lottie-welcome'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets10.lottiefiles.com/packages/lf20_i8mmfrht.json'
    });

    const successAnimation = lottie.loadAnimation({
        container: document.getElementById('lottie-success'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'https://assets2.lottiefiles.com/packages/lf20_xwmj0hsk.json'
    });

    // DOM Elements
    const form = document.getElementById('onboarding-form');
    const startAppBtn = document.getElementById('start-app-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const formStepsContainer = document.getElementById('form-steps');
    const successScreen = document.getElementById('success-screen');
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressText = document.getElementById('progress-text');
    const bioTextarea = document.getElementById('bio');
    const charCount = document.getElementById('char-count');
    const teachingExperienceRadios = document.querySelectorAll('input[name="teachingExperience"]');
    const teachingDetailsContainer = document.getElementById('teachingDetails');
    const fileInputs = document.querySelectorAll('.file-input');
    const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]');
    const languageCheckboxes = document.querySelectorAll('input[name="languages"]'); // New: Language checkboxes

    const steps = Array.from(document.querySelectorAll('.onboarding-step[id^="step-"]'));
    const totalSteps = steps.length;
    let currentStep = 0;

    // --- Autofill User Details ---
    async function autofillUserDetails() {
        try {
            const user = AuthService.getCurrentUser(); // Get user from localStorage
            if (user) {
                const userProfile = await localDb.getUser(user.id); // Fetch full profile from localDb
                if (userProfile) {
                    document.getElementById('fullName').value = userProfile.full_name || '';
                    document.getElementById('email').value = userProfile.email || '';
                    document.getElementById('phone').value = userProfile.phone || ''; 
                    document.getElementById('city').value = userProfile.city || ''; 
                    document.getElementById('bio').value = userProfile.bio || ''; 
                    charCount.textContent = `${bioTextarea.value.length}/500 characters`;

                    // Autofill languages (if stored as an array of values)
                    if (userProfile.languages && Array.isArray(userProfile.languages)) {
                        languageCheckboxes.forEach(checkbox => {
                            if (userProfile.languages.includes(checkbox.value)) {
                                checkbox.checked = true;
                            }
                        });
                    }
                    // Autofill gender
                    if (userProfile.gender) {
                        const genderRadio = document.querySelector(`input[name="gender"][value="${userProfile.gender}"]`);
                        if (genderRadio) genderRadio.checked = true;
                    }
                    // Autofill DOB
                    if (userProfile.dob) {
                        document.getElementById('dob').value = userProfile.dob;
                    }
                }
            }
        } catch (error) {
            console.error('Error autofilling user details:', error);
            showNotification('Failed to autofill some details.', 'error');
        }
    }

    // --- VALIDATION LOGIC ---
    const validationRules = {
        0: [ // Step 1
            { input: 'fullName', type: 'text', min: 2 },
            { input: 'email', type: 'email' },
            { input: 'phone', type: 'phone' },
            { input: 'dob', type: 'date' },
            { input: 'gender', type: 'select', min: 1 }, // Changed from 'select' to 'radio'
            { input: 'city', type: 'text', min: 2 },
            { input: 'languages', type: 'checkbox', min: 1 }, // Changed to checkbox
            { input: 'bio', type: 'text', min: 10 },
            { input: 'profilePhoto', type: 'file', optional: true }
        ],
        1: [ // Step 2
            { input: 'educationLevel', type: 'select' },
            { input: 'institution', type: 'text', min: 3 },
            { input: 'gradYear', type: 'year' },
            { input: 'fieldOfStudy', type: 'text', min: 2 },
            { input: 'profession', type: 'text', min: 2, optional: true },
            { input: 'experience', type: 'number', min: 0, optional: true },
            { input: 'previousTeachingDetails', type: 'text', min: 10, conditional: { input: 'teachingExperience', value: 'yes' }, optional: true } // Made optional if teachingExperience is 'no'
        ],
        2: [ // Step 3
            { input: 'subjects', type: 'checkbox', min: 3, max: 10 },
            { input: 'customSubjects', type: 'text', optional: true },
            { input: 'teachingApproach', type: 'checkbox', min: 1, optional: true },
            { input: 'targetAudience', type: 'radio', min: 1 }
        ],
        3: [ // Step 4
            { input: 'idFront', type: 'file' },
            { input: 'idBack', type: 'file' },
            { input: 'eduCert', type: 'file' },
            { input: 'profCert', type: 'file', optional: true },
            { input: 'teachingCred', type: 'file', optional: true }
        ],
        4: [ // Step 5
            { input: 'demoVideo', type: 'file' }
        ],
        5: [ // Step 6
            { input: 'ndaAgree', type: 'checkbox', min: 1 },
            { input: 'digitalSignature', type: 'signature' }
        ],
        6: [] // Step 7 - Review
    };

    const validateStep = (stepIndex) => {
        let isValid = true;
        const rules = validationRules[stepIndex];
        if (!rules) return true;

        rules.forEach(rule => {
            const inputElements = form.querySelectorAll(`[name="${rule.input}"]`);
            const inputElement = inputElements[0]; // Get the first element for single inputs

            // Handle conditional validation
            if (rule.conditional) {
                const conditionInput = form.querySelector(`[name="${rule.conditional.input}"]`);
                if (conditionInput && conditionInput.value !== rule.conditional.value) {
                    // If condition not met, and field is optional, skip validation
                    if (rule.optional) {
                        // Clear any existing error message for this field if condition is not met
                        const group = inputElement ? inputElement.closest('.form-group, .subject-tree, .language-checkbox-grid') : null;
                        if (group) {
                            group.classList.remove('error');
                            const errorMsg = group.querySelector('.error-message');
                            if (errorMsg) errorMsg.remove();
                        }
                        return;
                    }
                }
            }

            // Find the appropriate parent for error messages
            let group = null;
            if (inputElement) {
                group = inputElement.closest('.form-group, .subject-tree, .language-checkbox-grid');
            } else if (rule.type === 'checkbox' || rule.type === 'radio') {
                // For checkbox/radio groups, find a common parent if individual inputs don't have a form-group
                group = form.querySelector(`[name="${rule.input}"]`)?.closest('.form-group, .subject-tree, .checkbox-group, .radio-group, .language-checkbox-grid');
            }

            if (!group) {
                console.error(`Could not find a validation container for input "${rule.input}".`);
                isValid = false; // Treat as invalid if container not found
                return;
            }

            let isFieldValid = false;

            // Clear previous errors
            group.classList.remove('error');
            const errorMsg = group.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();

            switch (rule.type) {
                case 'text':
                    isFieldValid = inputElement.value.trim().length >= rule.min;
                    break;
                case 'email':
                    isFieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputElement.value);
                    break;
                case 'phone':
                    isFieldValid = /^\d{10}$/.test(inputElement.value);
                    break;
                case 'date':
                    isFieldValid = inputElement.value !== '';
                    break;
                case 'select':
                    isFieldValid = inputElement.value !== '';
                    break;
                case 'year':
                    const year = parseInt(inputElement.value, 10);
                    isFieldValid = !isNaN(year) && year >= 1950 && year <= new Date().getFullYear();
                    break;
                case 'number':
                    const num = parseInt(inputElement.value, 10);
                    isFieldValid = !isNaN(num) && num >= rule.min;
                    break;
                case 'checkbox':
                    const checkedCount = form.querySelectorAll(`input[name="${rule.input}"]:checked`).length;
                    isFieldValid = checkedCount >= rule.min && (rule.max ? checkedCount <= rule.max : true);
                    break;
                case 'radio':
                    isFieldValid = form.querySelectorAll(`input[name="${rule.input}"]:checked`).length >= rule.min;
                    break;
                case 'file':
                    isFieldValid = inputElement.files.length > 0;
                    break;
                case 'signature':
                    const fullNameInput = form.querySelector('#fullName');
                    const fullName = fullNameInput ? fullNameInput.value.trim().toLowerCase() : '';
                    isFieldValid = inputElement.value.trim().toLowerCase() === fullName && fullName !== '';
                    break;
            }

            if (!isFieldValid && !rule.optional) {
                isValid = false;
                group.classList.add('error');
                const msg = document.createElement('small');
                msg.className = 'error-message';
                msg.textContent = getErrorMessage(rule);
                group.appendChild(msg);
            }
        });

        return isValid;
    };

    const getErrorMessage = (rule) => {
        switch (rule.type) {
            case 'text': return `Please enter at least ${rule.min} characters.`;
            case 'email': return 'Please enter a valid email address.';
            case 'phone': return 'Please enter a 10-digit phone number.';
            case 'date': case 'select': return 'This field is required.';
            case 'checkbox':
                if (rule.input === 'languages') return `Please select at least ${rule.min} language(s).`;
                if (rule.input === 'subjects') return `Please select between ${rule.min} and ${rule.max || 'unlimited'} subjects.`;
                return 'Please make a selection.';
            case 'radio': return 'Please make a selection.';
            case 'year': return 'Please enter a valid year (e.g., 2023).';
            case 'number': return `Please enter a valid number (min ${rule.min}).`;
            case 'file': return 'Please upload the required file.';
            case 'signature': return 'Signature must match your full name from Step 1.';
            default: return 'Invalid input.';
        }
    };

    // --- EVENT LISTENERS ---
    startAppBtn.addEventListener('click', () => {
        welcomeScreen.style.display = 'none';
        formStepsContainer.style.display = 'block';
        updateStepVisibility();
        updateProgressBar();
        autofillUserDetails(); // Autofill when starting the application
    });

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps - 1) {
                currentStep++;
                if (currentStep === totalSteps - 1) { // If it's the review step
                    populateSummary();
                }
                updateStepVisibility();
                updateProgressBar();
            }
        }
    });

    backBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateStepVisibility();
            updateProgressBar();
        }
    });
    
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) { // Final validation on review step
            const formData = new FormData(form);
            const mentorApplication = { id: crypto.randomUUID() }; // Generate unique ID for application

            for (let [key, value] of formData.entries()) {
                if (key === 'languages' || key === 'subjects' || key === 'teachingApproach') {
                    if (!mentorApplication[key]) {
                        mentorApplication[key] = [];
                    }
                    mentorApplication[key].push(value);
                } else if (key === 'profilePhoto' || key === 'idFront' || key === 'idBack' || key === 'eduCert' || key === 'profCert' || key === 'teachingCred' || key === 'demoVideo') {
                    mentorApplication[key] = value.name; // Store file name
                } else if (key === 'gradYear' || key === 'experience') {
                    mentorApplication[key] = parseInt(value) || null; // Convert to number or null
                }
                else {
                    mentorApplication[key] = value;
                }
            }

            mentorApplication.status = 'pending'; // Initial status
            mentorApplication.submittedAt = new Date().toISOString();
            
            try {
                const user = AuthService.getCurrentUser();
                if (user) {
                    mentorApplication.userId = user.id;
                } else {
                    showNotification('User not logged in. Application cannot be submitted.', 'error');
                    return;
                }

                await localDb.addMentorApplication(mentorApplication);
                showNotification('Mentor application submitted successfully!', 'success');

                formStepsContainer.style.display = 'none';
                successScreen.style.display = 'block';
                successAnimation.play();
            } catch (error) {
                console.error('Error submitting mentor application:', error);
                showNotification(`Failed to submit application: ${error.message || 'Unknown error'}. Please try again.`, 'error');
            }
        }
    });

    bioTextarea.addEventListener('input', () => {
        charCount.textContent = `${bioTextarea.value.length}/500 characters`;
    });

    teachingExperienceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            teachingDetailsContainer.style.display = e.target.value === 'yes' ? 'block' : 'none';
            // Clear content if switching to 'no'
            if (e.target.value === 'no') {
                document.getElementById('previousTeachingDetails').value = '';
            }
            validateStep(currentStep); // Re-validate on change
        });
    });

    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
            const feedbackEl = document.getElementById(`${e.target.id}-name`);
            if (feedbackEl) {
                feedbackEl.textContent = fileName;
                feedbackEl.style.color = e.target.files[0] ? '#10b981' : '#64748b';
            }
            // For demo video, show preview
            if (e.target.id === 'demoVideo' && e.target.files[0]) {
                const videoPreview = document.getElementById('video-preview');
                const videoElement = videoPreview.querySelector('video');
                videoElement.src = URL.createObjectURL(e.target.files[0]);
                videoPreview.style.display = 'block';
            } else if (e.target.id === 'demoVideo') {
                document.getElementById('video-preview').style.display = 'none';
            }
            validateStep(currentStep); // Re-validate on file change
        });
    });

    // Re-validate subjects and languages on change
    subjectCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            validateStep(currentStep);
        });
    });
    languageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            validateStep(currentStep);
        });
    });

    // Real-time validation for inputs on blur
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', () => {
            // Only validate if it's the current step
            const stepElement = input.closest('.onboarding-step');
            if (stepElement && stepElement.id === steps[currentStep].id) {
                validateStep(currentStep);
            }
        });
    });

    // --- FUNCTIONS ---
    function updateStepVisibility() {
        steps.forEach((step, index) => {
            step.style.display = index === currentStep ? 'block' : 'none';
        });
        backBtn.style.display = currentStep > 0 ? 'inline-block' : 'none';
        nextBtn.style.display = currentStep < totalSteps - 1 ? 'inline-block' : 'none';
        submitBtn.style.display = currentStep === totalSteps - 1 ? 'inline-block' : 'none';
    }

    function updateProgressBar() {
        const progress = ((currentStep + 1) / totalSteps) * 100;
        progressBarFill.style.width = `${progress}%`;
        progressText.textContent = `Step ${currentStep + 1} of ${totalSteps}`;
    }

    function populateSummary() {
        const summaryContainer = document.getElementById('review-summary');
        const formData = new FormData(form);
        let html = '<h3>Personal Information</h3><ul>';

        const fieldLabels = {
            fullName: 'Full Name', email: 'Email', phone: 'Phone', dob: 'Date of Birth',
            gender: 'Gender', city: 'City', languages: 'Languages', bio: 'Bio',
            educationLevel: 'Education Level', institution: 'Institution', gradYear: 'Graduation Year',
            fieldOfStudy: 'Field of Study', profession: 'Profession', experience: 'Years Experience',
            teachingExperience: 'Taught Before?', previousTeachingDetails: 'Teaching Details',
            customSubjects: 'Other Subjects', teachingApproach: 'Teaching Approach', targetAudience: 'Target Audience',
            digitalSignature: 'Digital Signature'
        };

        // Personal Info
        ['fullName', 'email', 'phone', 'dob', 'gender', 'city', 'bio'].forEach(key => {
            const value = formData.get(key);
            if (value) {
                html += `<li><strong>${fieldLabels[key]}:</strong> ${value}</li>`;
            }
        });
        // Languages (checkboxes)
        const selectedLanguages = Array.from(form.querySelectorAll('input[name="languages"]:checked')).map(cb => cb.value);
        if (selectedLanguages.length > 0) {
            html += `<li><strong>${fieldLabels['languages']}:</strong> ${selectedLanguages.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(', ')}</li>`;
        }
        // Profile Photo
        const profilePhotoFile = document.getElementById('profilePhoto').files[0];
        if (profilePhotoFile) {
            html += `<li><strong>Profile Photo:</strong> ${profilePhotoFile.name} <i class="fas fa-check-circle" style="color: #10b981;"></i></li>`;
        } else {
            html += `<li><strong>Profile Photo:</strong> <span style="color: #f43f5e;">Missing</span> <i class="fas fa-times-circle" style="color: #f43f5e;"></i></li>`;
        }
        html += '</ul>';

        // Education & Experience
        html += '<h3>Education & Experience</h3><ul>';
        ['educationLevel', 'institution', 'gradYear', 'fieldOfStudy', 'profession', 'experience', 'teachingExperience'].forEach(key => {
            const value = formData.get(key);
            if (value) {
                html += `<li><strong>${fieldLabels[key]}:</strong> ${value}</li>`;
            }
        });
        if (formData.get('teachingExperience') === 'yes' && formData.get('previousTeachingDetails')) {
            html += `<li><strong>${fieldLabels['previousTeachingDetails']}:</strong> ${formData.get('previousTeachingDetails')}</li>`;
        }
        html += '</ul>';

        // Subjects & Expertise
        html += '<h3>Subjects & Expertise</h3><ul>';
        const subjects = Array.from(form.querySelectorAll('input[name="subjects"]:checked')).map(cb => cb.value);
        if (subjects.length > 0) {
            html += `<li><strong>Subjects:</strong> ${subjects.map(sub => sub.charAt(0).toUpperCase() + sub.slice(1)).join(', ')}</li>`;
        }
        if (formData.get('customSubjects')) {
            html += `<li><strong>Custom Subjects:</strong> ${formData.get('customSubjects')}</li>`;
        }
        const teachingApproach = Array.from(form.querySelectorAll('input[name="teachingApproach"]:checked')).map(cb => cb.value); // Re-checked syntax
        if (teachingApproach.length > 0) {
            html += `<li><strong>Teaching Approach:</strong> ${teachingApproach.map(app => app.charAt(0).toUpperCase() + app.slice(1)).join(', ')}</li>`;
        }
        if (formData.get('targetAudience')) {
            html += `<li><strong>Target Audience:</strong> ${formData.get('targetAudience')}</li>`;
        }
        html += '</ul>';

        // Documents
        html += '<h3>Uploaded Documents</h3><ul>';
        fileInputs.forEach(input => {
            if (input.files.length > 0) {
                const label = input.closest('.form-group').querySelector('label').textContent;
                html += `<li><strong>${label}:</strong> ${input.files[0].name} <i class="fas fa-check-circle" style="color: #10b981;"></i></li>`;
            } else if (!input.hasAttribute('optional')) {
                const label = input.closest('.form-group').querySelector('label').textContent;
                html += `<li><strong>${label}:</strong> <span style="color: #f43f5e;">Missing</span> <i class="fas fa-times-circle" style="color: #f43f5e;"></i></li>`;
            }
        });
        html += '</ul>';

        // NDA
        html += '<h3>NDA Agreement</h3><ul>';
        if (formData.get('ndaAgree')) {
            html += `<li><strong>NDA Agreement:</strong> Agreed <i class="fas fa-check-circle" style="color: #10b981;"></i></li>`;
        } else {
            html += `<li><strong>NDA Agreement:</strong> Not Agreed <i class="fas fa-times-circle" style="color: #f43f5e;"></i></li>`;
        }
        if (formData.get('digitalSignature')) {
            html += `<li><strong>Digital Signature:</strong> ${formData.get('digitalSignature')}</li>`;
        }
        html += '</ul>';

        summaryContainer.innerHTML = html;
    }
});
