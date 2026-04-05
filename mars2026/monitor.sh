#!/bin/bash

LOG_FILE="/tmp/devops.log"
DATE=$(date)

echo "_____$DATE____"  >> $LOG_FILE

systemctl is-active ssh > /dev/null 

if [ $? -ne 0 ]; then
   echo "SSH DOWN - redemarrage..." >> $LOG_FILE
   systemctl restart ssh
else 
   echo "SSH OK" >> $LOG_FILE 
fi 

#sauvegarde d'un dossier 
tar -czf /tmp/backup.tar.gz /home 2>> $LOG_FILE 

echo "Backup termine" >> $LOG_FILE
