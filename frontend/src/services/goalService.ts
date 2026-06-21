const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/goals`;

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'An error occurred' }));
    let errorMessage = 'Failed operation';
    
    if (error.detail && Array.isArray(error.detail)) {
      errorMessage = error.detail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ');
    } else if (error.detail) {
      errorMessage = error.detail;
    }
    
    throw new Error(errorMessage);
  }
  
  if (res.status === 204) return null;
  return res.json();
};

export const getGoalsSummary = async (token: string) => {
  const res = await fetch(`${API_URL}/summary`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const getGoals = async (token: string, limit: number = 100) => {
  const res = await fetch(`${API_URL}?limit=${limit}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const createGoal = async (token: string, data: any) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

export const getGoal = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const updateGoal = async (token: string, id: string, data: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

export const deleteGoal = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};
