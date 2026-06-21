const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/learning`;

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Failed operation');
  }
  return res.json();
};

export const getModules = async (token: string) => {
  const res = await fetch(`${API_URL}/modules`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const getModule = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/modules/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const completeModule = async (token: string, id: string, timeSpentMinutes: number) => {
  const res = await fetch(`${API_URL}/modules/${id}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ time_spent_minutes: timeSpentMinutes })
  });
  return handleResponse(res);
};

export const submitQuiz = async (token: string, id: string, answers: Record<string, string>, timeSpentMinutes: number) => {
  const res = await fetch(`${API_URL}/quizzes/${id}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ answers, time_spent_minutes: timeSpentMinutes })
  });
  return handleResponse(res);
};

export const getProgress = async (token: string) => {
  const res = await fetch(`${API_URL}/progress`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const getLiteracyScore = async (token: string) => {
  const res = await fetch(`${API_URL}/literacy-score`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const getRecommendation = async (token: string) => {
  const res = await fetch(`${API_URL}/recommendation`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};
