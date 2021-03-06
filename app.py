# https://www.youtube.com/watch?v=Z1RJmh_OqeA&ab_channel=freeCodeCamp.org
# run with :
# python app.py
# or
# FLASK_APP=app2.py python -m flask run
# if error "OSError: [Errno 98] Address already in use":
# ps -aux |grep "flask run"
# kill <process>
# echo $(ps -aux |grep "flask run --no-debugger" | awk '{print $2}'| head -n 1)
# kill $(ps -aux |grep "flask run --no-debugger" | awk '{print $2}'| head -n 1)
"""
test
"""
import datetime
import logging
import time
import sys
import socket
from unittest import result

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
    return today minus delta nb of days as a string like "2022-04-24"
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


def dt_next_granularity(dt, time_granularity):
    """
    dt : a datetime like datetime.datetime(2022,6,04) or datetime.datetime(2022, 6, 4, 22, 55)
    time_granularity : in {'day', 'hour', 'minute'}
    return the given datetime if has the expected granularity, or the datetime having the next
    granularity otherwise
    exemple :
        dt = dt_next_granularity(datetime(2022,6,22,55))
        print(a.strftime("%Y-%m-%d %H:%M:%S"))    # "2022-06-04 23:00:00"

        dt = dt_next_granularity(datetime(2022,6,20,0))
        print(a.strftime("%Y-%m-%d %H:%M:%S"))    # "2022-06-04 20:00:00"
    """

    if time_granularity == 'day':
        # Rounds to nearest day by adding a timedelta day if hour >= 12
        dt = dt.replace(microsecond=0, second=0, minute=0, hour=0, day=dt.day) + \
            datetime.timedelta(days=(0 if dt.hour == 0 else 1))
    elif time_granularity == 'hour':
        # Rounds to nearest hour by adding a timedelta hour if minute >= 30
        dt = dt.replace(microsecond=0, second=0, minute=0, hour=dt.hour) + \
            datetime.timedelta(hours=(0 if dt.minute == 0 else 1))
    elif time_granularity == 'minute':
        # Rounds to nearest minute by adding a timedelta minute if second >= 30
        dt = dt.replace(microsecond=0, second=0, minute=dt.minute) + \
            datetime.timedelta(minutes=(0 if dt.second == 0 else 1))
    elif time_granularity == '4h':
        granularity = 4
        dt = dt.replace(microsecond=0, second=0, minute=0,
            hour=((dt.hour//granularity)*granularity), day=dt.day) + \
            datetime.timedelta(hours=granularity)
    elif time_granularity == '2h':
        granularity = 2
        dt = dt.replace(microsecond=0, second=0, minute=0,
            hour=((dt.hour//granularity)*granularity), day=dt.day) + datetime.timedelta(hours=granularity)
    elif time_granularity == '1h':
        granularity = 1
        dt = dt.replace(microsecond=0, second=0, minute=0,
            hour=((dt.hour//granularity)*granularity), day=dt.day) + datetime.timedelta(hours=granularity)
    else:
        print("!!!!!!!!!! unknown time_granularity : {time_granularity} !!!")
        dt = None
    return dt


def dt_next_granularity_buggy(dt, time_granularity):
    """
    time : a datetime like datetime.datetime(2022,06,04) or datetime.datetime(2022, 06, 04, 22, 55)
    time_granularity : in {'day', 'hour', 'minute'}
    return the given datetime if has the expected granularity, or the datetime having the next
    granularity otherwise
    exemple :
        dt = dt_next_granularity(datetime(2022,6,22,55))
        print(a.strftime("%Y-%m-%d %H:%M:%S"))    # "2022-06-04 23:00:00"

        dt = dt_next_granularity(datetime(2022,6,20,0))
        print(a.strftime("%Y-%m-%d %H:%M:%S"))    # "2022-06-04 20:00:00"
    """
    # calculate granularity in nb of secs
    if time_granularity == "day":
        granularity_secs = 60 * 60 * 24
    elif time_granularity == "hour":
        granularity_secs = 60 * 60
    elif time_granularity == "minute":
        granularity_secs = 60
    else:
        print("!!!!!!!!!! unknown time_granularity : {time_granularity} !!!")

    # convert time to nb of seconds (since Epoch ?)
    dt_secs = datetime.datetime.timestamp(dt)
    # if it's exactly the right granularity, add it to resulting events, else,
    # create an event having
    # exactly the next time granularity
    if dt_secs % granularity_secs != 0:
        next_one = dt_secs + granularity_secs
        tmp_dt = datetime.datetime.fromtimestamp(next_one)
        print("next_one : ", tmp_dt.strftime("%Y-%m-%d %H:%M:%S"))

        modulo = dt_secs % granularity_secs
        tmp_dt = datetime.datetime.fromtimestamp(modulo)
        print("modulo : ", tmp_dt.strftime("%Y-%m-%d %H:%M:%S"))

        dt_secs = next_one - modulo

    next_dt = datetime.datetime.fromtimestamp(dt_secs)
    return next_dt


def sample_events(events, time_granularity):
    """
    reduce a fine-grained list of events to only those events having the requested granularity
    if there is no event exactly at the requested granularity, take the event just before that one

    timescale can be 'hour', 'day'

    (events are assumed to be sorted on the time key)
    (time are assumed in localtime)

    events like
        [{"time":"2022-06-04 09:55", "value":5},
         {"time":"2022-06-04 10:05", "value":6},
         {"time":"2022-06-04 10:25", "value":8},
         {"time":"2022-06-04 10:50", "value":9},
         {"time":"2022-06-04 11:10", "value":10},
         {"time":"2022-06-04 11:50", "value":13},
         {"time":"2022-06-04 12:01", "value":14},
         {"time":"2022-06-04 12:55", "value":16}
         ]
    will be converted in
        [{"2022-06-04 10:00",5},
         {"2022-06-04 11:00",9},
         {"2022-06-04 12:00",13},
         {"2022-06-04 13:00",16}
         ]
    """

    if len(events) > 0:
        dt_array = []
        value_array = []

        for event in events:
            time_str = event["time"]
            value = float(event["text"])

            # print(f'{time_str} {value}')

            dt = datetime.datetime.strptime(time_str, '%Y-%m-%d %H:%M:%S')
            next_granularity_dt = dt_next_granularity(dt, time_granularity)

            # add it to resulting events if it doesn't yet exist there, or replace the value if
            # an event with the same time already exists
            if next_granularity_dt in dt_array:
                value_index = dt_array.index(next_granularity_dt)
                value_array[value_index] = value
            else:
                dt_array.append(next_granularity_dt)
                value_array.append(value)

    resulting_events = []
    for i, dt in enumerate(dt_array):
        resulting_events.append({"time": dt.strftime(
            "%Y-%m-%d %H:%M:%S"), "text": str(value_array[i])})

    return resulting_events


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
        print(msg)
        logging.info(msg)


def smoothen(myarray):
    """
    smoothen the values of the passed array to smoothen the curve
    """
    # myarray = savgol_filter(myarray, 10, 1).tolist()
    return myarray


def normalise_pool_status(events, kind):
    """
    normalise the pool status events, i.e. convert from a string to a value, to facilite the graphic representation
    for ph and cl status :
        dosage  -> 1
        ok      -> 0
        other   -> -1
    for pp :
        pp      -> 1
        other   -> -1

    """
    for event in events:
        if kind in ['ph', 'cl']:
            if event["text"] == "ok":
                event["text"] = "0"
            elif event["text"] == "dosage":
                event["text"] = "1"
            elif event["text"] == "arret dose":
                event["text"] = "2"
            else:
                event["text"] = "-1"
        elif kind in ['pp']:
            if event["text"] == "p":
                event["text"] = "1"
            else:
                event["text"] = "-1"

    return events


@app.route('/about')
def about():
    """
    rendering the about page
    """
    return render_template("about.html")


@app.route('/horiz')
def horizontal_plugin():
    """
    rendering the page
    """
    return render_template("horizontal_plugin.html")


@app.route('/samples')
def samples():
    """
    rendering the samples page
    """
    return render_template("samples.html")


@app.route('/sample2')
def sample2():
    """
    rendering the sample2 page
    """
    return render_template("sample2.html")


@app.route('/', methods=['POST', 'GET'])
def index():
    """
    rendering the index page
    """
    # return "hello world !! (hello !)"

    #data = test_read.eventRead("",60)
    # labels = [row[0] for row in data]
    # values = [row[1] for row in data]

    hostname = socket.gethostname()

    elaps = ElapsedTime()

    data = read_where("temperature", 60, "1900-01-01")
    events = data["events"]
    frigo_1h_values = [float(event["text"]) for event in events]
    frigo_1h_ids = [event["id"] for event in events]
    frigo_1h_labels = [event["time"] for event in events]

    elaps.elapsed_time("frigo_1h")

    data = read_where("smart_temperature", 60, "1900-01-01")
    events = data["events"]
    frigo_1h_smart_values = [float(event["text"]) for event in events]
    frigo_1h_smart_ids = [event["id"] for event in events]
    frigo_1h_smart_labels = [event["time"] for event in events]

    elaps.elapsed_time("frigo_1h")

    # data = read_where("temperature", 60*10, "1900-01-01")
    # events = data["events"]
    # frigo_10h_values = [float(event["text"]) for event in events]
    # frigo_10h_ids = [event["id"] for event in events]
    # frigo_10h_labels = [event["time"] for event in events]

    # elaps.elapsed_time("frigo_10h")

    data = read_where("temperature", 60*24, "1900-01-01")
    events = data["events"]
    frigo_24h_values = [float(event["text"]) for event in events]
    frigo_24h_ids = [event["id"] for event in events]
    frigo_24h_labels = [event["time"] for event in events]

    elaps.elapsed_time("frigo_24h")

    data = read_where("pool_ph", 5*10*4, "1900-01-01")
    events = data["events"]
    pool_ph_values = [float(event["text"]) for event in events]
    pool_ph_ids = [event["id"] for event in events]
    pool_ph_labels = [event["time"] for event in events]

    elaps.elapsed_time("pool_ph")
    # ------------------------------------------------------
    data = read_where("pool_cl", 5*10*4, "1900-01-01")
    events = data["events"]
    pool_cl_values = [float(event["text"]) for event in events]
    pool_cl_ids = [event["id"] for event in events]
    pool_cl_labels = [event["time"] for event in events]

    elaps.elapsed_time("pool_cl")
    # ------------------------------------------------------
    data = read_where("pool_status_ph", 5*10*4, "1900-01-01")
    events = data["events"]
    events = normalise_pool_status(events, "ph")

    pool_status_ph_values = [float(event["text"]) for event in events]
    pool_status_ph_ids = [event["id"] for event in events]
    pool_status_ph_labels = [event["time"] for event in events]

    elaps.elapsed_time("pool_status_ph")
    # ------------------------------------------------------
    data = read_where("pool_status_cl", 5*10*4, "1900-01-01")
    events = data["events"]
    events = normalise_pool_status(events, "cl")

    pool_status_cl_values = [float(event["text"]) for event in events]
    pool_status_cl_ids = [event["id"] for event in events]
    pool_status_cl_labels = [event["time"] for event in events]

    elaps.elapsed_time("pool_status_cl")
    # ------------------------------------------------------
    data = read_where("pool_status_pp", 5*10*4, "1900-01-01")
    events = data["events"]
    events = normalise_pool_status(events, "pp")

    pool_status_pp_values = [float(event["text"]) for event in events]
    pool_status_pp_ids = [event["id"] for event in events]
    pool_status_pp_labels = [event["time"] for event in events]

    elaps.elapsed_time("pool_status_pp")
    # ------------------------------------------------------
    data = read_where("power_day", 30*24*5, "1900-01-01")
    events = data["events"]
    # events = remove_duplicates(events)
    power_day_values = [float(event["text"]) for event in events]
    power_day_ids = [float(event["id"]) for event in events]
    power_day_labels = [event["time"] for event in events]

    power_day_values = smoothen(power_day_values)

    elaps.elapsed_time("power_day")
    # ------------------------------------------------------
    data = read_where("power_day", 30*24*5, "1900-01-01")
    events = data["events"]
    # events = remove_duplicates(events)
    events = sample_events(events, "1h")
    power_day_delta_values, power_day_delta_labels = average_events(events)
    power_day_delta_values = smoothen(power_day_delta_values)

    elaps.elapsed_time("power_day_delta")
    # ------------------------------------------------------
    data = read_where("power_night", 30*24*5, "1900-01-01")
    events = data["events"]
    power_night_values = [float(event["text"]) for event in events]
    power_night_ids = [float(event["id"]) for event in events]
    power_night_labels = [event["time"] for event in events]

    elaps.elapsed_time("power_night")
    # ------------------------------------------------------
    data = read_where("power_night", 30*24*5, "1900-01-01")
    events = data["events"]
    # events = remove_duplicates(events)
    events = sample_events(events, "1h")

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
    # ------------------------------------------------------
    # the values of the ps4 dataset are 1 and the labels are the datetime at which ps4 was up
    delta = -2
    data = read_where("ps4", 100, today_delta_str(delta))
    events = data["events"]

    labels_ps4 = [event["time"] for event in events]
    ids_ps4 = [event["id"] for event in events]
    values_ps4 = [1 for event in events]

    elaps.elapsed_time("ps4")
    # ------------------------------------------------------
    # the values of the ps4_2 dataset are the number of minutes ps4 was up per day
    # the labels are those days where ps4 was up, forced at 12:00:00

    data = read_ps4(today_delta_str(delta))
    records = data["records"]
    labels_ps4_2 = [rec["date"].replace(
        "01:00:00", "12:00:00") for rec in records]
    values_ps4_2a = [rec["count"] for rec in records]
    # attention : the "rec*10" below should be parameterised with same parameter used in watchdog.py
    values_ps4_2 = [rec*10 for rec in values_ps4_2a]
    # ------------------------------------------------------

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

    class MyChartValuesWithIDs:
        """
        this class is just there to create an object containing all the parameters of a given chart,
        which will be handy to pass in one go all those values as an objects to the javascript
        that will need to process all those values
        """

        def __init__(self, title, values, ids, values_unit, labels, chart_type, unit, label):
            self.title = title
            self.values = values
            self.ids = ids
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

    frigo_1h_chart = MyChartValuesWithIDs(
        "frigo_1h", frigo_1h_values, frigo_1h_ids, "??C", frigo_1h_labels, "line", "minute",
        "temperature")
    frigo_1h_smart_chart = MyChartValuesWithIDs(
        "frigo_1h_smart", frigo_1h_smart_values, frigo_1h_smart_ids, "??C", frigo_1h_smart_labels,
        "line", "minute", "temperature")
    # frigo_10h_chart = MyChartValuesWithIDs(
    #     "frigo_10h", frigo_10h_values, frigo_10h_ids, "??C", frigo_10h_labels, "line", "hour",
    # "temperature")
    frigo_24h_chart = MyChartValuesWithIDs(
        "frigo_24h", frigo_24h_values, frigo_24h_ids, "??C", frigo_24h_labels, "line", "hour",
        "temperature")

    pool_ph_chart = MyChartValuesWithIDs(
        "pool_ph", pool_ph_values, pool_ph_ids, "ph", pool_ph_labels, "line", "hour", "pool ph")
    pool_status_ph_chart = MyChartValuesWithIDs(
        "pool_status_ph", pool_status_ph_values, pool_status_ph_ids, "ph", pool_status_ph_labels, "line", "hour", "pool ph")
    pool_cl_chart = MyChartValuesWithIDs(
        "pool_cl", pool_cl_values, pool_cl_ids, "cl", pool_cl_labels, "line", "hour", "pool cl")

    pool_status_ph_chart = MyChartValuesWithIDs(
        "pool_status_ph", pool_status_ph_values, pool_status_ph_ids, "ph", pool_status_ph_labels, "line", "hour", "pool ph")
    pool_status_cl_chart = MyChartValuesWithIDs(
        "pool_status_cl", pool_status_cl_values, pool_status_cl_ids, "cl", pool_status_cl_labels, "line", "hour", "pool cl")
    pool_status_pp_chart = MyChartValuesWithIDs(
        "pool_status_pp", pool_status_pp_values, pool_status_pp_ids, "pp", pool_status_pp_labels, "line", "hour", "pool pp")

    power_chart = MyChartValues2Datasets(
        "power_2_datasets",
        power_day_values, power_day_labels, "line",
        power_night_values, power_night_labels, "line",
        "hour")
    power_chart = MyChartValues2(
        "power day/night", power_day_values, power_night_values, "KwH", power_day_labels,
        power_night_labels, "line", "hour", "KwH day/night")
    power_day_chart = MyChartValuesWithIDs(
        "power_day", power_day_values, power_day_ids, "KwH", power_day_labels,
        "line", "hour", "KwH day")
    power_day_delta_chart = MyChartValues(
        "power_day_delta", power_day_delta_values, "kwH", power_day_delta_labels,
        "line", "hour", "KwH day Delta")
    power_night_chart = MyChartValuesWithIDs(
        "power_night", power_night_values, power_night_ids, "KwH", power_night_labels,
        "line", "hour", "KwH night")
    power_night_delta_chart = MyChartValues(
        "power_night_delta", power_night_delta_values, "kwH", power_night_delta_labels,
        "line", "hour", "KwH night Delta")
    ps4_chart = MyChartValuesWithIDs(
        "ps4", values_ps4, ids_ps4, "ps4 on/off", labels_ps4, "bubble", "day", "PS4")
    ps4_2_chart = MyChartValuesWithIDs(
        "ps4_2", values_ps4_2, [], "minutes", labels_ps4_2, "bar", "day", "PS4_2")

    # ps4_2_chart = MyChartValues(
    #     "ps4_2", values_ps4_2, "minutes", labels_ps4_2, "bar", "day", "PS4")
    ps4_2_datasets_chart = MyChartValues2Datasets(
        "ps4_2_datasets",
        values_ps4, labels_ps4, "bubble",
        values_ps4_2, labels_ps4_2, "bar",
        "day")

    rendered_html = render_template(
        "graph.html",
        hostname=hostname,
        frigo_1h_chart=frigo_1h_chart,
        frigo_1h_smart_chart=frigo_1h_smart_chart,
        #  frigo_10h_chart=frigo_10h_chart,
        frigo_24h_chart=frigo_24h_chart,
        pool_ph_chart=pool_ph_chart,
        pool_cl_chart=pool_cl_chart,
        pool_status_ph_chart=pool_status_ph_chart,
        pool_status_cl_chart=pool_status_cl_chart,
        pool_status_pp_chart=pool_status_pp_chart,
        power_chart=power_chart,
        power_day_chart=power_day_chart,
        power_day_delta_chart=power_day_delta_chart,
        power_night_chart=power_night_chart,
        power_night_delta_chart=power_night_delta_chart,
        ps4_chart=ps4_chart,
        ps4_2_chart=ps4_2_chart,
        ps4_2_datasets_chart=ps4_2_datasets_chart
    )
    return rendered_html

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
