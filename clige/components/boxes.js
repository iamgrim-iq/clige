const { repeat, pad, stripAnsi, wrapText, createBorder, measureText } = require('../core/renderer');
const { getTerminalSize } = require('../core/terminal');
const { COLORS } = require('../core/colors');

function drawBox(content, options = {}) {
    const {
        width,
        height,
        padding = 1,
        margin = 0,
        title = '',
        titleAlign = 'left',
        borderStyle = 'single',
        color = '',
        background = '',
        align = 'left'
    } = options;

    const terminal = getTerminalSize();
    const maxWidth = terminal.width - (margin * 2);
    const boxWidth = width || Math.min(maxWidth, 80);
    const border = createBorder(borderStyle);

    const contentWidth = boxWidth - 2 - (padding * 2);

    const contentLines = content.split('\n');
    let wrappedLines = [];
    contentLines.forEach(line => {
        const strippedLine = stripAnsi(line);
        if (strippedLine.length > contentWidth) {
            wrappedLines.push(...wrapText(line, contentWidth));
        } else {
            wrappedLines.push(line);
        }
    });

    if (height) {
        const targetHeight = height - 2 - (padding * 2);
        while (wrappedLines.length < targetHeight) {
            wrappedLines.push('');
        }
        wrappedLines = wrappedLines.slice(0, targetHeight);
    }

    const lines = [];
    const fullColor = color + background;

    let topBorder = '';
    if (title) {
        const titleContent = ` ${title} `;
        const titleWidth = stripAnsi(titleContent).length;
        const remainingWidth = boxWidth - titleWidth - 2;

        if (titleAlign === 'center') {
            const leftPad = Math.floor(remainingWidth / 2);
            const rightPad = remainingWidth - leftPad;
            topBorder = border.topLeft + repeat(border.horizontal, leftPad) + titleContent + repeat(border.horizontal, rightPad) + border.topRight;
        } else if (titleAlign === 'right') {
            topBorder = border.topLeft + repeat(border.horizontal, remainingWidth) + titleContent + border.topRight;
        } else {
            topBorder = border.topLeft + titleContent + repeat(border.horizontal, remainingWidth) + border.topRight;
        }
    } else {
        topBorder = border.topLeft + repeat(border.horizontal, boxWidth - 2) + border.topRight;
    }
    lines.push(topBorder);

    const emptyLine = border.vertical + repeat(' ', boxWidth - 2) + border.vertical;
    for (let i = 0; i < padding; i++) {
        lines.push(emptyLine);
    }

    wrappedLines.forEach(line => {
        const paddedLine = pad(line, contentWidth, ' ', align);
        const contentRow = border.vertical + repeat(' ', padding) + paddedLine + repeat(' ', padding) + border.vertical;
        lines.push(contentRow);
    });

    for (let i = 0; i < padding; i++) {
        lines.push(emptyLine);
    }

    const bottomBorder = border.bottomLeft + repeat(border.horizontal, boxWidth - 2) + border.bottomRight;
    lines.push(bottomBorder);

    const marginStr = repeat(' ', margin);
    const result = lines
        .map(line => marginStr + fullColor + line + COLORS.RESET)
        .join('\n');

    return result;
}

function drawContainer(items, options = {}) {
    const {
        title = '',
        spacing = 1,
        layout = 'vertical',
        color = COLORS.CYAN,
        containerPadding = 0
    } = options;
    
    let result = '';
    
    if (title) {
        result += drawBox(title, { 
            color: color + COLORS.BOLD,
            padding: 1,
            align: 'center'
        });
        result += '\n'.repeat(spacing);
    }
    
    if (layout === 'horizontal') {
        const terminal = getTerminalSize();
        const totalSpacing = (items.length - 1) * spacing;
        const availableWidth = terminal.width - totalSpacing;
        const itemWidth = Math.floor(availableWidth / items.length);
        
        const renderedItems = items.map(item => 
            drawBox(item.content, {
                ...item,
                width: itemWidth - 2 
            })
        );
        
        const maxHeight = Math.max(...renderedItems.map(item => item.split('\n').length));
        
        for (let lineIndex = 0; lineIndex < maxHeight; lineIndex++) {
            let line = '';
            renderedItems.forEach((item, itemIndex) => {
                const itemLines = item.split('\n');
                const actualItemWidth = stripAnsi(itemLines[0] || '').length;
                const currentLine = itemLines[lineIndex] || repeat(' ', actualItemWidth);
                
                const paddingNeeded = actualItemWidth - stripAnsi(currentLine).length;
                line += currentLine + repeat(' ', paddingNeeded);

                if (itemIndex < renderedItems.length - 1) {
                    line += repeat(' ', spacing);
                }
            });
            result += line + '\n';
        }
    } else {
        items.forEach((item, index) => {
            result += drawBox(item.content, {
                title: item.title || '',
                color: item.color || color,
                width: item.width,
                padding: item.padding,
                borderStyle: item.borderStyle,
                align: item.align
            });
            
            if (index < items.length - 1) {
                result += '\n'.repeat(spacing);
            }
        });
    }
    
    if (containerPadding > 0) {
        const paddingLine = repeat(' ', containerPadding);
        const lines = result.split('\n');
        result = paddingLine + '\n'.repeat(containerPadding) + 
                 lines.map(line => paddingLine + line + paddingLine).join('\n') + 
                 '\n'.repeat(containerPadding) + paddingLine;
    }
    
    return result;
}

function drawNestedBox(content, options = {}) {
    const { levels = 1, spacing = 1, colors = [], expandWidth = 4 } = options;
    
    let result = content;
    let currentWidth;
    
    for (let i = levels - 1; i >= 0; i--) {
        const color = colors[i] || options.color || COLORS.BLUE;
        
        if (i === levels - 1) {
            const contentMeasure = measureText(result);
            currentWidth = contentMeasure.width + 10;
        } else {
            currentWidth += expandWidth;
        }
        
        result = drawBox(result, {
            color,
            padding: spacing,
            borderStyle: options.borderStyle,
            width: currentWidth,
            align: 'center'
        });
    }
    
    return result;
}

module.exports = {
    drawBox,
    drawContainer,
    drawNestedBox,
};
