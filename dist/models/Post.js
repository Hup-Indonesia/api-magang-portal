"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require("."); // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
class Post extends sequelize_1.Model {
}
Post.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    post_status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "IN-PROGRESS"
    },
    post_position: sequelize_1.DataTypes.STRING,
    post_type: sequelize_1.DataTypes.STRING,
    post_need: sequelize_1.DataTypes.STRING,
    post_work_time: sequelize_1.DataTypes.STRING,
    post_work_time_perweek: sequelize_1.DataTypes.STRING,
    post_thp_type: sequelize_1.DataTypes.STRING,
    post_thp: sequelize_1.DataTypes.STRING,
    post_location_type: sequelize_1.DataTypes.STRING,
    post_location: sequelize_1.DataTypes.STRING,
    post_contract_duration: sequelize_1.DataTypes.STRING,
    post_link: sequelize_1.DataTypes.TEXT,
    post_mode: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "Member"
    },
    post_resume_req: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    post_portfolio_req: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    post_deadline: sequelize_1.DataTypes.STRING,
    post_postdate: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: getCurrentDate()
    },
    post_view: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    post_overview: sequelize_1.DataTypes.TEXT,
    post_responsibility: sequelize_1.DataTypes.TEXT,
    post_requirement: sequelize_1.DataTypes.TEXT,
    // timestamps
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    tableName: "post",
    sequelize: // Nama tabel di database
    _1.sequelize, // Instance Sequelize yang digunakan
});
exports.default = Post;
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tambahkan leading zero jika bulan < 10
    const day = String(today.getDate()).padStart(2, '0'); // Tambahkan leading zero jika tanggal < 10
    return `${year}-${month}-${day}`;
}
//# sourceMappingURL=Post.js.map