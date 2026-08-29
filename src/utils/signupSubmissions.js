const SIGNUP_SUBMISSIONS_KEY = 'insureco-signup-submissions';

export function getSignUpSubmissions() {
  try {
    const submissions = JSON.parse(localStorage.getItem(SIGNUP_SUBMISSIONS_KEY) || '[]');
    return Array.isArray(submissions) ? submissions : [];
  } catch {
    return [];
  }
}

export function saveSignUpSubmission(formData) {
  const submission = {
    id: `signup-${Date.now()}`,
    ...formData,
    submittedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    SIGNUP_SUBMISSIONS_KEY,
    JSON.stringify([submission, ...getSignUpSubmissions()]),
  );

  return submission;
}
