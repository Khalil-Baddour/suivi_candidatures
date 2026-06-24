import csv
import os
from django.core.management.base import BaseCommand
from applications.models import City


class Command(BaseCommand):
    help = "Load cities from communes-france-2025.csv if the table is empty"

    def handle(self, *args, **kwargs):
        if City.objects.exists():
            self.stdout.write("Cities already loaded, skipping.")
            return

        csv_path = os.path.join(os.path.dirname(__file__), "../../../assets/communes-france-2025.csv")
        csv_path = os.path.abspath(csv_path)

        if not os.path.exists(csv_path):
            self.stderr.write(f"CSV file not found: {csv_path}")
            return

        cities = []
        with open(csv_path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                cities.append(City(
                    nom_standard=row["nom_standard"],
                    nom_sans_pronom=row["nom_sans_pronom"],
                    nom_sans_accent=row["nom_sans_accent"],
                    nom_standard_majuscule=row["nom_standard_majuscule"],
                    reg_nom=row["reg_nom"],
                ))

        City.objects.bulk_create(cities, batch_size=1000)
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(cities)} cities."))
