"""
Sample Dataset Generator for Certificate Generation Pipeline
Generates 700+ realistic recipient records with varied name lengths, roles, and verification IDs.
"""

import csv
import random
import os

FIRST_NAMES = [
    "Aarav", "Aditi", "Alexander", "Amara", "Ananya", "Benjamin", "Carlos", "Chloe",
    "Daniel", "David", "Divya", "Elena", "Emma", "Ethan", "Fatima", "Gabriel",
    "Grace", "Hassan", "Isabella", "Jack", "James", "Jasmine", "Jin", "John",
    "Kavya", "Liam", "Lucas", "Maya", "Mei", "Michael", "Mohammed", "Nathan",
    "Neha", "Noah", "Olivia", "Priya", "Rahul", "Rohan", "Samantha", "Samuel",
    "Sara", "Shreya", "Sophia", "Tariq", "Thomas", "Victoria", "William", "Yuki",
    "Zainab", "Zoe", "Dr. Alistair", "Prof. Montgomery", "Archduchess Katherine"
]

LAST_NAMES = [
    "Anderson", "Banerjee", "Chen", "Choudhury", "Davis", "Deshmukh", "Dubois", "Fernandez",
    "Garcia", "Gupta", "Hernandez", "Ibrahim", "Ivanov", "Jackson", "Jha", "Johnson",
    "Kapoor", "Kim", "Kowalski", "Kumar", "Lee", "Lopez", "Malhotra", "Martin",
    "Martinez", "Miller", "Mishra", "Muller", "Nakamura", "Patel", "Perez", "Prakash",
    "Rahman", "Rao", "Rodriguez", "Rossi", "Sato", "Schneider", "Sharma", "Silva",
    "Singh", "Smith", "Takahashi", "Taylor", "Thomas", "Vargas", "Verma", "Wang",
    "Williams", "Wilson", "Yamamoto", "Zhang", "Montgomery-Fitzgerald-Smith"
]

EVENTS = [
    "Global AI & Machine Learning Summit 2026",
    "Full-Stack Cloud Architecture Masterclass",
    "Data Science & Analytics Leadership Bootcamp",
    "Cybersecurity & Threat Intelligence Forum",
    "International Software Engineering Symposium"
]

ROLES = [
    "Participant",
    "Honors Graduate",
    "Excellence in Leadership",
    "1st Place Winner",
    "Distinguished Contributor",
    "Workshop Mentor",
    "Technical Keynote Presenter"
]

DATES = [
    "September 22, 2026",
    "October 15, 2026",
    "November 08, 2026"
]

def generate_sample_dataset(count=700, output_path="data/sample_recipients.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    random.seed(42) # Reproducible sample data
    
    rows = []
    for i in range(1, count + 1):
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        full_name = f"{first} {last}"
        
        # Add some long names periodically to test dynamic auto-fitting
        if i % 25 == 0:
            full_name = f"Dr. {first} {last}-Pembroke of Oxfordshire III"
        elif i % 50 == 0:
            full_name = f"Prof. {first} Bartholomew {last} Jr."
            
        clean_name = full_name.lower().replace(" ", ".").replace("-", "").replace("'", "").replace("dr.", "").replace("prof.", "").strip(".")
        email = f"{clean_name}{i}@example.org"
        event = random.choice(EVENTS)
        role = random.choice(ROLES)
        date = random.choice(DATES)
        cert_id = f"GEN-2026-{i:04d}"
        verification_url = f"https://verify.certgen.io/view?id={cert_id}"
        
        rows.append({
            "name": full_name,
            "email": email,
            "event": event,
            "role": role,
            "date": date,
            "cert_id": cert_id,
            "verification_url": verification_url
        })
        
    with open(output_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "email", "event", "role", "date", "cert_id", "verification_url"])
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"Successfully generated {len(rows)} sample records at '{output_path}'")
    return output_path

if __name__ == "__main__":
    generate_sample_dataset(700)
