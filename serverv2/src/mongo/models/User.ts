import { Schema, model, Document } from 'mongoose';

import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

export interface IUser extends Document {
        email: string;
        password: string;
        username: string;
        id: string;
        comparePassword: Function;
}
const UserSchema: Schema = new Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        username: { type: String },
        id: { type: String }
})

UserSchema.pre<IUser>('save', function (next) {
        const user: IUser = this;

        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password')) return next();

        // generate a salt
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                if (err) return next(err);

                // hash the password using our new salt
                bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err) return next(err);

                        // override the cleartext password with the hashed one
                        user.password = hash;
                        next();
                });
        });
});

UserSchema.methods.comparePassword = function (candidatePassword: String, cb: (err: Error, isMatch: boolean) => void) {
        bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
                cb(err, isMatch)
        });
};
export default model<IUser>('User', UserSchema)