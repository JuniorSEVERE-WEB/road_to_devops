#!/bin/bash

mkdir test

if [ $? -eq 0 ]; then 
	echo "Dossier cree"
else
        echo "Erreur creation"
fi	
