"""
Unit tests module for this project
Just run like this :
export PYTHONPATH=/home/toto/utils ; cd ~/dashboard ; venv ; python test_dashboard.py
"""

import unittest
import app as dashboard
import datetime


class TestDashboard(unittest.TestCase):
        
    def Test_assert_equals(self,p1,p2):
        self.assertEqual(p1,p2)

    def test_dashboard_today_delta(self):
        yesterday_str = dashboard.today_delta_str(-1)
        yesterday_dt = datetime.datetime.strptime(yesterday_str,'%Y-%m-%d') 
        today_dt = yesterday_dt + datetime.timedelta(days=1)

        self.Test_assert_equals(today_dt.date(), datetime.date.today())

if __name__ == "__main__":
    unittest.main()
