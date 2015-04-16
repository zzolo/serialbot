// A real basic Serial sketch

int baud = 9600;
int counting = 0;
int wait = 1000;


void setup() {
  Serial.begin(baud);
 
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  Serial.println("Connected.");
}


void loop() {
  counting++;
  Serial.println(counting);
  delay(wait);
}
