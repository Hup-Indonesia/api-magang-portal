"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
const Experience_1 = __importDefault(require("./Experience"));
const Education_1 = __importDefault(require("./Education"));
const Attachment_1 = __importDefault(require("./Attachment"));
const Recruiter_1 = __importDefault(require("./Recruiter"));
const Post_1 = __importDefault(require("./Post"));
const SeekerPost_1 = __importDefault(require("./SeekerPost"));
class Seeker extends sequelize_1.Model {
}
Seeker.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    last_name: sequelize_1.DataTypes.STRING,
    domicile: sequelize_1.DataTypes.STRING,
    date_of_birth: sequelize_1.DataTypes.STRING,
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: ""
    },
    mobile: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    role: sequelize_1.DataTypes.STRING,
    sex: sequelize_1.DataTypes.STRING,
    current_status: sequelize_1.DataTypes.TEXT,
    profile_summary: sequelize_1.DataTypes.TEXT,
    profile_picture: sequelize_1.DataTypes.TEXT,
    profile_viewers: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    active_search: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "seeker",
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
Seeker.hasMany(Experience_1.default, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    as: 'experiences',
    constraints: false
});
Seeker.hasMany(Education_1.default, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    as: 'educations',
    constraints: false
});
Seeker.hasOne(Recruiter_1.default, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    as: 'recruiter',
    constraints: false
});
Seeker.hasOne(Attachment_1.default, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    as: 'attachment',
    constraints: false
});
Seeker.belongsToMany(Post_1.default, {
    as: "applied",
    sourceKey: "id",
    constraints: false,
    through: SeekerPost_1.default
});
Post_1.default.belongsToMany(Seeker, {
    as: "applicants",
    sourceKey: "id",
    constraints: false,
    through: SeekerPost_1.default
});
Seeker.belongsToMany(Post_1.default, {
    sourceKey: 'id',
    as: 'saved',
    constraints: false,
    through: "SeekerPostLoved"
});
Post_1.default.belongsToMany(Seeker, {
    sourceKey: 'id',
    as: 'saved',
    constraints: false,
    through: "SeekerPostLoved"
});
exports.default = Seeker;
//# sourceMappingURL=Seeker.js.map