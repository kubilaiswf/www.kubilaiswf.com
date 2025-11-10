document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formStatus = document.querySelector('.form-status');
            const submitBtn = contactForm.querySelector('.submit-btn');
            const formData = new FormData(contactForm);

            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';

            const mailtoLink = `mailto:kubilay.karacar@hotmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`)}`;
            window.location.href = mailtoLink;

            setTimeout(() => {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message prepared! Your email client should open shortly.';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                contactForm.reset();

                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }, 500);
        });
    }
});
