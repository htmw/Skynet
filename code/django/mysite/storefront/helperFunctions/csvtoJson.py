import csv
import json
from django.core.management import call_command

import sys
import os

from ..models import *


def csv_to_json() :
    csv_file_path = '../order.csv'
    json_file_path = '../order.json'
    fixture_file_path = '../order_fixture.json'

    
    # Open CSV file 
    with open(csv_file_path, 'r',encoding='utf-8-sig') as csv_file:
        reader = csv.DictReader(csv_file) #creates a dictionarty with column headers as keys
        data = list(reader)


    # create/open a json file and write to it
    with open(json_file_path, 'w') as json_file:
        json.dump(data, json_file)

    #to be able to use loaddata, django requires a fixture file, so third step is convert the json to a fixture
    with open(fixture_file_path, 'w') as fixture_file:
        call_command('dumpdata',Order,stdout=fixture_file)

    print(f'Successfully converted to JSON. JSON file created: {fixture_file_path}')


#csv_to_json()
   