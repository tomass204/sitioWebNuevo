// Button component for GamingHub theme

import { getGradient, getColor, applyTheme } from './helper';

export class Boton {
  private element: HTMLButtonElement;
  private type: 'primary' | 'secondary' | 'danger' | 'warning' | 'accent';

  constructor(text: string, type: 'primary' | 'secondary' | 'danger' | 'warning' | 'accent' = 'primary', onClick?: () => void) {
    this.type = type;
    this.element = document.createElement('button');
    this.element.textContent = text;
    this.element.style.padding = '12px 20px';
    this.element.style.border = 'none';
    this.element.style.cursor = 'pointer';
    this.element.style.borderRadius = '25px';
    this.element.style.fontSize = '1em';
    this.element.style.fontWeight = 'bold';
    this.element.style.transition = 'background 0.3s ease, transform 0.2s ease';
    this.element.style.background = getGradient(type);
    this.element.style.color = 'white';

    this.element.addEventListener('mouseover', () => {
      this.element.style.background = getGradient(`${type}Hover` as keyof typeof getGradient);
      this.element.style.transform = 'scale(1.05)';
    });

    this.element.addEventListener('mouseout', () => {
      this.element.style.background = getGradient(type);
      this.element.style.transform = 'scale(1)';
    });

    if (onClick) {
      this.element.addEventListener('click', onClick);
    }
  }

  getElement(): HTMLButtonElement {
    return this.element;
  }

  setText(text: string): void {
    this.element.textContent = text;
  }

  setType(type: 'primary' | 'secondary' | 'danger' | 'warning' | 'accent'): void {
    this.type = type;
    this.element.style.background = getGradient(type);
  }

  appendTo(parent: HTMLElement): void {
    parent.appendChild(this.element);
  }
}
