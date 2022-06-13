"""
basis testing of sample_events function
"""
import datetime
from app import sample_events
from app import dt_next_granularity

events = [{"time":"2022-06-04 09:55", "value":5}, \
          {"time":"2022-06-04 10:05", "value":6}, \
          {"time":"2022-06-04 10:25", "value":8}, \
          {"time":"2022-06-04 10:50", "value":9}, \
          {"time":"2022-06-04 11:10", "value":10}, \
          {"time":"2022-06-04 11:50", "value":13}, \
          {"time":"2022-06-04 12:01", "value":14}, \
          {"time":"2022-06-04 12:55", "value":16} \
          ]

dt = datetime.datetime.now()
print()
print('dt.strftime("%Y-%m-%d %H:%M") : ', dt.strftime("%Y-%m-%d %H:%M"))
print()



def test_dt_next_granularity(dt_tuple, time_granularity):
    """
    test fct
    """
    y,m,d,h,s = dt_tuple
    mydt = datetime.datetime(y,m,d,h,s)
    next_dt = dt_next_granularity(mydt,time_granularity)
    dt_str = mydt.strftime("%Y-%m-%d %H:%M:%S")
    next_dt_str = next_dt.strftime("%Y-%m-%d %H:%M:%S")
    print(f'{dt_str} up round to next {time_granularity} -> {next_dt_str}')


test_dt_next_granularity((2022,6,20,10,5), "hour")
test_dt_next_granularity((2022,6,20,21,00), "hour")
test_dt_next_granularity((2022,6,20,21,55), "hour")
test_dt_next_granularity((2022,6,20,23,00), "hour")
test_dt_next_granularity((2022,6,20,23,55), "hour")
print()
test_dt_next_granularity((2022,6,20,10,5), "day")
test_dt_next_granularity((2022,6,20,21,00), "day")
test_dt_next_granularity((2022,6,20,21,55), "day")
test_dt_next_granularity((2022,6,20,23,00), "day")
test_dt_next_granularity((2022,6,20,23,55), "day")
test_dt_next_granularity((2022,6,21,00,00), "day")



print(sample_events(events,'hour'))
