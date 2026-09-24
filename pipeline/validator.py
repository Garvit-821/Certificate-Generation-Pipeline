"""
Data Validator & Sanitizer for Certificate Pipeline
Handles CSV, Excel (.xlsx/.xls), and JSON datasets.
Validates required columns, sanitizes strings, and assigns unique IDs if missing.
"""

import os
import uuid
import pandas as pd

REQUIRED_FIELDS = ["name"]
DEFAULT_OPTIONAL_FIELDS = {
    "role": "Participant",
    "event": "Certificate Program 2026",
    "date": "September 2026",
    "email": ""
}

class DataValidator:
    def __init__(self, file_path):
        self.file_path = file_path
        self.raw_data = None
        self.sanitized_records = []
        self.validation_errors = []
        self.validation_warnings = []

    def load_and_validate(self):
        """Loads data file and performs sanitization & validation."""
        if not os.path.exists(self.file_path):
            raise FileNotFoundError(f"Data file not found at '{self.file_path}'")

        ext = os.path.splitext(self.file_path)[1].lower()
        if ext == ".csv":
            self.raw_data = pd.read_csv(self.file_path, dtype=str)
        elif ext in [".xlsx", ".xls"]:
            self.raw_data = pd.read_excel(self.file_path, dtype=str)
        elif ext == ".json":
            self.raw_data = pd.read_json(self.file_path, dtype=str)
        else:
            raise ValueError(f"Unsupported file format '{ext}'. Supported: .csv, .xlsx, .xls, .json")

        # Normalize column names: lowercase, strip whitespace, replace spaces with underscores
        self.raw_data.columns = [str(col).strip().lower().replace(" ", "_") for col in self.raw_data.columns]

        # Check required columns
        for req in REQUIRED_FIELDS:
            if req not in self.raw_data.columns:
                raise ValueError(f"Missing mandatory column '{req}' in {self.file_path}. Columns found: {list(self.raw_data.columns)}")

        records = self.raw_data.to_dict(orient="records")
        seen_ids = set()

        for idx, row in enumerate(records, start=1):
            sanitized_row = {}
            for k, v in row.items():
                if pd.isna(v) or v is None:
                    sanitized_row[k] = ""
                else:
                    sanitized_row[k] = str(v).strip()

            name = sanitized_row.get("name", "")
            if not name:
                self.validation_warnings.append(f"Row {idx}: Name is empty or blank. Skipped or placeholder needed.")
                continue

            # Fill optional defaults if missing
            for field, default_val in DEFAULT_OPTIONAL_FIELDS.items():
                if field not in sanitized_row or not sanitized_row[field]:
                    sanitized_row[field] = default_val

            # Generate unique cert_id if missing or duplicate
            cert_id = sanitized_row.get("cert_id", "")
            if not cert_id or cert_id in seen_ids:
                cert_id = f"CERT-{idx:04d}-{str(uuid.uuid4())[:6].upper()}"
                sanitized_row["cert_id"] = cert_id
            seen_ids.add(cert_id)

            # Generate verification URL if missing
            if not sanitized_row.get("verification_url"):
                sanitized_row["verification_url"] = f"https://verify.certgen.io/view?id={cert_id}"

            self.sanitized_records.append(sanitized_row)

        return self.sanitized_records

    def get_summary(self):
        """Returns a summary of validated records and warnings."""
        return {
            "total_rows_loaded": len(self.raw_data) if self.raw_data is not None else 0,
            "valid_records_count": len(self.sanitized_records),
            "warnings_count": len(self.validation_warnings),
            "warnings": self.validation_warnings[:10] # first 10 warnings
        }
