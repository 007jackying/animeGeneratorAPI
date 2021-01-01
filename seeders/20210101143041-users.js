const bcrypt = require('bcrypt');
'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('Users', [{
                firstName: 'Utsav Ashish',
                lastName: 'Koju',
                email: 'utsavkoju@gmail.com',
                username: 'utsavkoju',
                password: bcrypt.hashSync('anesthesia', 10, (err, hash) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            message: "HASH ",
                            error: err.message
                        })
                    } else {
                        return hash;

                    }
                }),
                status: true
            },
            {
                firstName: 'Teng Hong',
                lastName: 'Lee',
                email: 'dremersofjack@gmail.com',
                username: 'thlee',
                password: bcrypt.hashSync('yingjack', 10, (err, hash) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            message: "HASH ",
                            error: err.message
                        })
                    } else {
                        return hash;

                    }
                }),
                status: true
            }
        ], {});
    },

    down: async(queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Users', null, {});
    }
};