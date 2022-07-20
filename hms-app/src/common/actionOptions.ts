export const buildFetchOptions = (
  method: string,
  token: string,
  body?: any
) => {
  const options: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  if (body) options.body = JSON.stringify(body)
  return options
}
