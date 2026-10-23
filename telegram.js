// Telegram WebApp SDK Helper Utilities
export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const triggerHaptic = (type = 'medium') => {
  const tg = getTelegramWebApp();
  if (!tg || !tg.HapticFeedback) return;
  try {
    if (type === 'success' || type === 'warning' || type === 'error') {
      tg.HapticFeedback.notificationOccurred(type);
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  } catch (e) {
    // Graceful fallback
  }
};

export const openTelegramLink = (url) => {
  const tg = getTelegramWebApp();
  if (tg && tg.openTelegramLink && url.includes('t.me')) {
    tg.openTelegramLink(url);
  } else if (tg && tg.openLink) {
    tg.openLink(url);
  } else {
    window.open(url, '_blank');
  }
};