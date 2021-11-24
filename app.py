# https://www.youtube.com/watch?v=Z1RJmh_OqeA&ab_channel=freeCodeCamp.org
# run with :
# python app.py


from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
#import test_read
from log_event import read_events


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

    data = read_events("temperature",60)
    events = data["events"]
    labels = [event["time"] for event in events]
    values = [float(event["text"]) for event in events]
    
    # data = read_events("temperature",60*10)
    # events = data["events"]
    # labels2 = [event["time"] for event in events]
    # values2 = [float(event["text"]) for event in events]
    
    data = read_events("ps4",60*10)
    events = data["events"]
    labels2 = [event["time"] for event in events]
    values2 = [1 for event in events]
    
    return render_template("graph.html",labels=labels, values=values,labels2=labels2, values2=values2)

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
    