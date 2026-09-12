import { MdInfoOutline } from 'react-icons/md';
import { isDemoMode } from '../utils/demo';

export default function DemoBanner() {
  if (!isDemoMode) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[200] flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-orange-500 text-white shadow-soft-lg border border-white/25 text-sm font-bold">
      <MdInfoOutline className="text-lg" />
      <span>Demo Mode — Akses Penuh</span>
    </div>
  );
}