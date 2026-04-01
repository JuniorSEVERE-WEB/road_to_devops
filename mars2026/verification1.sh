#!/bin/bash

mkdir test

if [ $? -eq 0 ]; then
  echo "Dossier créé"
else
  echo "Erreur création"
fi
