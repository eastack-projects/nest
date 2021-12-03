#include "DHT.h"

#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  if (Serial.available() > 0) {
    if (Serial.read() == 'a') {
      float humdity = dht.readHumidity();
      float temperature = dht.readTemperature();

      if (isnan(humdity) || isnan(temperature)) {
        Serial.println("{\"humidity\": null, \"temperature\": null}");
        return;
      }

      Serial.print("{\"humidity\":");
      Serial.print(humdity);
      Serial.print(",");
      Serial.print("\"temperature\":");
      Serial.print(temperature);
      Serial.println("}");
    }
  }
}
