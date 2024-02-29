import { DataTypes, Model,Association, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, BelongsToManySetAssociationsMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import Waiting from "./Waiting";
import Reviewed from "./Reviewed";
import Scheduled from "./Scheduled";
import Rejected from "./Rejected";
import Offering from "./Offering";

class SeekerPost extends Model {
  declare id: CreationOptional<number>;

  declare setWaiting: HasOneSetAssociationMixin<Waiting, number>
  declare setReviewed: HasOneSetAssociationMixin<Reviewed, number>
  declare setScheduled: HasOneSetAssociationMixin<Scheduled, number>
  declare setRejected: HasOneSetAssociationMixin<Rejected, number>
  declare setOffering: HasOneSetAssociationMixin<Offering, number>
}

SeekerPost.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    applicantStatus: {
      type: DataTypes.STRING, // Tipe data status aplikasi (diterima, ditolak, dalam proses, dll.)
      defaultValue: 'Waiting', // Nilai default untuk status
    },
  },
  {
    sequelize,
    modelName: 'SeekerPost', // Nama model
    tableName: 'seeker_posts', // Nama tabel di database
  }
);

SeekerPost.hasOne(Waiting,{
  sourceKey: 'id',
  foreignKey: 'ownerId',
  constraints:false
})
SeekerPost.hasOne(Reviewed,{
  sourceKey: 'id',
  foreignKey: 'ownerId',
  constraints:false
})
SeekerPost.hasOne(Scheduled,{
  sourceKey: 'id',
  foreignKey: 'ownerId',
  constraints:false
})
SeekerPost.hasOne(Rejected,{
  sourceKey: 'id',
  foreignKey: 'ownerId',
  constraints:false
})
SeekerPost.hasOne(Offering,{
  sourceKey: 'id',
  foreignKey: 'ownerId',
  constraints:false
})

export default SeekerPost;
