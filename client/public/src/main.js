document.addEventListener('DOMContentLoaded', () => {

    // Get the elements
    const resumeBtn = document.getElementById('resumeBtn');
    const paymentModal = document.getElementById('paymentModal');
    const closeModalBtn = document.getElementById('closeModal');
    const payBtn = paymentModal.querySelector('.pay-btn');

    // Function to show the modal
    const showModal = () => {
        paymentModal.classList.add('modal-active');
    };

    // Function to hide the modal
    const hideModal = () => {
        paymentModal.classList.remove('modal-active');
    };

    // Event Listeners
    resumeBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);

    // Close modal if user clicks on the overlay (the dark background)
    paymentModal.addEventListener('click', (event) => {
        if (event.target === paymentModal) {
            hideModal();
        }
    });

    // Simulate payment process on button click
    payBtn.addEventListener('click', () => {
        alert('Redirecting to payment gateway... (This is a simulation)');
        hideModal();
    });

});