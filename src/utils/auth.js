export const showAuthForm = (formId) => {
  // Hide any currently visible auth forms
  const authForms = document.querySelectorAll('#signIn, #signUp');
  authForms.forEach(form => {
    form.classList.add('hidden');
    form.style.display = 'none';
  });

  // Show the requested form
  const form = document.getElementById(formId);
  if (form) {
    form.classList.remove('hidden');
    form.style.display = 'block';
  }
};

export const hideAuthForm = (formId) => {
  // Show all sections (only if they were hidden due to protected route)
  if (window.location.hash.match(/#(pricing|howToUse)/)) {
    const mainSections = document.querySelectorAll('section');
    mainSections.forEach(section => {
      section.style.display = 'block';
    });
  }

  // Hide the auth form
  const form = document.getElementById(formId);
  if (form) {
    form.classList.add('hidden');
    form.style.display = 'none';
  }
};
