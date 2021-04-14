
from django.contrib.auth.models import BaseUserManager
class CustomUserManager(BaseUserManager):
	def create_user(self, email, username, password , role, created_at):
		user = self.model(email=self.normalize_email(email),username=username, role=role, created_at=created_at)
		user.set_password(password)
		user.save(using=self._db)
		return user




