import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
  HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
  Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Seeker from "./Seeker";
import Gallery from "./Gallery";
import Post from "./Post";

class Recruiter extends Model {
  declare id: CreationOptional<number>;
  declare rec_type:string;
  declare rec_org_name:string;
  declare rec_org_desc:string;
  declare rec_org_size:string;
  declare rec_org_year:string;
  declare rec_org_website:string;
  declare rec_org_address:string;
  declare rec_org_logo:string;
  declare rec_info_firstname:string;
  declare rec_info_lastname:string;
  declare rec_info_email:string;
  declare rec_info_company_domain: string;
  declare rec_info_position:string;
  declare rec_tier:string;
  declare rec_mode: string;
  declare ownerId: ForeignKey<Seeker['id']>;


  declare rec_banner: string;
  declare rec_description: string;
  declare rec_verified: boolean;
  declare rec_profile_view: number;
  declare rec_response_time: boolean;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  // Mixin Gallery Has Many
  declare addGallery: HasManyAddAssociationMixin<Gallery, number>
  declare hasGallery: HasManyHasAssociationMixin<Gallery, number>
  declare removeGallery: HasManyRemoveAssociationsMixin<Gallery,number>
  declare getGallerys: HasManyGetAssociationsMixin<Gallery>

  // Mixin Gallery Has Many
  declare addPost: HasManyAddAssociationMixin<Post, number>
  declare hasPost: HasManyHasAssociationMixin<Post, number>
  declare removePost: HasManyRemoveAssociationsMixin<Post,number>
  declare getPosts: HasManyGetAssociationsMixin<Post>
}

Recruiter.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    rec_type:DataTypes.STRING,
    rec_org_name:DataTypes.STRING,
    rec_org_desc:DataTypes.TEXT,
    rec_org_size:DataTypes.STRING,
    rec_org_year:DataTypes.STRING,
    rec_org_website:DataTypes.TEXT,
    rec_org_address:DataTypes.TEXT,
    rec_org_logo: DataTypes.TEXT,
    rec_info_firstname:DataTypes.STRING,
    rec_info_lastname:DataTypes.STRING,
    rec_info_email:DataTypes.STRING,
    rec_info_company_domain: DataTypes.STRING,
    rec_info_position:DataTypes.STRING,
    rec_tier:DataTypes.STRING,
    rec_mode:{
      type: DataTypes.STRING,
      defaultValue: "Member"
    },

    rec_description:DataTypes.TEXT,
    rec_verified:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rec_profile_view: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rec_response_time: DataTypes.STRING,
    rec_banner: DataTypes.STRING,

    // timestamps
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "recruiter", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

Recruiter.hasMany(Gallery, {
  sourceKey: 'id',
  foreignKey: 'ownerId',
  as: 'gallery', // this determines the name in `associations`!
  constraints:false
});

Recruiter.belongsToMany(Post, {
  as:"posts",
  through: "RecruiterPost",
  constraints:false
})
Post.belongsToMany(Recruiter, {
  as: "recruiter",
  through: "RecruiterPost",
  constraints:false
})

export default Recruiter;
