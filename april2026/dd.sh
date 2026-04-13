#!/bin/bash

echo "Déploiement en cours..."

cd ~/mon-projet
git pull

docker-compose down
docker-compose up -d

echo "Déploiement terminé 🚀"
