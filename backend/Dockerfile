FROM python:3.11-slim

WORKDIR /app

ENV APP_ENV=production
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y git

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "\
  if [ \"$APP_ENV\" = \"development\" ]; then \
    flask run --host=0.0.0.0 --port=8000 --reload; \
  else \
    gunicorn -c gunicorn.conf.py app:app; \
  fi \
"]
