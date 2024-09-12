#!/bin/bash

# Cargar las variables desde el archivo .env
export $(grep -v '^#' .env | xargs)

# Archivo SQL con la estructura y los datos de prueba
SQL_FILE="carrera_competition_with_seed.sql"

# Ejecutar el script SQL utilizando las variables de entorno
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS < $SQL_FILE

# Verificar si la operación fue exitosa
if [ $? -eq 0 ]; then
  echo "Base de datos inicializada correctamente con datos de prueba."
else
  echo "Ocurrió un error al inicializar la base de datos."
fi
