from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.
def my_first_app(request):
  template = loader.get_template('my_first_app.html')
  return HttpResponse(template.render())
