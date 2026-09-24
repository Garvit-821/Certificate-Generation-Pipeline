#!/usr/bin/env python3
"""
Certificate Generation Pipeline CLI
Main entry point for batch generating certificates for 700+ recipients.
"""

import os
import sys
import argparse
import json

from pipeline.validator import DataValidator
from pipeline.generator import CertificateBatchGenerator
from pipeline.mailer import CertificateMailer

def main():
    parser = argparse.ArgumentParser(
        description="High-Performance Certificate Generation Pipeline for 700+ recipients",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    
    parser.add_argument(
        "--data", "-d",
        type=str,
        default="data/sample_recipients.csv",
        help="Path to recipients data file (.csv, .xlsx, .json)"
    )
    parser.add_argument(
        "--config", "-c",
        type=str,
        default="config/template_config.json",
        help="Path to template layout configuration JSON"
    )
    parser.add_argument(
        "--template", "-t",
        type=str,
        default=None,
        help="Override template image path in config"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default="output",
        help="Directory to save generated certificates"
    )
    parser.add_argument(
        "--format", "-f",
        type=str,
        default="pdf,png",
        help="Comma-separated output formats (pdf, png, jpg)"
    )
    parser.add_argument(
        "--workers", "-w",
        type=int,
        default=None,
        help="Number of CPU worker processes (defaults to available CPU cores)"
    )
    parser.add_argument(
        "--limit", "-n",
        type=int,
        default=None,
        help="Limit number of certificates to generate (e.g. for quick test)"
    )
    parser.add_argument(
        "--no-combined-pdf",
        action="store_true",
        help="Disable creating a single combined master PDF of all certificates"
    )
    parser.add_argument(
        "--email-dry-run",
        action="store_true",
        help="Simulate bulk email dispatch for generated certificates"
    )
    
    args = parser.parse_args()
    
    print("\n🔍 Step 1: Validating recipient data...")
    validator = DataValidator(args.data)
    try:
        records = validator.load_and_validate()
    except Exception as e:
        print(f"❌ Data Validation Error: {e}")
        sys.exit(1)
        
    summary = validator.get_summary()
    print(f"✅ Data validated successfully: {summary['valid_records_count']} records ready.")
    if summary["warnings_count"] > 0:
        print(f"⚠️ {summary['warnings_count']} warnings encountered.")
        
    if args.limit and args.limit > 0:
        records = records[:args.limit]
        print(f"ℹ️ Limiting generation to first {len(records)} records as requested.")
        
    # Prepare formats list
    formats = [fmt.strip().lower() for fmt in args.format.split(",") if fmt.strip()]
    
    # Initialize generator
    generator = CertificateBatchGenerator(args.config, output_dir=args.output)
    
    # Override template image if passed
    if args.template:
        generator.config["template_image"] = args.template
        
    # Execute batch generation
    results = generator.generate_batch(
        records=records,
        formats=formats,
        workers=args.workers,
        generate_combined_pdf=not args.no_combined_pdf
    )
    
    # Handle email dry run if requested
    if args.email_dry_run:
        mailer = CertificateMailer()
        mailer.send_batch(
            records=records,
            pdf_dir=os.path.join(args.output, "pdf"),
            dry_run=True
        )
        
    print("✨ All pipeline tasks completed successfully!")

if __name__ == "__main__":
    main()
