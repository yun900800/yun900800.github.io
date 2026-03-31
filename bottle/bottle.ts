interface BottleOptions {
    color?: 'blue' | 'pink' | 'yellow' | 'green';
    waterOnly?: boolean;
    size?: 'small' | 'medium' | 'large';
    customColors?: CustomColors;
    showClover?: boolean;
    showJellyfish?: boolean;
    showBubbles?: boolean;
}

interface CustomColors {
    primary: string;
    secondary: string;
    tertiary: string;
    glow: string;
}

interface SizeConfig {
    width: number;
    scale: number;
}

class Bottle {
    private container: HTMLElement;
    private options: Required<BottleOptions>;
    private element: HTMLElement | null = null;
    private sizes: Record<string, SizeConfig> = {
        small: { width: 180, scale: 0.75 },
        medium: { width: 240, scale: 1 },
        large: { width: 300, scale: 1.25 }
    };

    constructor(container: HTMLElement, options: BottleOptions = {}) {
        this.container = container;
        this.options = this._mergeOptions(options);
    }

    private _mergeOptions(options: BottleOptions): Required<BottleOptions> {
        return {
            color: options.color || 'blue',
            waterOnly: options.waterOnly || false,
            size: options.size || 'medium',
            customColors: options.customColors || null!,
            showClover: options.showClover ?? true,
            showJellyfish: options.showJellyfish ?? true,
            showBubbles: options.showBubbles ?? true
        };
    }

    render(): this {
        const bottle = document.createElement('div');
        bottle.className = this._getBottleClass();
        
        const sizeConfig = this.sizes[this.options.size];
        bottle.style.width = `${sizeConfig.width}px`;
        bottle.style.transform = `scale(${sizeConfig.scale})`;
        bottle.style.transformOrigin = 'top center';
        bottle.style.margin = '90px 0px';

        if (this.options.customColors) {
            this._applyCustomColors(bottle);
        }

        bottle.innerHTML = this._createBottleHTML();
        this.container.appendChild(bottle);
        this.element = bottle;
        
        return this;
    }

    private _applyCustomColors(bottle: HTMLElement): void {
        const { primary, secondary, tertiary, glow } = this.options.customColors;
        bottle.style.setProperty('--water-primary', primary);
        bottle.style.setProperty('--water-secondary', secondary);
        bottle.style.setProperty('--water-tertiary', tertiary);
        bottle.style.setProperty('--water-glow', glow);
    }

    private _getBottleClass(): string {
        const classes = ['bottle'];
        
        if (this.options.customColors) {
            return classes.join(' ');
        }
        
        if (this.options.color === 'pink') classes.push('bottle-pink');
        else if (this.options.color === 'yellow') classes.push('bottle-yellow');
        else if (this.options.color === 'green') classes.push('bottle-green');
        
        if (this.options.waterOnly && this.options.color === 'pink') classes.push('bottle-water-pink');
        else if (this.options.waterOnly && this.options.color === 'yellow') classes.push('bottle-water-yellow');
        else if (this.options.waterOnly && this.options.color === 'green') classes.push('bottle-water-green');
        
        return classes.join(' ');
    }

    private _createBottleHTML(): string {
        return `
            <div class="bottle-top">
                <div class="bottle-mouth"></div>
                <div class="highlight"></div>
            </div>
            <div class="bottle-neck">
                <div class="highlight"></div>
            </div>
            <div class="bottle-main">
                <div class="bottle-inner">
                    <div class="water">
                        ${this._createCloverHTML()}
                        ${this._createJellyfishHTML()}
                        ${this._createBubblesHTML()}
                    </div>
                </div>
                <div class="highlight"></div>
            </div>
        `;
    }

    private _createCloverHTML(): string {
        if (!this.options.showClover) return '';
        return `
            <div class="cloverTop">
                <div class="clover">
                    <div class="leaves">
                        <i class="leave angleN"></i>
                        <i class="leave angleS"></i>
                        <i class="leave angleW"></i>
                        <i class="leave angleE"></i>
                    </div>
                    <i class="branch"></i>
                </div>
            </div>
            <div class="cloverBottom">
                <div class="clover">
                    <div class="leaves">
                        <i class="leave angleN"></i>
                        <i class="leave angleS"></i>
                        <i class="leave angleW"></i>
                        <i class="leave angleE"></i>
                    </div>
                    <i class="branch"></i>
                </div>
            </div>
        `;
    }

    private _createJellyfishHTML(): string {
        if (!this.options.showJellyfish) return '';
        return `
            <div class="jellyfish">
                <div class="jellyfish_head"></div>
                <div class="jellyfish_tail">
                    <div class="jellyfish_tail_in"></div>
                </div>
            </div>
        `;
    }

    private _createBubblesHTML(): string {
        if (!this.options.showBubbles) return '';
        return `
            <div class="bubble bubble1"></div>
            <div class="bubble bubble2"></div>
            <div class="bubble bubble3"></div>
        `;
    }

    getElement(): HTMLElement | null {
        return this.element;
    }

    setColor(color: 'blue' | 'pink' | 'yellow' | 'green'): this {
        this.options.color = color;
        this._updateClass();
        return this;
    }

    setSize(size: 'small' | 'medium' | 'large'): this {
        this.options.size = size;
        if (this.element) {
            const sizeConfig = this.sizes[size];
            this.element.style.width = `${sizeConfig.width}px`;
            this.element.style.transform = `scale(${sizeConfig.scale})`;
        }
        return this;
    }

    setCustomColors(colors: CustomColors): this {
        this.options.customColors = colors;
        if (this.element) {
            this._applyCustomColors(this.element);
        }
        return this;
    }

    setVisible(visible: boolean): this {
        if (this.element) {
            this.element.style.display = visible ? 'block' : 'none';
        }
        return this;
    }

    private _updateClass(): void {
        if (this.element) {
            this.element.className = this._getBottleClass();
        }
    }

    destroy(): void {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            this.element = null;
        }
    }
}

class BottleCollection {
    private container: HTMLElement;
    private bottles: Bottle[] = [];

    constructor(containerSelector: string) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error(`Container "${containerSelector}" not found`);
        }
        this.container = container as HTMLElement;
    }

    add(options: BottleOptions = {}): this {
        const bottle = new Bottle(this.container, options);
        bottle.render();
        this.bottles.push(bottle);
        return this;
    }

    addMultiple(count: number, options: BottleOptions = {}): this {
        for (let i = 0; i < count; i++) {
            this.add(options);
        }
        return this;
    }

    addColorSet(): this {
        this.add({ color: 'blue' })
            .add({ color: 'pink' })
            .add({ color: 'yellow' })
            .add({ color: 'green' });
        return this;
    }

    addWaterOnlySet(): this {
        this.add({ color: 'blue', waterOnly: false })
            .add({ color: 'pink', waterOnly: true })
            .add({ color: 'yellow', waterOnly: true })
            .add({ color: 'green', waterOnly: true });
        return this;
    }

    addCustomSet(colorsArray: CustomColors[]): this {
        colorsArray.forEach(colors => {
            this.add({ customColors: colors });
        });
        return this;
    }

    getBottles(): Bottle[] {
        return this.bottles;
    }

    clear(): this {
        this.bottles.forEach(bottle => bottle.destroy());
        this.bottles = [];
        return this;
    }

    forEach(callback: (bottle: Bottle, index: number) => void): this {
        this.bottles.forEach(callback);
        return this;
    }
}

const PRESET_COLORS: Record<string, CustomColors> = {
    purple: {
        primary: 'rgba(138, 43, 226, 0.35)',
        secondary: 'rgba(123, 31, 162, 0.55)',
        tertiary: 'rgba(123, 31, 162, 0.4)',
        glow: 'rgba(138, 43, 226, 0.5)'
    },
    coral: {
        primary: 'rgba(255, 99, 71, 0.35)',
        secondary: 'rgba(220, 20, 60, 0.55)',
        tertiary: 'rgba(220, 20, 60, 0.4)',
        glow: 'rgba(255, 99, 71, 0.5)'
    },
    teal: {
        primary: 'rgba(0, 128, 128, 0.35)',
        secondary: 'rgba(0, 100, 100, 0.55)',
        tertiary: 'rgba(0, 100, 100, 0.4)',
        glow: 'rgba(0, 128, 128, 0.5)'
    }
};

export { Bottle, BottleCollection, BottleOptions, CustomColors, PRESET_COLORS };
