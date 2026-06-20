import { User } from './user';
import { Endpoints } from './endpoints';

export const UserFactory = {
    realUser(): User{
        return {
            email: process.env.EMAIL!,
            password: process.env.PASSWORD!,
            username: process.env.USERNAME!,
            image: `${process.env.API_URL}${Endpoints.images}/smiley-cyrus.jpeg`,
            bio: null
        }
    },
    fakeUser(): User{
        return {
            email: 'fakeEmail@fake.com',
            password: 'fakePassword'
        }
    }
}