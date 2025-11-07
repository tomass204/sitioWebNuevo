// Theme helper functions and constants for GamingHub

export const THEME_COLORS = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryDarker: '#0D47A1',
  secondary: '#4caf50',
  secondaryDark: '#388e3c',
  accent: '#ff9800',
  accentDark: '#f57c00',
  danger: '#f44336',
  dangerDark: '#d32f2f',
  warning: '#ff5722',
  warningDark: '#d84315',
  text: '#333',
  textLight: '#666',
  background: 'transparent',
  surface: 'rgba(255, 255, 255, 0.95)',
  surfaceLight: 'rgba(255, 255, 255, 0.8)',
};

export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
  primaryHover: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)',
  secondary: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  secondaryHover: 'linear-gradient(135deg, #388e3c 0%, #43a047 100%)',
  danger: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
  dangerHover: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
  warning: 'linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)',
  warningHover: 'linear-gradient(135deg, #d84315 0%, #e64a19 100%)',
  accent: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
  accentHover: 'linear-gradient(135deg, #f57c00 0%, #fb8c00 100%)',
  header: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)',
  footer: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)',
  section: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  item: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
};

export function getGradient(type: keyof typeof GRADIENTS): string {
  return GRADIENTS[type];
}

export function getColor(type: keyof typeof THEME_COLORS): string {
  return THEME_COLORS[type];
}

export function applyTheme(element: HTMLElement, theme: { background?: string; color?: string; borderRadius?: string; boxShadow?: string }): void {
  if (theme.background) element.style.background = theme.background;
  if (theme.color) element.style.color = theme.color;
  if (theme.borderRadius) element.style.borderRadius = theme.borderRadius;
  if (theme.boxShadow) element.style.boxShadow = theme.boxShadow;
}
