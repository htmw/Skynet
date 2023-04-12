# imports to deal with CSRF security
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token

# for HTTP requests/responses
from django.http import *

import requests
import json
from datetime import datetime

from rest_framework.response import Response
from rest_framework.request import Request




#tracking functions

def get_ups_tracking_info(response, tracking_number):
    trans_id = '12345'
    transaction_src = 'Skynet Capstone'
    access_license_number = '0DD15E0D975760E1'

    url = f'https://wwwcie.ups.com/track/v1/details/{tracking_number}'
    headers = {
        'transID': trans_id,
        'transactionSrc': transaction_src,
        'AccessLicenseNumber': access_license_number
    }

    response = requests.get(url, headers=headers)
    json_response = json.loads(response.content)
    status_descriptions = []
    for activity in json_response['trackResponse']['shipment'][0]['package'][0]['activity']:
        status = activity['status']['description']
        date = datetime.strptime(activity['date'], '%Y%m%d').date()
        time = datetime.strptime(activity['time'], '%H%M%S').time()
        status_descriptions.append(f'Status: {status.rstrip()}: Date: {date} at {time}')

    pretty_response = json.dumps(status_descriptions, indent=4)
    print(HttpResponse(pretty_response, content_type="application/json"))

    return HttpResponse(pretty_response, content_type="application/json")


#test function to veiw the JSON response format
def test_ups_tracking_info(response):
    tracking_number = "1Z1442YY7229014688"
    trans_id = '12345'
    transaction_src = 'Skynet Capstone'
    access_license_number = '0DD15E0D975760E1'

    url = f'https://wwwcie.ups.com/track/v1/details/{tracking_number}?locale=en_US'
    #url = f'https://onlinetools.ups.com/track/v1/details/{tracking_number}?locale=en_US'
    #url = f'https://wwwcie.ups.com/track/v1/details/1Z5338FF0107231059'
    headers = {
        'transID': trans_id,
        'transactionSrc': transaction_src,
        'AccessLicenseNumber': access_license_number,
        'Content-Type': 'application/json',
        'Accept': 'application/json',

    }

    response = requests.get(url, headers=headers)
    json_response = response.json()
    return JsonResponse(json_response)

    json_response = json.loads(response.content) #create python object to store the JSON response for iterating
    status_descriptions = []
    for activity in json_response['trackResponse']['shipment'][0]['package'][0]['activity']:
        status = activity['status']['description']
        date = datetime.strptime(activity['date'], '%Y%m%d')
        time = datetime.strptime(activity['time'], '%H%M%S')
        status_descriptions.append(f'Status: {status.rstrip()}: Date: {date} at {time}')

    pretty_response = json.dumps(status_descriptions, indent=4)
    #pretty_response = json.dumps(json_response, indent=4)


    print(HttpResponse(pretty_response, content_type="application/json"))

    return HttpResponse(pretty_response, content_type="application/json")


@csrf_exempt
def address_verify_UPS(request):
    access_license_number = '0DD15E0D975760E1'
    username = 'TeamSkynet2022'
    password = 'Terminator123'

    
    if request.method == 'POST':
        body = json.loads(request.body)
        streetNumber = body.get('streetNumber')
        city = body.get('city')
        state = body.get('state')
        zip = body.get('zipCode')
        full_address = f'{streetNumber}, {city}, {state}, {zip}'


        #send request to UPS API
        baseURL = 'https://wwwcie.ups.com/addressvalidation/v1/1'
        headers = {
            'AccessLicenseNumber' : access_license_number,
            'Content-Type': 'application/json',
            'Username': username,
            'Password': password,
          }    
        data = {
            "XAVRequest": {
                "AddressKeyFormat": {
                    "AddressLine": [streetNumber],
                "PoliticalDivision2": city,
                "PoliticalDivision1": state,
                "PostcodePrimaryLow": zip,
                "CountryCode": "US"
        }
      }
    }


        response = requests.post(baseURL, headers=headers, json=data)
        json_response_dict = json.loads(response.content)

        #check the response for the nested ValidAddressIndicator flag
        if 'XAVResponse' in json_response_dict:
            validCheck = json_response_dict["XAVResponse"].get("ValidAddressIndicator")
            #check next level
            if validCheck == "":
                valid_response_dict = {"verification_status": "valid"}
                verification_status = JsonResponse(valid_response_dict)
                return verification_status
            else:
                valid_response_dict = {"verification_status": "failure"}
                verification_status = JsonResponse(valid_response_dict)
            return verification_status
        else:
            valid_response_dict = {"verification_status": "error"}
            verification_status = JsonResponse(valid_response_dict)



def addressTest(response):
    access_license_number = '0DD15E0D975760E1'
    username = 'TeamSkynet2022'
    password = 'Terminator123'

    streetNumber = "One Pace Plaza"
    city = "New York"
    state = "NY"
    zip = "10038"

    #send request to UPS API
    baseURL = 'https://onlinetools.ups.com/addressvalidation/v1/1?regionalrequestindicator=true'
    headers = {
        'AccessLicenseNumber' : access_license_number,
        'Content-Type': 'application/json',
        'Username': username,
        'Password': password,
      }
    data = {
      "XAVRequest": {
        "AddressKeyFormat": {
          "AddressLine":  [streetNumber],
        "PoliticalDivision2": city,
        "PoliticalDivision1": state,
        "PostcodePrimaryLow": zip,
        "CountryCode": "US"
        }
      }
    }
    response = requests.post(baseURL, headers=headers, json=data)
    json_response = response.json() #parse JSON from response(response is a python object)
    #new strategy, change json response ot python dictionary
    json_response_dict = json.loads(response.content)

    #check the response for the nested ValidAddressIndicator flag
    if 'XAVResponse' in json_response_dict:
        validCheck = json_response_dict["XAVResponse"].get("ValidAddressIndicator")
        #check next level
        if validCheck == "":
            valid_response_dict = {"verification_status": "valid"}
            verification_status = JsonResponse(valid_response_dict)
            return verification_status
        else:
            valid_response_dict = {"verification_status": "failure"}
            verification_status = JsonResponse(valid_response_dict)
            return verification_status





     
                   


  
    




 
     


