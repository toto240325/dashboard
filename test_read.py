
import requests
import json

requestTimeout = 1000 	# timeout for requests

def eventRead(eventType):
    url = 'http://192.168.0.73/event/api/event/read.php?type='+eventType
    #print(url)
    r = requests.get(url, timeout=requestTimeout)
    #print(r.content)
    # r.content supposed to be something like this : 
    #   {"records":[{"id":"254","time":"2018-03-03 21:37:43","host":"L02DI1453375DIT","text":"incremental backup P702 to googleDrive via mypc3","type":"backup P702"}],"errMsg":""}\
    records=json.loads(r.content)
    try:
        pass
        # lastEventDatetimeStr= j['records'][0]['time']
        #print("URL : " + url + "   eventType : " + eventType + "   finished on " + time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
    except:
        pass
        # lastEventDatetimeStr = "1900-01-01 00:00:00"
    # myDatetime = datetime.datetime.strptime(lastEventDatetimeStr, '%Y-%m-%d %H:%M:%S')
    results = []
    for r in records:
        #print("{} : {} {}".format(r["time"],r["id"],r["text"]))
        if r["type"] == "temperature":
            try:
                results.append((r["time"],float(r["text"])))
            except:
                pass
    results.sort(key=lambda tup: tup[0])
    nb_min = 60
    return results[-nb_min:]

if __name__ == "__main__":
    temps=eventRead("toto")

