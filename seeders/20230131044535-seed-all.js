'use strict';
const bcrypt = require('bcryptjs');


const authors = require('../data/db.json').Authors
const movies = require('../data/db.json').Movies
const actors = require('../data/db.json').Actors


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    authors.forEach(el => {
      delete el.id
      el.password = bcrypt.hashSync(el.password, 10)
      el.createdAt = el.updatedAt = new Date()
    })
    movies.forEach(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()
    })
    actors.forEach(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()
    })

    await queryInterface.bulkInsert('Authors', authors, {})
    await queryInterface.bulkInsert('Movies', movies, {})
    await queryInterface.bulkInsert('Actors', actors, {})

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Authors', null, {});
    await queryInterface.bulkDelete('Movies', null, {});
    await queryInterface.bulkDelete('Actors', null, {});
  }
};
