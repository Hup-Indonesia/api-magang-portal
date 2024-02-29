"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
const Waiting_1 = __importDefault(require("./Waiting"));
const Reviewed_1 = __importDefault(require("./Reviewed"));
const Scheduled_1 = __importDefault(require("./Scheduled"));
const Rejected_1 = __importDefault(require("./Rejected"));
const Offering_1 = __importDefault(require("./Offering"));
class SeekerPost extends sequelize_1.Model {
}
SeekerPost.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    applicantStatus: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'Waiting', // Nilai default untuk status
    },
}, {
    sequelize: _1.sequelize,
    modelName: 'SeekerPost',
    tableName: 'seeker_posts', // Nama tabel di database
});
SeekerPost.hasOne(Waiting_1.default, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    constraints: false
});
SeekerPost.hasOne(Reviewed_1.default, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    constraints: false
});
SeekerPost.hasOne(Scheduled_1.default, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    constraints: false
});
SeekerPost.hasOne(Rejected_1.default, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    constraints: false
});
SeekerPost.hasOne(Offering_1.default, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    constraints: false
});
exports.default = SeekerPost;
//# sourceMappingURL=SeekerPost.js.map