import smtplib
import getpass
import os
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

def send_email():
    print("=" * 60)
    print("  📧 Direct Gmail SMTP Mail Sender")
    print("=" * 60)
    
    sender_email = "artistvoice4@gmail.com"
    receiver_email = "amanchandel6395@gmail.com"
    
    print(f"From : {sender_email}")
    print(f"To   : {receiver_email}")
    print("-" * 60)
    
    # Subject
    default_subject = "CRETA MEDIA — Project Files & Virtual Studio Update"
    sub_input = input(f"Enter Subject [Press Enter for default: '{default_subject}']:\n> ").strip()
    subject = sub_input if sub_input else default_subject

    # Body
    print("\nEnter message body (Press Enter twice or finish with Ctrl+Z / Enter):")
    lines = []
    while True:
        try:
            line = input()
            if not line and lines and lines[-1] == "":
                break
            lines.append(line)
        except EOFError:
            break
    
    body = "\n".join(lines).strip()
    if not body:
        body = (
            "Hi Aman,\n\n"
            "This is an automated delivery confirmation for the CRETA MEDIA project.\n"
            "The photorealistic virtual studio is fully operational and packaged.\n\n"
            "Best regards,\n"
            "Artist Voice / CRETA MEDIA Team"
        )
        print("\nUsing default body message.")

    # Optional Attachment
    attach_path = input("\nEnter attachment file path (optional, press Enter to skip):\n> ").strip().strip('"').strip("'")

    # App Password input
    print("\n" + "-" * 60)
    print("NOTE: Gmail requires a 16-character 'App Password' (not your normal password).")
    print("Get it at: https://myaccount.google.com/apppasswords")
    print("-" * 60)
    app_password = getpass.getpass("Enter your 16-character Google App Password (hidden): ").strip().replace(" ", "")

    if not app_password:
        print("❌ Error: App Password cannot be empty.")
        return

    # Create message
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    # Attach file if provided
    if attach_path and os.path.isfile(attach_path):
        try:
            filename = os.path.basename(attach_path)
            with open(attach_path, "rb") as f:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f"attachment; filename= {filename}")
            msg.attach(part)
            print(f"📎 Attached file: {filename}")
        except Exception as e:
            print(f"⚠️ Warning: Could not attach file: {e}")

    # Send via SMTP SSL
    print("\nConnecting to smtp.gmail.com:465 ...")
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.send_message(msg)
        print("\n" + "=" * 60)
        print(f"✅ SUCCESS! Email sent successfully to {receiver_email}")
        print("=" * 60)
    except smtplib.SMTPAuthenticationError:
        print("\n❌ Authentication Failed!")
        print("Reasons:")
        print("1. The 16-character Google App Password was incorrect.")
        print("2. 2-Step Verification is not enabled on artistvoice4@gmail.com.")
        print("Fix: Go to https://myaccount.google.com/apppasswords and create an App Password.")
    except Exception as e:
        print(f"\n❌ Failed to send email: {e}")

if __name__ == "__main__":
    send_email()
