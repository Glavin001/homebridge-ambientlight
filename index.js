const { Accessory } = require('homebridge-plugin-helpers');
const ambientlight = require('ambientlight');

module.exports = function (homebridge) {
	AmbientLightAccessory.register(homebridge);
};

class AmbientLightAccessory extends Accessory {

	static get pluginName() {
		return "homebridge-ambientlight";
	}
	
	static get accessoryName() {
		return "iSightAmbientLightSensor";
	}

	constructor(homebridge, log, config, api) {
		super();
		// Save args
		this.log = log;
		this.config = config;
		this.api = api;
		// Setup Homebridge
		this.Service = homebridge.hap.Service;
		this.Characteristic = homebridge.hap.Characteristic;
		// Setup Service
		this.service = new this.Service.LightSensor(this.name);
		this.setupCharacteristics();
        this.tick();
	}

	get name() {
		return this.config.name;
	}

	get manufacturer() {
		return "Apple";
	}

	get model() {
		return "Mac";
	}

	get serialNumber() {
		return "iSight";
	}

	setupCharacteristics() {
		const { Characteristic } = this;
		const ambientlight = this.service
			.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
			.on('get', callback => callback(null, this.ambientlight))
			;
		this.characteristics = {
            ambientlight,
		};
	}
    
    get rawAmbientlight() {
        return ambientlight();
    }

    get ambientlight() {
        const x = this.rawAmbientlight;
        // Equation from https://www.snip2code.com/Snippet/232340/Read-lux-measurement-using-MBP-ambient-l
        const lux = (-3 * Math.pow(10, -27)) * Math.pow(x, 4) + (2.6 * Math.pow(10, -19)) * Math.pow(x, 3) - (3.4 * Math.pow(10,-12)) * Math.pow(x, 2) + (3.9 * Math.pow(10, -5)) * x - 0.19;
        const limitedLux = Math.max(Math.min(this.maxValue, lux), this.minValue);
        console.log(`Ambient light: raw=${x}, lux=${lux}, lux2=${limitedLux}`);
        return limitedLux;
    }

    get maxValue() {
        return 100000;
    }

    get minValue() {
        return 0.0001;
    }

    tick() {
		return this.updateValues()
			.then(() => setTimeout(() => this.tick(), this.pollInterval))
			.catch(() => setTimeout(() => this.tick(), this.pollInterval))
			;
	}

	get pollInterval() {
		return 2000;
	}

	updateValues() {
		return Promise.all([
			this.updateAmbientLight(),
		]);
	}

	updateAmbientLight() {
		this.characteristics.ambientlight.updateValue(this.ambientlight);
	}
    
}