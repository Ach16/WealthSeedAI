const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/profile`;

export const getProfile = async (token: string) => {
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to fetch profile');
  }

  return res.json();
};

export const updateProfile = async (token: string, data: any) => {
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const error = await res.json();
    let errorMessage = 'Failed to update profile';

    // Check if FastAPI validation error array
    if (error.detail && Array.isArray(error.detail)) {
      errorMessage = error.detail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ');
    } else if (error.detail) {
      errorMessage = error.detail;
    }

    throw new Error(errorMessage);
  }

  return res.json();
};
