#Use an offical python image
FROM python:3.12

# Prevent python from writting .pyc files
ENV PYTHONDONTWRITEBYTECODE=1

#Prevent Python output buffering
ENV PYTHONUNBUFFERED=1

# Set working directory inside container
WORKDIR /app

#Copy requirements first
COPY requirements.txt

#Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

#COPY project files
COPY ..

#Expose Django port
EXPOSE 8000

#Run Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


