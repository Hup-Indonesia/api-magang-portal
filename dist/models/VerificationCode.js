"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class Verification extends sequelize_1.Model {
}
Verification.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    verification_code: sequelize_1.DataTypes.INTEGER,
    verification_email: sequelize_1.DataTypes.STRING,
    expired_date: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
}, {
    sequelize: _1.sequelize,
    tableName: 'verification_code', // Nama tabel di database
});
exports.default = Verification;
//# sourceMappingURL=VerificationCode.js.map