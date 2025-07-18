'use client';
import dynamic from 'next/dynamic';

const BlocklyGameClient = dynamic(
  () => import('./BlocklyGame.client'),
  { ssr: false }
);

const BlocklyGame = () => {
  return <BlocklyGameClient />;
};

export default BlocklyGame;
