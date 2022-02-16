
from django.contrib.auth.models import BaseUserManager
class CustomUserManager(BaseUserManager):
	def create_user(self, email, username, password , role, created_at, reports_id, canUpdateCapacity):
		user = self.model(email=self.normalize_email(email),username=username, role=role, created_at=created_at, reports_id=reports_id, canUpdateCapacity=canUpdateCapacity)
		user.set_password(password)
		user.save(using=self._db)
		return user




