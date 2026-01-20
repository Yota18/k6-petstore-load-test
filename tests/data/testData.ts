export const testData = {
    users: {
        validUser: {
            username: 'user1',
            password: 'password1'
        },
        invalidUser: {
            username: 'wronguser',
            password: 'wrongpassword'
        }
    },
    pets: {
        validPet: {
            id: 123456789,
            category: {
                id: 1,
                name: 'Dogs'
            },
            name: 'Rex',
            photoUrls: [
                'string'
            ],
            tags: [
                {
                    id: 1,
                    name: 'friendly'
                }
            ],
            status: 'available'
        },
        invalidPet: {
            id: 'invalid-id-type',
            name: 12345
        }
    },
    orders: {
        validOrder: {
            id: 1,
            petId: 123456789,
            quantity: 1,
            shipDate: '2024-01-01T00:00:00.000+0000',
            status: 'placed',
            complete: true
        },
        invalidOrder: {}
    }
};
