# homebridge-ambientlight

Homebridge Accessory for Mac's ambient light sensors.

```
npm install --global homebridge-ambientlight
```

Edit `~/.homebridge/config.json`:

```json
{
    "accessories": [
            {
                "accessory": "iSightAmbientLightSensor",
                "name": "GlavinBook-Pro Ambient Light Sensor"
            }
    ]
}
```