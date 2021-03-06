#!/usr/bin/python
#-*- coding: utf-8 -*-
from flask import Flask, request, session, g, redirect, url_for, abort, \
             render_template, flash, jsonify

app = Flask(__name__)
app.config.update(dict(
    DEBUG=True,
    SECRET_KEY='aikorea',
    HOST='0.0.0.0',
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

@app.route('/')
def list():
    return render_template('papers.html')

@app.route('/papers.json', methods=['GET', 'POST'])
def search():
    papers = [
        {'title' : 'aikorea', 'year' : 2014}, 
        {'title' : 'google', 'year' : 2013}, 
        {'title' : 'deep learning', 'year' : 2012}, 
    ]*100

    if request.method == 'POST':
        query = request.form['query']
        year = request.form['year']

        if query:
            papers = [item for item in papers if query in item['title']]
        if year:
            year = int(year)
            papers = [item for item in papers if year == int(item['year'])]

    data = {'papers': papers}

    return jsonify(**data)

if __name__ == '__main__':
    app.run()
