#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Apr 21 08:57:48 2024

@author: Team-12

Description: Separate page to generate a simple animation relating to the user's dream.

"""

import streamlit as st
from abstraction import AI_test_model, generate_video


#Page configuration
st.set_page_config(page_title="Animation Generation", page_icon="📹")
st.sidebar.header("Animation generation")
st.title('Dream Animation Generator')

 

#WARNING: Do not run the generate animation function since we only get 30 tries for free.
user_animation_input=st.text_input("Enter a scene from your dream:")
if st.button('Generate Dream Animation'):
    st.write('Animation Link:' + generate_video(user_animation_input))
    # pass
else:
    st.write('Dream animation pending')