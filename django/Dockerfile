FROM python:3.9.7

# Set environment variables
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /
RUN pip install --upgrade pip

# Install dependencies.
RUN pip install -r /requirements.txt

# Set work directory.
RUN mkdir /code
WORKDIR /code

# Copy project code.
COPY . /code/

EXPOSE 8000

#CMD ["uwsgi", "--http", ":8080", "--ini", "./uwsgi/uwsgi.ini"]
CMD python manage.py runserver 0.0.0.0:8000