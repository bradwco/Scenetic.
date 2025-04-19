#include <Arduino.h>
#include <Servo.h>


Servo servoTest;

void setup() {
  servoTest.attach(7);
}

void loop() {
  for(int i=0; i<90; i++){
    servoTest.write(i);
    delay(15);
  }
  
}
