#!/bin/bash
read -p "Entrez un nombre: " n

if [ $n -gt 10 ]; then
  echo "Grand nombre"
else
  echo "Petit nombre"
fi
