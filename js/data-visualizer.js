/**
 * HomeScorePro Data Visualization Components
 * Interactive charts and visual score displays
 */

class DataVisualizer {
    constructor() {
        this.charts = new Map();
        this.animations = {
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        };
    }

    /**
     * Create animated circular score display
     */
    createScoreCircle(containerId, score, label, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const config = {
            size: options.size || 200,
            strokeWidth: options.strokeWidth || 15,
            primaryColor: options.primaryColor || this.getScoreColor(score),
            backgroundColor: options.backgroundColor || '#f0f0f0',
            showPercentage: options.showPercentage !== false,
            animated: options.animated !== false
        };

        const radius = (config.size - config.strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (score / 10) * circumference;

        const svg = `
            <div class="score-circle-container" style="position: relative; width: ${config.size}px; height: ${config.size}px;">
                <svg width="${config.size}" height="${config.size}" class="score-circle">
                    <defs>
                        <linearGradient id="scoreGradient-${containerId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:${config.primaryColor};stop-opacity:1" />
                            <stop offset="100%" style="stop-color:${this.lightenColor(config.primaryColor, 20)};stop-opacity:1" />
                        </linearGradient>
                        <filter id="scoreShadow-${containerId}">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
                        </filter>
                    </defs>
                    
                    <!-- Background circle -->
                    <circle
                        cx="${config.size / 2}"
                        cy="${config.size / 2}"
                        r="${radius}"
                        stroke="${config.backgroundColor}"
                        stroke-width="${config.strokeWidth}"
                        fill="none"
                    />
                    
                    <!-- Score circle -->
                    <circle
                        class="score-progress"
                        cx="${config.size / 2}"
                        cy="${config.size / 2}"
                        r="${radius}"
                        stroke="url(#scoreGradient-${containerId})"
                        stroke-width="${config.strokeWidth}"
                        fill="none"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${config.animated ? circumference : offset}"
                        stroke-linecap="round"
                        transform="rotate(-90 ${config.size / 2} ${config.size / 2})"
                        filter="url(#scoreShadow-${containerId})"
                    />
                </svg>
                
                <div class="score-text" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    font-family: 'Inter', -apple-system, sans-serif;
                ">
                    <div class="score-value" style="
                        font-size: ${config.size / 4}px;
                        font-weight: 700;
                        color: ${config.primaryColor};
                        line-height: 1;
                        opacity: ${config.animated ? 0 : 1};
                    ">${score.toFixed(1)}</div>
                    <div class="score-label" style="
                        font-size: ${config.size / 12}px;
                        color: #666;
                        margin-top: 5px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    ">${label}</div>
                </div>
            </div>
        `;

        container.innerHTML = svg;

        // Animate if enabled
        if (config.animated) {
            setTimeout(() => {
                const circle = container.querySelector('.score-progress');
                const text = container.querySelector('.score-value');
                
                circle.style.transition = `stroke-dashoffset ${this.animations.duration}ms ${this.animations.easing}`;
                circle.style.strokeDashoffset = offset;
                
                text.style.transition = `opacity 500ms ease-in`;
                text.style.opacity = 1;
                
                // Animate number
                this.animateNumber(text, 0, score, this.animations.duration);
            }, 100);
        }
    }

    /**
     * Create comparison radar chart
     */
    createRadarChart(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const config = {
            size: options.size || 400,
            levels: options.levels || 5,
            maxValue: options.maxValue || 10,
            showLegend: options.showLegend !== false,
            animated: options.animated !== false
        };

        const categories = Object.keys(data);
        const angleStep = (2 * Math.PI) / categories.length;
        const center = config.size / 2;
        const radius = (config.size - 60) / 2;

        // Calculate points
        const points = categories.map((cat, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const value = data[cat];
            const r = (value / config.maxValue) * radius;
            return {
                x: center + r * Math.cos(angle),
                y: center + r * Math.sin(angle),
                label: cat,
                value: value
            };
        });

        // Create SVG
        let svg = `
            <svg width="${config.size}" height="${config.size}" class="radar-chart">
                <defs>
                    <linearGradient id="radarGradient-${containerId}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:0.3" />
                    </linearGradient>
                </defs>
        `;

        // Draw grid levels
        for (let level = 1; level <= config.levels; level++) {
            const levelRadius = (radius / config.levels) * level;
            const levelPoints = categories.map((_, i) => {
                const angle = angleStep * i - Math.PI / 2;
                return {
                    x: center + levelRadius * Math.cos(angle),
                    y: center + levelRadius * Math.sin(angle)
                };
            });

            const pathData = levelPoints.map((p, i) => 
                `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`
            ).join(' ') + ' Z';

            svg += `
                <path
                    d="${pathData}"
                    fill="none"
                    stroke="#e0e0e0"
                    stroke-width="1"
                    opacity="0.3"
                />
            `;
        }

        // Draw axes
        categories.forEach((_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const x2 = center + radius * Math.cos(angle);
            const y2 = center + radius * Math.sin(angle);
            
            svg += `
                <line
                    x1="${center}"
                    y1="${center}"
                    x2="${x2}"
                    y2="${y2}"
                    stroke="#e0e0e0"
                    stroke-width="1"
                    opacity="0.3"
                />
            `;
        });

        // Draw data polygon
        const pathData = points.map((p, i) => 
            `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`
        ).join(' ') + ' Z';

        svg += `
            <path
                class="radar-area"
                d="${pathData}"
                fill="url(#radarGradient-${containerId})"
                stroke="#4F46E5"
                stroke-width="2"
                opacity="${config.animated ? 0 : 1}"
            />
        `;

        // Add dots and labels
        points.forEach((point, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const labelRadius = radius + 25;
            const labelX = center + labelRadius * Math.cos(angle);
            const labelY = center + labelRadius * Math.sin(angle);
            
            // Dot
            svg += `
                <circle
                    cx="${point.x}"
                    cy="${point.y}"
                    r="5"
                    fill="#4F46E5"
                    stroke="white"
                    stroke-width="2"
                    class="radar-dot"
                    opacity="${config.animated ? 0 : 1}"
                />
            `;
            
            // Label
            const textAnchor = labelX < center - 10 ? 'end' : labelX > center + 10 ? 'start' : 'middle';
            svg += `
                <text
                    x="${labelX}"
                    y="${labelY}"
                    text-anchor="${textAnchor}"
                    dominant-baseline="middle"
                    font-size="12"
                    fill="#666"
                    font-weight="500"
                >
                    ${point.label}
                </text>
            `;
            
            // Value label
            svg += `
                <text
                    x="${point.x}"
                    y="${point.y - 10}"
                    text-anchor="middle"
                    font-size="10"
                    fill="#4F46E5"
                    font-weight="600"
                    opacity="${config.animated ? 0 : 1}"
                    class="radar-value"
                >
                    ${point.value.toFixed(1)}
                </text>
            `;
        });

        svg += '</svg>';
        container.innerHTML = svg;

        // Animate if enabled
        if (config.animated) {
            setTimeout(() => {
                const area = container.querySelector('.radar-area');
                const dots = container.querySelectorAll('.radar-dot');
                const values = container.querySelectorAll('.radar-value');
                
                area.style.transition = `opacity ${this.animations.duration}ms ease-out`;
                area.style.opacity = 1;
                
                dots.forEach((dot, i) => {
                    setTimeout(() => {
                        dot.style.transition = 'opacity 300ms ease-out';
                        dot.style.opacity = 1;
                    }, i * 100);
                });
                
                values.forEach((value, i) => {
                    setTimeout(() => {
                        value.style.transition = 'opacity 300ms ease-out';
                        value.style.opacity = 1;
                    }, i * 100 + 200);
                });
            }, 100);
        }
    }

    /**
     * Create progress bars for category breakdown
     */
    createProgressBars(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const config = {
            animated: options.animated !== false,
            showValues: options.showValues !== false,
            colorScheme: options.colorScheme || 'gradient',
            height: options.height || 30
        };

        let html = '<div class="progress-bars-container">';
        
        Object.entries(data).forEach(([category, value], index) => {
            const percentage = (value / 10) * 100;
            const color = this.getScoreColor(value);
            
            html += `
                <div class="progress-bar-item" style="margin-bottom: 20px;">
                    <div class="progress-bar-header" style="
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                        font-family: 'Inter', -apple-system, sans-serif;
                    ">
                        <span style="
                            font-weight: 600;
                            color: #333;
                            text-transform: capitalize;
                        ">${category}</span>
                        <span style="
                            font-weight: 700;
                            color: ${color};
                        ">${value.toFixed(1)}/10</span>
                    </div>
                    <div class="progress-bar-track" style="
                        background: #f0f0f0;
                        border-radius: ${config.height / 2}px;
                        height: ${config.height}px;
                        overflow: hidden;
                        position: relative;
                    ">
                        <div class="progress-bar-fill" style="
                            width: ${config.animated ? 0 : percentage}%;
                            height: 100%;
                            background: linear-gradient(90deg, ${color}, ${this.lightenColor(color, 20)});
                            border-radius: ${config.height / 2}px;
                            position: relative;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            transition: width ${this.animations.duration}ms ${this.animations.easing};
                        " data-percentage="${percentage}">
                            <div class="progress-bar-glow" style="
                                position: absolute;
                                top: 0;
                                right: 0;
                                width: 50px;
                                height: 100%;
                                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3));
                                animation: shimmer 2s infinite;
                            "></div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;

        // Add shimmer animation
        if (!document.getElementById('shimmer-style')) {
            const style = document.createElement('style');
            style.id = 'shimmer-style';
            style.textContent = `
                @keyframes shimmer {
                    0% { transform: translateX(-100px); }
                    100% { transform: translateX(100px); }
                }
            `;
            document.head.appendChild(style);
        }

        // Animate bars
        if (config.animated) {
            setTimeout(() => {
                container.querySelectorAll('.progress-bar-fill').forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.width = bar.dataset.percentage + '%';
                    }, index * 100);
                });
            }, 100);
        }
    }

    /**
     * Create comparison chart between properties
     */
    createComparisonChart(containerId, properties, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const config = {
            chartType: options.chartType || 'bar',
            categories: options.categories || ['location', 'transport', 'amenities', 'safety', 'growth'],
            colors: options.colors || ['#4F46E5', '#EC4899', '#10B981', '#F59E0B'],
            animated: options.animated !== false
        };

        const width = container.offsetWidth || 600;
        const height = options.height || 400;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        // Create grouped bar chart HTML
        let html = `
            <div class="comparison-chart">
                <svg width="${width}" height="${height}">
                    <g transform="translate(${margin.left},${margin.top})">
        `;

        const barWidth = chartWidth / (config.categories.length * (properties.length + 1));
        const groupWidth = barWidth * properties.length;
        const spacing = barWidth;

        // Y-axis scale (0-10)
        const yScale = chartHeight / 10;

        // Draw grid lines
        for (let i = 0; i <= 10; i += 2) {
            const y = chartHeight - (i * yScale);
            html += `
                <line
                    x1="0"
                    y1="${y}"
                    x2="${chartWidth}"
                    y2="${y}"
                    stroke="#e0e0e0"
                    stroke-width="1"
                    opacity="0.3"
                />
                <text
                    x="-10"
                    y="${y}"
                    text-anchor="end"
                    dominant-baseline="middle"
                    font-size="12"
                    fill="#666"
                >${i}</text>
            `;
        }

        // Draw bars
        config.categories.forEach((category, catIndex) => {
            const x = catIndex * (groupWidth + spacing) + spacing / 2;
            
            properties.forEach((property, propIndex) => {
                const score = property.scores[category] || 0;
                const barHeight = score * yScale;
                const barX = x + propIndex * barWidth;
                const barY = chartHeight - barHeight;
                
                html += `
                    <rect
                        class="comparison-bar"
                        x="${barX}"
                        y="${config.animated ? chartHeight : barY}"
                        width="${barWidth - 2}"
                        height="${config.animated ? 0 : barHeight}"
                        fill="${config.colors[propIndex % config.colors.length]}"
                        data-height="${barHeight}"
                        data-y="${barY}"
                        opacity="0.8"
                        rx="2"
                    />
                    <text
                        class="bar-value"
                        x="${barX + barWidth / 2 - 1}"
                        y="${barY - 5}"
                        text-anchor="middle"
                        font-size="11"
                        font-weight="600"
                        fill="${config.colors[propIndex % config.colors.length]}"
                        opacity="${config.animated ? 0 : 1}"
                    >${score.toFixed(1)}</text>
                `;
            });
            
            // Category label
            html += `
                <text
                    x="${x + groupWidth / 2}"
                    y="${chartHeight + 20}"
                    text-anchor="middle"
                    font-size="12"
                    fill="#666"
                    font-weight="500"
                >${category}</text>
            `;
        });

        html += `
                    </g>
                </svg>
        `;

        // Add legend
        html += `
            <div class="chart-legend" style="
                display: flex;
                justify-content: center;
                margin-top: 20px;
                gap: 20px;
                font-family: 'Inter', -apple-system, sans-serif;
            ">
        `;
        
        properties.forEach((property, index) => {
            html += `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="
                        width: 12px;
                        height: 12px;
                        background: ${config.colors[index % config.colors.length]};
                        border-radius: 2px;
                    "></div>
                    <span style="font-size: 14px; color: #666;">${property.name}</span>
                </div>
            `;
        });
        
        html += `
            </div>
        </div>
        `;

        container.innerHTML = html;

        // Animate bars
        if (config.animated) {
            setTimeout(() => {
                container.querySelectorAll('.comparison-bar').forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.transition = `all ${this.animations.duration}ms ${this.animations.easing}`;
                        bar.setAttribute('y', bar.dataset.y);
                        bar.setAttribute('height', bar.dataset.height);
                    }, index * 50);
                });
                
                setTimeout(() => {
                    container.querySelectorAll('.bar-value').forEach(value => {
                        value.style.transition = 'opacity 300ms ease-out';
                        value.style.opacity = 1;
                    });
                }, properties.length * config.categories.length * 50);
            }, 100);
        }
    }

    /**
     * Create trend line chart
     */
    createTrendChart(containerId, data, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const config = {
            showGrid: options.showGrid !== false,
            showPoints: options.showPoints !== false,
            smoothCurve: options.smoothCurve !== false,
            color: options.color || '#4F46E5',
            animated: options.animated !== false
        };

        const width = container.offsetWidth || 600;
        const height = options.height || 300;
        const padding = 40;
        
        const points = Object.entries(data);
        const maxValue = Math.max(...points.map(p => p[1]));
        const minValue = Math.min(...points.map(p => p[1]));
        const range = maxValue - minValue || 1;

        const xStep = (width - padding * 2) / (points.length - 1);
        const yScale = (height - padding * 2) / range;

        // Create path data
        let pathData = '';
        const pointCoords = points.map(([label, value], index) => {
            const x = padding + index * xStep;
            const y = height - padding - ((value - minValue) * yScale);
            
            if (index === 0) {
                pathData = `M ${x},${y}`;
            } else if (config.smoothCurve) {
                const prevX = padding + (index - 1) * xStep;
                const prevY = height - padding - ((points[index - 1][1] - minValue) * yScale);
                const cp1x = prevX + xStep / 3;
                const cp1y = prevY;
                const cp2x = x - xStep / 3;
                const cp2y = y;
                pathData += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
            } else {
                pathData += ` L ${x},${y}`;
            }
            
            return { x, y, label, value };
        });

        let svg = `
            <svg width="${width}" height="${height}" class="trend-chart">
                <defs>
                    <linearGradient id="trendGradient-${containerId}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:${config.color};stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:${config.color};stop-opacity:0" />
                    </linearGradient>
                </defs>
        `;

        // Draw grid
        if (config.showGrid) {
            // Horizontal lines
            for (let i = 0; i <= 5; i++) {
                const y = padding + (i * (height - padding * 2) / 5);
                svg += `
                    <line
                        x1="${padding}"
                        y1="${y}"
                        x2="${width - padding}"
                        y2="${y}"
                        stroke="#e0e0e0"
                        stroke-width="1"
                        opacity="0.3"
                    />
                `;
            }
            
            // Vertical lines
            pointCoords.forEach(point => {
                svg += `
                    <line
                        x1="${point.x}"
                        y1="${padding}"
                        x2="${point.x}"
                        y2="${height - padding}"
                        stroke="#e0e0e0"
                        stroke-width="1"
                        opacity="0.3"
                    />
                `;
            });
        }

        // Draw area fill
        const areaPath = pathData + ` L ${pointCoords[pointCoords.length - 1].x},${height - padding} L ${padding},${height - padding} Z`;
        svg += `
            <path
                class="trend-area"
                d="${areaPath}"
                fill="url(#trendGradient-${containerId})"
                opacity="${config.animated ? 0 : 1}"
            />
        `;

        // Draw line
        svg += `
            <path
                class="trend-line"
                d="${pathData}"
                fill="none"
                stroke="${config.color}"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="${config.animated ? 0 : 1}"
            />
        `;

        // Draw points and labels
        if (config.showPoints) {
            pointCoords.forEach((point, index) => {
                // Point
                svg += `
                    <circle
                        class="trend-point"
                        cx="${point.x}"
                        cy="${point.y}"
                        r="5"
                        fill="${config.color}"
                        stroke="white"
                        stroke-width="2"
                        opacity="${config.animated ? 0 : 1}"
                    />
                `;
                
                // Value label
                svg += `
                    <text
                        class="point-value"
                        x="${point.x}"
                        y="${point.y - 10}"
                        text-anchor="middle"
                        font-size="11"
                        font-weight="600"
                        fill="${config.color}"
                        opacity="${config.animated ? 0 : 1}"
                    >${point.value.toFixed(1)}</text>
                `;
                
                // X-axis label
                svg += `
                    <text
                        x="${point.x}"
                        y="${height - padding + 20}"
                        text-anchor="middle"
                        font-size="11"
                        fill="#666"
                    >${point.label}</text>
                `;
            });
        }

        svg += '</svg>';
        container.innerHTML = svg;

        // Animate
        if (config.animated) {
            setTimeout(() => {
                const area = container.querySelector('.trend-area');
                const line = container.querySelector('.trend-line');
                const points = container.querySelectorAll('.trend-point');
                const values = container.querySelectorAll('.point-value');
                
                area.style.transition = `opacity ${this.animations.duration}ms ease-out`;
                area.style.opacity = 1;
                
                line.style.transition = `opacity ${this.animations.duration}ms ease-out`;
                line.style.opacity = 1;
                
                points.forEach((point, i) => {
                    setTimeout(() => {
                        point.style.transition = 'opacity 300ms ease-out';
                        point.style.opacity = 1;
                    }, i * 100 + this.animations.duration);
                });
                
                values.forEach((value, i) => {
                    setTimeout(() => {
                        value.style.transition = 'opacity 300ms ease-out';
                        value.style.opacity = 1;
                    }, i * 100 + this.animations.duration + 100);
                });
            }, 100);
        }
    }

    /**
     * Helper: Get color based on score
     */
    getScoreColor(score) {
        if (score >= 8.5) return '#10B981'; // Excellent - Green
        if (score >= 7) return '#3B82F6';   // Good - Blue
        if (score >= 5) return '#F59E0B';   // Average - Orange
        return '#EF4444';                    // Poor - Red
    }

    /**
     * Helper: Lighten color
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    /**
     * Helper: Animate number
     */
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = start + (end - start) * this.easeOutCubic(progress);
            element.textContent = current.toFixed(1);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    }

    /**
     * Helper: Easing function
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataVisualizer;
}