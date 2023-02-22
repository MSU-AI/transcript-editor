from django import forms
from .models import UserUpload

class VideoForm(forms.ModelForm):
    class Meta:
        model= UserUpload
        fields= '__all__'