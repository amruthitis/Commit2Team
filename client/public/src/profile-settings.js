// Function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('profileSettingsForm');
    const nameInput = document.getElementById('name');
    const usernameInput = document.getElementById('username');
    const yearInput = document.getElementById('year');
    const collegeInput = document.getElementById('college');
    const genderInput = document.getElementById('gender');
    const skillCategoryInput = document.getElementById('skillCategory');
    const formMessage = document.getElementById('formMessage');

    // Get user email from localStorage
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        formMessage.textContent = 'User session not found. Please log in again.';
        formMessage.style.color = 'red';
        form.style.display = 'none';
        return;
    }

    // Fetch current user data
    try {
        const response = await fetch(`http://localhost:5000/api/portfolio/user/${userEmail}`);
        const data = await response.json();

        if (data.success) {
            const { user } = data;
            nameInput.value = user.name;
            usernameInput.value = user.username || '';
            yearInput.value = user.portfolio.year || '';
            collegeInput.value = user.portfolio.college || '';
            genderInput.value = user.portfolio.gender || '';
            skillCategoryInput.value = user.portfolio.skillCategory || '';
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        formMessage.textContent = 'Failed to load your profile data. Please try again later.';
        formMessage.style.color = 'red';
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating...';

        const profilePicInput = document.getElementById('profilepic');
        let profilePicBase64 = '';

        try {
            if (profilePicInput.files.length > 0) {
                profilePicBase64 = await fileToBase64(profilePicInput.files[0]);
            }

            const portfolioData = {
                name: nameInput.value.trim(),
                year: yearInput.value.trim(),
                college: collegeInput.value.trim(),
                gender: genderInput.value,
                skillCategory: skillCategoryInput.value,
            };

            // Only include profile pic if a new one was uploaded
            if (profilePicBase64) {
                portfolioData.profilePic = profilePicBase64;
            }

            const response = await fetch('http://localhost:5000/api/portfolio/update-portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    portfolioData
                })
            });

            const data = await response.json();

            if (data.success) {
                formMessage.textContent = '✅ Profile updated successfully!';
                formMessage.style.color = 'lightgreen';

                // If a new profile pic was uploaded, update localStorage
                if (profilePicBase64) {
                    localStorage.setItem('userProfilePic', profilePicBase64);
                }

                setTimeout(() => {
                    window.location.href = 'main.html';
                }, 1500);
            } else {
                throw new Error(data.message);
            }

        } catch (error) {
            console.error('Profile update error:', error);
            formMessage.textContent = `❌ Update failed: ${error.message}`;
            formMessage.style.color = 'red';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Update Profile';
        }
    });
});