const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/mentor`;

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Failed operation');
  }
  return res.json();
};

export const chatWithMentor = async (token: string, message: string) => {
  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  return handleResponse(res);
};

export const getMentorContext = async (token: string) => {
  const res = await fetch(`${API_URL}/context`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const getProviderStatus = async (token: string) => {
  const res = await fetch(`${API_URL}/provider-status`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};
