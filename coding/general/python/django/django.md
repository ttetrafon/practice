https://www.w3schools.com/django/django_getstarted.php

* Django receives the URL, checks the urls.py file, and calls the view that matches the URL.
* The view, located in views.py, checks for relevant models.
* The models are imported from the models.py file.
* The view then sends the data to a specified template in the template folder.
* The template contains HTML and Django tags, and with the data it returns finished HTML content back to the browser.

# Create a Project

* (create a virtual environment)
* Install django: `pip install django`
* Create a project: `django-admin startproject my_project`
  * This will create the basic structure inside a folder named `my_project`.
* Start the server with `python ./my_project/manage.py runserver`

# Apps

* An app is a single entity in the project.
* To create an app, navigate into the project folder and run `python ./manapge.py startapp my_first_app`.

## Views

* A view is a python function that takes http requests and returns a response.
* To direct to a view, a path must be defined in the `urls.py` file (same folder with `views.py`).

### Templates

* A response can be an **html template**.
  * Create a `templates` folder inside the app folder, and in there an html file to operate as the template.

https://www.w3schools.com/django/django_templates.php