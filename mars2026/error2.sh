#!/bin/bash

# On essaie de lister un dossier qui n'existe pas (va échouer)
ls /dossier/inexistant

# Maintenant, on vérifie le résultat de la commande 'ls'
if [ $? -eq 0 ]; then
    echo "Succès : Le dossier existe."
else
    echo "Erreur : La commande précédente a échoué."
fi
