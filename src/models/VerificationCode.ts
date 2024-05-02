import { DataTypes, Model, CreationOptional, NonAttribute, ForeignKey, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, BelongsToManySetAssociationsMixin, } from "sequelize";
import { sequelize } from "."; // Pastikan Anda mengganti path sesuai dengan struktur direktori Anda
import SeekerPost from "./SeekerPost";

class Verification extends Model {
  declare id: CreationOptional<number>;
  declare verification_code: number
  declare verification_email: string
  declare expired_date: string
}

Verification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    verification_code: DataTypes.INTEGER,
    verification_email: DataTypes.STRING,
    expired_date: {
        type: DataTypes.STRING,
        defaultValue: null
    },
  },
  {
    sequelize,
    tableName: 'verification_code', // Nama tabel di database
  }
);

export default Verification;
