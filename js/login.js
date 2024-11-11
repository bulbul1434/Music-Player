document.addEventListener('DOMContentLoaded', (event) => {
    if (sessionStorage.getItem('formSubmitted') === 'true') {
      window.location.href = 'index.html'; // Redirect to index.html if form was submitted
    }
  });

  function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission
    const form = event.target;
    const formData = new FormData(form);

    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        sessionStorage.setItem('formSubmitted', 'true'); // Set the form as submitted in session storage
        window.location.href = 'index.html'; // Redirect to index.html after successful submission
      } else {
        alert('There was an error submitting your form.');
      }
    }).catch(error => {
      console.error('Error:', error);
      alert('There was an error submitting your form.');
    });
  }
