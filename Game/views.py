from django.shortcuts import render
from django.views.generic import TemplateView

def home_view(request):
    # View code here...
    return render(request, 'home.html')

def main_view(request):
	# View code here...
	return render(request, 'main.html')
