document.addEventListener('DOMContentLoaded', function() {
    // Get the contact form
    const contactForm = document.querySelector('.contact-form');
    
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.display = 'none';
    contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
    
    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.display = 'none';
    contactForm.parentNode.insertBefore(errorMessage, contactForm.nextSibling);
    
    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value.trim();
        const email = contactForm.querySelector('input[type="email"]').value.trim();
        const subject = contactForm.querySelector('input[placeholder="Subject"]').value.trim();
        const message = contactForm.querySelector('textarea').value.trim();
        
        // Validate form
        if (!name || !email || !message) {
            showError('Please fill in all required fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch('send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showSuccess(data.message);
                contactForm.reset();
            } else {
                showError(data.message);
            }
        } catch (error) {
            showError('An error occurred. Please try again later.');
        } finally {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
    
    // Handle Get Started button click
    const getStartedBtn = document.querySelector('.cta-button');
    getStartedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Smooth scroll to contact form
        const contactSection = document.querySelector('#contact');
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Focus on the name input
        setTimeout(() => {
            contactForm.querySelector('input[type="text"]').focus();
        }, 1000);
    });
    
    // Helper functions
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}); 