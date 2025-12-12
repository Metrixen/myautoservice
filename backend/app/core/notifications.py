import logging
from typing import Optional

logger = logging.getLogger(__name__)


def send_sms(phone: str, message: str) -> None:
    logger.info("SMS to %s: %s", phone, message)


def send_viber(phone: str, message: str) -> None:
    logger.info("Viber to %s: %s", phone, message)


def send_email(recipient: str, subject: str, body: str) -> None:
    logger.info("Email to %s | %s | %s", recipient, subject, body)


def notify_customer_credentials(phone: str, password: str, email: Optional[str] = None) -> None:
    message = (
        "Welcome to MyAutoService! Use your phone number to log in. "
        f"Temporary password: {password}"
    )
    send_sms(phone, message)
    send_viber(phone, message)
    if email:
        send_email(
            email,
            "Your MyAutoService Login",
            f"Use {phone} to log in. Temporary password: {password}",
        )
