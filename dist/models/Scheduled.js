"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class Scheduled extends sequelize_1.Model {
}
Scheduled.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    scheduledDate: sequelize_1.DataTypes.STRING,
    interviewDate: sequelize_1.DataTypes.STRING,
    interviewType: sequelize_1.DataTypes.STRING,
    interviewLink: sequelize_1.DataTypes.STRING,
    interviewMessage: sequelize_1.DataTypes.STRING,
}, {
    sequelize: _1.sequelize,
    tableName: 'scheduled', // Nama tabel di database
});
exports.default = Scheduled;
//# sourceMappingURL=Scheduled.js.map