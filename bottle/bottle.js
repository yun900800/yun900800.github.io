class Bottle {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            color: options.color || 'blue',
            waterOnly: options.waterOnly || false,
            size: options.size || 'medium',
            customColors: options.customColors || null,
            showClover: options.showClover ?? true,
            cloverType: options.cloverType || 'four',
            cloverColor: options.cloverColor || '#2cb62c',
            cloverCount: options.cloverCount ?? 1,
            showJellyfish: options.showJellyfish ?? true,
            jellyfishColor: options.jellyfishColor || 'white',
            jellyfishCount: options.jellyfishCount ?? 1,
            showBubbles: options.showBubbles ?? true,
            ...options
        };
        this.element = null;
        this.sizes = {
            small: { width: 180, scale: 0.75 },
            medium: { width: 240, scale: 1 },
            large: { width: 300, scale: 1.25 }
        };
    }

    render() {
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

        if (this.options.cloverColor && this.options.cloverColor !== '#2cb62c') {
            bottle.style.setProperty('--clover-color', this.options.cloverColor);
            const branchColor = this._adjustColor(this.options.cloverColor, -30);
            bottle.style.setProperty('--clover-branch-color', branchColor);
        }

        if (this.options.jellyfishColor && this.options.jellyfishColor !== 'white') {
            bottle.style.setProperty('--jellyfish-color', this._hexToRgba(this.options.jellyfishColor, 0.15));
            bottle.style.setProperty('--jellyfish-border', this._hexToRgba(this.options.jellyfishColor, 0.5));
        }

        bottle.innerHTML = this._createBottleHTML();
        this.container.appendChild(bottle);
        this.element = bottle;
        
        return this;
    }

    _applyCustomColors(bottle) {
        const { primary, secondary, tertiary, glow } = this.options.customColors;
        bottle.style.setProperty('--water-primary', primary);
        bottle.style.setProperty('--water-secondary', secondary);
        bottle.style.setProperty('--water-tertiary', tertiary);
        bottle.style.setProperty('--water-glow', glow);
    }

    _getBottleClass() {
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

    _createBottleHTML() {
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

    _createCloverHTML() {
        if (!this.options.showClover) return '';
        
        const type = this.options.cloverType;
        const count = this.options.cloverCount || 1;
        const clovers = [];
        
        for (let i = 0; i < count; i++) {
            const offsetX = i * 35;
            
            if (type === 'three') {
                clovers.push(`
                    <div class="clover-wrapper" style="left: ${offsetX}px;">
                        <div class="clover cloverThree">
                            <div class="leaves">
                                <i class="leave angleN"></i>
                                <i class="leave angleS"></i>
                                <i class="leave angleE"></i>
                            </div>
                            <i class="branch"></i>
                        </div>
                    </div>
                `);
            } else {
                clovers.push(`
                    <div class="clover-wrapper" style="left: ${offsetX}px;">
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
                `);
            }
        }
        
        return `
            <div class="cloverBottom">${clovers.join('')}</div>
        `;
    }

    _createJellyfishHTML() {
        if (!this.options.showJellyfish) return '';
        
        const count = this.options.jellyfishCount || 1;
        const jellyfishs = [];
        
        for (let i = 0; i < count; i++) {
            const offsetX = i * 50;
            jellyfishs.push(`
                <div class="jellyfish-wrapper" style="left: ${offsetX}px;">
                    <div class="jellyfish">
                        <div class="jellyfish_head"></div>
                        <div class="jellyfish_tail">
                            <div class="jellyfish_tail_in"></div>
                        </div>
                    </div>
                </div>
            `);
        }
        
        return `
            <div class="jellyfish-container">${jellyfishs.join('')}</div>
        `;
    }

    _createBubblesHTML() {
        if (!this.options.showBubbles) return '';
        return `
            <div class="bubble bubble1"></div>
            <div class="bubble bubble2"></div>
            <div class="bubble bubble3"></div>
        `;
    }

    getElement() {
        return this.element;
    }

    setColor(color) {
        this.options.color = color;
        this._updateClass();
        return this;
    }

    setSize(size) {
        this.options.size = size;
        if (this.element) {
            const sizeConfig = this.sizes[size];
            this.element.style.width = `${sizeConfig.width}px`;
            this.element.style.transform = `scale(${sizeConfig.scale})`;
        }
        return this;
    }

    setCustomColors(colors) {
        this.options.customColors = colors;
        if (this.element) {
            const water = this.element.querySelector('.water');
            if (water) {
                water.style.setProperty('--water-primary', colors.primary);
                water.style.setProperty('--water-secondary', colors.secondary);
                water.style.setProperty('--water-tertiary', colors.tertiary);
                water.style.setProperty('--water-glow', colors.glow);
            }
        }
        return this;
    }

    setVisible(visible) {
        if (this.element) {
            this.element.style.display = visible ? 'block' : 'none';
        }
        return this;
    }

    setWaterLevel(level) {
        if (this.element) {
            const water = this.element.querySelector('.water');
            if (water) {
                water.style.height = `${level}px`;
            }
        }
        return this;
    }

    setAnimationDuration(duration) {
        if (this.element) {
            this.element.style.setProperty('--animation-duration', duration);
        }
        return this;
    }

    play() {
        if (this.element) {
            this.element.style.animationPlayState = 'running';
        }
        return this;
    }

    pause() {
        if (this.element) {
            this.element.style.animationPlayState = 'paused';
        }
        return this;
    }

    _updateClass() {
        if (this.element) {
            this.element.className = this._getBottleClass();
        }
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            this.element = null;
        }
    }

    floatClover(duration = 3) {
        if (this.element) {
            const water = this.element.querySelector('.water');
            if (water) {
                water.classList.add('clover-float');
                water.style.setProperty('--clover-float-duration', `${duration}s`);
            }
        }
        return this;
    }

    resetClover() {
        if (this.element) {
            const water = this.element.querySelector('.water');
            if (water) {
                water.classList.remove('clover-float');
            }
        }
        return this;
    }

    addClover() {
        this.options.cloverCount++;
        this._updateClover(true);
        return this;
    }

    removeClover() {
        if (this.element && this.options.cloverCount > 0) {
            const water = this.element.querySelector('.water');
            if (water) {
                const wrapperBottoms = water.querySelectorAll('.cloverBottom .clover-wrapper');
                
                if (wrapperBottoms.length > 0) {
                    const lastBottom = wrapperBottoms[wrapperBottoms.length - 1];
                    
                    lastBottom.style.transition = 'none';
                    lastBottom.style.transform = 'translateY(0)';
                    lastBottom.style.opacity = '1';
                    
                    this.options.cloverCount--;
                    
                    void lastBottom.offsetWidth;
                    
                    lastBottom.style.transition = 'transform 1s ease-in, opacity 1s ease-in';
                    lastBottom.style.transform = 'translateY(80px)';
                    lastBottom.style.opacity = '0';
                    
                    setTimeout(() => {
                        this._updateClover();
                    }, 1000);
                }
            }
        }
        return this;
    }

    addJellyfish() {
        this.options.jellyfishCount++;
        this._updateJellyfish(true);
        return this;
    }

    removeJellyfish() {
        if (this.element && this.options.jellyfishCount > 0) {
            const water = this.element.querySelector('.water');
            if (water) {
                const wrappers = water.querySelectorAll('.jellyfish-wrapper');
                
                if (wrappers.length > 0) {
                    const last = wrappers[wrappers.length - 1];
                    
                    last.style.transition = 'none';
                    last.style.transform = 'translateY(0)';
                    last.style.opacity = '1';
                    
                    this.options.jellyfishCount--;
                    
                    void last.offsetWidth;
                    
                    last.style.transition = 'transform 1s ease-in, opacity 1s ease-in';
                    last.style.transform = 'translateY(50px)';
                    last.style.opacity = '0';
                    
                    setTimeout(() => {
                        this._updateJellyfish();
                    }, 1000);
                }
            }
        }
        return this;
    }

    _updateJellyfish(addAnimation = false) {
        if (this.element) {
            const water = this.element.querySelector('.water');
            if (water) {
                const count = this.options.jellyfishCount || 1;
                const jellyfishs = [];
                
                for (let i = 0; i < count; i++) {
                    const offsetX = i * 50;
                    let style = `left: ${offsetX}px;`;
                    
                    if (addAnimation && i === count - 1) {
                        style += ` animation: newJellyfishFloat 2s ease-out forwards;`;
                    }
                    
                    jellyfishs.push(`
                        <div class="jellyfish-wrapper" style="${style}">
                            <div class="jellyfish">
                                <div class="jellyfish_head"></div>
                                <div class="jellyfish_tail">
                                    <div class="jellyfish_tail_in"></div>
                                </div>
                            </div>
                        </div>
                    `);
                }
                
                const container = water.querySelector('.jellyfish-container');
                if (container) container.innerHTML = jellyfishs.join('');
            }
        }
    }

    _adjustColor(hex, amount) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
    }

    _hexToRgba(hex, alpha) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = num >> 16;
        const g = (num >> 8) & 0x00FF;
        const b = num & 0x0000FF;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

class BottleCollection {
    constructor(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error(`Container "${containerSelector}" not found`);
        }
        this.container = container;
        this.bottles = [];
    }

    add(options = {}) {
        const bottle = new Bottle(this.container, options);
        bottle.render();
        this.bottles.push(bottle);
        return this;
    }

    addMultiple(count, options = {}) {
        for (let i = 0; i < count; i++) {
            this.add(options);
        }
        return this;
    }

    addColorSet() {
        this.add({ color: 'blue' })
            .add({ color: 'pink' })
            .add({ color: 'yellow' })
            .add({ color: 'green' });
        return this;
    }

    addWaterOnlySet() {
        this.add({ color: 'blue', waterOnly: false })
            .add({ color: 'pink', waterOnly: true })
            .add({ color: 'yellow', waterOnly: true })
            .add({ color: 'green', waterOnly: true });
        return this;
    }

    addCustomSet(colorsArray) {
        colorsArray.forEach(colors => {
            this.add({ customColors: colors });
        });
        return this;
    }

    getBottles() {
        return this.bottles;
    }

    clear() {
        this.bottles.forEach(bottle => bottle.destroy());
        this.bottles = [];
        return this;
    }

    forEach(callback) {
        this.bottles.forEach(callback);
        return this;
    }

    play() {
        this.bottles.forEach(bottle => bottle.play());
        return this;
    }

    pause() {
        this.bottles.forEach(bottle => bottle.pause());
        return this;
    }
}

const PRESET_COLORS = {
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Bottle, BottleCollection, PRESET_COLORS };
}
