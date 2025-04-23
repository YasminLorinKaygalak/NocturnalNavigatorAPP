#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Apr  4 13:08:19 2024

Name: prompts.py

@author: Team-12

Description: Gather information from user.

"""
class Prompts:     
    def ask_setting():
        return "Where did the dream take place?"
    def ask_characters():
        return "Who were the characters in the dream? Was there anyone that you liked or disliked?"

    def ask_emotions():
        return "What emotions did you experience in the dream or when you woke up? "

    def ask_actions():
        return "What were you doing in the dream?"
    
    def ask_symbols():
        return "Where there and objects or symbols that stood out to you?"
    
    def ask_experiences():
        return "Was the dream familiar or related to any real life experiences?"
    
    def ask_physical():
        return "Did you feel anything physically during / after the dream?"
    
def custom_interpretation(theme,setting,chars,emotions,acts,symbols,exps,phy):
    
    return f"Please interpret a dream that consists of the following information: Theme: {theme}, Setting: {setting}, Characters: {chars}, Emotions: {emotions}, Acts: {acts},Symbols:{symbols}, Experiences:{exps}, Physical{phy}"
    
   
#Test
# print(custom_interpretation('negative','town','parents and siblings','sad','riding a bike','bicycle','going up a hill'))