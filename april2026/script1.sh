#!/bin/bash 

mkdir test1

if [ $? -eq 0 ]; then 
	echo "Dossier cree"
else 
        echo "Erreur de creation"
fi 	
