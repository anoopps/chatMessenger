export const apiFetch = async (url, method, token, type) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }

  const result = await response.json();
  return result;
};
