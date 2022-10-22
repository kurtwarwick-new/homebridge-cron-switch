var cron = require("cron").CronJob;

var Service;
var Characteristic;

class Accessory {
    constructor(logger, config, api) {
        this.configureAccessory = this.configureAccessory.bind(this);
        this.debug = this.debug.bind(this);
        this.log = this.log.bind(this);

        this.getServices = this.getServices.bind(this);

        this.config = config;
        this.logger = logger;
        this.api = api;

        Service = api.hap.Service;
        Characteristic = api.hap.Characteristic;

        this.configureAccessory();
    }

    debug(message) {
        if (this.config && this.config.debug) {
            this.logger(message.toLowerCase());
        }
    }

    log(message) {
        this.logger(message.toLowerCase());
    }

    getServices() {
        return [this.service];
    }

    configureAccessory() {
        this.service = new Service.Switch(`${this.config.name}`);

        let job = new cron(this.config.cron, () => {
            this.service.updateCharacteristic(Characteristic.On, true);
            setTimeout(() => this.service.updateCharacteristic(Characteristic.On, false), this.config.turnOffDelay);
        });

        job.start();
    }
}

Accessory.pluginName = "homebridge-cron-switch";
Accessory.accessoryName = "CronSwitch";

module.exports = Accessory;
