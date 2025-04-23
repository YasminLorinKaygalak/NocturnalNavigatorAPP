#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Apr  4 12:57:49 2024

Name: abstraction.py

@author: Team-12

Description: Connect to API for AI tools.

"""

from gemini_api_connection import gemini_model
from gooey_api_connection import generate_animation_link


AI_test_model = gemini_model

def generate_video(dream_input):
    return generate_animation_link(dream_input)


        
        
        