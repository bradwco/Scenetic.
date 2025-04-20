#include <Arduino.h>
#include <Servo.h>

Servo servoLB; // FWD and BACK
Servo servoLT; // angle it's looking at
Servo servoR;  // up and down

int initialLB = 85;
int initialLT = 30;
int initialR = 70;

void setup() {
  Serial.begin(9600); // <-- Start serial
  servoLB.attach(6); 
  servoLT.attach(5);
  servoR.attach(7);

  servoLB.write(initialLB);
  servoLT.write(initialLT);
  servoR.write(initialR);
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();

    if (command == '1') {
      // Move sequence

      delay(2000); 
      
      for (int pos = initialLB; pos > initialLB - 25; pos--) {
        servoLB.write(pos);
        delay(10);
      }

      delay(500); 

      for (int pos = initialLB - 25; pos < initialLB; pos++) {
        servoLB.write(pos);
        delay(10);
      }

      delay(2000); 

      for (int pos = initialLT; pos > initialLT - 45; pos--) {
        servoLT.write(pos);
        delay(10);
      }

      delay(3000); 

      for (int pos = initialLT - 45; pos < initialLT; pos++) {
        servoLT.write(pos);
        delay(10);
      }

      delay(1500);

      for (int pos = initialR; pos > initialR - 45; pos--) {
        servoR.write(pos);
        delay(10);
      }

      delay(200); 

      for (int pos = initialR - 45; pos < initialR; pos++) {
        servoR.write(pos);
        delay(10);
      }

      delay(2000); 

      for (int pos = initialLT; pos < initialLT + 35; pos++) {
        servoLT.write(pos);
        delay(10);
      }

      delay(2500); 

      for (int pos = initialLT + 35; pos > initialLT; pos--) {
        servoLT.write(pos);
        delay(10);
      }

      delay(2000);

      // Wait for next command
    }
  }
}
