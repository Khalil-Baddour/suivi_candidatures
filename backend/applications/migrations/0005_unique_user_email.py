from django.db import migrations


def remove_duplicate_emails(apps, schema_editor):
    """
    Pour chaque email en doublon, on garde le compte le plus ancien
    et on supprime les autres.
    """
    User = apps.get_model('auth', 'User')
    seen = {}
    for user in User.objects.order_by('date_joined'):
        email = user.email.lower().strip() if user.email else ''
        if not email:
            continue
        if email in seen:
            user.delete()
        else:
            seen[email] = user.pk


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0004_alter_application_next_action'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.RunPython(remove_duplicate_emails, migrations.RunPython.noop),
    ]
