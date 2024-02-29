"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class Reviewed extends sequelize_1.Model {
}
Reviewed.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    reviewedDate: sequelize_1.DataTypes.STRING,
}, {
    sequelize: _1.sequelize,
    tableName: 'reviewed', // Nama tabel di database
});
exports.default = Reviewed;
//# sourceMappingURL=Reviewed.js.map