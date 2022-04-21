# https://www.youtube.com/watch?v=Z1RJmh_OqeA&ab_channel=freeCodeCamp.org
# run with :
# python app.py
# or 
# FLASK_APP=app2.py python -m flask run

from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
# from datetime import datetime
import datetime
import logging
#import test_read

import sys
# sys.path.insert(0, "/home/toto/utils")
from event import read_where
from event import read_ps4
#Add the following line to your ~/.profile file.
#export PYTHONPATH=$PYTHONPATH:/path/you/want/to/add
import time

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)


def init_logger(s_level):
    """
    Usage : (in main())
    init_logger('INFO')
    logging.info("Starting main")
    """
    #logging.basicConfig(filename="logs.log", filemode="w", level=logging.DEBUG)
    # logging.basicConfig(filename="logs.log", filemode="a", \
    #     stream=sys.stdout, \
    #     format='%(asctime)s.%(msecs)03d %(levelname)s {%(module)s} [%(funcName)s] %(message)s', \
    #     datefmt='%Y-%m-%d,%H:%M:%S', level=logging.INFO)

    file_handler = logging.FileHandler(filename='logs.log')
    stdout_handler = logging.StreamHandler(sys.stdout)
    handlers = [file_handler, stdout_handler]

    levels = {
        "DEBUG": logging.DEBUG,
        "INFO": logging.INFO,
        "WARNING": logging.WARNING,
        "ERROR": logging.ERROR,
        "CRITICAL": logging.CRITICAL
    }
    logging.basicConfig(        
        level=levels.get(s_level,logging.INFO),
        #level=logging.INFO, 
        format='[%(asctime)s] {%(filename)s:%(lineno)d} %(levelname)s {%(module)s} [%(funcName)s]- %(message)s',
        handlers=handlers
    )

def shutdown_logger():
    """
    properly shutdown the logger and closes files
    """

    # handlers = logging.handlers.copy()
    # for handler in handlers:
    #     # Copied from `logging.shutdown`.
    #     try:
    #         handler.acquire()
    #         handler.flush()
    #         handler.close()
    #     except (OSError, ValueError):
    #         pass
    #     finally:
    #         handler.release()
    #     logging.removeHandler(handler) 


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return '<Task %r>' % self.id

def timenow():
    return time.time()

def today_delta_str(delta):
    dt = datetime.date.today()
    dt = dt + datetime.timedelta(days=delta)  
    dt_str = dt.strftime("%Y-%m-%d")
    return dt_str


class Elapsed_time:
    def __init__(self):
        self.mytimes = []
        self.mytimes.append(timenow())

    def elapsed_time(self, point):
        self.mytimes.append(timenow())
        i = len(self.mytimes)
        diff_secs = self.mytimes[i-1] - self.mytimes[i-2]
        msg = f'delta{i-1} {point} : {round(diff_secs,2)}'
        #print(msg)
        logging.info(msg)


@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/', methods=['POST', 'GET'])
def index():
    #return "hello world !! (hello !)"

    #data = test_read.eventRead("",60)
    # labels = [row[0] for row in data]
    # values = [row[1] for row in data]

    elaps = Elapsed_time()

    data = read_where("temperature",60,"1900-01-01")
    events = data["events"]
    frigo_1h_values = [float(event["text"]) for event in events]
    frigo_1h_labels = [event["time"] for event in events]

    elaps.elapsed_time("frigo_1h")

    data = read_where("smart_temperature",60,"1900-01-01")
    events = data["events"]
    frigo_1h_smart_values = [float(event["text"]) for event in events]
    frigo_1h_smart_labels = [event["time"] for event in events]

    elaps.elapsed_time("frigo_1h")

    data = read_where("temperature",60*10,"1900-01-01")
    events = data["events"]
    frigo_10h_values = [float(event["text"]) for event in events]
    frigo_10h_labels = [event["time"] for event in events]
    
    elaps.elapsed_time("frigo_10h")
    
    data = read_where("temperature",60*24,"1900-01-01")
    events = data["events"]
    frigo_24h_values = [float(event["text"]) for event in events]
    frigo_24h_labels = [event["time"] for event in events]
    
    elaps.elapsed_time("frigo_24h")
    
    data = read_where("pool_pH",60*10,"1900-01-01")
    events = data["events"]
    pool_pH_values = [float(event["text"]) for event in events]
    pool_pH_labels = [event["time"] for event in events]
    
    elaps.elapsed_time("pool_pH")
    
    data = read_where("pool_Cl",60*10,"1900-01-01")
    events = data["events"]
    pool_Cl_values = [float(event["text"]) for event in events]
    pool_Cl_labels = [event["time"] for event in events]
    
    elaps.elapsed_time("pool_Cl")
    
    data = read_where("power_day",60*10,"1900-01-01")
    events = data["events"]
    power_day_values = [float(event["text"]) for event in events]
    power_day_labels = [event["time"] for event in events]
    
    elaps.elapsed_time("power_day")
    
    data = read_where("power_night",60*10,"1900-01-01")
    events = data["events"]
    power_night_values = [float(event["text"]) for event in events]
    power_night_labels = [event["time"] for event in events]
    
    elaps.elapsed_time("power_night")
    
    delta = -2
    data = read_where("ps4",100,today_delta_str(delta))
    events = data["events"]
    labels_ps4 = [event["time"] for event in events]
    values_ps4 = [1 for event in events]
    
    elaps.elapsed_time("ps4")
    
    data = read_ps4(today_delta_str(delta))
    records = data["records"]
    labels_ps4_2 = [rec["date"].replace("01:00:00","12:00:00") for rec in records]
    values_ps4_2a = [rec["count"] for rec in records]
    values_ps4_2 = [rec*5 for rec in values_ps4_2a]
    
    class MyChart:
        def __init__(self, title, values, values_unit, labels, chart_type, unit):
            self.title = title
            self.values = values
            self.values_unit = values_unit
            self.labels = labels
            self.chart_type = chart_type
            self.unit = unit

    class MyChart_2_datasets:
        def __init__(self, title, 
                    values1, labels1, chart_type1, 
                    values2, labels2, chart_type2, 
                    unit):
            self.title = title
            self.values1 = values1
            self.labels1 = labels1
            self.chart_type1 = chart_type1
            self.values2 = values2
            self.labels2 = labels2
            self.chart_type2 = chart_type2
            self.unit = unit

    frigo_1h_chart = MyChart("frigo_1h", frigo_1h_values, "°C", frigo_1h_labels,"line","minute") 
    frigo_1h_smart_chart = MyChart("frigo_1h_smart", frigo_1h_smart_values, "°C", frigo_1h_smart_labels,"line","minute") 
    frigo_10h_chart = MyChart("frigo_10h", frigo_10h_values, "°C", frigo_10h_labels,"line","hour") 
    frigo_24h_chart = MyChart("frigo_24h", frigo_24h_values, "°C", frigo_24h_labels,"line","hour") 
    pool_pH_chart = MyChart("pool_pH", pool_pH_values, "Cl", pool_pH_labels,"line","hour") 
    pool_Cl_chart = MyChart("pool_Cl", pool_Cl_values, "Cl", pool_Cl_labels,"line","hour") 
    power_day_chart = MyChart("power_day", power_day_values, "Cl", power_day_labels,"line","hour") 
    power_night_chart = MyChart("power_night", power_night_values, "Cl", power_night_labels,"line","hour") 
    ps4_chart = MyChart("ps4", values_ps4, "ps4 on/off", labels_ps4,"bubble","day") 
    ps4_2_chart = MyChart("ps4_2", values_ps4_2, "minutes", labels_ps4_2,"bar","day") 
    ps4_2_datasets_chart = MyChart_2_datasets(
        "ps4_2_datasets", 
        values_ps4, labels_ps4, "bubble",
        values_ps4_2,labels_ps4_2,"bar",
        "day") 

    return render_template("graph.html",
        frigo_1h_chart=frigo_1h_chart,
        frigo_1h_smart_chart=frigo_1h_smart_chart,
        frigo_10h_chart=frigo_10h_chart,
        frigo_24h_chart=frigo_24h_chart,
        pool_pH_chart=pool_pH_chart,
        pool_Cl_chart=pool_Cl_chart,
        power_day_chart=power_day_chart,
        power_night_chart=power_night_chart,
        ps4_chart=ps4_chart,
        ps4_2_chart=ps4_2_chart,
        ps4_2_datasets_chart=ps4_2_datasets_chart
        )

    # return
    # if request.method == 'POST':
    #     task_content = request.form['content']
    #     new_task = Todo(content=task_content)

    #     try:
    #         db.session.add(new_task)
    #         db.session.commit()
    #         return redirect('/')
    #     except:
    #         return 'There was an issue adding your task'

    # else:
    #     tasks = Todo.query.order_by(Todo.date_created).all()
    #     return render_template('index.html', tasks=tasks)


@app.route("/hello/<name>")
def hello_there(name):
    # now = datetime.now()
    # formatted_now = now.strftime("%A, %d %B, %Y at %X")

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

    init_logger('INFO')
    logging.info("-----------------------------------------------------------------------------------")
    logging.info("Starting Dashboard")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True #doesn't seem to work
    app.run(host='0.0.0.0' , port=5000)
    logging.info("Ending watchdog")
    shutdown_logger()
#app.run(host='192.168.0.52' , port=5000)
    