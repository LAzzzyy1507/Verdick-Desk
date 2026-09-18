export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' = 'medium') {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'light') {
        navigator.vibrate(8);
      } else if (type === 'medium') {
        navigator.vibrate(18);
      } else if (type === 'success') {
        navigator.vibrate([12, 40, 20]);
      } else if (type === 'warning') {
        navigator.vibrate([25, 40, 25]);
      }
    }
  } catch {}

  // Trigger UI haptic visual pulse
  if (typeof document !== 'undefined') {
    const root = document.getElementById('root');
    if (root) {
      root.classList.remove('animate-haptic');
      void root.offsetWidth; // trigger reflow
      root.classList.add('animate-haptic');
      setTimeout(() => root.classList.remove('animate-haptic'), 250);
    }
  }
}
