import socket
import params
import requests
import logging
import sys

def init_logger(s_level):
    """
    Usage : (in main())
    mylogger = init_logger('mylogger')
    mylogger.info("Starting main")
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


def log_event(type, text):
  url = params.event_server + "/api/event/create.php"

  hostname = socket.gethostname()

  data = '{ \
    "text" : "' + text + '", \
    "host" : "' + hostname + '", \
    "type" : "' + type + '" \
  }'

  headers = {'content-type': 'application/json'}  # curl -H
  # auth = HTTPBasicAuth('trial', 'trial')          # curl -u

  try:
    req = requests.post(                            # curl -X POST
        url,
        #auth=auth,
        data=data,
        headers=headers)

    # returned_data = req.json()
    # print("returned data : ")
    # print(returned_data)
    # print(req.text)
    
    if req.text.find("event created on") == -1:
        print("problem when creating the event !!")
        print("server OK but this is the error message :")
        print(req.text)

    return (req.text)         # Display JSON on stdout
  except Exception as e:
    print("There was an error when doing requests.post")
    print(str(e))
    return('{"message":"error when trying to create event"}')


def read_events(type, limit):
  url = params.event_server + f"/api/event/read_where.php"
  logging.warning("arguments should be filtered !")
  at_least_one_criteria = False
  if type != "" or limit != 0:
      url = url + "?"
      if type != "":
        url = url + f"type={type}"
        at_least_one_criteria = True
      if limit != 0:
          if at_least_one_criteria:
            url = url + "&"
          url = url + f"limit={limit}"
  logging.info(f"url : {url}")
  headers = {'content-type': 'application/json'}  # curl -H
  try:
    req = requests.get(
        url,
        headers=headers)

    events = req.json()
    nb_events = len(events)
    # print("nb events : {nb_events}")
    # print(events)
    # event1 = events[0]
    # type1 = event1["type"]

    
    if nb_events < 1:
        print("problem when reading events !!")
        print(req)

    return ({"events":events, "error": ""})

  except Exception as e:
    error_msg = "There was an error when doing requests.get"
    logging.error(error_msg)
    logging.error(str(e))
    return({"events":[], "error" : error_msg})


def main():
  init_logger("DEBUG")
  logging.info("Starting main")
  res = log_event("ps4","ps4 is up")
  res = read_events("ps4",2)
  logging.debug(f'error = {res["error"]}')
  if res["error"] == '':
    logging.debug(f'res["events"] = {res["events"]}')
    
   
if __name__ == "__main__": 
    main()
