import { createFileRoute } from '@tanstack/react-router'
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useState } from 'react';
import { WifiOff, Clock, AlertTriangle, RotateCcw } from 'lucide-react';
import { NetworkStatusIndicator } from '@/shared/components/NetworkStatusIndicator';
import { getCurrentLang } from '@/shared/atoms';

interface NetworkErrorSearch {
  errorType?: 'network' | 'timeout' | 'server';
  message?: string;
  canRetry?: string;
  returnTo?: string;
}
export const Route = createFileRoute('/network-error')({
  component: NetworkErrorPage,
})

function NetworkErrorPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/network-error' }) as NetworkErrorSearch;
  const [isRetrying, setIsRetrying] = useState(false);
  
  const errorType = search.errorType || 'network';
  const canRetry = search.canRetry === 'true';
  const returnTo = search.returnTo || '/';

  const getErrorIcon = () => {
    switch (errorType) {
      case 'timeout':
        return <Clock className="w-16 h-16 text-yellow-500" />;
      case 'server':
        return <AlertTriangle className="w-16 h-16 text-red-500" />;
      default:
        return <WifiOff className="w-16 h-16 text-red-500" />;
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'timeout':
        return 'Délai d\'attente dépassé';
      case 'server':
        return 'Erreur serveur';
      default:
        return 'Problème de connexion';
    }
  };

  const getErrorMessage = () => {
    return search.message || 'Une erreur est survenue lors de la connexion.';
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      // Tenter de refaire la requête d'authentification
      const response = await fetch('/api/auth/info', {
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // Si la requête réussit, retourner à la page précédente
        navigate({ to: returnTo });
      } else {
        // Si échec, attendre un peu avant de permettre un nouveau retry
        setTimeout(() => setIsRetrying(false), 2000);
      }
    } catch (error) {
      console.error('Retry failed:', error);
      setTimeout(() => setIsRetrying(false), 2000);
    }
  };

  const handleGoHome = () => {
    navigate({ to: '/$lang', params: { lang: getCurrentLang() } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {getErrorIcon()}
            
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {getErrorTitle()}
            </h2>
            
            <p className="mt-2 text-sm text-gray-600">
              {getErrorMessage()}
            </p>

            {errorType === 'network' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  Vérifiez votre connexion internet et réessayez.
                </p>
              </div>
            )}

            {errorType === 'timeout' && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-800">
                  La connexion est lente. Veuillez réessayer.
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {canRetry && (
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRetrying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Nouvelle tentative...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Réessayer
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={handleGoHome}
                className="w-full flex justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de statut réseau */}
      <div className="fixed bottom-4 right-4">
        <NetworkStatusIndicator />
      </div>
    </div>
  );
}

