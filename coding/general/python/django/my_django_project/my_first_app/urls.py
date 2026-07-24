from django.urls import path
from . import views

urlpatterns = [
  path('my_first_app/', views.my_first_app, name='my_first_app'),
]
