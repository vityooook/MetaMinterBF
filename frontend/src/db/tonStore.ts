import { TonConnectUI, THEME } from '@tonconnect/ui';
import { MANIFEST_URL } from '../config';
import create from 'zustand';

// Initialize TonConnectUI
const tonConnectUI = new TonConnectUI({
  manifestUrl: MANIFEST_URL,
  uiPreferences: {
    theme: THEME.DARK,
    borderRadius: 's',
  },
  actionsConfiguration: {
    returnStrategy: 'back',
    modals: ['before', 'success', 'error'],
    notifications: ['before', 'success', 'error'],
  },
});

// Zustand Store
interface TonConnectState {
  wallet: string | null;
  showWelcome: boolean;
  tonConnectUI: TonConnectUI;
  setWallet: (newWallet: string | null) => void;
  disconnectWallet: () => Promise<void>;
}

export const useTonConnectStore = create<TonConnectState>((set) => ({
  wallet: null,
  showWelcome: false,
  tonConnectUI: tonConnectUI,
  setWallet: (newWallet: string | null) => set(() => ({ wallet: newWallet })),
  disconnectWallet: async () => {
    await tonConnectUI.disconnect();
    set(() => ({ wallet: null }));
  },
}));
