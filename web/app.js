/**
 * GENESIS CERTIFICATE PIPELINE & STUDIO — CLIENT ENGINE
 * IBM Carbon Design System Implementation
 * Supports 700+ batch generation, drag-and-drop layer studio, dynamic auto-fitting, QR verification, and Python CLI sync.
 */

// Global Application State
const STATE = {
    currentRecordIndex: 0,
    recipients: [],
    filteredRecipients: [],
    currentTemplateId: 'modern_gold',
    templateImage: null,
    activeFieldId: 'name',
    isDragging: false,
    draggedField: null,
    dragOffset: { x: 0, y: 0 },
    zoomLevel: 1.0,
    showGrid: false,
    showSafeMargins: false,
    showBoundingBoxes: true,
    config: {
        name: "Modern Gold Excellence",
        template_image: "../templates/modern_gold.png",
        dimensions: { width: 1920, height: 1080 },
        fields: [
            {
                id: "name",
                type: "text",
                field: "name",
                x: 960,
                y: 335,
                font_family: "'Playfair Display', serif",
                font_size: 56,
                min_font_size: 24,
                max_width: 1400,
                color: "#0f172a",
                align: "center",
                auto_fit: true,
                prefix: "",
                suffix: ""
            },
            {
                id: "role",
                type: "text",
                field: "role",
                x: 960,
                y: 460,
                font_family: "'Montserrat', sans-serif",
                font_size: 24,
                max_width: 1300,
                color: "#9a3412",
                align: "center",
                auto_fit: false,
                prefix: "for exemplary performance and dedication as ",
                suffix: ""
            },
            {
                id: "event",
                type: "text",
                field: "event",
                x: 960,
                y: 525,
                font_family: "'Montserrat', sans-serif",
                font_size: 22,
                max_width: 1400,
                color: "#1e293b",
                align: "center",
                auto_fit: false,
                prefix: "in the ",
                suffix: ""
            },
            {
                id: "date",
                type: "text",
                field: "date",
                x: 960,
                y: 585,
                font_family: "'Montserrat', sans-serif",
                font_size: 17,
                max_width: 600,
                color: "#475569",
                align: "center",
                auto_fit: false,
                prefix: "Conferred on ",
                suffix: ""
            },
            {
                id: "qr_code",
                type: "qr_code",
                field: "verification_url",
                x: 1670,
                y: 840,
                size: 105,
                fill_color: "#0f172a",
                back_color: "#ffffff"
            },
            {
                id: "cert_id",
                type: "text",
                field: "cert_id",
                x: 1722,
                y: 960,
                font_family: "'Montserrat', sans-serif",
                font_size: 12,
                max_width: 250,
                color: "#475569",
                align: "center",
                auto_fit: false,
                prefix: "ID: ",
                suffix: ""
            }
        ]
    }
};

// Built-in Theme Presets
const THEME_CONFIGS = {
    modern_gold: {
        name: "Modern Gold Excellence",
        template_image: "../templates/modern_gold.png",
        fields: [
            { id: "name", type: "text", field: "name", x: 960, y: 335, font_family: "'Playfair Display', serif", font_size: 56, min_font_size: 24, max_width: 1400, color: "#0f172a", align: "center", auto_fit: true, prefix: "", suffix: "" },
            { id: "role", type: "text", field: "role", x: 960, y: 460, font_family: "'Montserrat', sans-serif", font_size: 24, max_width: 1300, color: "#9a3412", align: "center", auto_fit: false, prefix: "for exemplary performance and dedication as ", suffix: "" },
            { id: "event", type: "text", field: "event", x: 960, y: 525, font_family: "'Montserrat', sans-serif", font_size: 22, max_width: 1400, color: "#1e293b", align: "center", auto_fit: false, prefix: "in the ", suffix: "" },
            { id: "date", type: "text", field: "date", x: 960, y: 585, font_family: "'Montserrat', sans-serif", font_size: 17, max_width: 600, color: "#475569", align: "center", auto_fit: false, prefix: "Conferred on ", suffix: "" },
            { id: "qr_code", type: "qr_code", field: "verification_url", x: 1670, y: 840, size: 105, fill_color: "#0f172a", back_color: "#ffffff" },
            { id: "cert_id", type: "text", field: "cert_id", x: 1722, y: 960, font_family: "'Montserrat', sans-serif", font_size: 12, max_width: 250, color: "#475569", align: "center", auto_fit: false, prefix: "ID: ", suffix: "" }
        ]
    },
    tech_innovation: {
        name: "Tech Innovation Cyan",
        template_image: "../templates/tech_innovation.png",
        fields: [
            { id: "name", type: "text", field: "name", x: 960, y: 335, font_family: "'Montserrat', sans-serif", font_size: 52, min_font_size: 24, max_width: 1400, color: "#38bdf8", align: "center", auto_fit: true, prefix: "", suffix: "" },
            { id: "role", type: "text", field: "role", x: 960, y: 465, font_family: "'Montserrat', sans-serif", font_size: 22, max_width: 1300, color: "#f8fafc", align: "center", auto_fit: false, prefix: "Track / Distinction: ", suffix: "" },
            { id: "event", type: "text", field: "event", x: 960, y: 525, font_family: "'Montserrat', sans-serif", font_size: 20, max_width: 1400, color: "#94a3b8", align: "center", auto_fit: false, prefix: "Presented at: ", suffix: "" },
            { id: "date", type: "text", field: "date", x: 400, y: 840, font_family: "'Montserrat', sans-serif", font_size: 17, max_width: 400, color: "#94a3b8", align: "center", auto_fit: false, prefix: "Issued: ", suffix: "" },
            { id: "qr_code", type: "qr_code", field: "verification_url", x: 1460, y: 690, size: 120, fill_color: "#0f172a", back_color: "#38bdf8" },
            { id: "cert_id", type: "text", field: "cert_id", x: 1520, y: 840, font_family: "'Montserrat', sans-serif", font_size: 15, max_width: 400, color: "#64748b", align: "center", auto_fit: false, prefix: "Token: ", suffix: "" }
        ]
    },
    academic_classic: {
        name: "Academic Classic Blue",
        template_image: "../templates/academic_classic.png",
        fields: [
            { id: "name", type: "text", field: "name", x: 960, y: 335, font_family: "'Playfair Display', serif", font_size: 52, min_font_size: 24, max_width: 1400, color: "#1e3a8a", align: "center", auto_fit: true, prefix: "", suffix: "" },
            { id: "role", type: "text", field: "role", x: 960, y: 465, font_family: "'Montserrat', sans-serif", font_size: 22, max_width: 1300, color: "#b48c3c", align: "center", auto_fit: false, prefix: "having demonstrated exceptional merit as ", suffix: "" },
            { id: "event", type: "text", field: "event", x: 960, y: 525, font_family: "'Montserrat', sans-serif", font_size: 20, max_width: 1400, color: "#475569", align: "center", auto_fit: false, prefix: "for successful participation in ", suffix: "" },
            { id: "date", type: "text", field: "date", x: 400, y: 840, font_family: "'Montserrat', sans-serif", font_size: 17, max_width: 400, color: "#475569", align: "center", auto_fit: false, prefix: "Conferred on: ", suffix: "" },
            { id: "qr_code", type: "qr_code", field: "verification_url", x: 1460, y: 690, size: 120, fill_color: "#1e3a8a", back_color: "#ffffff" },
            { id: "cert_id", type: "text", field: "cert_id", x: 1520, y: 840, font_family: "'Montserrat', sans-serif", font_size: 15, max_width: 400, color: "#64748b", align: "center", auto_fit: false, prefix: "Reg No: ", suffix: "" }
        ]
    }
};

// Canvas references
const canvas = document.getElementById('certificate-canvas');
const ctx = canvas.getContext('2d');
const gridCanvas = document.getElementById('grid-canvas');
const gridCtx = gridCanvas.getContext('2d');
const dragHud = document.getElementById('drag-hud-tooltip');

// QR Code In-Memory Cache (URL -> Image)
const qrCache = new Map();

// Initialize Studio Application
document.addEventListener('DOMContentLoaded', async () => {
    setupTabNavigation();
    await loadSampleRecipients();
    await loadTemplateImage(STATE.config.template_image);
    renderFieldPills();
    syncPropertyPanel();
    setupEventListeners();
    setupCanvasInteractivity();
    renderRecipientsTable();
    renderCanvas();
    drawGridOverlay();
});

// Setup Carbon Product Tab Navigation
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab-strip .product-tab');
    const panes = document.querySelectorAll('.tab-content-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            tabs.forEach(t => {
                t.classList.remove('product-tab-selected', 'active');
                t.setAttribute('aria-selected', 'false');
            });
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('product-tab-selected', 'active');
            tab.setAttribute('aria-selected', 'true');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');
        });
    });
}

// Load 700 Sample Recipients from CSV
async function loadSampleRecipients() {
    try {
        const response = await fetch('../data/sample_recipients.csv');
        if (response.ok) {
            const csvText = await response.text();
            const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
            STATE.recipients = parsed.data;
        } else {
            generateFallbackSampleData(700);
        }
    } catch (e) {
        generateFallbackSampleData(700);
    }
    STATE.filteredRecipients = [...STATE.recipients];
    updateRecipientToolbar();
}

function generateFallbackSampleData(count) {
    STATE.recipients = [];
    for (let i = 1; i <= count; i++) {
        STATE.recipients.push({
            name: `Recipient ${i} Full Name`,
            role: "Distinguished Participant",
            event: "Global Tech Innovation Summit 2026",
            date: "October 15, 2026",
            cert_id: `GEN-2026-${String(i).padStart(4, '0')}`,
            verification_url: `https://verify.certgen.io/view?id=GEN-2026-${String(i).padStart(4, '0')}`
        });
    }
}

// Load Template Image
function loadTemplateImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            STATE.templateImage = img;
            canvas.width = img.width || 1920;
            canvas.height = img.height || 1080;
            gridCanvas.width = canvas.width;
            gridCanvas.height = canvas.height;
            document.getElementById('canvas-res-badge').innerText = `${canvas.width} × ${canvas.height} (300 DPI)`;
            document.getElementById('util-dims').innerText = `${canvas.width} × ${canvas.height} (300 DPI)`;
            drawGridOverlay();
            resolve(img);
        };
        img.onerror = () => {
            canvas.width = 1920;
            canvas.height = 1080;
            gridCanvas.width = 1920;
            gridCanvas.height = 1080;
            resolve(null);
        };
        img.src = src;
    });
}

// Update Toolbar State
function updateRecipientToolbar() {
    const total = STATE.recipients.length;
    const current = STATE.recipients[STATE.currentRecordIndex] || {};
    document.getElementById('rec-counter-text').innerText = `Recipient ${STATE.currentRecordIndex + 1} of ${total}`;
    document.getElementById('rec-current-name').innerText = current.name || "Recipient Name";
    document.getElementById('jump-to-index').value = STATE.currentRecordIndex + 1;
    document.getElementById('jump-to-index').max = total;
    document.getElementById('data-count-badge').innerText = `${total} Records`;
    document.getElementById('util-rec-count').innerText = `${total} Records`;
    document.getElementById('tab-rec-count').innerText = total;
    document.getElementById('modal-total-count').innerText = total;
    highlightActiveTableRow();
}

// Render Field Layer Selector Pills
function renderFieldPills() {
    const container = document.getElementById('field-pill-list');
    container.innerHTML = '';
    STATE.config.fields.forEach(f => {
        const pill = document.createElement('div');
        pill.className = `field-pill ${f.id === STATE.activeFieldId ? 'active' : ''}`;
        pill.innerText = f.id;
        pill.addEventListener('click', () => {
            STATE.activeFieldId = f.id;
            renderFieldPills();
            syncPropertyPanel();
            renderCanvas();
        });
        container.appendChild(pill);
    });

    const activeEl = document.getElementById('editor-active-id-display');
    if (activeEl) activeEl.innerText = STATE.activeFieldId || "None";
    document.getElementById('theme-layer-count').innerText = `${STATE.config.fields.length} Configured Elements`;
}

// Sync Property Inspector Panel with Active Field
function syncPropertyPanel() {
    const field = STATE.config.fields.find(f => f.id === STATE.activeFieldId);
    if (!field) return;

    document.getElementById('prop-field-key').value = field.field || field.id;
    document.getElementById('prop-field-type').value = field.type || 'text';
    document.getElementById('prop-x').value = Math.round(field.x);
    document.getElementById('prop-y').value = Math.round(field.y);

    const isText = (field.type || 'text') === 'text';
    document.getElementById('text-prop-group').style.display = isText ? 'block' : 'none';
    document.getElementById('prop-size-group').style.display = isText ? 'none' : 'block';

    if (isText) {
        document.getElementById('prop-font-family').value = field.font_family || "'Montserrat', sans-serif";
        document.getElementById('prop-font-size').value = field.font_size || 24;
        document.getElementById('prop-color').value = field.color || '#0f172a';
        document.getElementById('prop-color-hex').value = field.color || '#0f172a';
        document.getElementById('prop-prefix').value = field.prefix || '';
        document.getElementById('prop-auto-fit').checked = !!field.auto_fit;

        // Alignment button states
        document.querySelectorAll('#prop-align-group .btn-toggle').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.align === (field.align || 'center'));
        });
    } else {
        document.getElementById('prop-size').value = field.size || 105;
    }
}

// Render Recipients Table in Sidebar Tab 3
function renderRecipientsTable() {
    const tbody = document.getElementById('recipients-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const displayList = STATE.filteredRecipients.slice(0, 100); // Display top 100 in virtual viewport
    displayList.forEach((r, idx) => {
        const realIdx = STATE.recipients.indexOf(r);
        const tr = document.createElement('tr');
        if (realIdx === STATE.currentRecordIndex) tr.classList.add('active-row');

        tr.innerHTML = `
            <td><strong>${realIdx + 1}</strong></td>
            <td>${escapeHtml(r.name || '')}</td>
            <td>${escapeHtml(r.role || r.event || '')}</td>
            <td><button class="btn-table-action" data-index="${realIdx}">View</button></td>
        `;

        tr.querySelector('.btn-table-action').addEventListener('click', (e) => {
            e.stopPropagation();
            STATE.currentRecordIndex = realIdx;
            updateRecipientToolbar();
            renderCanvas();
        });

        tr.addEventListener('click', () => {
            STATE.currentRecordIndex = realIdx;
            updateRecipientToolbar();
            renderCanvas();
        });

        tbody.appendChild(tr);
    });
}

function highlightActiveTableRow() {
    document.querySelectorAll('#recipients-table-body tr').forEach((tr, i) => {
        const btn = tr.querySelector('.btn-table-action');
        if (btn && parseInt(btn.dataset.index, 10) === STATE.currentRecordIndex) {
            tr.classList.add('active-row');
            tr.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            tr.classList.remove('active-row');
        }
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Generate QR Code Image as Promise
function getQRCodeImage(dataUrl, size, fillColor, backColor) {
    const cacheKey = `${dataUrl}_${size}_${fillColor}_${backColor}`;
    if (qrCache.has(cacheKey)) {
        return Promise.resolve(qrCache.get(cacheKey));
    }

    return new Promise((resolve) => {
        const tempDiv = document.createElement('div');
        new QRCode(tempDiv, {
            text: dataUrl,
            width: size,
            height: size,
            colorDark: fillColor || "#000000",
            colorLight: backColor || "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });

        setTimeout(() => {
            const imgEl = tempDiv.querySelector('img');
            if (imgEl && imgEl.src) {
                const img = new Image();
                img.onload = () => {
                    qrCache.set(cacheKey, img);
                    resolve(img);
                };
                img.src = imgEl.src;
            } else {
                const canvasEl = tempDiv.querySelector('canvas');
                if (canvasEl) {
                    const img = new Image();
                    img.onload = () => {
                        qrCache.set(cacheKey, img);
                        resolve(img);
                    };
                    img.src = canvasEl.toDataURL();
                } else {
                    resolve(null);
                }
            }
        }, 20);
    });
}

// Render Certificate on Main Canvas
async function renderCanvas() {
    const currentRec = STATE.recipients[STATE.currentRecordIndex] || {
        name: "Sara Fernandez",
        role: "Distinguished Participant",
        event: "Global AI & Machine Learning Summit 2026",
        date: "October 15, 2026",
        cert_id: "GEN-2026-0001",
        verification_url: "https://verify.certgen.io/view?id=GEN-2026-0001"
    };

    // 1. Draw background template
    if (STATE.templateImage) {
        ctx.drawImage(STATE.templateImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Render all configured fields
    for (const field of STATE.config.fields) {
        const fieldType = field.type || 'text';

        if (fieldType === 'text') {
            const rawVal = currentRec[field.field || field.id] || "";
            if (!rawVal) continue;

            const prefix = field.prefix || "";
            const suffix = field.suffix || "";
            const fullText = `${prefix}${rawVal}${suffix}`;

            let fontSize = field.font_size || 24;
            const minFontSize = field.min_font_size || 14;
            const maxWidth = field.max_width || 1400;
            const fontFamily = field.font_family || "'Montserrat', sans-serif";

            ctx.font = `bold ${fontSize}px ${fontFamily}`;

            // Auto-fit dynamic calculation
            if (field.auto_fit && maxWidth > 0) {
                let textMetrics = ctx.measureText(fullText);
                while (textMetrics.width > maxWidth && fontSize > minFontSize) {
                    fontSize -= 2;
                    ctx.font = `bold ${fontSize}px ${fontFamily}`;
                    textMetrics = ctx.measureText(fullText);
                }
            }

            ctx.fillStyle = field.color || "#0f172a";
            ctx.textAlign = field.align || "center";
            ctx.textBaseline = "middle";
            ctx.fillText(fullText, field.x, field.y);

            // Bounding Box Highlight for Active Field
            if (STATE.showBoundingBoxes && field.id === STATE.activeFieldId) {
                const metrics = ctx.measureText(fullText);
                const textWidth = metrics.width;
                let startX = field.x;
                if (field.align === 'center') startX = field.x - textWidth / 2;
                else if (field.align === 'right') startX = field.x - textWidth;

                ctx.save();
                ctx.strokeStyle = "#0f62fe"; // IBM Blue
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.strokeRect(startX - 8, field.y - fontSize / 2 - 4, textWidth + 16, fontSize + 8);
                
                // Corner square handles (Carbon style 4px square)
                ctx.fillStyle = "#0f62fe";
                ctx.fillRect(startX - 10, field.y - fontSize / 2 - 6, 6, 6);
                ctx.fillRect(startX + textWidth + 4, field.y - fontSize / 2 - 6, 6, 6);
                ctx.fillRect(startX - 10, field.y + fontSize / 2 + 2, 6, 6);
                ctx.fillRect(startX + textWidth + 4, field.y + fontSize / 2 + 2, 6, 6);
                ctx.restore();
            }

        } else if (fieldType === 'qr_code') {
            const qrData = currentRec[field.field || "verification_url"] || currentRec.cert_id || "https://certgen.io";
            const qrSize = field.size || 105;
            const qrImg = await getQRCodeImage(qrData, qrSize, field.fill_color || "#0f172a", field.back_color || "#ffffff");
            
            if (qrImg) {
                ctx.drawImage(qrImg, field.x, field.y, qrSize, qrSize);

                if (STATE.showBoundingBoxes && field.id === STATE.activeFieldId) {
                    ctx.save();
                    ctx.strokeStyle = "#0f62fe";
                    ctx.lineWidth = 2;
                    ctx.setLineDash([4, 4]);
                    ctx.strokeRect(field.x - 4, field.y - 4, qrSize + 8, qrSize + 8);
                    
                    ctx.fillStyle = "#0f62fe";
                    ctx.fillRect(field.x - 6, field.y - 6, 6, 6);
                    ctx.fillRect(field.x + qrSize + 2, field.y - 6, 6, 6);
                    ctx.fillRect(field.x - 6, field.y + qrSize + 2, 6, 6);
                    ctx.fillRect(field.x + qrSize + 2, field.y + qrSize + 2, 6, 6);
                    ctx.restore();
                }
            }
        }
    }
}

// Draw Grid & Safe Margins on Overlay Canvas
function drawGridOverlay() {
    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

    if (STATE.showGrid) {
        const step = 60;
        gridCtx.strokeStyle = "rgba(15, 98, 254, 0.15)";
        gridCtx.lineWidth = 1;

        gridCtx.beginPath();
        for (let x = 0; x <= gridCanvas.width; x += step) {
            gridCtx.moveTo(x, 0);
            gridCtx.lineTo(x, gridCanvas.height);
        }
        for (let y = 0; y <= gridCanvas.height; y += step) {
            gridCtx.moveTo(0, y);
            gridCtx.lineTo(gridCanvas.width, y);
        }
        gridCtx.stroke();

        // Center lines
        gridCtx.strokeStyle = "rgba(15, 98, 254, 0.4)";
        gridCtx.beginPath();
        gridCtx.moveTo(gridCanvas.width / 2, 0);
        gridCtx.lineTo(gridCanvas.width / 2, gridCanvas.height);
        gridCtx.moveTo(0, gridCanvas.height / 2);
        gridCtx.lineTo(gridCanvas.width, gridCanvas.height / 2);
        gridCtx.stroke();
    }

    if (STATE.showSafeMargins) {
        gridCtx.strokeStyle = "rgba(218, 30, 40, 0.45)"; // Semantic Error Red
        gridCtx.lineWidth = 2;
        gridCtx.setLineDash([8, 6]);
        const margin = 80;
        gridCtx.strokeRect(margin, margin, gridCanvas.width - margin * 2, gridCanvas.height - margin * 2);
        gridCtx.setLineDash([]);
    }
}

// Canvas Drag-and-Drop Layer Interactivity
function setupCanvasInteractivity() {
    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
            clientX: e.clientX,
            clientY: e.clientY
        };
    }

    function findFieldAt(x, y) {
        const currentRec = STATE.recipients[STATE.currentRecordIndex] || {};
        for (let i = STATE.config.fields.length - 1; i >= 0; i--) {
            const field = STATE.config.fields[i];
            if (field.type === 'qr_code') {
                const size = field.size || 105;
                if (x >= field.x && x <= field.x + size && y >= field.y && y <= field.y + size) {
                    return field;
                }
            } else {
                const rawVal = currentRec[field.field || field.id] || "Sample Text";
                const fullText = `${field.prefix || ''}${rawVal}${field.suffix || ''}`;
                ctx.font = `bold ${field.font_size || 24}px ${field.font_family || 'sans-serif'}`;
                const metrics = ctx.measureText(fullText);
                const w = metrics.width;
                const h = (field.font_size || 24);
                let startX = field.x;
                if (field.align === 'center') startX = field.x - w / 2;
                else if (field.align === 'right') startX = field.x - w;

                if (x >= startX - 12 && x <= startX + w + 12 && y >= field.y - h / 2 - 8 && y <= field.y + h / 2 + 8) {
                    return field;
                }
            }
        }
        return null;
    }

    canvas.addEventListener('mousedown', (e) => {
        const coords = getCanvasCoords(e);
        const clickedField = findFieldAt(coords.x, coords.y);
        if (clickedField) {
            STATE.isDragging = true;
            STATE.draggedField = clickedField;
            STATE.activeFieldId = clickedField.id;
            STATE.dragOffset = {
                x: coords.x - clickedField.x,
                y: coords.y - clickedField.y
            };
            renderFieldPills();
            syncPropertyPanel();
            renderCanvas();

            dragHud.style.display = 'block';
            dragHud.innerText = `X: ${Math.round(clickedField.x)}, Y: ${Math.round(clickedField.y)}`;
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!STATE.isDragging || !STATE.draggedField) return;
        const coords = getCanvasCoords(e);
        STATE.draggedField.x = Math.round(coords.x - STATE.dragOffset.x);
        STATE.draggedField.y = Math.round(coords.y - STATE.dragOffset.y);

        syncPropertyPanel();
        renderCanvas();

        const canvasRect = canvas.getBoundingClientRect();
        dragHud.style.display = 'block';
        dragHud.style.left = `${e.clientX - canvasRect.left + 15}px`;
        dragHud.style.top = `${e.clientY - canvasRect.top - 25}px`;
        dragHud.innerText = `X: ${STATE.draggedField.x}, Y: ${STATE.draggedField.y}`;
    });

    window.addEventListener('mouseup', () => {
        if (STATE.isDragging) {
            STATE.isDragging = false;
            STATE.draggedField = null;
            dragHud.style.display = 'none';
        }
    });
}

// Setup Event Listeners & UI Controls
function setupEventListeners() {
    // Recipient Navigation Controls
    document.getElementById('btn-first-rec').addEventListener('click', () => {
        STATE.currentRecordIndex = 0;
        updateRecipientToolbar();
        renderCanvas();
    });

    document.getElementById('btn-prev-rec').addEventListener('click', () => {
        if (STATE.currentRecordIndex > 0) {
            STATE.currentRecordIndex--;
            updateRecipientToolbar();
            renderCanvas();
        }
    });

    document.getElementById('btn-next-rec').addEventListener('click', () => {
        if (STATE.currentRecordIndex < STATE.recipients.length - 1) {
            STATE.currentRecordIndex++;
            updateRecipientToolbar();
            renderCanvas();
        }
    });

    document.getElementById('btn-last-rec').addEventListener('click', () => {
        STATE.currentRecordIndex = STATE.recipients.length - 1;
        updateRecipientToolbar();
        renderCanvas();
    });

    document.getElementById('jump-to-index').addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (val >= 1 && val <= STATE.recipients.length) {
            STATE.currentRecordIndex = val - 1;
            updateRecipientToolbar();
            renderCanvas();
        }
    });

    // Template Theme Switcher
    document.getElementById('template-select').addEventListener('change', async (e) => {
        const themeKey = e.target.value;
        const themeConfig = THEME_CONFIGS[themeKey];
        if (themeConfig) {
            STATE.currentTemplateId = themeKey;
            STATE.config.name = themeConfig.name;
            STATE.config.template_image = themeConfig.template_image;
            STATE.config.fields = JSON.parse(JSON.stringify(themeConfig.fields));
            await loadTemplateImage(themeConfig.template_image);
            renderFieldPills();
            syncPropertyPanel();
            renderCanvas();
        }
    });

    // Custom Template Upload Dropzone
    const dropzone = document.getElementById('template-dropzone');
    const templateInput = document.getElementById('custom-template-input');

    dropzone.addEventListener('click', () => templateInput.click());
    templateInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                await loadTemplateImage(event.target.result);
                renderCanvas();
            };
            reader.readAsDataURL(file);
        }
    });

    // Custom CSV / Excel Upload
    document.getElementById('custom-csv-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data && results.data.length > 0) {
                        STATE.recipients = results.data.map((r, i) => {
                            if (!r.cert_id) r.cert_id = `CERT-${String(i + 1).padStart(4, '0')}`;
                            if (!r.verification_url) r.verification_url = `https://verify.certgen.io/view?id=${r.cert_id}`;
                            return r;
                        });
                        STATE.filteredRecipients = [...STATE.recipients];
                        STATE.currentRecordIndex = 0;
                        updateRecipientToolbar();
                        renderRecipientsTable();
                        renderCanvas();
                        alert(`Successfully loaded ${STATE.recipients.length} recipients!`);
                    }
                }
            });
        }
    });

    // Reset Sample Data
    document.getElementById('btn-reload-sample').addEventListener('click', async () => {
        await loadSampleRecipients();
        renderRecipientsTable();
        renderCanvas();
    });

    // Search Recipients Filter
    document.getElementById('recipient-search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            STATE.filteredRecipients = [...STATE.recipients];
        } else {
            STATE.filteredRecipients = STATE.recipients.filter(r => 
                (r.name && r.name.toLowerCase().includes(query)) ||
                (r.role && r.role.toLowerCase().includes(query)) ||
                (r.event && r.event.toLowerCase().includes(query)) ||
                (r.cert_id && r.cert_id.toLowerCase().includes(query))
            );
        }
        renderRecipientsTable();
    });

    // Property Inspector Live Binding
    const updateActiveFieldFromInputs = () => {
        const field = STATE.config.fields.find(f => f.id === STATE.activeFieldId);
        if (!field) return;

        field.field = document.getElementById('prop-field-key').value;
        field.type = document.getElementById('prop-field-type').value;
        field.x = parseInt(document.getElementById('prop-x').value, 10) || 0;
        field.y = parseInt(document.getElementById('prop-y').value, 10) || 0;

        if (field.type === 'text') {
            field.font_family = document.getElementById('prop-font-family').value;
            field.font_size = parseInt(document.getElementById('prop-font-size').value, 10) || 24;
            field.color = document.getElementById('prop-color').value;
            field.prefix = document.getElementById('prop-prefix').value;
            field.auto_fit = document.getElementById('prop-auto-fit').checked;
        } else {
            field.size = parseInt(document.getElementById('prop-size').value, 10) || 105;
        }
        renderCanvas();
    };

    ['prop-field-key', 'prop-field-type', 'prop-font-family', 'prop-font-size', 'prop-prefix', 'prop-x', 'prop-y', 'prop-size'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateActiveFieldFromInputs);
    });

    document.getElementById('prop-auto-fit').addEventListener('change', updateActiveFieldFromInputs);

    document.getElementById('prop-color').addEventListener('input', (e) => {
        document.getElementById('prop-color-hex').value = e.target.value;
        updateActiveFieldFromInputs();
    });

    document.getElementById('prop-color-hex').addEventListener('input', (e) => {
        document.getElementById('prop-color').value = e.target.value;
        updateActiveFieldFromInputs();
    });

    // Quick Palette Swatches
    document.querySelectorAll('.swatch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            document.getElementById('prop-color').value = color;
            document.getElementById('prop-color-hex').value = color;
            updateActiveFieldFromInputs();
        });
    });

    // Alignment button toggles
    document.querySelectorAll('#prop-align-group .btn-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#prop-align-group .btn-toggle').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const field = STATE.config.fields.find(f => f.id === STATE.activeFieldId);
            if (field) field.align = btn.dataset.align;
            renderCanvas();
        });
    });

    // Center Layer Horizontally
    document.getElementById('btn-center-x').addEventListener('click', () => {
        const field = STATE.config.fields.find(f => f.id === STATE.activeFieldId);
        if (field) {
            field.x = Math.round(canvas.width / 2);
            field.align = "center";
            syncPropertyPanel();
            renderCanvas();
        }
    });

    // Add Field Layer
    document.getElementById('btn-add-field').addEventListener('click', () => {
        const newId = `field_${STATE.config.fields.length + 1}`;
        STATE.config.fields.push({
            id: newId,
            type: "text",
            field: "name",
            x: Math.round(canvas.width / 2),
            y: 650,
            font_family: "'Montserrat', sans-serif",
            font_size: 20,
            color: "#0f172a",
            align: "center",
            auto_fit: false,
            prefix: "",
            suffix: ""
        });
        STATE.activeFieldId = newId;
        renderFieldPills();
        syncPropertyPanel();
        renderCanvas();
    });

    // Delete Field Layer
    document.getElementById('btn-delete-field').addEventListener('click', () => {
        if (STATE.config.fields.length <= 1) {
            alert("A certificate must have at least one field layer.");
            return;
        }
        STATE.config.fields = STATE.config.fields.filter(f => f.id !== STATE.activeFieldId);
        STATE.activeFieldId = STATE.config.fields[0].id;
        renderFieldPills();
        syncPropertyPanel();
        renderCanvas();
    });

    // Overlays Toggle Toolbar
    document.getElementById('btn-toggle-grid').addEventListener('click', (e) => {
        STATE.showGrid = !STATE.showGrid;
        e.target.classList.toggle('active', STATE.showGrid);
        drawGridOverlay();
    });

    document.getElementById('btn-toggle-margins').addEventListener('click', (e) => {
        STATE.showSafeMargins = !STATE.showSafeMargins;
        e.target.classList.toggle('active', STATE.showSafeMargins);
        drawGridOverlay();
    });

    document.getElementById('btn-toggle-boxes').addEventListener('click', (e) => {
        STATE.showBoundingBoxes = !STATE.showBoundingBoxes;
        e.target.classList.toggle('active', STATE.showBoundingBoxes);
        renderCanvas();
    });

    // Zoom Controls
    const zoomText = document.getElementById('zoom-level-text');
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
        STATE.zoomLevel = Math.min(STATE.zoomLevel + 0.15, 2.0);
        applyZoom();
    });

    document.getElementById('btn-zoom-out').addEventListener('click', () => {
        STATE.zoomLevel = Math.max(STATE.zoomLevel - 0.15, 0.4);
        applyZoom();
    });

    document.getElementById('btn-zoom-fit').addEventListener('click', () => {
        STATE.zoomLevel = 1.0;
        canvas.style.transform = `scale(1)`;
        gridCanvas.style.transform = `scale(1)`;
        zoomText.innerText = "Fit";
    });

    function applyZoom() {
        canvas.style.transform = `scale(${STATE.zoomLevel})`;
        gridCanvas.style.transform = `scale(${STATE.zoomLevel})`;
        zoomText.innerText = `${Math.round(STATE.zoomLevel * 100)}%`;
    }

    // Export Single Certificate PNG
    document.getElementById('btn-download-single').addEventListener('click', () => {
        const currentRec = STATE.recipients[STATE.currentRecordIndex] || {};
        const cleanName = (currentRec.name || "certificate").replace(/[^a-zA-Z0-9]/g, "_");
        const link = document.createElement('a');
        link.download = `${cleanName}_${currentRec.cert_id || 'cert'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Python CLI Command Copy
    document.getElementById('btn-copy-cli-cmd').addEventListener('click', () => {
        const cmd = document.getElementById('cli-command-code').innerText;
        navigator.clipboard.writeText(cmd).then(() => {
            const btn = document.getElementById('btn-copy-cli-cmd');
            btn.innerText = "Copied!";
            setTimeout(() => btn.innerText = "Copy", 1500);
        });
    });

    // Export & Import Config JSON
    document.getElementById('btn-export-config-json').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(STATE.config, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "template_config.json");
        dlAnchorElem.click();
    });

    document.getElementById('btn-import-config-json').addEventListener('click', () => {
        document.getElementById('config-json-input').click();
    });

    document.getElementById('config-json-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const loadedConfig = JSON.parse(event.target.result);
                    STATE.config = loadedConfig;
                    renderFieldPills();
                    syncPropertyPanel();
                    renderCanvas();
                    alert("Config JSON imported successfully!");
                } catch (err) {
                    alert("Invalid JSON configuration file.");
                }
            };
            reader.readAsText(file);
        }
    });

    // Batch Modal Controls
    const batchModal = document.getElementById('batch-modal');
    document.getElementById('btn-batch-modal').addEventListener('click', () => {
        batchModal.style.display = 'flex';
        document.getElementById('batch-settings-view').style.display = 'flex';
        document.getElementById('batch-progress-view').style.display = 'none';
        document.getElementById('btn-start-batch-exec').style.display = 'inline-flex';
        document.getElementById('btn-cancel-batch').innerText = "Cancel";
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => batchModal.style.display = 'none');
    document.getElementById('btn-cancel-batch').addEventListener('click', () => batchModal.style.display = 'none');
    document.getElementById('btn-start-batch-exec').addEventListener('click', startBatchGeneration);

    // Shortcuts Modal Controls
    const shortcutsModal = document.getElementById('shortcuts-modal');
    document.getElementById('btn-quick-shortcuts').addEventListener('click', () => shortcutsModal.style.display = 'flex');
    document.getElementById('btn-close-shortcuts').addEventListener('click', () => shortcutsModal.style.display = 'none');
    document.getElementById('btn-done-shortcuts').addEventListener('click', () => shortcutsModal.style.display = 'none');

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 'ArrowRight') {
            document.getElementById('btn-next-rec').click();
        } else if (e.key === 'ArrowLeft') {
            document.getElementById('btn-prev-rec').click();
        } else if (e.key === 'Home') {
            document.getElementById('btn-first-rec').click();
        } else if (e.key === 'End') {
            document.getElementById('btn-last-rec').click();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            document.getElementById('btn-batch-modal').click();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            e.preventDefault();
            document.getElementById('btn-download-single').click();
        } else if (e.key.toLowerCase() === 'g') {
            document.getElementById('btn-toggle-grid').click();
        } else if (e.key === 'Escape') {
            batchModal.style.display = 'none';
            shortcutsModal.style.display = 'none';
        }
    });
}

// High-Speed Batch Generation Pipeline
async function startBatchGeneration() {
    const total = STATE.recipients.length;
    if (total === 0) return alert("No recipients data found!");

    document.getElementById('batch-settings-view').style.display = 'none';
    document.getElementById('batch-progress-view').style.display = 'block';
    document.getElementById('btn-start-batch-exec').style.display = 'none';

    const fmtPng = document.getElementById('chk-fmt-png').checked;
    const fmtMasterPdf = document.getElementById('chk-fmt-pdf').checked;
    const fmtIndivPdf = document.getElementById('chk-fmt-indiv-pdf').checked;

    const zip = new JSZip();
    const startTime = Date.now();

    let masterPdf = null;
    if (fmtMasterPdf && window.jspdf) {
        masterPdf = new window.jspdf.jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
    }

    const savedIndex = STATE.currentRecordIndex;
    const prevBounding = STATE.showBoundingBoxes;
    STATE.showBoundingBoxes = false; // Disable bounding box outline during render

    for (let i = 0; i < total; i++) {
        STATE.currentRecordIndex = i;
        await renderCanvas();

        const rec = STATE.recipients[i];
        const cleanName = (rec.name || `Recipient_${i + 1}`).replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `${cleanName}_${rec.cert_id || i + 1}`;

        // 1. Add PNG to ZIP
        if (fmtPng) {
            const dataUrl = canvas.toDataURL('image/png');
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
            zip.file(`certificates/png/${fileName}.png`, base64Data, { base64: true });
        }

        // 2. Add page to Master PDF
        if (masterPdf) {
            if (i > 0) masterPdf.addPage([canvas.width, canvas.height], 'landscape');
            masterPdf.addImage(canvas.toDataURL('image/jpeg', 0.90), 'JPEG', 0, 0, canvas.width, canvas.height);
        }

        // 3. Add Individual PDF to ZIP
        if (fmtIndivPdf && window.jspdf) {
            const singlePdf = new window.jspdf.jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            singlePdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, canvas.width, canvas.height);
            const singleBlob = singlePdf.output('arraybuffer');
            zip.file(`certificates/pdf/${fileName}.pdf`, singleBlob);
        }

        // Update progress UI
        const processed = i + 1;
        const pct = Math.round((processed / total) * 100);
        const elapsedSec = (Date.now() - startTime) / 1000;
        const speed = (processed / Math.max(elapsedSec, 0.1)).toFixed(1);

        document.getElementById('progress-percentage').innerText = `${pct}%`;
        document.getElementById('progress-count').innerText = `${processed} / ${total}`;
        document.getElementById('progress-speed').innerText = `${speed} cert/s`;
        document.getElementById('progress-bar-fill').style.width = `${pct}%`;
        document.getElementById('current-processing-text').innerText = `Processed (${processed}/${total}): ${rec.name}`;

        // Yield event loop for 60fps UI smoothness
        if (i % 6 === 0) {
            await new Promise(r => setTimeout(r, 0));
        }
    }

    // Finalize outputs & zip packaging
    document.getElementById('current-processing-text').innerText = "Compressing ZIP archive & generating download package...";

    if (masterPdf) {
        const pdfBlob = masterPdf.output('blob');
        zip.file('ALL_700_CERTIFICATES_MASTER.pdf', pdfBlob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `Genesis_Batch_Certificates_${total}_Records.zip`);

    STATE.currentRecordIndex = savedIndex;
    STATE.showBoundingBoxes = prevBounding;
    renderCanvas();

    document.getElementById('current-processing-text').innerText = "All certificates generated & downloaded successfully!";
    document.getElementById('btn-cancel-batch').innerText = "Done";
}
