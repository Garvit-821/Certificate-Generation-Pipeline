# 🎓 High-Performance Certificate Generation Pipeline (700+ Recipients)

A production-ready, high-throughput pipeline designed to batch generate thousands of high-resolution certificates (in **PDF** and **PNG/JPEG** formats) with dynamic text auto-scaling, unique certificate IDs, and dynamic verification QR codes.

---

## ⚡ Key Highlights

- **Fast Multiprocessing**: Generates 700+ high-resolution certificates in seconds using parallel Python workers.
- **Interactive Visual Studio (Web UI)**: Built with the **IBM Carbon Design System** — featuring drag-and-drop layer positioning, live alignment grids, print safe margin guides, and real-time element inspection.
- **Live 700-Recipient Preview**: Switch through recipient rows (1 to 700) in real time to verify that text layouts and long names fit cleanly.
- **Smart Dynamic Auto-Scaling**: Automatically scales font size down when a name or title is unusually long so it never overflows template borders.
- **Dynamic QR Code Engine**: Generates unique QR codes for verification (linking to a verification URL or embedding recipient metadata).
- **Consolidated Master PDF**: Automatically creates a single multi-page PDF containing all 700 certificates for one-click printing or archiving.
- **Email Delivery Support**: Optional bulk email dispatcher module (`pipeline/mailer.py`) with customizable body templates and attachments.

---

## 🚀 Quick Start Guide

### 1. Requirements & Setup
```bash
pip install -r requirements.txt
```

### 2. Launch the Interactive Visual Studio (Web Dashboard)
To visually design your template, drag and drop fields, and flip through live previews of all 700 recipients:
```bash
python3 serve.py
```
Open **`http://localhost:8080/web/index.html`** in your browser.

---

### 3. Run Batch Generation via CLI

Batch generate all 700 certificates with a single command:
```bash
python3 generate.py --data data/sample_recipients.csv --config config/template_config.json --format pdf,png --workers 8
```

#### Available CLI Options:
| Flag | Description | Default |
|------|-------------|---------|
| `--data`, `-d` | Path to CSV, Excel (`.xlsx`), or JSON recipient data file | `data/sample_recipients.csv` |
| `--config`, `-c` | Path to template layout JSON configuration | `config/template_config.json` |
| `--template`, `-t` | Path to custom background image override | Template in config |
| `--output`, `-o` | Output directory for generated certificates | `output` |
| `--format`, `-f` | Output formats (`pdf`, `png`, `jpg`) | `pdf,png` |
| `--workers`, `-w` | Number of parallel CPU worker processes | CPU core count |
| `--limit`, `-n` | Generate only first N certificates (for quick testing) | All records |
| `--email-dry-run` | Simulate bulk email dispatch without sending live emails | Disabled |

---

## 📁 Project Structure

```
Certificate Generation Pipeline/
├── config/
│   ├── template_config.json   # Modern Gold template coordinate & style mapping
│   ├── tech_config.json       # Tech Innovation (Slate/Cyan) preset
│   └── academic_config.json   # Academic Classic (Royal Blue) preset
├── data/
│   └── sample_recipients.csv  # 700 realistic recipient records (Name, Role, Event, Date, ID)
├── fonts/                     # High-quality TrueType fonts (Playfair, Montserrat, Cinzel, GreatVibes)
├── pipeline/
│   ├── generator.py           # Core multiprocessing batch rendering engine
│   ├── validator.py           # Data sanitizer & column validator
│   ├── qr_service.py          # High-resolution QR code generator
│   ├── mailer.py              # Bulk email sender with attachment support
│   └── sample_generator.py    # 700-row sample data generator
├── templates/
│   ├── modern_gold.png        # Luxury Gold & Navy background template
│   ├── tech_innovation.png    # Modern Tech Slate/Cyan background template
│   └── academic_classic.png   # Ivy League Academic background template
├── web/                       # Interactive Visual Studio Web App (IBM Carbon Design System)
│   ├── index.html             # Studio UI layout (Carbon v11 flat geometry)
│   ├── style.css              # IBM Carbon Design tokens, typography & styling
│   └── app.js                 # HTML5 canvas rendering & batch zip export
├── output/                    # Generated PDF & PNG certificates
├── generate.py                # Command-line entrypoint
├── serve.py                   # Local web server runner
└── requirements.txt           # Python dependencies
```

---

## 📄 Using Your Own Custom Data & Templates

1. **Custom CSV / Excel**:
   Make sure your file has a `name` column. Optional columns include `email`, `role`, `event`, `date`, `cert_id`. If `cert_id` or `verification_url` are missing, the pipeline automatically generates unique values for each person.

2. **Custom Template**:
   Save your PNG / JPG / PDF template in `templates/my_template.png` and update `config/template_config.json` or adjust fields interactively in the Web Studio!
