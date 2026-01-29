import jwt from 'jsonwebtoken';

/**
 * Global Server-side Middleware for API protection
 * Intercepts all requests to /api/ except for authentication routes
 */
export default defineEventHandler((event) => {
  const { path } = event;

  // Bypass protection for authentication endpoints (Login, Signup, etc.)
  if (path.startsWith('/api/auth/')) {
    return;
  }

  // Only apply protection to API routes
  if (!path.startsWith('/api/')) {
    return;
  }

  const config = useRuntimeConfig(event);
  const token = getCookie(event, 'auth_token');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Authentication required'
    });
  }

  try {
    /**
     * Token verification and context population
     * Decoded payload is attached to event.context for downstream use
     */
    const decoded = jwt.verify(token, config.jwtAccessSecret) as { userId: string };
    event.context.auth = { userId: decoded.userId };
  } catch (err) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid or expired token'
    });
  }
});