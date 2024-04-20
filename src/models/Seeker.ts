import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
  HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
  Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, BelongsToManySetAssociationsMixin, BelongsToManyGetAssociationsMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Experience from "./Experience";
import Education from "./Education";
import Attachment from "./Attachment";
import Recruiter from "./Recruiter";
import Gallery from "./Gallery";
import Post from "./Post";
import SeekerPost from "./SeekerPost";

class Seeker extends Model {
  declare id: CreationOptional<number>;
  declare first_name: string;
  declare last_name: string;
  declare domicile: string;
  declare date_of_birth: string;
  declare email: string;
  declare mobile: string;
  declare password: string;
  declare role: string;
  declare sex: string;
  declare profile_picture: string;
  declare profile_viewers: number;
  declare active_search: boolean;

  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  // Mixin Experience Has Many
  declare addExperience: HasManyAddAssociationMixin<Experience, number>
  declare hasExperience: HasManyHasAssociationMixin<Experience, number>
  declare removeExperience: HasManyRemoveAssociationsMixin<Experience,number>
  declare getExperiences: HasManyGetAssociationsMixin<Experience>

  // Mixin Experience Has Many
  declare addSaved: BelongsToManyAddAssociationMixin<Post, number>
  declare removeSaved: BelongsToManyRemoveAssociationMixin<Post,number>
  declare setSaved: BelongsToManySetAssociationsMixin<Post,number>
  declare getSaved: BelongsToManyGetAssociationsMixin<Post>

  // Mixin Experience Has Many
  declare addApplied: BelongsToManyAddAssociationMixin<Post, number>
  declare getApplied: BelongsToManyGetAssociationsMixin<Post>
  declare removeApplied: BelongsToManyRemoveAssociationMixin<Post,number>
  declare setApplied: BelongsToManySetAssociationsMixin<Post,number>

  // Mixin Education Has Many
  declare addEducation: HasManyAddAssociationMixin<Education, number>
  declare hasEducation: HasManyHasAssociationMixin<Education, number>
  declare removeEducation: HasManyRemoveAssociationsMixin<Education,number>
  declare getEducations: HasManyGetAssociationsMixin<Education>

  // Mixin Education Has One
  declare createAttachment: HasOneCreateAssociationMixin<Attachment>
  declare getAttachment: HasOneGetAssociationMixin<Attachment>
  declare setAttachment: HasOneSetAssociationMixin<Attachment, number>

  // Mixin Education Has One
  declare createRecruiter: HasOneCreateAssociationMixin<Recruiter>
  declare getRecruiter: HasOneGetAssociationMixin<Recruiter>
  declare setRecruiter: HasOneSetAssociationMixin<Recruiter, number>

  declare static associations: { experiences: Association<Seeker, Experience> };
  declare static associationsRecruiter: { experiences: Association<Seeker, Recruiter> };
}

Seeker.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    domicile: DataTypes.STRING,
    date_of_birth: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue:""
    },
    mobile: DataTypes.STRING,
    password:  DataTypes.STRING,
    role: DataTypes.STRING,
    sex: DataTypes.STRING,
    current_status: DataTypes.TEXT,
    profile_summary: DataTypes.TEXT,
    profile_picture: DataTypes.TEXT,
    profile_viewers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    active_search: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: "seeker", // Nama tabel di database
    sequelize, // Instance Sequelize yang digunakan
  }
);

Seeker.hasMany(Experience, {
  sourceKey: 'id',
  foreignKey: 'ownerId',
  as: 'experiences', // this determines the name in `associations`!
  constraints:false
});
Seeker.hasMany(Education, {
  sourceKey: 'id',
  foreignKey: 'ownerId',
  as: 'educations', // this determines the name in `associations`!
  constraints:false
});
Seeker.hasOne(Recruiter,{
  sourceKey: 'id',
  foreignKey: 'ownerId',
  as: 'recruiter',
  constraints:false
})
Seeker.hasOne(Attachment,{
  sourceKey: 'id',
  foreignKey: 'ownerId',
  as: 'attachment',
  constraints:false
})

Seeker.belongsToMany(Post,{
  as: "applied",
  sourceKey: "id",
  constraints: false,
  through: SeekerPost
})
Post.belongsToMany(Seeker,{
  as: "applicants",
  sourceKey: "id",
  constraints: false,
  through: SeekerPost
})

Seeker.belongsToMany(Post, {
  sourceKey: 'id',
  as: 'saved', // this determines the name in `associations`!
  constraints:false,
  through: "SeekerPostLoved"
})
Post.belongsToMany(Seeker, {
  sourceKey: 'id',
  as: 'saved', // this determines the name in `associations`!
  constraints:false,
  through: "SeekerPostLoved"
})

export default Seeker;
