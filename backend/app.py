from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import altair as alt
import numpy as mp

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React

data = pd.read_csv('all_prospects.csv')
data.loc[data['POS_y'].isnull(), 'POS_y'] = data['POS_x']
data.loc[data['POS_y'].isin(['S', 'SS', 'FS']), ['POS_y', 'POS_x']] = 'S'
data.loc[data['POS_y'].isin(['ILB', 'LB']), ['POS_y', 'POS_x']] = 'LB'
data.loc[data['POS_y'].isin(['OLB', 'DE', 'EDG', 'DL']), ['POS_y', 'POS_x']] = 'EDGE'
data.loc[data['POS_y'].isin(['DT', 'Byron Young (DT)']), ['POS_y', 'POS_x']] = 'DT'
data = data[data["Broad Jump (in)"] >= 25]
data['POS_y'].value_counts()
data = data.drop(columns=['POS_x'])
data.rename(columns={'POS_y': 'POS'}, inplace=True)

@app.route("/api/scatters")
def scatters():
    round_1 = data.loc[data['Rnd'] == 1]
    round_1 = round_1.dropna(subset=['Height (in)'])
    selector = alt.selection_multi(fields=['POS'], on='click')

    condition = alt.condition(selector, alt.Color('POS:N'), alt.value('lightgray'))

    height = alt.Chart(round_1).mark_circle().encode(
        x=alt.X('Height (in)', scale=alt.Scale(domain=[60, 85])),
        y=alt.Y('Weight (lbs)', scale=alt.Scale(domain=[150, 400])),
        color=condition,
        tooltip=round_1.columns.to_list()
    ).add_selection(selector)

    jumps = alt.Chart(round_1).mark_circle().encode(
        x=alt.X('Broad Jump (in)', scale=alt.Scale(domain=[80, 160])),
        y=alt.Y('Vert Leap (in)', scale=alt.Scale(domain=[20, 50])),
        color=condition,
        tooltip=round_1.columns.to_list()
    ).add_selection(selector)

    agility = alt.Chart(round_1).mark_circle().encode(
        x=alt.X('Shuttle', scale=alt.Scale(domain=[3, 7])),
        y=alt.Y('40 Yard', scale=alt.Scale(domain=[4, 6])),
        color=condition,
        tooltip=round_1.columns.to_list()
    ).add_selection(selector)

    chart = (height | jumps | agility)
    return jsonify(message=chart.to_json())

@app.route("/api/brush")
def brush():
    brush = alt.selection_interval(name = "brush")

    scatter = alt.Chart(data).mark_circle().encode(
        x=alt.X("Weight (lbs)", type='quantitative', scale=alt.Scale(domain=(150, 400))),
        y=alt.Y("40 Yard", type='quantitative', scale=alt.Scale(domain=(4, 6))),
        color=alt.condition(brush, alt.Color('POS:N'), alt.value('grey'), legend = alt.Legend(title='Position')),
        opacity=alt.condition(brush, alt.value(0.8), alt.value(0.1)),
        tooltip=["Name", "POS", "Pick", "Weight (lbs)", "40 Yard"] 
    ).properties(
        width=500,
        height=300,
    ).add_params(brush)

    hist = alt.Chart(data).mark_bar().encode(
        x=alt.X('Rnd:O', title="Round"),
        y=alt.Y('count(Rnd):Q'),
        color = alt.Color('Rnd:N'),
    ).properties(
        width=500,
        height=300
    ).transform_filter(brush).transform_impute(
        impute='count()', key='Rnd', value=0
    )

    chart = (scatter&hist).add_params(brush)
    return jsonify(message=chart.to_json())

@app.route("/api/dataload")
def dataload():
    return jsonify(message=data.to_json(orient='records'))

if __name__ == "__main__":
    app.run(debug=True)
