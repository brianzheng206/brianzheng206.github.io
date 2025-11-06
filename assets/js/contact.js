/**
 * Contact Form JavaScript
 * Handles form submission and validation
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!validateForm(data)) {
                return;
            }
            
            // Check honeypot (spam protection)
            if (data.website) {
                // Spam detected - silently fail
                showFormMessage('success', 'Thank you for your message!');
                contactForm.reset();
                return;
            }
            
            // Disable submit button
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            try {
                // Here you would typically send to a form handler service
                // For now, we'll simulate a successful submission
                
                // Example: Using Formspree or Netlify Forms
                // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(data)
                // });
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Success
                showFormMessage('success', 'Thank you for your message! I\'ll get back to you soon.');
                contactForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('error', 'Sorry, there was an error sending your message. Please try again or email me directly.');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
    
    function validateForm(data) {
        // Check required fields
        if (!data.name || !data.email || !data.subject || !data.message) {
            showFormMessage('error', 'Please fill in all required fields.');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('error', 'Please enter a valid email address.');
            return false;
        }
        
        // Check message length
        if (data.message.length < 10) {
            showFormMessage('error', 'Please write a longer message (at least 10 characters).');
            return false;
        }
        
        return true;
    }
    
    function showFormMessage(type, message) {
        if (formMessage) {
            formMessage.className = 'form-message ' + type;
            formMessage.textContent = message;
            formMessage.style.display = 'block';
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Hide message after 5 seconds for success, keep error visible
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
    
    // Real-time email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
    }
});

