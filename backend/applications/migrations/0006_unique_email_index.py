from django.db import migrations


class Migration(migrations.Migration):
    # Doit tourner hors transaction car CREATE INDEX CONCURRENTLY
    # ne peut pas s'exécuter dans une transaction ouverte
    atomic = False

    dependencies = [
        ('applications', '0005_unique_user_email'),
    ]

    operations = [
        migrations.RunSQL(
            sql="CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS auth_user_email_unique ON auth_user (email) WHERE email <> '';",
            reverse_sql="DROP INDEX IF EXISTS auth_user_email_unique;",
        ),
    ]
