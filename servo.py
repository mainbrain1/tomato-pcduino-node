#!/usr/bin/env python
# blink_led.py
# gpio test code for pcduino ( http://www.pcduino.com )
#2.35  0.54
import gpio
import time
import sys
interval = float(sys.argv[1])
servo_pin = "gpio"+sys.argv[2]
#print(servo_pin)
def setup():
        gpio.pinMode(servo_pin, gpio.OUTPUT)
#endDef
 
def spin(interval, freq=50):
        #print("Supplying {} ms duty cycle".format(interval))
        for x in range(0,int(freq)):  
                gpio.digitalWrite(servo_pin, gpio.HIGH)
                time.sleep(float(interval/1000))
                gpio.digitalWrite(servo_pin, gpio.LOW)
                time.sleep(float((20.000-interval)/1000))
        #endFor
        time.sleep(0.5)
#endDef
 
 

setup()
  

spin(interval)
