// Votre code modifié
import { redirect } from '@tanstack/react-router';
import { authCache } from './caching';

async function fetchAuthInfo(controller: AbortController) {
  // Vérifier le cache d'abord
  const cached = authCache.get();
  if (cached) {
    console.log('Using cached auth info');
    console.log(cached);
    return cached;
  }

  console.log('Fetching fresh auth info');
  const response = await fetch('/api/auth/info', {
    credentials: 'include',
    signal: controller.signal,
  }).catch(() => {
    console.log('Timeout or network error');
    throw redirect({
      to: '/network-error',
      search: {
        errorType: 'network',
        canRetry: 'true',
        returnTo: '/$lang/sign-in',
      },
    });
  });



  const data = await response.json();
  
  // Stocker dans le cache
  authCache.set(data);
  
  return data;
}

export default fetchAuthInfo;
