const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/risk`;

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

export const submitAssessment = async (token: string, data: any) => {
  const res = await fetch(`${API_URL}/assessment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

export const getAssessment = async (token: string) => {
  const res = await fetch(`${API_URL}/assessment`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const getRiskProfile = async (token: string) => {
  const res = await fetch(`${API_URL}/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};
