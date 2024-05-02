import { DataTypes, Model,CreationOptional, ForeignKey, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Seeker from "./Seeker";
import Recruiter from "./Recruiter";

class Post extends Model {
  declare id: CreationOptional<number>;
  declare post_status: string;
  declare post_position: string;
  declare post_type: string;
  declare post_need: string;
  declare post_work_time: string;
  declare post_work_time_perweek: string;
  declare post_thp_type: string;
  declare post_thp: string;
  declare post_location_type: string;
  declare post_location: string;
  declare post_contract_duration: string;
  declare post_resume_req: boolean;
  declare post_portfolio_req: boolean;
  declare post_deadline: string;
  declare post_postdate: string;
  declare post_view: number;
  declare post_mode: string;
  declare post_link: string;

  declare post_overview: string;
  declare post_responsibility: string;
  declare post_requirement: string;
  
  declare ownerId: ForeignKey<Recruiter['id']>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    post_status: {
      type: DataTypes.STRING,
      defaultValue: "IN-PROGRESS"
    },
    post_position: DataTypes.STRING,
    post_type: DataTypes.STRING,
    post_need: DataTypes.STRING,
    post_work_time: DataTypes.STRING,
    post_work_time_perweek: DataTypes.STRING,
    post_thp_type: DataTypes.STRING,
    post_thp: DataTypes.STRING,
    post_location_type: DataTypes.STRING,
    post_location: DataTypes.STRING,
    post_contract_duration: DataTypes.STRING,
    post_link: DataTypes.TEXT,
    post_mode: {
      type: DataTypes.STRING,
      defaultValue: "Member"
    },
    post_resume_req: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    post_portfolio_req: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    post_deadline: DataTypes.STRING,
    post_postdate: {
      type: DataTypes.STRING,
      defaultValue: getCurrentDate()
    },
    post_view: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  
    post_overview: DataTypes.TEXT,
    post_responsibility: DataTypes.TEXT,
    post_requirement: DataTypes.TEXT,
    token_used: {
      type: DataTypes.STRING,
      defaultValue: "Free"
    },

    // timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "post", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

export default Post;

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Tambahkan leading zero jika bulan < 10
  const day = String(today.getDate()).padStart(2, '0'); // Tambahkan leading zero jika tanggal < 10
  
  return `${year}-${month}-${day}`;
}
