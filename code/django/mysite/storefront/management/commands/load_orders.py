
from django.core.management.base import BaseCommand
import pandas as pd
from storefront.models import Order, Item, Customer
from datetime import datetime



class Command(BaseCommand):
    help = 'Load orders from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        # Load CSV data into a DataFrame
        df = pd.read_csv(csv_file)

        # Loop through the DataFrame and create Order objects
        for _, row in df.iterrows():
            item = Item.objects.get(itemID=row['itemID_id'])
            customer = Customer.objects.get(customerID = row['customerID_id'])
            order_date = datetime.strptime(row['orderDate'], '%m/%d/%Y').strftime('%Y-%m-%d')

            order = Order(
                itemID=item,
                quantity=row['quantity'],
                orderDate=order_date,
                orderPrice=row['orderPrice'],
                customerID=customer
            )
            order.save()  # Save the Order object to the database

        self.stdout.write(self.style.SUCCESS(f'Successfully loaded orders data from {csv_file}'))
