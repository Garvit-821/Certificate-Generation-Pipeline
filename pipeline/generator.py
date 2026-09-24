"""
High-Performance Certificate Generation Engine
Supports parallel multiprocessing, dynamic auto-scaling text fitting, QR overlay, and multi-format export (PDF/PNG/JPEG).
"""

import os
import time
import json
from concurrent.futures import ProcessPoolExecutor, as_completed
from PIL import Image, ImageDraw, ImageFont, ImageColor
from tqdm import tqdm

from pipeline.qr_service import QRService

# Cache for font objects: (font_path, font_size) -> ImageFont
_FONT_CACHE = {}

def get_font(font_path: str, size: int) -> ImageFont.ImageFont:
    """Retrieves or loads TrueType font from cache."""
    key = (font_path, size)
    if key not in _FONT_CACHE:
        if not os.path.exists(font_path):
            # Fallback to default PIL font if custom font path is invalid
            try:
                _FONT_CACHE[key] = ImageFont.load_default()
            except Exception:
                _FONT_CACHE[key] = ImageFont.load_default()
        else:
            _FONT_CACHE[key] = ImageFont.truetype(font_path, size)
    return _FONT_CACHE[key]

def compute_fitted_font(text: str, font_path: str, initial_size: int, min_size: int, max_width: int):
    """Dynamically scales font size down until text fits within max_width."""
    current_size = initial_size
    font = get_font(font_path, current_size)
    
    # Measure text bounding box
    bbox = font.getbbox(text)
    text_w = bbox[2] - bbox[0]
    
    while text_w > max_width and current_size > min_size:
        current_size -= 2
        font = get_font(font_path, current_size)
        bbox = font.getbbox(text)
        text_w = bbox[2] - bbox[0]
        
    return font, current_size

def render_single_certificate(args):
    """
    Worker function to render a single certificate.
    args: tuple of (record, config, output_dir, formats, template_img_bytes, filename_pattern)
    """
    record, config, output_dir, formats, template_path, filename_pattern = args
    
    try:
        # Load base template
        base_img = Image.open(template_path).convert("RGBA")
        draw = ImageDraw.Draw(base_img)
        
        # Render each field in config
        for field in config.get("fields", []):
            field_type = field.get("type", "text")
            
            if field_type == "text":
                val_key = field.get("field", "")
                raw_text = str(record.get(val_key, ""))
                
                if not raw_text:
                    continue
                
                prefix = field.get("prefix", "")
                suffix = field.get("suffix", "")
                full_text = f"{prefix}{raw_text}{suffix}"
                
                # Transform case if specified
                transform = field.get("text_transform", "none")
                if transform == "uppercase":
                    full_text = full_text.upper()
                elif transform == "lowercase":
                    full_text = full_text.lower()
                elif transform == "title":
                    full_text = full_text.title()
                
                font_path = field.get("font_path", "fonts/Montserrat-Regular.ttf")
                font_size = field.get("font_size", 24)
                min_size = field.get("min_font_size", 14)
                max_w = field.get("max_width", 1200)
                auto_fit = field.get("auto_fit", False)
                
                if auto_fit and max_w > 0:
                    font, _ = compute_fitted_font(full_text, font_path, font_size, min_size, max_w)
                else:
                    font = get_font(font_path, font_size)
                
                # Color parsing
                color_hex = field.get("color", "#000000")
                try:
                    color_rgba = ImageColor.getrgb(color_hex)
                except Exception:
                    color_rgba = (0, 0, 0, 255)
                
                align = field.get("align", "center")
                x = field.get("x", 0)
                y = field.get("y", 0)
                
                # Pillow anchor mapping
                anchor_map = {
                    "center": "mm", # middle-middle
                    "left": "lm",   # left-middle
                    "right": "rm"   # right-middle
                }
                anchor = anchor_map.get(align, "mm")
                
                draw.text((x, y), full_text, font=font, fill=color_rgba, anchor=anchor)
                
            elif field_type == "qr_code":
                data_key = field.get("field", "verification_url")
                qr_data = str(record.get(data_key, record.get("cert_id", "")))
                
                if qr_data:
                    qr_size = field.get("size", 120)
                    fill_col = field.get("fill_color", "#000000")
                    back_col = field.get("back_color", "#ffffff")
                    
                    qr_img = QRService.generate_qr(
                        data=qr_data,
                        size=qr_size,
                        fill_color=fill_col,
                        back_color=back_col
                    )
                    
                    qx = field.get("x", 0)
                    qy = field.get("y", 0)
                    base_img.paste(qr_img, (qx, qy), qr_img)
        
        # Determine output filename
        clean_name = "".join(c for c in record.get("name", "certificate") if c.isalnum() or c in (" ", "_", "-")).rstrip()
        clean_id = record.get("cert_id", "0000")
        
        file_base = filename_pattern.replace("{name}", clean_name.replace(" ", "_")).replace("{cert_id}", clean_id)
        
        output_files = {}
        


        # Save requested formats
        if "png" in formats:
            png_path = os.path.join(output_dir, "png", f"{file_base}.png")
            os.makedirs(os.path.dirname(png_path), exist_ok=True)
            base_img.save(png_path, "PNG", optimize=True)
            output_files["png"] = png_path
            
        if "jpg" in formats or "jpeg" in formats:
            jpg_path = os.path.join(output_dir, "jpg", f"{file_base}.jpg")
            os.makedirs(os.path.dirname(jpg_path), exist_ok=True)
            rgb_img = base_img.convert("RGB")
            rgb_img.save(jpg_path, "JPEG", quality=95)
            output_files["jpg"] = jpg_path
            
        if "pdf" in formats:
            pdf_path = os.path.join(output_dir, "pdf", f"{file_base}.pdf")
            os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
            rgb_img = base_img.convert("RGB")
            rgb_img.save(pdf_path, "PDF", resolution=300.0)
            output_files["pdf"] = pdf_path
            
        return {
            "status": "success",
            "cert_id": clean_id,
            "name": record.get("name", ""),
            "files": output_files
        }
        
    except Exception as e:
        return {
            "status": "error",
            "cert_id": record.get("cert_id", "unknown"),
            "name": record.get("name", ""),
            "error": str(e)
        }

class CertificateBatchGenerator:
    def __init__(self, config_path: str, output_dir: str = "output"):
        self.config_path = config_path
        self.output_dir = output_dir
        self.config = self._load_config()
        
    def _load_config(self):
        if not os.path.exists(self.config_path):
            raise FileNotFoundError(f"Configuration file not found: {self.config_path}")
        with open(self.config_path, "r", encoding="utf-8") as f:
            return json.load(f)
            
    def generate_batch(
        self,
        records: list,
        formats: list = None,
        workers: int = None,
        filename_pattern: str = "{name}_{cert_id}",
        generate_combined_pdf: bool = True
    ):
        """
        Executes parallel batch generation for all recipient records.
        """
        if formats is None:
            formats = ["png", "pdf"]
            
        if workers is None:
            workers = os.cpu_count() or 4
            
        template_path = self.config.get("template_image", "templates/modern_gold.png")
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template image not found: {template_path}")
            
        os.makedirs(self.output_dir, exist_ok=True)
        
        print(f"\n=======================================================")
        print(f"🚀 Starting Batch Certificate Generation Pipeline")
        print(f"📋 Template: {self.config.get('name', 'Custom')} ({template_path})")
        print(f"👥 Total Recipients: {len(records)}")
        print(f"📦 Output Formats: {', '.join(formats).upper()}")
        print(f"⚡ CPU Worker Processes: {workers}")
        print(f"📁 Output Directory: {os.path.abspath(self.output_dir)}")
        print(f"=======================================================\n")
        
        start_time = time.time()
        
        tasks = [
            (rec, self.config, self.output_dir, formats, template_path, filename_pattern)
            for rec in records
        ]
        
        successful_renders = []
        errors = []
        
        # Parallel execution with tqdm progress monitoring
        with ProcessPoolExecutor(max_workers=workers) as executor:
            futures = [executor.submit(render_single_certificate, task) for task in tasks]
            
            with tqdm(total=len(tasks), desc="Generating Certificates", unit="cert") as pbar:
                for future in as_completed(futures):
                    res = future.result()
                    if res.get("status") == "success":
                        successful_renders.append(res)
                    else:
                        errors.append(res)
                    pbar.update(1)
                    
        elapsed = time.time() - start_time
        certs_per_sec = len(successful_renders) / max(elapsed, 0.001)
        
        # Optional: Generate a single consolidated Master PDF with all certificates
        combined_pdf_path = None
        if generate_combined_pdf and "pdf" in formats and successful_renders:
            print("\n📚 Generating Consolidated Master PDF for batch archive/printing...")
            try:
                from reportlab.pdfgen import canvas
                # Or gather generated single-page PDFs with PIL or pypdf
                combined_pdf_path = os.path.join(self.output_dir, "ALL_700_CERTIFICATES_MASTER.pdf")
                
                # Combine using PIL images or PDF merger
                first_img = None
                img_list = []
                for res in successful_renders:
                    png_path = res["files"].get("png")
                    if png_path and os.path.exists(png_path):
                        im = Image.open(png_path).convert("RGB")
                        if first_img is None:
                            first_img = im
                        else:
                            img_list.append(im)
                            
                if first_img:
                    first_img.save(combined_pdf_path, "PDF", resolution=150.0, save_all=True, append_images=img_list)
                    print(f"✅ Consolidated Master PDF saved: {combined_pdf_path}")
            except Exception as e:
                print(f"⚠️ Note: Master PDF compilation skipped: {e}")
        
        print("\n=======================================================")
        print(f"🎉 Pipeline Execution Finished in {elapsed:.2f}s!")
        print(f"✅ Successfully Generated: {len(successful_renders)} / {len(records)}")
        print(f"⚡ Average Speed: {certs_per_sec:.2f} certificates/sec")
        if errors:
            print(f"⚠️ Errors encountered: {len(errors)}")
            for err in errors[:5]:
                print(f"   - {err.get('name')} ({err.get('cert_id')}): {err.get('error')}")
        print(f"=======================================================\n")
        
        return {
            "total": len(records),
            "successful": len(successful_renders),
            "errors": errors,
            "elapsed_seconds": elapsed,
            "certs_per_sec": certs_per_sec,
            "combined_pdf_path": combined_pdf_path
        }
