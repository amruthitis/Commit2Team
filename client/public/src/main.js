document.addEventListener('DOMContentLoaded', () => {

    // Get the elements
    const resumeBtn = document.getElementById('resumeBtn');
    const teamCardsSection = document.querySelector('.team-cards');
    const applyFilterBtn = document.getElementById('applyFilter');
    const clearFilterBtn = document.getElementById('clearFilter');

    // Function to generate avatar initials
    function getAvatarInitials(name) {
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }

    // Function to get skill category display name
    function getSkillCategoryDisplay(category) {
        const categories = {
            'frontend': 'Frontend Development',
            'backend': 'Backend Development', 
            'fullstack': 'Full-Stack Development',
            'ai-ml': 'AI/ML',
            'mobile': 'Mobile Development',
            'ui-ux': 'UI/UX Design'
        };
        return categories[category] || category;
    }

    // Function to get skill tags based on category
    function getSkillTags(category) {
        const skillMap = {
            'frontend': ['React', 'JavaScript', 'CSS', 'HTML'],
            'backend': ['Node.js', 'Python', 'Java', 'SQL'],
            'fullstack': ['React', 'Node.js', 'MongoDB', 'Express'],
            'ai-ml': ['Python', 'TensorFlow', 'Statistics', 'SQL'],
            'mobile': ['React Native', 'Flutter', 'iOS', 'Android'],
            'ui-ux': ['Figma', 'Adobe XD', 'User Research', 'Prototyping']
        };
        return skillMap[category] || ['Skills', 'Development', 'Programming', 'Tech'];
    }

    // Function to create user card HTML
    function createUserCard(user) {
        const initials = getAvatarInitials(user.name);
        const skillCategoryDisplay = getSkillCategoryDisplay(user.skillCategory);
        const skillTags = getSkillTags(user.skillCategory);
        const genderDisplay = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified';
        
        return `
            <div class="card">
                <div class="card-header">
                    <div class="avatar ${initials.toLowerCase()}">${initials}</div>
                    <div class="info">
                        <h3>${user.name}</h3>
                        <p>${skillCategoryDisplay}</p>
                        <span><i class="ri-map-pin-2-fill"></i> ${user.college}</span>
                        <span><i class="ri-user-line"></i> ${genderDisplay}</span>
                    </div>
                </div>
                <div class="card-body">
                    <h4>Domain: ${skillCategoryDisplay}</h4>
                    <div class="tags">
                        ${skillTags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
                <button class="request-btn">
                    <i class="ri-user-add-line"></i>
                    Send Request
                </button>
            </div>
        `;
    }

    // Function to load users from database
    async function loadUsers() {
        try {
            const response = await fetch('http://localhost:5000/api/portfolio/users');
            const data = await response.json();
            
            if (data.success && data.users.length > 0) {
                // Clear existing cards
                teamCardsSection.innerHTML = '';
                
                // Add user cards
                data.users.forEach(user => {
                    teamCardsSection.insertAdjacentHTML('beforeend', createUserCard(user));
                });
            } else {
                // Show default cards if no users found
                showDefaultCards();
            }
        } catch (error) {
            console.error('Error loading users:', error);
            // Show default cards on error
            showDefaultCards();
        }
    }

    // Function to show default cards
    function showDefaultCards() {
        teamCardsSection.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="avatar ac">AC</div>
                    <div class="info">
                        <h3>Alex Chen</h3>
                        <p>Full Stack Developer</p>
                        <span><i class="ri-map-pin-2-fill"></i> Mumbai</span>
                    </div>
                </div>
                <div class="card-body">
                    <h4>Domain: Web Development</h4>
                    <div class="tags">
                        <span>React</span>
                        <span>Node.js</span>
                        <span>Python</span>
                        <span>MongoDB</span>
                    </div>
                </div>
                <button class="request-btn">
                    <i class="ri-user-add-line"></i>
                    Send Request
                </button>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="avatar ps">PS</div>
                    <div class="info">
                        <h3>Priya Sharma</h3>
                        <p>UI/UX Designer</p>
                        <span><i class="ri-map-pin-2-fill"></i> Bangalore</span>
                    </div>
                </div>
                <div class="card-body">
                    <h4>Domain: Design</h4>
                    <div class="tags">
                        <span>Figma</span>
                        <span>Adobe XD</span>
                        <span>User Research</span>
                        <span>Prototyping</span>
                    </div>
                </div>
                <button class="request-btn">
                    <i class="ri-user-add-line"></i>
                    Send Request
                </button>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="avatar rp">RP</div>
                    <div class="info">
                        <h3>Raj Patel</h3>
                        <p>Data Scientist</p>
                        <span><i class="ri-map-pin-2-fill"></i> Delhi</span>
                    </div>
                </div>
                <div class="card-body">
                    <h4>Domain: AI/ML</h4>
                    <div class="tags">
                        <span>Python</span>
                        <span>TensorFlow</span>
                        <span>Statistics</span>
                        <span>SQL</span>
                    </div>
                </div>
                <button class="request-btn">
                    <i class="ri-user-add-line"></i>
                    Send Request
                </button>
            </div>
        `;
    }

    // Function to load filtered users
    async function loadFilteredUsers() {
        try {
            const skillCategory = document.getElementById('skillFilter').value;
            const gender = document.getElementById('genderFilter').value;
            const year = document.getElementById('yearFilter').value;
            const college = document.getElementById('collegeFilter').value;

            // Build query parameters
            const params = new URLSearchParams();
            if (skillCategory && skillCategory !== 'all') params.append('skillCategory', skillCategory);
            if (gender && gender !== 'all') params.append('gender', gender);
            if (year && year !== 'all') params.append('year', year);
            if (college && college.trim()) params.append('college', college.trim());

            const response = await fetch(`http://localhost:5000/api/portfolio/users/filter?${params.toString()}`);
            const data = await response.json();
            
            if (data.success && data.users.length > 0) {
                // Clear existing cards
                teamCardsSection.innerHTML = '';
                
                // Add user cards
                data.users.forEach(user => {
                    teamCardsSection.insertAdjacentHTML('beforeend', createUserCard(user));
                });
                
                // Show result count
                showResultCount(data.count, data.filters);
            } else {
                // Show no results message
                teamCardsSection.innerHTML = `
                    <div class="no-results">
                        <i class="ri-search-line"></i>
                        <h3>No students found</h3>
                        <p>Try adjusting your filters or clear them to see all students.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading filtered users:', error);
            // Show default cards on error
            showDefaultCards();
        }
    }

    // Function to show result count
    function showResultCount(count, filters) {
        const existingCount = document.querySelector('.result-count');
        if (existingCount) {
            existingCount.remove();
        }

        const countDiv = document.createElement('div');
        countDiv.className = 'result-count';
        countDiv.innerHTML = `
            <p><i class="ri-user-line"></i> Found ${count} student${count !== 1 ? 's' : ''}</p>
        `;
        
        teamCardsSection.parentNode.insertBefore(countDiv, teamCardsSection);
    }

    // Function to clear filters
    function clearFilters() {
        document.getElementById('skillFilter').value = 'all';
        document.getElementById('genderFilter').value = 'all';
        document.getElementById('yearFilter').value = 'all';
        document.getElementById('collegeFilter').value = '';
        
        // Remove result count
        const existingCount = document.querySelector('.result-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        // Load all users
        loadUsers();
    }

    // Load users when page loads
    loadUsers();

    // Event Listeners
    resumeBtn.addEventListener('click', () => {
        // Directly redirect to resume analyzer page
        window.location.href = 'resume-analyzer.html';
    });

    applyFilterBtn.addEventListener('click', loadFilteredUsers);
    clearFilterBtn.addEventListener('click', clearFilters);

    // Allow Enter key in college filter to apply filters
    document.getElementById('collegeFilter').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loadFilteredUsers();
        }
    });

});