import secrets
import string
from django.core.mail import EmailMessage
# secure password
password = ''.join((secrets.choice(string.ascii_letters + string.digits + string.punctuation) for i in range(8)))
print(password)

# nous avons maintenant password, username et email
# je vais envoyer un email contenant un lien

email = 'ahmed.belaiba@redlean.io'
email_subject = 'Création de mot de passe'
email_body = 'Test body'
email = EmailMessage(
    email_subject,
    email_body,
    'ahmedbelaiba19952018@gmail.com',
    [email],
)
email.send(fail_silently=False)
