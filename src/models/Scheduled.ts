import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, BelongsToManySetAssociationsMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import SeekerPost from "./SeekerPost";

class Scheduled extends Model {
  declare id: CreationOptional<number>;
  declare ownerId: ForeignKey<SeekerPost['id']>;
}

Scheduled.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    scheduledDate: DataTypes.STRING,
    interviewDate: DataTypes.STRING,
    interviewType: DataTypes.STRING,
    interviewLink: DataTypes.STRING,
    interviewMessage: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: 'scheduled', // Nama tabel di database
  }
);

export default Scheduled;
