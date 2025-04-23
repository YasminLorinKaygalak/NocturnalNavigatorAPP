#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Apr 21 08:58:00 2024

@author: Team-12

Description: Separate page to generate a customized dream interpretation.

"""

import streamlit as st
from abstraction import AI_test_model, generate_video
from prompts import Prompts, custom_interpretation



st.set_page_config(page_title="Custom Interpretation", page_icon="☁️")

st.sidebar.header("Customer Interpretation")


st.title('Customized Dream Interpreter')

#st.image('/gemini.png')  
        
categories = ("General","Positive","Negative","Nightmare","Success","Failure")
selected_category = st.selectbox("Select the theme for your dream interpreation:",categories,index=None,placeholder='Select theme...')



setting = st.text_input(Prompts.ask_setting())
characters = st.text_input(Prompts.ask_characters())
emotions = st.text_input(Prompts.ask_emotions())
actions = st.text_input(Prompts.ask_actions())
symbols = st.text_input(Prompts.ask_symbols())
experiences = st.text_input(Prompts.ask_experiences())
physical = st.text_input(Prompts.ask_physical())


if st.checkbox("I understand this is AI-generated and for entertainment only."):
    if st.button('Generate Dream Interpretation'):
        response = AI_test_model.generate_content(custom_interpretation(selected_category,setting,characters,emotions,actions,symbols,experiences,physical))
        st.toast('Your dream was interpreted!', icon='🫡')
        st.write(response.text)      
    
        st.download_button(
        label="Download Your Dream Interpretation",
        data= response.text ,
        file_name="dream_interpretation.txt",
        mime="text/plain"
    )
else:
    st.write('Check the box above if you want to proceed with generating an interpretation.')
      
