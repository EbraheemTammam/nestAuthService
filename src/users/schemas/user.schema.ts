import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as uuid4 from 'uuid4';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ default: uuid4.uuid4, unique: true, _id: true })
    id!: string;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true, minlength: 3 })
    name!: string;

    @Prop({ required: true })
    password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);