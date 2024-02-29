"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
const Gallery_1 = __importDefault(require("./Gallery"));
const Post_1 = __importDefault(require("./Post"));
class Recruiter extends sequelize_1.Model {
}
Recruiter.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    rec_type: sequelize_1.DataTypes.STRING,
    rec_org_name: sequelize_1.DataTypes.STRING,
    rec_org_desc: sequelize_1.DataTypes.TEXT,
    rec_org_size: sequelize_1.DataTypes.STRING,
    rec_org_year: sequelize_1.DataTypes.STRING,
    rec_org_website: sequelize_1.DataTypes.TEXT,
    rec_org_address: sequelize_1.DataTypes.TEXT,
    rec_org_logo: sequelize_1.DataTypes.TEXT,
    rec_info_firstname: sequelize_1.DataTypes.STRING,
    rec_info_lastname: sequelize_1.DataTypes.STRING,
    rec_info_email: sequelize_1.DataTypes.STRING,
    rec_info_company_domain: sequelize_1.DataTypes.STRING,
    rec_info_position: sequelize_1.DataTypes.STRING,
    rec_tier: sequelize_1.DataTypes.STRING,
    rec_mode: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "Member"
    },
    rec_description: sequelize_1.DataTypes.TEXT,
    rec_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    rec_profile_view: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    rec_response_time: sequelize_1.DataTypes.STRING,
    rec_banner: sequelize_1.DataTypes.STRING,
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "recruiter",
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
Recruiter.hasMany(Gallery_1.default, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    as: 'gallery',
    constraints: false
});
Recruiter.belongsToMany(Post_1.default, {
    as: "posts",
    through: "RecruiterPost",
    constraints: false
});
Post_1.default.belongsToMany(Recruiter, {
    as: "recruiter",
    through: "RecruiterPost",
    constraints: false
});
exports.default = Recruiter;
//# sourceMappingURL=Recruiter.js.map