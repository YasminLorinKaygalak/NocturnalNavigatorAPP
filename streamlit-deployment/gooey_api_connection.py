#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Apr  4 13:07:35 2024



Name: gooey_api_connection.py

@author: Team-12

Description: Establish a connection to Gooey and use it to send/receive user input and animation link.

"""

import requests

api_key ='sk-YphiJP1mvUur1A1gQdCXB9zQNoI46UpnGB5VtbnxNA1kagZD'



def generate_animation_link(dream_input):
    #The below code is slightly modified from the source code from Gooey.ai at:
    #https://gooey.ai/animation-generator/api/?run_id=dginy85aa465&uid=QVDCBEYxX5d1xuGe7myRYxwj6NX2
    payload = {
        "animation_prompts": [
            {
                "frame": 0,
                "prompt": dream_input,
            }
        ]
    }
    response = requests.post(
        "https://api.gooey.ai/v2/DeforumSD/",
        headers={
            "Authorization": "Bearer " + api_key,
        },
        json=payload,
    )
    assert response.ok, response.content

    result = response.json()
    return result['output']['output_video']





