"""
Automated Bulk Email Dispatcher for Certificate Delivery
Supports personalized HTML/plain-text email templates, PDF attachments, and dry-run testing.
"""

import os
import smtplib
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

class CertificateMailer:
    def __init__(
        self,
        smtp_host: str = "smtp.gmail.com",
        smtp_port: int = 587,
        sender_email: str = "",
        sender_password: str = "",
        sender_name: str = "Genesis Certificate Authority"
    ):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.sender_email = sender_email
        self.sender_password = sender_password
        self.sender_name = sender_name

    def send_batch(
        self,
        records: list,
        pdf_dir: str = "output/pdf",
        subject_template: str = "Your Certificate for {event}",
        body_template: str = None,
        dry_run: bool = True,
        rate_limit_delay: float = 0.5
    ):
        """
        Sends certificates in batch via SMTP.
        If dry_run=True, tests and prints simulation logs without establishing live connections.
        """
        if body_template is None:
            body_template = """
Dear {name},

Congratulations! Please find attached your official Certificate of Achievement for {event}.

Certificate ID: {cert_id}
Verification URL: {verification_url}

Thank you for your active participation and commitment.

Best regards,
{sender_name}
"""

        print(f"\n📨 {'[DRY RUN] ' if dry_run else ''}Starting Bulk Email Dispatcher ({len(records)} recipients)...")
        
        sent_count = 0
        failed_count = 0

        server = None
        if not dry_run:
            if not self.sender_email or not self.sender_password:
                raise ValueError("Sender email and password are required for live email dispatch.")
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            server.starttls()
            server.login(self.sender_email, self.sender_password)

        try:
            for idx, rec in enumerate(records, start=1):
                recipient_email = rec.get("email")
                recipient_name = rec.get("name", "Recipient")
                cert_id = rec.get("cert_id", "")
                event = rec.get("event", "Program")
                
                if not recipient_email or "@" not in recipient_email:
                    print(f"[{idx}/{len(records)}] ⚠️ Skipping {recipient_name} - invalid or missing email.")
                    failed_count += 1
                    continue

                subject = subject_template.format(name=recipient_name, event=event, cert_id=cert_id)
                body = body_template.format(
                    name=recipient_name,
                    event=event,
                    role=rec.get("role", ""),
                    date=rec.get("date", ""),
                    cert_id=cert_id,
                    verification_url=rec.get("verification_url", ""),
                    sender_name=self.sender_name
                )

                # Locate PDF attachment
                clean_name = "".join(c for c in recipient_name if c.isalnum() or c in (" ", "_", "-")).rstrip().replace(" ", "_")
                pdf_filename = f"{clean_name}_{cert_id}.pdf"
                pdf_path = os.path.join(pdf_dir, pdf_filename)

                if dry_run:
                    print(f"[{idx}/{len(records)}] 🧪 DRY RUN: Would email {recipient_email} | Subject: '{subject}' | Attachment: {pdf_filename} (Exists: {os.path.exists(pdf_path)})")
                    sent_count += 1
                    time.sleep(0.01) # fast simulation
                    continue

                # Prepare MIME message
                msg = MIMEMultipart()
                msg["From"] = f"{self.sender_name} <{self.sender_email}>"
                msg["To"] = recipient_email
                msg["Subject"] = subject
                msg.attach(MIMEText(body, "plain"))

                if os.path.exists(pdf_path):
                    with open(pdf_path, "rb") as f:
                        part = MIMEBase("application", "octet-stream")
                        part.set_payload(f.read())
                    encoders.encode_base64(part)
                    part.add_header("Content-Disposition", f"attachment; filename={pdf_filename}")
                    msg.attach(part)
                else:
                    print(f"⚠️ Warning: Attachment {pdf_path} not found for {recipient_name}")

                try:
                    server.send_message(msg)
                    print(f"[{idx}/{len(records)}] ✅ Sent to {recipient_email}")
                    sent_count += 1
                    time.sleep(rate_limit_delay)
                except Exception as e:
                    print(f"[{idx}/{len(records)}] ❌ Failed sending to {recipient_email}: {e}")
                    failed_count += 1

        finally:
            if server:
                server.quit()

        print(f"\n🏁 Email Dispatch Summary: {sent_count} sent successfully, {failed_count} failed.")
        return {"sent": sent_count, "failed": failed_count}
