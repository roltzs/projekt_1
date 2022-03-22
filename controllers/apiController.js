var config = require("../config");
var pgp = require("pg-promise")();
var db = pgp(config.getDbConnectionString());
module.exports = function (app) {

    //Millised auditooriumide numbrid on andmebaasis?
    app.get("/api/rooms", function (req, res) {
        db.any("SELECT DISTINCT room FROM controller_sensor")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any room",
                    error: err,
                });
            });
    });

    //Millised andurid on auditooriumis nr ...
    app.get("/api/room/:number/sensors", function (req, res) {
        db.any(
                "SELECT sensor.sensorname FROM sensor INNER JOIN controller_sensor ON controller_sensor.id_sensor=sensor.id " +
                "WHERE controller_sensor.room=" + req.params.number + ":: varchar"
            )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any room",
                    error: err,
                });
            });
    });

    //Näidata, millised kontrollerid on andmebaasis
    app.get("/api/controllers/db", function (req, res) {
        db.any("SELECT controllername FROM controller")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any controllers",
                    error: err,
                });
            });
    });

    //Näidata, millised andurid on konkreetse kontrolleriga ühendatud
    app.get("/api/controllers/controllerSensorWorking", function (req, res) {
        db.any(
                "SELECT controller.controllername, sensor.sensorname FROM controller, sensor " +
                "WHERE controller.id IN (SELECT controller_sensor.id_controller FROM controller_sensor " +
                "WHERE controller_sensor.state SIMILAR TO 'work') AND sensor.id IN " +
                "(SELECT controller_sensor.id_sensor FROM controller_sensor WHERE controller_sensor.state SIMILAR TO 'work') " +
                "ORDER BY controllername ASC"
            )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any working controllers/sensors",
                    error: err,
                });
            });
    });

    //Näidata auditooriumi nr 44 andurite andmeid täna
    app.get("/api/room/44/sensorsDataToday", function (req, res) {
        db.any(
                "SELECT room, sensor, valuetype, hour_avg, dimension, date_time FROM data_archive WHERE room SIMILAR TO '44' " +
                "AND date_time = current_date"
            )
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can’t find any data",
                    error: err,
                });
            });
    });
};