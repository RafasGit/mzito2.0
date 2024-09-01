import { useState, useCallback } from 'react';

interface SmsSenderProps {
  endpoint: string;
  apiKey: string;
  to: string;
  from?: string;
  message: string;
}

const useSmsSender = ({
  endpoint,
  apiKey,
  to,
  from = 'CONNECT',
  message,
}: SmsSenderProps): [boolean, Error | null, () => Promise<void>] => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendSMS = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const request = {
        to,
        from,
        message,
      };

      const requestBody = JSON.stringify(request);

      const response = await fetch(`https://cors-anywhere.herokuapp.com/${endpoint}`, {
        method: 'POST',
        body: requestBody,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data); // Log the response data
    } catch (err) {
      console.error('Error sending SMS:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, apiKey, to, from, message]);

  return [isLoading, error, sendSMS];
};

export default useSmsSender;
