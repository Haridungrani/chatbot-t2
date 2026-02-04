import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const setToken = (token: string) => {
  // Match cookie expiration with backend token expiration (30 minutes)
  const tokenExpirationMinutes = 30; // Should match ACCESS_TOKEN_EXPIRE_MINUTES
  const expirationTime = tokenExpirationMinutes / (24 * 60); // Convert to days for cookie
  
  Cookies.set(TOKEN_KEY, token, { 
    expires: expirationTime, // 30 minutes in days (0.0208 days)
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax'
  });
  
  // Also store in localStorage with manual expiration check
  if (typeof window !== 'undefined') {
    const expirationTimestamp = Date.now() + (tokenExpirationMinutes * 60 * 1000);
    const tokenData = {
      token,
      expiration: expirationTimestamp
    };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
  }
};

export const getToken = (): string | undefined => {
  // First try to get from cookie
  let token = Cookies.get(TOKEN_KEY);
  
  // If not found in cookie, try localStorage with expiration check
  if (!token && typeof window !== 'undefined') {
    const storedData = localStorage.getItem(TOKEN_KEY);
    if (storedData) {
      try {
        const tokenData = JSON.parse(storedData);
        
        // Check if token is expired
        if (Date.now() < tokenData.expiration) {
          token = tokenData.token;
          
          // Restore to cookie if still valid
          const remainingTime = (tokenData.expiration - Date.now()) / (1000 * 60 * 60 * 24); // Convert to days
          if (remainingTime > 0 && token) {
            Cookies.set(TOKEN_KEY, token, { 
              expires: remainingTime,
              secure: false,
              sameSite: 'lax'
            });
          }
        } else {
          // Token expired, remove from localStorage
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch (e) {
        // Invalid JSON, remove it
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }
  
  return token;
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
