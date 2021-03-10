
from django.contrib.auth.models import BaseUserManager
class CustomUserManager(BaseUserManager):
	def create_user(self, email, username, password , is_superadmin, is_admin ):
		user = self.model(email=self.normalize_email(email),username=username, is_superadmin = is_superadmin,is_admin = is_admin)
		user.set_password(password)
		user.save(using=self._db)
		return user
	def create_superuser(self,email, username, password = None):
		user = self.create_user(email= self.normalize_email(email), username= username, password= password)
		user.is_admin= True
		user.is_staff =True
		user.is_superuser = True
		user.save(using=self._db)
		return user



