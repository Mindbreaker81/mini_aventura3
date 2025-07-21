import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();

  const goToDashboard = () => {
    try {
      router.push('/');
    } catch (error) {
      console.error('Router navigation failed, using window.location', error);
      window.location.href = '/';
    }
  };

  const goToGame = (gamePath: string) => {
    router.push(gamePath);
  };

  return {
    goToDashboard,
    goToGame,
  };
};