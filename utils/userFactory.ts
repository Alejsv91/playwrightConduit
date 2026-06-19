import { User } from './user';

export const UserFactory = {
    realUser(): User{
        return {
            email: process.env.EMAIL!,
            password: process.env.PASSWORD!,
            username: process.env.USERNAME!
        }
    },
    fakeUser(): User{
        return {
            email: 'fakeEmail@fake.com',
            password: 'fakePassword'
        }
    }
}