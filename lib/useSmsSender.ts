import { useState, useCallback } from 'react';

interface SmsSenderProps {
  to: string;
  from?: string;
  message: string;
}

const useSmsSender = ({ to, from = 'CONNECT', message }: SmsSenderProps): [boolean, Error | null, () => Promise<void>] => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendSMS = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/sendSms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, from, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Send SMS Response:', data);
    } catch (err) {
      console.error('Error sending SMS:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [to, from, message]);

  return [isLoading, error, sendSMS];
};

export default useSmsSender;
