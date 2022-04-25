# https://www.youtube.com/watch?v=Z1RJmh_OqeA&ab_channel=freeCodeCamp.org
# run with :
# python app.py
# or
# FLASK_APP=app2.py python -m flask run
# if error "OSError: [Errno 98] Address already in use":
# ps -aux |grep "flask run"
# kill <process>
"""
test
"""
import datetime
import logging
import time
import sys

from scipy.signal import savgol_filter

from utils import diff_date_secs

from flask import Flask, render_template  # , url_for, request, redirect
# from flask_sqlalchemy import SQLAlchemy
# from datetime import datetime
# sys.path.insert(0, "/home/toto/utils")
from event import read_where
from event import read_ps4
# Add the following line to your ~/.profile file.
# export PYTHONPATH=$PYTHONPATH:/path/you/want/to/add

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
# db = SQLAlchemy(app)


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
        level=levels.get(s_level, logging.INFO),
        # level=logging.INFO,
        format='[%(asctime)s] {%(filename)s:%(lineno)d} ' +
        '%(levelname)s {%(module)s} [%(funcName)s]- %(message)s',
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


# class Todo(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     content = db.Column(db.String(200), nullable=False)
#     date_created = db.Column(db.DateTime, default=datetime.datetime.utcnow)

#     def __repr__(self):
#         return '<Task %r>' % self.id

def timenow():
    """
    return ?????
    """
    return time.time()


def today_delta_str(delta):
    """
    return today as a string like "2022-04-24
    """

    date_time = datetime.date.today()
    date_time = date_time + datetime.timedelta(days=delta)
    dt_str = date_time.strftime("%Y-%m-%d")
    return dt_str


def remove_duplicates(events):
    """
    remove from the array of events those ones for which the preceding events had
    exactly the same value
    """
    new_events = []
    prev_event = events[0]
    new_events.append(prev_event)
    for event in events:
        if event["text"] != prev_event["text"]:
            new_events.append(event)
            prev_event = event
    # make sure the last value is always present, even if same value as preceding one
    new_events.append(events[-1])

    return new_events


def average_events(events):
    """
    convert events giving value at a given moment to events (i.e (label,value))
    giving the average value during the whole period
    events like
        [{"10:00",5},
         {"11:00",6},
         {"13:00",8},
         {"15:00",9}
         ]
    will be converted in
        [{"10:00",5.5},{"11:00",5.5},
         {"11:00",7},{"13:00",7},
         {"13:00",8.25},{"15",8.25}
        ]
    """
    i = 0
    values = []
    labels = []
    for event in events:
        if i != 0:
            # ...

            value1 = float(prev_event["text"])
            value2 = float(event["text"])
            time1 = prev_event["time"]
            time2 = event["time"]

            # the last event might be the same as the preceding one,
            # in which case there is no delta
            if time1 != time2:
                delta_kwh = value2 - value1
                delta_date_secs = diff_date_secs(time1, time2)
                # print(delta_date_secs)
                if delta_date_secs == 0:
                    print("!!!!!!!!!!!!!!!!!!!!!! ooops !")
                kwh_per_h = delta_kwh / (delta_date_secs/3600)
                # replacing initial events by 2 events starting at the beginning and end of the
                # period and with a value of the average consumption in kwh during that period
                values.append(kwh_per_h)
                labels.append(time1)
                values.append(kwh_per_h)
                labels.append(time2)

        prev_event = event
        i += 1

    return values, labels


class ElapsedTime:
    """
    class to help manage elapsed time
    """

    def __init__(self):
        self.mytimes = []
        self.mytimes.append(timenow())

    def elapsed_time(self, point):
        """
        missing desc
        """
        self.mytimes.append(timenow())
        i = len(self.mytimes)
        diff_secs = self.mytimes[i-1] - self.mytimes[i-2]
        msg = f'delta{i-1} {point} : {round(diff_secs,2)}'
        # print(msg)
        logging.info(msg)


def smoothen(myarray):
    """
    smoothen the values of the passed array to smoothen the curve
    """
    smoothened_array = savgol_filter(myarray, 50, 3)
    return smoothened_array.tolist()


@app.route('/about')
def about():
    """
    rendering the about page
    """
    return render_template("about.html")


@app.route('/samples')
def samples():
    """
    rendering the samples page
    """
    return render_template("samples.html")


@app.route('/', methods=['POST', 'GET'])
def index():
    """
    rendering the index page
    """
    # return "hello world !! (hello !)"

    #data = test_read.eventRead("",60)
    # labels = [row[0] for row in data]
    # values = [row[1] for row in data]

    elaps = ElapsedTime()

    data = read_where("temperature", 60, "1900-01-01")
    events = data["events"]
    frigo_1h_values = [float(event["text"]) for event in events]
    frigo_1h_labels = [event["time"] for event in events]

    elaps.elapsed_time("frigo_1h")

    data = read_where("smart_temperature", 60, "1900-01-01")
    events = data["events"]
    frigo_1h_smart_values = [float(event["text"]) for event in events]
    frigo_1h_smart_labels = [event["time"] for event in events]

    elaps.elapsed_time("frigo_1h")

    data = read_where("temperature", 60*10, "1900-01-01")
    events = data["events"]
    frigo_10h_values = [float(event["text"]) for event in events]
    frigo_10h_labels = [event["time"] for event in events]

    elaps.elapsed_time("frigo_10h")

    data = read_where("temperature", 60*24, "1900-01-01")
    events = data["events"]
    frigo_24h_values = [float(event["text"]) for event in events]
    frigo_24h_labels = [event["time"] for event in events]

    elaps.elapsed_time("frigo_24h")

    data = read_where("pool_pH", 60*10, "1900-01-01")
    events = data["events"]
    pool_ph_values = [float(event["text"]) for event in events]
    pool_ph_labels = [event["time"] for event in events]

    elaps.elapsed_time("pool_pH")

    data = read_where("pool_Cl", 60*10, "1900-01-01")
    events = data["events"]
    pool_cl_values = [float(event["text"]) for event in events]
    pool_cl_labels = [event["time"] for event in events]

    elaps.elapsed_time("pool_Cl")

    data = read_where("power_day", 60*10, "1900-01-01")
    events = data["events"]
    events = remove_duplicates(events)
    power_day_values = [float(event["text"]) for event in events]
    power_day_labels = [event["time"] for event in events]

    power_day_values = smoothen(power_day_values)

    elaps.elapsed_time("power_day")

    data = read_where("power_day", 60*10, "1900-01-01")
    events = data["events"]
    events = remove_duplicates(events)

    # power_day_delta_values = [float(event["text"]) for event in events]
    # values = [float(event["text"]) for event in events]
    # prev_value = values[0]
    # delta_values = []
    # for value in values:
    #     delta_values.append(value - prev_value)
    #     prev_value = value

    # power_day_delta_values = delta_values
    # power_day_delta_labels = [event["time"] for event in events]

    # ---------------

    power_day_delta_values, power_day_delta_labels = average_events(events)

    power_day_delta_values = smoothen(power_day_delta_values)



    elaps.elapsed_time("power_day_delta")

    data = read_where("power_night", 60*10, "1900-01-01")
    events = data["events"]
    power_night_values = [float(event["text"]) for event in events]
    power_night_labels = [event["time"] for event in events]

    elaps.elapsed_time("power_night")

    data = read_where("power_night", 60*10, "1900-01-01")
    events = data["events"]
    events = remove_duplicates(events)

    # # power_night_delta_values = [float(event["text"]) for event in events]
    # # values = [float(event["text"]) for event in events]
    # # prev_value = values[0]
    # # delta_values = []
    # # for value in values:
    # #     delta_values.append(value - prev_value)
    # #     prev_value = value
    # # power_night_delta_values = delta_values
    # # power_night_delta_labels = [event["time"] for event in events]

    # #---------------
    # i=0
    # values = []
    # labels = []
    # for event in events:
    #     if i !=0:
    #         #...
    #         value1 = float(prev_event["text"])
    #         value2 = float(event["text"])
    #         time1 = prev_event["time"]
    #         time2 = event["time"]
    #         delta_kwh = value2 - value1
    #         delta_date_secs = diff_date_secs(time1, time2)
    #         kwh_per_h = delta_kwh / (delta_date_secs/3600)
    #         #replacing initial events by 2 events starting at the beginning and end of the
    #         #period and with a value of the average consumption in kwh during that period
    #         values.append(kwh_per_h)
    #         labels.append(time1)
    #         values.append(kwh_per_h)
    #         labels.append(time2)

    #     prev_event = event
    #     i +=1
    # power_night_delta_values = values
    # power_night_delta_labels = labels

    power_night_delta_values, power_night_delta_labels = average_events(events)

    elaps.elapsed_time("power_night_delta")

    delta = -2
    data = read_where("ps4", 100, today_delta_str(delta))
    events = data["events"]
    labels_ps4 = [event["time"] for event in events]
    values_ps4 = [1 for event in events]

    elaps.elapsed_time("ps4")

    data = read_ps4(today_delta_str(delta))
    records = data["records"]
    labels_ps4_2 = [rec["date"].replace(
        "01:00:00", "12:00:00") for rec in records]
    values_ps4_2a = [rec["count"] for rec in records]
    values_ps4_2 = [rec*5 for rec in values_ps4_2a]

    class MyChartValues:
        """
        this class is just there to create an object containing all the parameters of a given chart,
        which will be handy to pass in one go all those values as an objects to the javascript
        that will need to process all those values
        """

        def __init__(self, title, values, values_unit, labels, chart_type, unit, label):
            self.title = title
            self.values = values
            self.values_unit = values_unit
            self.labels = labels
            self.chart_type = chart_type
            self.unit = unit
            self.label = label

    class MyChartValues2:
        """
        MyChartValues2 desc
        """

        def __init__(self, title, values1, values2, values_unit, labels1, labels2,
                     chart_type, unit, label):
            self.title = title
            self.values1 = values1
            self.values2 = values2
            self.values_unit = values_unit
            self.labels1 = labels1
            self.labels2 = labels2
            self.chart_type = chart_type
            self.unit = unit
            self.label = label

    class MyChartValues2Datasets:
        """
        MyChartValues2Datasets desc
        """

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

    frigo_1h_chart = MyChartValues(
        "frigo_1h", frigo_1h_values, "°C", frigo_1h_labels, "line", "minute", "temperature")
    frigo_1h_smart_chart = MyChartValues(
        "frigo_1h_smart", frigo_1h_smart_values, "°C", frigo_1h_smart_labels,
        "line", "minute", "temperature")
    frigo_10h_chart = MyChartValues(
        "frigo_10h", frigo_10h_values, "°C", frigo_10h_labels, "line", "hour", "temperature")
    frigo_24h_chart = MyChartValues(
        "frigo_24h", frigo_24h_values, "°C", frigo_24h_labels, "line", "hour", "temperature")
    pool_ph_chart = MyChartValues(
        "pool_ph", pool_ph_values, "pH", pool_ph_labels, "line", "hour", "pH")
    pool_cl_chart = MyChartValues(
        "pool_cl", pool_cl_values, "Cl", pool_cl_labels, "line", "hour", "Cl")
    power_chart = MyChartValues2Datasets(
        "power_2_datasets",
        power_day_values, power_day_labels, "line",
        power_night_values, power_night_labels, "line",
        "hour")
    power_chart = MyChartValues2(
        "power day/night", power_day_values, power_night_values, "KwH", power_day_labels,
        power_night_labels, "line", "hour", "KwH day/night")
    power_day_chart = MyChartValues(
        "power_day", power_day_values, "KwH", power_day_labels, "line", "hour", "KwH day")
    power_day_delta_chart = MyChartValues(
        "power_day_delta", power_day_delta_values, "kwH", power_day_delta_labels,
        "line", "hour", "KwH day Delta")
    power_night_chart = MyChartValues(
        "power_night", power_night_values, "Cl", power_night_labels, "line", "hour", "KwH night")
    power_night_delta_chart = MyChartValues(
        "power_night_delta", power_night_delta_values, "kwH", power_night_delta_labels,
        "line", "hour", "KwH night Delta")
    ps4_chart = MyChartValues(
        "ps4", values_ps4, "ps4 on/off", labels_ps4, "bubble", "day", "PS4")
    ps4_2_chart = MyChartValues(
        "ps4_2", values_ps4_2, "minutes", labels_ps4_2, "bar", "day", "PS4")
    ps4_2_datasets_chart = MyChartValues2Datasets(
        "ps4_2_datasets",
        values_ps4, labels_ps4, "bubble",
        values_ps4_2, labels_ps4_2, "bar",
        "day")

    return render_template("graph.html",
                           frigo_1h_chart=frigo_1h_chart,
                           frigo_1h_smart_chart=frigo_1h_smart_chart,
                           frigo_10h_chart=frigo_10h_chart,
                           frigo_24h_chart=frigo_24h_chart,
                           pool_ph_chart=pool_ph_chart,
                           pool_cl_chart=pool_cl_chart,
                           power_chart=power_chart,
                           power_day_chart=power_day_chart,
                           power_day_delta_chart=power_day_delta_chart,
                           power_night_chart=power_night_chart,
                           power_night_delta_chart=power_night_delta_chart,
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


# @app.route("/hello/<name>")
# def hello_there(name):
#     # now = datetime.now()
#     # formatted_now = now.strftime("%A, %d %B, %Y at %X")

#     # Filter the name argument to letters only using regular expressions. URL arguments
#     # can contain arbitrary text, so we restrict to safe characters only.
#     match_object = re.match("[a-zA-Z]+", name)

#     if match_object:
#         clean_name = match_object.group(0)
#     else:
#         clean_name = "Friend"

#     content = "Hello there, " + clean_name + "! It's " + formatted_now
#     return content


# @app.route('/delete/<int:id>')
# def delete(id):
#     task_to_delete = Todo.query.get_or_404(id)

#     try:
#         db.session.delete(task_to_delete)
#         db.session.commit()
#         return redirect('/')
#     except:
#         return 'There was a problem deleting that task'

# @app.route('/update/<int:id>', methods=['GET', 'POST'])
# def update(id):
#     task = Todo.query.get_or_404(id)

#     if request.method == 'POST':
#         task.content = request.form['content']

#         try:
#             db.session.commit()
#             return redirect('/')
#         except:
#             return 'There was an issue updating your task'

#     else:
#         return render_template('update.html', task=task)


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
    logging.info(
        "--------------------------------------------------------------------------")
    logging.info("Starting Dashboard")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True  # doesn't seem to work
    app.run(host='0.0.0.0', port=5000)
    logging.info("Ending watchdog")
    shutdown_logger()
#app.run(host='192.168.0.52' , port=5000)
