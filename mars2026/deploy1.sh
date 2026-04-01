#!/bin/bash

echo "Déploiement en cours..."

cd ~/projects/road_to_devops/mars2026
git pull

docker-compose down
docker-compose up -d

echo "Déploiement terminé 🚀"
