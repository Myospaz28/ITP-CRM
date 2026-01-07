export default function apiAuth(req, res, next) {
  console.log('API Token Received:', req.headers['x-api-key']);

  const API_KEY = 'RAM_COMPANY_SECRET_KEY';
  const token = req.headers['x-api-key'];

  if (!token) return res.status(401).json({ message: 'API Key missing' });
  if (token !== API_KEY)
    return res.status(403).json({ message: 'Invalid API Key' });

  next();
}
