export const apiFetch = async (url, method, token, type, body = null) => {
  const options = {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }

  const result = await response.json();
  return result;
};
