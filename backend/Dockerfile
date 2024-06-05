# Use the official Python image as the base image
FROM python:3.9

# Set the working directory inside the container
WORKDIR /code

# Set environment variables
ENV TRANSFORMERS_CACHE /code/.cache/huggingface

# Create necessary directories and grant permissions
RUN mkdir -p /code/.cache/huggingface && \
    chmod -R 777 /code

# Copy the requirements file into the container at /code
COPY ./requirements.txt /code/requirements.txt

# Install the required Python packages
RUN pip install --no-cache-dir --upgrade -r requirements.txt && \
    python -m spacy download en_core_web_sm

# Copy the entire current directory into the container at /code
COPY . .

# Expose port 7860 to the outside world
EXPOSE 7860

# Command to run the Flask application
CMD ["python", "app.py"]
