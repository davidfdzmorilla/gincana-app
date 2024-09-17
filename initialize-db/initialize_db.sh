#!/bin/bash

SQL_FILE="/docker-entrypoint-initdb.d/carrera_competition_with_seed.sql"

# Ejecutar el script SQL
mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < $SQL_FILE

if [ $? -eq 0 ]; then
  echo "Base de datos inicializada correctamente con datos de prueba."
else
  echo "Ocurrió un error al inicializar la base de datos."
fi
