# https://www.youtube.com/watch?v=Z1RJmh_OqeA&ab_channel=freeCodeCamp.org
# run with :
# python app.py
# or 
# FLASK_APP=app2.py python -m flask run

from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
#import test_read

import sys
sys.path.insert(0, "/home/toto/utils")
from event import read_events_where
#Add the following line to your ~/.profile file.
#export PYTHONPATH=$PYTHONPATH:/path/you/want/to/add


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Task %r>' % self.id


@app.route('/', methods=['POST', 'GET'])
def index():
    #return "hello world !! (hello !)"

    #data = test_read.eventRead("",60)
    # labels = [row[0] for row in data]
    # values = [row[1] for row in data]

    data = read_events_where("temperature",60)
    events = data["events"]
    frigo_1h_labels = [event["time"] for event in events]
    
    frigo_1h_values = []
    for event in events:
        host = event["host"]
        text = event["text"]
        id = event["id"]
        time = event["time"]
        # print(f"{id} - {text} - {time} - {host}")
        temp = float(text)
        frigo_1h_values.append(temp)

    data = read_events_where("temperature",60*10)
    events = data["events"]
    frigo_10h_values = [float(event["text"]) for event in events]
    frigo_10h_labels = [event["time"] for event in events]
    
    data = read_events_where("temperature",60*10)
    events = data["events"]
    labels10 = [event["time"] for event in events]
    values10 = [float(event["text"]) for event in events]
    
    data = read_events_where("ps4",100)

    events = data["events"]
    labels_ps4 = [event["time"] for event in events]
    values_ps4 = [1 for event in events]
    
    class MyChart:
        def __init__(self, values, labels, chart_type):
            self.values = values
            self.labels = labels
            self.chart_type = chart_type

    ps4_chart = MyChart(values_ps4,labels_ps4,"bubble") 
    frigo_1h_chart = MyChart(frigo_1h_values,frigo_1h_labels,"line") 
    frigo_10h_chart = MyChart(frigo_10h_values,frigo_10h_labels,"line") 

    return render_template("graph.html",
        # labels=labels, values=values,
        # labels2=labels2, values2=values2,
        # labels_ps4=labels_ps4, values_ps4=values_ps4,
        labels10=labels10, values10=values10,
        ps4_chart=ps4_chart,
        frigo_1h_chart=frigo_1h_chart,
        frigo_10h_chart=frigo_10h_chart)

    return
    if request.method == 'POST':
        task_content = request.form['content']
        new_task = Todo(content=task_content)

        try:
            db.session.add(new_task)
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue adding your task'

    else:
        tasks = Todo.query.order_by(Todo.date_created).all()
        return render_template('index.html', tasks=tasks)


@app.route("/hello/<name>")
def hello_there(name):
    now = datetime.now()
    formatted_now = now.strftime("%A, %d %B, %Y at %X")

    # Filter the name argument to letters only using regular expressions. URL arguments
    # can contain arbitrary text, so we restrict to safe characters only.
    match_object = re.match("[a-zA-Z]+", name)

    if match_object:
        clean_name = match_object.group(0)
    else:
        clean_name = "Friend"

    content = "Hello there, " + clean_name + "! It's " + formatted_now
    return content



@app.route('/delete/<int:id>')
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)

    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/')
    except:
        return 'There was a problem deleting that task'

@app.route('/update/<int:id>', methods=['GET', 'POST'])
def update(id):
    task = Todo.query.get_or_404(id)

    if request.method == 'POST':
        task.content = request.form['content']

        try:
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue updating your task'

    else:
        return render_template('update.html', task=task)


#app.run(host='0.0.0.0' , port=5001)

if __name__ == "__main__":
    # app.run(debug=True)


    # to be run with 
    #   python app.py 
    # and not
    #   flask run
    # to be accessible from anywhere !??
    # then
    # http://192.168.0.52:5000/

    app.run(host='0.0.0.0' , port=5000)
    #app.run(host='192.168.0.52' , port=5000)
    