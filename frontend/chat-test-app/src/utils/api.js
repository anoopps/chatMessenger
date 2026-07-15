export const apiFetch = async (
  url,
  method,
  token = null,
  type,
  body = null
) => {
  const options = {
    method,
    headers: {},
  };

  // Add token only if available
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  // Add JSON body if available
  if (body) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }
  console.log(body);
  const response = await fetch(url, options);
  console.log("URL:", url);
  console.log("Request:", options);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }

  const result = await response.json();
  return result;
};
