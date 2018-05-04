
exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          title: 'Warm Tones'
        }, 'id')
      .then(project => {
        return knex('palettes').insert([
          {id: 1, title: 'summer', color1: 'blue', color2: 'red', color3: 'orange', color4: 'yellow', color5: 'purple', project_id: project[0]},
          {id: 2, title: 'winter', color1: 'aqua', color2: 'magenta', color3: 'gold', color4: 'green', color5: 'white', project_id: project[0]},
        ])
      })
      .catch(error => console.log(error))
    ])
  })
  .catch(error => console.log(error))
};
