import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();

  const goToDashboard = () => {
    router.push('/');
  };

  const goToGame = (gamePath: string) => {
    router.push(gamePath);
  };

  return {
    goToDashboard,
    goToGame,
  };
};