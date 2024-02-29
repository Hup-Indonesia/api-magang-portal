"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class Rejected extends sequelize_1.Model {
}
Rejected.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    rejectedDate: sequelize_1.DataTypes.STRING,
    rejectedMessage: sequelize_1.DataTypes.STRING,
}, {
    sequelize: _1.sequelize,
    tableName: 'rejected', // Nama tabel di database
});
exports.default = Rejected;
//# sourceMappingURL=Rejected.js.map