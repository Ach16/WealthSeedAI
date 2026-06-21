const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/portfolio`;

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

export const getPortfolio = async (token: string) => {
  const res = await fetch(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const getPortfolioSummary = async (token: string) => {
  const res = await fetch(`${API_URL}/summary`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const getHoldings = async (token: string) => {
  const res = await fetch(`${API_URL}/holdings`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const getTransactions = async (token: string) => {
  const res = await fetch(`${API_URL}/transactions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const buyAsset = async (token: string, data: any) => {
  const res = await fetch(`${API_URL}/buy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

export const sellAsset = async (token: string, data: any) => {
  const res = await fetch(`${API_URL}/sell`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

export const getPortfolioHealth = async (token: string) => {
  const res = await fetch(`${API_URL}/health`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(res);
};

export const simulateTransaction = async (token: string, data: any) => {
  const res = await fetch(`${API_URL}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};

export const updateBalance = async (token: string, data: { new_balance: number }) => {
  const res = await fetch(`${API_URL}/balance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
};
