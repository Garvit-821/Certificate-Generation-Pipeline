/**
 * GENESIS CERTIFICATE PIPELINE & STUDIO - CLIENT LOGIC
 * High-performance canvas rendering, drag-and-drop template editor, and 700+ batch generator.
 */

// Global State
const STATE = {
    currentRecordIndex: 0,
    recipients: [],
    currentTemplateId: 'modern_gold',
    templateImage: null,
    activeFieldId: 'name',
    isDragging: false,
    draggedField: null,
    dragOffset: { x: 0, y: 0 },
    zoomLevel: 1.0,
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
                min_font_size: 26,
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
                prefix: "ID: ",
                suffix: ""
            }
        ]
    }
};

// Built-in Theme Configurations
const THEME_CONFIGS = {
    modern_gold: {
        name: "Modern Gold Excellence",
        template_image: "../templates/modern_gold.png",
        fields: [
            { id: "name", type: "text", field: "name", x: 960, y: 335, font_family: "'Playfair Display', serif", font_size: 56, min_font_size: 26, max_width: 1400, color: "#0f172a", align: "center", auto_fit: true, prefix: "", suffix: "" },
            { id: "role", type: "text", field: "role", x: 960, y: 460, font_family: "'Montserrat', sans-serif", font_size: 24, max_width: 1300, color: "#9a3412", align: "center", prefix: "for exemplary performance and dedication as ", suffix: "" },
            { id: "event", type: "text", field: "event", x: 960, y: 525, font_family: "'Montserrat', sans-serif", font_size: 22, max_width: 1400, color: "#1e293b", align: "center", prefix: "in the ", suffix: "" },
            { id: "date", type: "text", field: "date", x: 960, y: 585, font_family: "'Montserrat', sans-serif", font_size: 17, max_width: 600, color: "#475569", align: "center", prefix: "Conferred on ", suffix: "" },
            { id: "qr_code", type: "qr_code", field: "verification_url", x: 1670, y: 840, size: 105, fill_color: "#0f172a", back_color: "#ffffff" },
            { id: "cert_id", type: "text", field: "cert_id", x: 1722, y: 960, font_family: "'Montserrat', sans-serif", font_size: 12, max_width: 250, color: "#475569", align: "center", prefix: "ID: ", suffix: "" }
        ]
    },
    tech_innovation: {
        name: "Tech Innovation Cyan",
        template_image: "../templates/tech_innovation.png",
        fields: [
            { id: "name", type: "text", field: "name", x: 960, y: 335, font_family: "'Montserrat', sans-serif", font_size: 52, min_font_size: 26, max_width: 1400, color: "#38bdf8", align: "center", auto_fit: true, prefix: "", suffix: "" },
            { id: "role", type: "text", field: "role", x: 960, y: 465, font_family: "'Montserrat', sans-serif", font_size: 22, max_width: 1300, color: "#f8fafc", align: "center", prefix: "Track / Distinction: ", suffix: "" },
            { id: "event", type: "text", field: "event", x: 960, y: 525, font_family: "'Montserrat', sans-serif", font_size: 20, max_width: 1400, color: "#94a3b8", align: "center", prefix: "Presented at: ", suffix: "" },
            { id: "date", type: "text", field: "date", x: 400, y: 840, font_family: "'Montserrat', sans-serif", font_size: 17, max_width: 400, color: "#94a3b8", align: "center", prefix: "Issued: ", suffix: "" },
            { id: "qr_code", type: "qr_code", field: "verification_url", x: 1460, y: 690, size: 120, fill_color: "#0f172a", back_color: "#38bdf8" },
            { id: "cert_id", type: "text", field: "cert_id", x: 1520, y: 840, font_family: "'Montserrat', sans-serif", font_size: 15, max_width: 400, color: "#64748b", align: "center", prefix: "Token: ", suffix: "" }
        ]
    },
    academic_classic: {
        name: "Academic Classic Blue",
        template_image: "../templates/academic_classic.png",
        fields: [
            { id: "name", type: "text", field: "name", x: 960, y: 335, font_family: "'Playfair Display', serif", font_size: 52, min_font_size: 26, max_width: 1400, color: "#1e3a8a", align: "center", auto_fit: true, prefix: "", suffix: "" },
            { id: "role", type: "text", field: "role", x: 960, y: 465, font_family: "'Montserrat', sans-serif", font_size: 22, max_width: 1300, color: "#b48c3c", align: "center", prefix: "having demonstrated exceptional merit as ", suffix: "" },
            { id: "event", type: "text", field: "event", x: 960, y: 525, font_family: "'Montserrat', sans-serif", font_size: 20, max_width: 1400, color: "#475569", align: "center", prefix: "for successful participation in ", suffix: "" },
            { id: "date", type: "text", field: "date", x: 400, y: 840, font_family: "'Montserrat', sans-serif", font_size: 17, max_width: 400, color: "#475569", align: "center", prefix: "Conferred on: ", suffix: "" },
            { id: "qr_code", type: "qr_code", field: "verification_url", x: 1460, y: 690, size: 120, fill_color: "#1e3a8a", back_color: "#ffffff" },
            { id: "cert_id", type: "text", field: "cert_id", x: 1520, y: 840, font_family: "'Montserrat', sans-serif", font_size: 15, max_width: 400, color: "#64748b", align: "center", prefix: "Reg No: ", suffix: "" }
        ]
    }
};

// Canvas references
const canvas = document.getElementById('certificate-canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('selection-overlay');

// Cache QR code images: url -> Image
const qrCache = new Map();

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    await loadSampleRecipients();
    await loadTemplateImage(STATE.config.template_image);
    renderFieldPills();
    syncPropertyPanel();
    setupEventListeners();
    setupCanvasInteractivity();
    renderCanvas();
});

// Load 700 sample recipients from CSV
async function loadSampleRecipients() {
    try {
        const response = await fetch('../data/sample_recipients.csv');
        if (response.ok) {
            const csvText = await response.text();
            const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
            STATE.recipients = parsed.data;
        } else {
            // Fallback generated sample data
            generateFallbackSampleData(700);
        }
    } catch (e) {
        generateFallbackSampleData(700);
    }
    updateRecipientToolbar();
}

function generateFallbackSampleData(count) {
    STATE.recipients = [];
    for (let i = 1; i <= count; i++) {
        STATE.recipients.push({
            name: `Recipient ${i} Full Name`,
            role: "Distinguished Participant",
            event: "Global Tech Summit 2026",
            date: "September 22, 2026",
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
            resolve(img);
        };
        img.onerror = () => {
            // Generate fallback blank canvas
            canvas.width = 1920;
            canvas.height = 1080;
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
    document.getElementById('data-count-badge').innerText = `${total} Loaded`;
    document.getElementById('modal-total-count').innerText = total;
}

// Render Field Pills
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

        // Alignment buttons
        document.querySelectorAll('#prop-align-group .btn-toggle').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.align === (field.align || 'center'));
        });
    } else {
        document.getElementById('prop-size').value = field.size || 105;
    }
}

// Generate QR Code Image as Promise
function getQRCodeImage(dataUrl, size, fillColor, backColor) {
    const cacheKey = `${dataUrl}_${size}_${fillColor}_${backColor}`;
    if (qrCache.has(cacheKey)) {
        return Promise.resolve(qrCache.get(cacheKey));
    }

    return new Promise((resolve) => {
        const tempDiv = document.createElement('div');
        const qrcode = new QRCode(tempDiv, {
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
        }, 30);
    });
}

// Render Certificate on Canvas
async function renderCanvas() {
    const currentRec = STATE.recipients[STATE.currentRecordIndex] || {
        name: "Sara Fernandez",
        role: "Distinguished Participant",
        event: "Global AI & Machine Learning Summit 2026",
        date: "October 15, 2026",
        cert_id: "GEN-2026-0001",
        verification_url: "https://verify.certgen.io/view?id=GEN-2026-0001"
    };

    // Draw background template
    if (STATE.templateImage) {
        ctx.drawImage(STATE.templateImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Render Fields
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

            // Auto-fit font scaling
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

            // Highlight active field bounding box
            if (field.id === STATE.activeFieldId) {
                const metrics = ctx.measureText(fullText);
                const textWidth = metrics.width;
                let startX = field.x;
                if (field.align === 'center') startX = field.x - textWidth / 2;
                else if (field.align === 'right') startX = field.x - textWidth;

                ctx.save();
                ctx.strokeStyle = "rgba(212, 175, 55, 0.8)";
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 4]);
                ctx.strokeRect(startX - 8, field.y - fontSize / 2 - 4, textWidth + 16, fontSize + 8);
                ctx.restore();
            }

        } else if (fieldType === 'qr_code') {
            const qrData = currentRec[field.field || "verification_url"] || currentRec.cert_id || "https://certgen.io";
            const qrImg = await getQRCodeImage(qrData, field.size || 105, field.fill_color || "#0f172a", field.back_color || "#ffffff");
            if (qrImg) {
                ctx.drawImage(qrImg, field.x, field.y, field.size || 105, field.size || 105);

                if (field.id === STATE.activeFieldId) {
                    ctx.save();
                    ctx.strokeStyle = "rgba(212, 175, 55, 0.8)";
                    ctx.lineWidth = 2;
                    ctx.setLineDash([6, 4]);
                    ctx.strokeRect(field.x - 4, field.y - 4, (field.size || 105) + 8, (field.size || 105) + 8);
                    ctx.restore();
                }
            }
        }
    }
}

// Canvas Drag and Drop Interactivity
function setupCanvasInteractivity() {
    function getCanvasCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
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

                if (x >= startX - 10 && x <= startX + w + 10 && y >= field.y - h / 2 - 5 && y <= field.y + h / 2 + 5) {
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
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!STATE.isDragging || !STATE.draggedField) return;
        const coords = getCanvasCoords(e);
        STATE.draggedField.x = Math.round(coords.x - STATE.dragOffset.x);
        STATE.draggedField.y = Math.round(coords.y - STATE.dragOffset.y);
        syncPropertyPanel();
        renderCanvas();
    });

    window.addEventListener('mouseup', () => {
        if (STATE.isDragging) {
            STATE.isDragging = false;
            STATE.draggedField = null;
        }
    });
}

// Event Listeners Setup
function setupEventListeners() {
    // Recipient Navigation
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

    // Custom Template Upload
    document.getElementById('custom-template-input').addEventListener('change', (e) => {
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
                        STATE.currentRecordIndex = 0;
                        updateRecipientToolbar();
                        renderCanvas();
                        alert(`Successfully loaded ${STATE.recipients.length} recipients!`);
                    }
                }
            });
        }
    });

    // Reset Sample Data
    document.getElementById('btn-reload-sample').addEventListener('click', () => {
        loadSampleRecipients();
        renderCanvas();
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

    // Alignment button toggles
    document.querySelectorAll('#prop-align-group .btn-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('#prop-align-group .btn-toggle').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const field = STATE.config.fields.find(f => f.id === STATE.activeFieldId);
            if (field) field.align = btn.dataset.align;
            renderCanvas();
        });
    });

    // Add New Custom Field
    document.getElementById('btn-add-field').addEventListener('click', () => {
        const newId = `field_${STATE.config.fields.length + 1}`;
        STATE.config.fields.push({
            id: newId,
            type: "text",
            field: "name",
            x: 960,
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

    // Single Download
    document.getElementById('btn-download-single').addEventListener('click', () => {
        const currentRec = STATE.recipients[STATE.currentRecordIndex] || {};
        const cleanName = (currentRec.name || "certificate").replace(/[^a-zA-Z0-9]/g, "_");
        const link = document.createElement('a');
        link.download = `${cleanName}_${currentRec.cert_id || 'cert'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Batch Modal Controls
    const modal = document.getElementById('batch-modal');
    document.getElementById('btn-batch-modal').addEventListener('click', () => {
        modal.style.display = 'flex';
        document.getElementById('batch-settings-view').style.display = 'flex';
        document.getElementById('batch-progress-view').style.display = 'none';
        document.getElementById('btn-start-batch-exec').style.display = 'inline-flex';
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    document.getElementById('btn-cancel-batch').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Batch Generation Execution
    document.getElementById('btn-start-batch-exec').addEventListener('click', startBatchGeneration);
}

// Batch Generation Pipeline (Client-Side ZIP & PDF generation)
async function startBatchGeneration() {
    const total = STATE.recipients.length;
    if (total === 0) return alert("No recipients data found!");

    document.getElementById('batch-settings-view').style.display = 'none';
    document.getElementById('batch-progress-view').style.display = 'block';
    document.getElementById('btn-start-batch-exec').style.display = 'none';

    const fmtPng = document.getElementById('chk-fmt-png').checked;
    const fmtMasterPdf = document.getElementById('chk-fmt-pdf').checked;

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

    for (let i = 0; i < total; i++) {
        STATE.currentRecordIndex = i;
        await renderCanvas();

        const rec = STATE.recipients[i];
        const cleanName = (rec.name || `Recipient_${i + 1}`).replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `${cleanName}_${rec.cert_id || i + 1}`;

        // Add PNG to ZIP
        if (fmtPng) {
            const dataUrl = canvas.toDataURL('image/png');
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
            zip.file(`certificates/png/${fileName}.png`, base64Data, { base64: true });
        }

        // Add page to Master PDF
        if (masterPdf) {
            if (i > 0) masterPdf.addPage([canvas.width, canvas.height], 'landscape');
            masterPdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, canvas.width, canvas.height);
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
        document.getElementById('current-processing-text').innerText = `Processed: ${rec.name} (${rec.cert_id || i + 1})`;

        // Yield execution so UI updates smoothly
        if (i % 5 === 0) {
            await new Promise(r => setTimeout(r, 0));
        }
    }

    // Save outputs
    document.getElementById('current-processing-text').innerText = "Compressing ZIP archive...";

    if (masterPdf) {
        const pdfBlob = masterPdf.output('blob');
        zip.file('ALL_700_CERTIFICATES_MASTER.pdf', pdfBlob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `Genesis_Batch_Certificates_${total}_Records.zip`);

    STATE.currentRecordIndex = savedIndex;
    renderCanvas();

    document.getElementById('current-processing-text').innerText = "🎉 All certificates generated & downloaded successfully!";
    document.getElementById('btn-cancel-batch').innerText = "Done";
}
