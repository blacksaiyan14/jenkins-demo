# Étape 1 : Build des dépendances
FROM python:3.13-slim AS builder

WORKDIR /app
COPY requirements.txt .

# Installation des dépendances dans un virtualenv isolé
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Étape 2 : Image finale minimaliste
FROM python:3.13-slim

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

# Configuration utilisateur non-root
RUN adduser --disabled-password --gecos "" appuser && \
    mkdir -p /app && \
    chown appuser:appuser /app

WORKDIR /app

# Copie des fichiers depuis l'étape builder
COPY --from=builder /opt/venv /opt/venv
COPY --chown=appuser:appuser . /app/

USER appuser

# Commande Gunicorn avec configuration optimisée
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--threads", "2", "odc.wsgi:application"]