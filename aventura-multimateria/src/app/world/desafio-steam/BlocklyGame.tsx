'use client';
import dynamic from 'next/dynamic';
import type { BlocklyGameRef } from './BlocklyGame.client';
export type { BlocklyGameRef };

const BlocklyGameClient = dynamic(
  () => import('./BlocklyGame.client'),
  { ssr: false }
);

interface BlocklyGameProps {
  onReady?: (functions: BlocklyGameRef) => void;
}

const BlocklyGame = ({ onReady }: BlocklyGameProps) => {
  return <BlocklyGameClient onReady={onReady} />;
};

export default BlocklyGame;
